import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';

export class CreateMidiaDto {
  @ApiProperty({ description: 'ID do Evento a qual a mídia pertence' })
  @IsNotEmpty({ message: 'O ID do evento é obrigatório' })
  @IsNumberString({}, { message: 'O ID do evento deve ser um número' })
  eventoId: string;

  @ApiProperty({ description: 'Tipo de mídia (foto ou video)', enum: ['foto', 'video'] })
  @IsNotEmpty({ message: 'O tipo da mídia é obrigatório' })
  @IsEnum(['foto', 'video'], { message: 'O tipo deve ser foto ou video' })
  tipo: string;

  @ApiPropertyOptional({ description: 'Título opcional da mídia' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ description: 'Texto alternativo para acessibilidade (RNF01)' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Arquivo de mídia (imagem ou vídeo)' })
  @IsOptional() // Validado manualmente para casos específicos
  file?: any;
}
