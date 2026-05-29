import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment.strategy.interface';

/**
 * Padrão Strategy (Estratégia Concreta):
 * Isola a regra de negócio exclusiva para pagamento via Pix.
 * O módulo financeiro não precisa saber COMO o Pix é gerado, apenas
 * chama o método padronizado da interface.
 */
@Injectable()
export class PixStrategy implements PaymentStrategy {
  async processPayment(_amount: number): Promise<boolean> {
    // TODO: Implementar lógica de geração de payload Pix / API Banco Central
    await Promise.resolve();
    return true;
  }
}
