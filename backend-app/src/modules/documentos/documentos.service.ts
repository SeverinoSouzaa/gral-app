import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoStatusDto } from './dto/update-documento-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Express } from 'express';

@Injectable()
export class DocumentosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async uploadDocumento(userId: number, dto: CreateDocumentoDto, file?: Express.Multer.File) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    if (!usuario || !usuario.formando) {
      throw new ForbiddenException('Apenas formandos podem enviar documentos.');
    }

    // Validação Estrita de Regra de Negócio (Tipos vs Arquivos)
    const requiresFile = ['FRAME_PHOTO', 'IDENTITY_DOC', 'INVITATION_PHOTO'].includes(dto.tipoDocumento);
    if (requiresFile && !file) {
      throw new BadRequestException(`O tipo de documento ${dto.tipoDocumento} exige o upload de um arquivo (imagem/pdf).`);
    }

    if (dto.tipoDocumento === 'CAP_NAME' && !dto.valorConteudo) {
      throw new BadRequestException('O Nome para o Canudo exige que o valor do conteúdo seja preenchido.');
    }

    // Trava Anti-Spam: Impede envio de novo documento se já houver um PENDENTE ou APROVADO
    const existingDoc = await this.prisma.documento.findFirst({
      where: {
        formandoId: usuario.formando.id,
        tipoDocumento: dto.tipoDocumento,
        status: { in: ['PENDENTE', 'APROVADO'] },
      },
    });

    if (existingDoc) {
      throw new ConflictException(`Você já enviou um documento deste tipo. Ele está com status ${existingDoc.status}. Aguarde ou veja o retorno da Equipe Interna.`);
    }

    // Se a API for configurada no futuro com AWS S3, a URL virá do S3.
    // Atualmente estamos mockando usando um prefixo local /uploads/documentos/
    const nomeArquivo = file ? file.filename : 'TEXTO_APENAS';

    const documento = await this.prisma.documento.create({
      data: {
        nomeArquivo,
        valorConteudo: dto.valorConteudo || null,
        tipoDocumento: dto.tipoDocumento,
        status: 'PENDENTE',
        formandoId: usuario.formando.id,
      },
    });

    return documento;
  }

  async findMyDocumentos(userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    if (!usuario || !usuario.formando) {
      throw new ForbiddenException('Acesso negado.');
    }

    return this.prisma.documento.findMany({
      where: { formandoId: usuario.formando.id },
      orderBy: { dataEnvio: 'desc' },
    });
  }

  async findAllDocumentos() {
    return this.prisma.documento.findMany({
      include: {
        formando: {
          include: {
            turma: true,
            usuario: {
              select: { nome: true, cpf: true, email: true },
            },
          },
        },
      },
      orderBy: { dataEnvio: 'desc' },
    });
  }

  async updateStatus(id: number, dto: UpdateDocumentoStatusDto) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
      include: {
        formando: {
          include: { usuario: true },
        },
      },
    });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado.');
    }

    if (documento.status !== 'PENDENTE') {
      throw new ConflictException(`Este documento já foi avaliado e está com status ${documento.status}. Não é possível alterar seu status diretamente.`);
    }

    const docAtualizado = await this.prisma.documento.update({
      where: { id },
      data: { 
        status: dto.status,
        motivoRejeicao: dto.status === 'REJEITADO' ? dto.motivoRejeicao : null,
      },
    });

    // Padrão Observer: Dispara notificação desacoplada
    this.eventEmitter.emit('documento.status.alterado', {
      documentoId: docAtualizado.id,
      status: docAtualizado.status,
      motivoRejeicao: docAtualizado.motivoRejeicao,
      formandoEmail: documento.formando.usuario.email,
      tipoDocumento: docAtualizado.tipoDocumento,
    });

    return docAtualizado;
  }
}
