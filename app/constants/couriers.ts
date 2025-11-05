export const enum ECourierStatus {
  OFFLINE = 'offline',
  IDLE = 'idle',
  DELIVERING = 'delivering',
}

export const COURIER_STATUSES = [
  ECourierStatus.DELIVERING,
  ECourierStatus.IDLE,
  ECourierStatus.OFFLINE,
];
