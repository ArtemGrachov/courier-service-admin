export const enum EOrderStatus {
  ORDERED = 'ordered',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const ORDER_STATUSES = [
  EOrderStatus.ORDERED,
  EOrderStatus.PROCESSING,
  EOrderStatus.COMPLETED,
  EOrderStatus.CANCELLED,
];
