import { Injectable, NotFoundException, ForbiddenException, BadRequestException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMidiaDto } from './dto/create-midia.dto';
import { UpdateMidiaDto } from './dto/update-midia.dto';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ZipArchive } from 'archiver';
import { PassThrough } from 'stream';

@Injectable()
export class MidiasService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadMidia(userId: number, dto: CreateMidiaDto, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('O arquivo de mídia é obrigatório');

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { equipeInterna: true },
    });

    if (!usuario || !usuario.equipeInterna) {
      throw new ForbiddenException('Apenas a equipe interna pode fazer upload de mídias.');
    }

    // Busca o evento para pegar a turma vinculada
    const evento = await this.prisma.evento.findUnique({
      where: { id: parseInt(dto.eventoId, 10) },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const midia = await this.prisma.midia.create({
      data: {
        titulo: dto.titulo || null,
        tipo: dto.tipo,
        arquivo: file.filename,
        altText: dto.altText || null,
        dataPublicacao: new Date(),
        equipeInternaId: usuario.equipeInterna.id,
        eventoId: evento.id,
        turmaId: evento.turmaId, // RN02
      },
    });

    return midia;
  }

  async updateMidia(id: number, dto: UpdateMidiaDto) {
    const midia = await this.prisma.midia.findUnique({ where: { id } });
    if (!midia) throw new NotFoundException('Mídia não encontrada');

    return this.prisma.midia.update({
      where: { id },
      data: {
        titulo: dto.titulo !== undefined ? dto.titulo : midia.titulo,
        altText: dto.altText !== undefined ? dto.altText : midia.altText,
      },
    });
  }

  async removeMidia(id: number) {
    const midia = await this.prisma.midia.findUnique({ where: { id } });
    if (!midia) throw new NotFoundException('Mídia não encontrada');

    // Remove file from disk
    const filePath = path.join(process.cwd(), 'uploads', 'midias', midia.arquivo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.prisma.midia.delete({ where: { id } });
  }

  async findMidias(userId: number, eventoId?: string, tipo?: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    // Se for equipe interna, retorna tudo ou filtra pelo evento. 
    // Se for formando, retorna as mídias da turma dele (RN02).
    let turmaId;
    if (usuario?.tipoUsuario === 'STUDENT' && usuario.formando) {
      turmaId = usuario.formando.turmaId;
    }

    const whereClause: any = {};
    if (turmaId) whereClause.turmaId = turmaId;
    if (eventoId) whereClause.eventoId = parseInt(eventoId, 10);
    if (tipo) whereClause.tipo = tipo;

    return this.prisma.midia.findMany({
      where: whereClause,
      include: { evento: { select: { nomeEvento: true, dataEvento: true } } },
      orderBy: { dataPublicacao: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const midia = await this.prisma.midia.findUnique({
      where: { id },
      include: { evento: true },
    });

    if (!midia) throw new NotFoundException('Mídia não encontrada');

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    if (usuario?.tipoUsuario === 'STUDENT' && usuario.formando) {
      if (midia.turmaId !== usuario.formando.turmaId) {
        throw new ForbiddenException('Você não tem permissão para acessar esta mídia.');
      }
    }

    return midia;
  }

  async createZipStream(userId: number, tipo?: string): Promise<StreamableFile> {
    const midias = await this.findMidias(userId, undefined, tipo);

    if (midias.length === 0) {
      throw new NotFoundException('Nenhuma mídia encontrada para download.');
    }

    const archive = new ZipArchive({ zlib: { level: 9 } });

    midias.forEach((midia) => {
      const filePath = path.join(process.cwd(), 'uploads', 'midias', midia.arquivo);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: midia.arquivo });
      }
    });

    archive.finalize();

    const passThrough = new PassThrough();
    archive.pipe(passThrough);

    return new StreamableFile(passThrough);
  }
}
