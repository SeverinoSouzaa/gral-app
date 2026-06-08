import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginFormandoDto {
  @ApiProperty({
    description: 'CPF do aluno (Formato apenas números)',
    example: '02844747205',
  })
  @IsString({ message: 'O CPF deve ser uma string' })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  cpf: string;

  @ApiProperty({
    description: 'Código de Acesso da Turma (5 números)',
    example: '12345',
  })
  @IsString({ message: 'O código da turma deve ser uma string' })
  @IsNotEmpty({ message: 'O código da turma é obrigatório' })
  @Matches(/^\d{5}$/, { message: 'O código da turma deve conter exatamente 5 números' })
  codigoTurma: string;
}

export class LoginEquipeDto {
  @ApiProperty({
    description: 'E-mail do administrador (Equipe Interna)',
    example: 'admin@gral.com.br',
  })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha de acesso',
    example: '123456',
    minLength: 6,
  })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;
}
