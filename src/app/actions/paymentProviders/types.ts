export interface PaymentMetadata {
  userId: string;
  businessId: string;
  bookingId?: string;
  [key: string]: any;
}

export interface PaymentProvider {
  /**
   * Initializes a payment flow. For mock adapters, it resolves immediately.
   * For real gateways, it might return a client secret or redirect URL.
   */
  processPayment(amount: number, currency: string, metadata: PaymentMetadata): Promise<{ success: boolean; transactionId?: string; redirectUrl?: string; error?: string }>;
  
  /**
   * Verifies the status of a transaction (e.g. via webhook or API polling).
   */
  verifyPayment(transactionId: string): Promise<boolean>;
}
