import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormandoDto {
  @ApiProperty({ example: 'João Formando', description: 'Nome completo do aluno' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '02844747205', description: 'CPF do aluno (apenas números)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 números' })
  cpf: string;

  @ApiProperty({ example: 'joao@estudante.com', description: 'E-mail do aluno', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '11999999999', description: 'Telefone do aluno (apenas números)' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ example: '20231010', description: 'Matrícula acadêmica' })
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @ApiProperty({ example: 'Engenharia de Software', description: 'Curso do aluno' })
  @IsString()
  @IsNotEmpty()
  curso: string;

  @ApiProperty({ example: 1, description: 'ID da Turma no banco de dados' })
  @IsNotEmpty()
  turmaId: number;
}
