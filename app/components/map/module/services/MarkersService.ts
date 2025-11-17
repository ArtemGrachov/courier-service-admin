import { injectable } from 'tsyringe';

import { EMarkerTypes } from '../../constants';
import { EOrderStatus } from '~/constants/order';

import type { MarkerData } from '../../types';
import type { ICourier } from '~/types/models/courier';
import type { IOrder } from '~/types/models/order';

import { getCourierKey, getReceiverKey, getSenderKey } from '../../utils';

@injectable()
export class MarkersService {
  public getOrderMarkersData(order: IOrder) {
    const markersData: MarkerData[] = [];
    const { senderGeoPos, receiverGeoPos, courier } = order;

    if (senderGeoPos && order.sender) {
      markersData.push({
        key: getSenderKey(order.id),
        location: senderGeoPos,
        type: EMarkerTypes.SENDER,
        data: order.sender,
        order,
      });
    }

    if (receiverGeoPos && order.receiver) {
      markersData.push({
        key: getReceiverKey(order.id),
        location: receiverGeoPos,
        type: EMarkerTypes.RECEIVER,
        data: order.receiver,
        order,
      });
    }

    if ((order.status === EOrderStatus.PROCESSING || order.status === EOrderStatus.ORDERED) && courier?.location) {
      markersData.push({
        key: getCourierKey(courier.id),
        location: courier.location,
        type: EMarkerTypes.COURIER,
        data: courier,
      });
    }

    return markersData;
  }

  public getCourierMarkerData(courier: ICourier) {
    if (!courier?.location) {
      return null;
    }

    return {
      key: getCourierKey(courier.id),
      location: courier.location,
      type: EMarkerTypes.COURIER,
      data: courier,
    };
  }
}
