import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdatePresencaDto {
  @ApiProperty({ description: 'Status de presença', enum: ['CONFIRMADO', 'RECUSADO'] })
  @IsNotEmpty({ message: 'O status de presença é obrigatório' })
  @IsIn(['CONFIRMADO', 'RECUSADO'], { message: 'O status deve ser CONFIRMADO ou RECUSADO' })
  status: string;
}
