import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enviarDocumento(usuarioId: number, dto: CreateDocumentDto) {
    // Buscar o formando a partir do usuário
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { formando: true },
    });

    if (!usuario || !usuario.formando) {
      throw new BadRequestException('Apenas formandos podem enviar documentos.');
    }

    return this.prisma.documento.create({
      data: {
        nomeArquivo: dto.nomeArquivo,
        tipoDocumento: dto.tipoDocumento,
        status: 'PENDING',
        formandoId: usuario.formando.id,
      },
    });
  }

  async listarMeusDocumentos(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { formando: true },
    });

    if (!usuario || !usuario.formando) {
      throw new BadRequestException('Apenas formandos possuem documentos.');
    }

    return this.prisma.documento.findMany({
      where: { formandoId: usuario.formando.id },
      orderBy: { dataEnvio: 'desc' },
    });
  }

  async listarTodosPendentes() {
    return this.prisma.documento.findMany({
      where: { status: 'PENDING' },
      include: {
        formando: {
          include: {
            usuario: { select: { nome: true, email: true } },
            turma: { select: { nomeTurma: true } },
          },
        },
      },
      orderBy: { dataEnvio: 'asc' },
    });
  }

  async avaliarDocumento(id: number, dto: UpdateDocumentStatusDto) {
    const documento = await this.prisma.documento.findUnique({ where: { id } });

    if (!documento) {
      throw new NotFoundException('Documento não encontrado.');
    }

    // Atualiza o documento de PENDING para APPROVED ou REJECTED
    return this.prisma.documento.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
