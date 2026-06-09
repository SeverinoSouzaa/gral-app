import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentoStatusDto {
  @ApiProperty({
    description: 'Novo status do documento',
    enum: ['APROVADO', 'REJEITADO'],
    example: 'APROVADO',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['APROVADO', 'REJEITADO'], { message: 'O status deve ser APROVADO ou REJEITADO' })
  status: string;

  @ApiPropertyOptional({
    description: 'Obrigatório se o status for REJEITADO',
    example: 'A foto do quadro enviada está ilegível. Envie novamente.',
  })
  @IsOptional()
  @IsString()
  motivoRejeicao?: string;
}
