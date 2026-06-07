import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentStatusDto {
  @ApiProperty({
    description: 'Novo status do documento avaliado pela Equipe Interna',
    example: 'APPROVED',
    enum: ['APPROVED', 'REJECTED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'], { message: 'O status deve ser apenas APPROVED ou REJECTED' })
  status: string;
}
