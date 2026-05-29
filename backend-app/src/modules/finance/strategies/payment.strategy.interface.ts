export interface PaymentStrategy {
  processPayment(amount: number): Promise<boolean>;
}
