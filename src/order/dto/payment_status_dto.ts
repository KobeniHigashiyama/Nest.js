// Класс для суммы платежа
export class AmountPayment {
  value: string;
  currency: string;
}

// Класс для объекта платежа
export class ObjectPayment {
  id: string;
  status: string;
  amount: AmountPayment;
  payment_method: {
    type: string;
    id: string;
    saved: boolean;
    title: string;
    card: object;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  destination: string; // Перенесено из PaymentStatusDto
}

// Класс для статуса платежа
export class PaymentStatusDto {
  event:
    | 'payment.succeeded'
    | 'payment.waiting_for_capture'
    | 'payment.canceled'
    | 'refund.success';
  object: ObjectPayment;
}
