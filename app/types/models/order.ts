import type { EOrderStatus } from '~/constants/order';

import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IGeoPos } from '~/types/models/geo-pos';

export interface IOrder {
  id: number;
  senderId: number;
  receiverId: number;
  senderAddress: string;
  receiverAddress: string;
  senderGeoPos: IGeoPos;
  receiverGeoPos: IGeoPos;
  courierId: number;
  status: EOrderStatus;
  dateTimeOrdered: string;
  dateTimeClosed: string | null;
  sender?: IClient;
  receiver?: IClient;
  courier?: ICourier;
}
