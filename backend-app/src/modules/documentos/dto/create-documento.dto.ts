import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateDocumentoDto {
  @ApiProperty({
    description: 'Tipo de documento sendo enviado',
    enum: DocumentType,
    example: DocumentType.FRAME_PHOTO,
  })
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  @IsNotEmpty({ message: 'O tipo de documento é obrigatório' })
  tipoDocumento: DocumentType;

  @ApiPropertyOptional({
    description: 'Texto do documento (se aplicável, como o "Nome para o canudo")',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString({ message: 'O valor deve ser uma string' })
  valorConteudo?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de mídia associado ao documento (para fotos do quadro, identidade, etc.)',
  })
  @IsOptional()
  file?: any;
}
