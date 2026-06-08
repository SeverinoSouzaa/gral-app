import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTurmaDto {
  @ApiProperty({
    description: 'Nome da Turma',
    example: 'Engenharia de Software 2026',
  })
  @IsString({ message: 'O nome da turma deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da turma é obrigatório' })
  nomeTurma: string;

  @ApiProperty({
    description: 'Curso da Turma',
    example: 'Engenharia de Software',
  })
  @IsString()
  @IsNotEmpty()
  curso: string;

  @ApiProperty({
    description: 'Ano de Formatura',
    example: 2026,
  })
  @IsNotEmpty()
  anoFormatura: number;

  @ApiProperty({
    description: 'Código de Acesso exclusivo da Turma (5 caracteres)',
    example: 'ENG26',
  })
  @IsString({ message: 'O código de acesso deve ser uma string' })
  @IsNotEmpty({ message: 'O código de acesso é obrigatório' })
  @Length(5, 5, { message: 'O código de acesso deve ter exatamente 5 caracteres' })
  codigoAcesso: string;
}
