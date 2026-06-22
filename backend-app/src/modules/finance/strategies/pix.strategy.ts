import { Injectable } from '@nestjs/common';
import { PaymentStrategy, PaymentResult } from './payment.strategy.interface';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class PixStrategy implements PaymentStrategy {
  async processPayment(amount: number, description: string): Promise<PaymentResult> {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken || accessToken === 'APP_USR-XXXXX-YYYYY') {
      console.warn('⚠️ Token do Mercado Pago não configurado. Retornando MOCK temporário!');
      return {
        success: true,
        transactionId: `mock_txid_${Date.now()}`,
        qrCodeImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/200px-QR_code_for_mobile_English_Wikipedia.svg.png', 
        qrCodeText: `00020126580014br.gov.bcb.pix0136mock-chave-aleatoria-mp5204000053039865404${amount.toFixed(2)}5802BR5913MOCK MERCADO PAGO`,
      };
    }

    try {
      // Inicializa o cliente com o Token do .env
      const client = new MercadoPagoConfig({ accessToken, options: { timeout: 10000 } });
      const payment = new Payment(client);

      const requestOptions = {
        idempotencyKey: `pix_gral_${Date.now()}`, // Garante que a transação seja única
      };

      const body = {
        transaction_amount: Number(amount.toFixed(2)),
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: 'pagador.teste@gral.com', // Obrigatório no Mercado Pago (podemos puxar do usuario no futuro)
          first_name: 'Formando',
          last_name: 'GRAL'
        },
      };

      // Chama a API de criação de pagamento do Mercado Pago
      const response = await payment.create({ body, requestOptions });

      if (!response.point_of_interaction?.transaction_data) {
        throw new Error('Mercado Pago não retornou os dados do QR Code.');
      }

      return {
        success: true,
        transactionId: response.id?.toString() || `tx_${Date.now()}`,
        // O Mercado Pago já manda o Base64 puro, precisamos adicionar o prefixo do Data URI
        qrCodeImage: `data:image/png;base64,${response.point_of_interaction.transaction_data.qr_code_base64}`,
        qrCodeText: response.point_of_interaction.transaction_data.qr_code || '',
      };

    } catch (error: any) {
      console.error('❌ Erro no Mercado Pago:', error);
      return {
        success: false,
        errorMessage: error?.message || 'Erro ao processar Pix no Mercado Pago.',
      };
    }
  }
}
