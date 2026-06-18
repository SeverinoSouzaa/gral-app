import { IsNotEmpty, IsNumber, Min, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GerarParcelasDto {
  @ApiProperty({
    description: 'Valor total do contrato por Formando (ex: R$ 1300.00)',
    example: 1300.00,
  })
  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @IsNumber({}, { message: 'O valor total deve ser numérico' })
  @Min(1, { message: 'O valor total não pode ser menor que R$1' })
  valorTotalPorAluno: number;

  @ApiProperty({
    description: 'Quantidade de parcelas/meses que o valor será fracionado',
    example: 12,
  })
  @IsNotEmpty({ message: 'A quantidade de parcelas é obrigatória' })
  @IsNumber({}, { message: 'A quantidade de parcelas deve ser numérica' })
  @Min(1, { message: 'A quantidade de parcelas deve ser de no mínimo 1' })
  quantidadeDeParcelas: number;

  @ApiProperty({
    description: 'Data de vencimento da primeira parcela (Formato: YYYY-MM-DD)',
    example: '2026-08-10',
  })
  @IsNotEmpty({ message: 'A data de vencimento inicial é obrigatória' })
  @IsString({ message: 'A data deve ser uma string' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato YYYY-MM-DD' })
  dataVencimentoInicial: string;
}
