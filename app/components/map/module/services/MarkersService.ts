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
    const { sender_lat: senderLat, sender_lng: senderLng, receiver_lat: receiverLat, receiver_lng: receiverLng, courier } = order;

    if (senderLat && senderLng && order.sender) {
      markersData.push({
        key: getSenderKey(order.id),
        location: {
          lat: senderLat,
          lng: senderLng,
        },
        type: EMarkerTypes.SENDER,
        data: order.sender,
        order,
      });
    }

    if (receiverLat && receiverLng && order.receiver) {
      markersData.push({
        key: getReceiverKey(order.id),
        location: {
          lat: receiverLat,
          lng: receiverLng,
        },
        type: EMarkerTypes.RECEIVER,
        data: order.receiver,
        order,
      });
    }

    if ((order.status === EOrderStatus.PROCESSING || order.status === EOrderStatus.ORDERED) && courier?.position) {
      markersData.push({
        key: getCourierKey(courier.id),
        location: courier.position,
        type: EMarkerTypes.COURIER,
        data: courier,
      });
    }

    return markersData;
  }

  public getCourierMarkerData(courier: ICourier) {
    if (!courier?.position) {
      return null;
    }

    return {
      key: getCourierKey(courier.id),
      location: courier.position,
      type: EMarkerTypes.COURIER,
      data: courier,
    };
  }
}
