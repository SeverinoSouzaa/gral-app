import { Injectable } from '@nestjs/common';
import { PaymentStrategy, PaymentResult } from './payment.strategy.interface';

/**
 * Padrão Strategy (Estratégia Concreta):
 * Isola a regra de negócio exclusiva para pagamento via Cartão de Crédito.
 * Se amanhã o gateway de cartão mudar (ex: de Stripe para Pagar.me),
 * o módulo financeiro principal não sofrerá impacto, apenas essa classe será ajustada.
 */
@Injectable()
export class CreditCardStrategy implements PaymentStrategy {
  async processPayment(amount: number, description: string): Promise<PaymentResult> {
    // TODO: Implementar comunicação com API de adquirente de cartão
    console.log(`Processando cartão: ${description} no valor de ${amount}`);
    await Promise.resolve();
    return {
      success: true,
      transactionId: `cc_mock_${Date.now()}`
    };
  }
}
