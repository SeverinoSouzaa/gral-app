import { Injectable } from '@nestjs/common';
import { PaymentStrategy, PaymentResult } from './payment.strategy.interface';

@Injectable()
export class PixStrategy implements PaymentStrategy {
  async processPayment(amount: number, description: string): Promise<PaymentResult> {
    const clientId = process.env.EFI_CLIENT_ID;
    const clientSecret = process.env.EFI_CLIENT_SECRET;
    const certBase64 = process.env.EFI_CERT_BASE64;
    const chavePix = process.env.EFI_CHAVE_PIX;

    if (!clientId || !clientSecret || !certBase64 || !chavePix) {
      console.warn('⚠️ Credenciais da Efí Pay não configuradas. Retornando MOCK temporário!');
      return {
        success: true,
        transactionId: `mock_txid_${Date.now()}`,
        qrCodeImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/200px-QR_code_for_mobile_English_Wikipedia.svg.png',
        qrCodeText: `00020126580014br.gov.bcb.pix0136mock-chave-aleatoria-mp5204000053039865404${amount.toFixed(2)}5802BR5913MOCK EFI PAY`,
      };
    }

    try {
      // Require inline para evitar erro de tipagem no TypeScript com biblioteca puramente CommonJS
      const EfiPay = require('sdk-node-apis-efi');

      const options = {
        sandbox: false, // Produção
        client_id: clientId,
        client_secret: clientSecret,
        certificate: certBase64,
        cert_base64: true,
      };

      const efipay = new EfiPay(options);

      const body = {
        calendario: {
          expiracao: 3600 // 1 hora de validade
        },
        valor: {
          original: amount.toFixed(2)
        },
        chave: chavePix,
        infoAdicionais: [
          {
            nome: "Referencia",
            valor: description.substring(0, 50)
          }
        ]
      };

      // 1. Gera a cobrança (TxId)
      const charge = await efipay.pixCreateImmediateCharge({}, body);
      
      if (!charge || !charge.loc || !charge.loc.id) {
        throw new Error('Efí Pay não retornou Loc ID da cobrança.');
      }

      // 2. Gera o QR Code para aquele Loc Id
      const qrcodeResponse = await efipay.pixGenerateQRCode({ id: charge.loc.id });

      return {
        success: true,
        transactionId: charge.txid,
        qrCodeImage: qrcodeResponse.imagemQrcode,
        qrCodeText: qrcodeResponse.qrcode,
      };

    } catch (error: any) {
      console.error('❌ Erro na Efí Pay:', error?.response?.data || error?.message || error);
      return {
        success: false,
        errorMessage: 'Erro ao processar Pix na Efí Pay. Verifique as credenciais, o certificado ou permissões da conta.',
      };
    }
  }
}
