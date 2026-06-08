import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'CPF do usuário (Formato apenas números)',
    example: '02844747205',
  })
  @IsString({ message: 'O CPF deve ser uma string' })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  cpf: string;

  @ApiProperty({
    description: 'Código de Acesso da Turma',
    example: '12345',
  })
  @IsString({ message: 'O código da turma deve ser uma string' })
  @IsNotEmpty({ message: 'O código da turma é obrigatório' })
  @Length(5, 5, { message: 'O código da turma deve ter exatamente 5 caracteres' })
  codigoTurma: string;
}
