import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString, IsInt } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateEventoDto {
  @ApiProperty({ description: 'Nome do Evento' })
  @IsNotEmpty({ message: 'O nome do evento é obrigatório' })
  @IsString()
  nomeEvento: string;

  @ApiProperty({ description: 'Data do Evento em ISO 8601 (ex: 2026-12-15T19:00:00Z)' })
  @IsNotEmpty({ message: 'A data do evento é obrigatória' })
  @IsDateString({}, { message: 'Formato de data inválido (Use ISO 8601)' })
  dataEvento: string;

  @ApiProperty({ description: 'Local do evento (físico ou link)' })
  @IsNotEmpty({ message: 'O local é obrigatório' })
  @IsString()
  local: string;

  @ApiProperty({ description: 'Descrição detalhada' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Tipo do evento', enum: EventType })
  @IsNotEmpty({ message: 'O tipo do evento é obrigatório' })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ description: 'ID da Turma' })
  @IsNotEmpty({ message: 'O ID da turma é obrigatório' })
  @IsInt()
  turmaId: number;
}
