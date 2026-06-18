import { IsNotEmpty, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayParcelaDto {
  @ApiProperty({
    description: 'Método de pagamento desejado',
    enum: ['PIX', 'CREDIT_CARD'],
    example: 'PIX',
  })
  @IsNotEmpty({ message: 'O método de pagamento é obrigatório' })
  @IsIn(['PIX', 'CREDIT_CARD'], { message: 'O método deve ser PIX ou CREDIT_CARD' })
  formaPagamento: 'PIX' | 'CREDIT_CARD';

  // O valor não é estritamente necessário se confiarmos no Banco de Dados (e DEVEMOS).
  // Mas para fins de segurança extra e auditoria de tela, podemos receber e validar se bate com o BD.
  @ApiProperty({
    description: 'Valor da parcela que está sendo paga',
    example: 75.00,
  })
  @IsNotEmpty({ message: 'O valor da transação é obrigatório' })
  @IsNumber({}, { message: 'O valor deve ser numérico' })
  @Min(1, { message: 'O valor não pode ser menor que R$1' })
  valor: number;
}
