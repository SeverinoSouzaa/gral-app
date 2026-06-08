import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';

@Injectable()
export class TurmasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTurmaDto: CreateTurmaDto) {
    const codeExists = await this.prisma.turma.findUnique({
      where: { codigoAcesso: createTurmaDto.codigoAcesso },
    });

    if (codeExists) {
      throw new ConflictException('Já existe uma Turma com este código de acesso');
    }

    return this.prisma.turma.create({
      data: {
        nomeTurma: createTurmaDto.nomeTurma,
        curso: createTurmaDto.curso,
        anoFormatura: createTurmaDto.anoFormatura,
        codigoAcesso: createTurmaDto.codigoAcesso,
      },
    });
  }

  async findAll() {
    return this.prisma.turma.findMany({
      include: {
        _count: {
          select: { formandos: true },
        },
      },
    });
  }
}
