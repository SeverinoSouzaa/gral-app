export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  qrCodeImage?: string;
  qrCodeText?: string;
  errorMessage?: string;
}

export interface PaymentStrategy {
  processPayment(amount: number, description: string): Promise<PaymentResult>;
}
