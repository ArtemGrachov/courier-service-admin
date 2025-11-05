export const enum EOrderStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const ORDER_STATUSES = [
  EOrderStatus.RECEIVED,
  EOrderStatus.PROCESSING,
  EOrderStatus.COMPLETED,
  EOrderStatus.CANCELLED,
];
