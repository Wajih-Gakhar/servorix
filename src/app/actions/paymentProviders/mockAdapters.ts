import { PaymentProvider, PaymentMetadata } from './types';

export class JazzCashAdapter implements PaymentProvider {
  async processPayment(amount: number, currency: string, metadata: PaymentMetadata) {
    console.log(`[JazzCash Mock] Processing ${amount} ${currency} for user ${metadata.userId}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
    return { success: true, transactionId: `jc_mock_${Date.now()}` };
  }

  async verifyPayment(transactionId: string) {
    return transactionId.startsWith('jc_mock_');
  }
}

export class EasypaisaAdapter implements PaymentProvider {
  async processPayment(amount: number, currency: string, metadata: PaymentMetadata) {
    console.log(`[Easypaisa Mock] Processing ${amount} ${currency} for user ${metadata.userId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, transactionId: `ep_mock_${Date.now()}` };
  }

  async verifyPayment(transactionId: string) {
    return transactionId.startsWith('ep_mock_');
  }
}

export class CardAdapter implements PaymentProvider {
  async processPayment(amount: number, currency: string, metadata: PaymentMetadata) {
    console.log(`[Card Mock] Processing ${amount} ${currency} for user ${metadata.userId}`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true, transactionId: `card_mock_${Date.now()}` };
  }

  async verifyPayment(transactionId: string) {
    return transactionId.startsWith('card_mock_');
  }
}
