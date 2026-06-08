import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormandoDto } from './dto/create-formando.dto';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        formando: true,
        equipeInterna: true,
      },
    });
  }

  async findByCpf(cpf: string) {
    return this.prisma.usuario.findUnique({
      where: { cpf },
      include: {
        formando: {
          include: {
            turma: true,
          },
        },
        equipeInterna: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        formando: true,
        equipeInterna: true,
      },
    });
  }

  async createFormando(dto: CreateFormandoDto) {
    // Verificar se o CPF já existe
    const cpfExists = await this.prisma.usuario.findUnique({ where: { cpf: dto.cpf } });
    if (cpfExists) {
      throw new ConflictException('Já existe um usuário com este CPF');
    }

    // Verificar e-mail caso fornecido
    if (dto.email) {
      const emailExists = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
      if (emailExists) {
        throw new ConflictException('Já existe um usuário com este E-mail');
      }
    }

    // Criar o usuário e o perfil de Formando (transação Prisma)
    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        email: dto.email,
        tipoUsuario: 'STUDENT',
        telefone: dto.telefone,
        formando: {
          create: {
            matricula: dto.matricula,
            curso: dto.curso,
            statusFinanceiro: 'ADIMPLENTE', // Padrão
            turmaId: dto.turmaId,
          },
        },
      },
      include: {
        formando: true,
      },
    });
  }
}
