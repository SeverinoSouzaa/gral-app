import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateEventoDto) {
    const admin = await this.prisma.equipeInterna.findUnique({ where: { id: userId } });
    if (!admin) throw new ForbiddenException('Apenas equipe interna pode criar eventos');

    return this.prisma.evento.create({
      data: {
        ...dto,
        dataEvento: new Date(dto.dataEvento),
        equipeInternaId: admin.id,
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.evento.findMany({
      orderBy: { dataEvento: 'asc' },
    });
  }

  async findAllForStudent(userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    if (!usuario?.formando) throw new ForbiddenException('Apenas formandos podem usar esta rota');

    const eventos = await this.prisma.evento.findMany({
      where: { turmaId: usuario.formando.turmaId },
      include: {
        presencas: {
          where: { formandoId: usuario.formando.id },
          select: { status: true }
        }
      },
      orderBy: { dataEvento: 'asc' },
    });

    // Retorna os dados brutos e inclui o status da presença do aluno
    return eventos.map(e => {
      const { presencas, ...rest } = e;
      return {
        ...rest,
        statusPresencaUsuario: presencas.length > 0 ? presencas[0].status : 'PENDENTE',
      };
    });
  }

  async findOne(id: number, userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        presencas: usuario?.tipoUsuario === 'STUDENT' ? {
          where: { formandoId: usuario.formando?.id },
          select: { status: true }
        } : false
      }
    });

    if (!evento) throw new NotFoundException('Evento não encontrado');

    // RN02 (Isolamento)
    if (usuario?.tipoUsuario === 'STUDENT' && usuario.formando) {
      if (evento.turmaId !== usuario.formando.turmaId) {
        throw new ForbiddenException('Você não tem permissão para acessar um evento de outra turma');
      }
    }

    const { presencas, ...rest } = evento as any;
    return {
      ...rest,
      statusPresencaUsuario: presencas && presencas.length > 0 ? presencas[0].status : (usuario?.tipoUsuario === 'STUDENT' ? 'PENDENTE' : null),
    };
  }

  async update(id: number, dto: UpdateEventoDto) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) throw new NotFoundException('Evento não encontrado');

    const updateData: any = { ...dto };
    if (dto.dataEvento) updateData.dataEvento = new Date(dto.dataEvento);

    return this.prisma.evento.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) throw new NotFoundException('Evento não encontrado');

    return this.prisma.evento.delete({ where: { id } });
  }

  async setPresenca(eventId: number, userId: number, dto: UpdatePresencaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { formando: true },
    });

    if (!usuario?.formando) throw new ForbiddenException('Apenas formandos podem confirmar presença');

    const evento = await this.prisma.evento.findUnique({ where: { id: eventId } });
    if (!evento) throw new NotFoundException('Evento não encontrado');

    if (evento.turmaId !== usuario.formando.turmaId) {
      throw new ForbiddenException('Evento não pertence à sua turma');
    }

    // Upsert presence (Cria ou Atualiza)
    return this.prisma.presencaEvento.upsert({
      where: {
        formandoId_eventoId: {
          formandoId: usuario.formando.id,
          eventoId: eventId,
        }
      },
      update: { status: dto.status },
      create: {
        formandoId: usuario.formando.id,
        eventoId: eventId,
        status: dto.status,
      }
    });
  }

  async getPresencasAdmin(eventId: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id: eventId },
      include: {
        turma: {
          include: {
            formandos: {
              include: {
                usuario: { select: { nome: true, email: true } },
                presencasEventos: {
                  where: { eventoId: eventId },
                  select: { status: true }
                }
              }
            }
          }
        }
      }
    });

    if (!evento) throw new NotFoundException('Evento não encontrado');

    const lista = evento.turma.formandos.map(f => ({
      formandoId: f.id,
      nome: f.usuario.nome,
      email: f.usuario.email,
      status: f.presencasEventos.length > 0 ? f.presencasEventos[0].status : 'PENDENTE'
    }));

    // Ordena alfabeticamente
    lista.sort((a, b) => a.nome.localeCompare(b.nome));

    return {
      evento: {
        id: evento.id,
        nomeEvento: evento.nomeEvento,
        dataEvento: evento.dataEvento,
        local: evento.local,
      },
      presencas: lista
    };
  }
}
