import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment.strategy.interface';

/**
 * Padrão Strategy (Estratégia Concreta):
 * Isola a regra de negócio exclusiva para pagamento via Cartão de Crédito.
 * Se amanhã o gateway de cartão mudar (ex: de Stripe para Pagar.me),
 * o módulo financeiro principal não sofrerá impacto, apenas essa classe será ajustada.
 */
@Injectable()
export class CreditCardStrategy implements PaymentStrategy {
  async processPayment(_amount: number): Promise<boolean> {
    // TODO: Implementar comunicação com API de adquirente de cartão
    await Promise.resolve();
    return true;
  }
}
