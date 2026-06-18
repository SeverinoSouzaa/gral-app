import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaixaManualDto {
  @ApiProperty({
    description: 'Motivo ou observação da baixa manual (ex: Pagamento em espécie no escritório)',
    example: 'Pagamento recebido em espécie na sede da GRAL.',
  })
  @IsNotEmpty({ message: 'O motivo/observação é obrigatório para manter o registro de auditoria.' })
  @IsString()
  observacao: string;
}
