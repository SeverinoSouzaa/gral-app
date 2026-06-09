import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormandoDto } from './dto/create-formando.dto';
import { UpdateFormandoDto } from './dto/update-formando.dto';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllFormandos() {
    const formandos = await this.prisma.usuario.findMany({
      where: { tipoUsuario: 'STUDENT' },
      include: {
        formando: {
          include: {
            turma: true,
          },
        },
      },
    });

    return formandos.map((u) => ({
      id: u.id,
      nome: u.nome,
      cpf: u.cpf,
      turma: u.formando?.turma?.nomeTurma,
    }));
  }

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

  async updateFormando(id: number, dto: UpdateFormandoDto) {
    const usuario = await this.findById(id);

    if (!usuario || usuario.tipoUsuario !== 'STUDENT') {
      throw new ConflictException('Formando não encontrado.');
    }

    // Verificar CPF duplicado se fornecido e for diferente do atual
    if (dto.cpf && dto.cpf !== usuario.cpf) {
      const cpfExists = await this.prisma.usuario.findUnique({ where: { cpf: dto.cpf } });
      if (cpfExists) {
        throw new ConflictException('Já existe um usuário com este CPF');
      }
    }

    // Verificar E-mail duplicado se fornecido e for diferente do atual
    if (dto.email && dto.email !== usuario.email) {
      const emailExists = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
      if (emailExists) {
        throw new ConflictException('Já existe um usuário com este E-mail');
      }
    }

    // Preparar os dados a serem atualizados na tabela Usuario
    const usuarioData: any = {};
    if (dto.nome) usuarioData.nome = dto.nome;
    if (dto.cpf) usuarioData.cpf = dto.cpf;
    if (dto.email !== undefined) usuarioData.email = dto.email;
    if (dto.telefone !== undefined) usuarioData.telefone = dto.telefone;

    // Preparar os dados a serem atualizados na tabela Formando
    const formandoData: any = {};
    if (dto.matricula) formandoData.matricula = dto.matricula;
    if (dto.curso) formandoData.curso = dto.curso;
    if (dto.turmaId) formandoData.turmaId = dto.turmaId;

    // Se houver dados de formando, precisa fazer um update aninhado
    if (Object.keys(formandoData).length > 0) {
      usuarioData.formando = {
        update: formandoData,
      };
    }

    return this.prisma.usuario.update({
      where: { id },
      data: usuarioData,
      include: {
        formando: {
          include: {
            turma: true,
          },
        },
      },
    });
  }
}
