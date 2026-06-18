import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentStrategy, PaymentResult } from './payment.strategy.interface';
const EfiPay = require('sdk-node-apis-efi');
import * as path from 'path';

@Injectable()
export class PixStrategy implements PaymentStrategy {
  async processPayment(amount: number, description: string): Promise<PaymentResult> {
    const clientId = process.env.EFI_CLIENT_ID;
    const clientSecret = process.env.EFI_CLIENT_SECRET;
    const certificateName = process.env.EFI_CERTIFICATE_PATH;

    // Fallback: Se o usuário ainda não tiver a conta aprovada, geramos um MOCK para ele não travar o desenvolvimento
    if (!clientId || clientId.includes('XXXXX')) {
      console.warn('⚠️ Credenciais da EFI Bank não encontradas. Gerando Pix de mentirinha (MOCK) para continuar os testes!');
      return {
        success: true,
        transactionId: `mock_txid_${Date.now()}`,
        qrCodeImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', // Imagem fake de QR Code
        qrCodeText: `00020126580014br.gov.bcb.pix0136mock-chave-aleatoria-efi-bank5204000053039865404${amount.toFixed(2)}5802BR5913MOCK EFI BANK6008BRASILIA62070503***6304A1B2`, // Copia e Cola Fake
      };
    }

    const options = {
      sandbox: process.env.EFI_SANDBOX === 'true',
      client_id: clientId,
      client_secret: clientSecret,
      certificate: path.resolve(__dirname, '../../../../', certificateName || ''),
    };

    try {
      const efipay = new EfiPay(options);

      // 1. Criar a Cobrança (Cob)
      const body = {
        calendario: { expiracao: 3600 },
        valor: { original: amount.toFixed(2) },
        chave: process.env.EFI_PIX_KEY || 'sua_chave_pix_cadastrada_na_efi@email.com', // A chave Pix cadastrada
        solicitacaoPagador: description
      };

      const cobRes = await efipay.pixCreateImmediateCharge([], body);
      
      if (!cobRes || !cobRes.loc || !cobRes.loc.id) {
        throw new Error('Falha ao gerar cobrança Pix.');
      }

      // 2. Gerar o QRCode a partir do ID da Cobrança
      const qrCodeRes = await efipay.pixGenerateQRCode({ id: cobRes.loc.id });

      return {
        success: true,
        transactionId: cobRes.txid,
        qrCodeImage: qrCodeRes.imagemQrcode, // Imagem em base64
        qrCodeText: qrCodeRes.qrcode, // Pix Copia e Cola
      };

    } catch (error: any) {
      console.error('Erro na EFI Bank:', error);
      return {
        success: false,
        errorMessage: error?.message || 'Erro desconhecido ao processar Pix na EFI Bank.',
      };
    }
  }
}
