import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Nome do arquivo enviado',
    example: 'rg_frente_joao.pdf',
  })
  @IsString()
  @IsNotEmpty()
  nomeArquivo: string;

  @ApiProperty({
    description: 'O tipo do documento enviado',
    enum: DocumentType,
    example: DocumentType.FRAME_PHOTO,
  })
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido. Deve ser FRAME_PHOTO, CAP_NAME ou OTHER.' })
  @IsNotEmpty()
  tipoDocumento: DocumentType;
}
