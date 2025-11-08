import { inject, injectable } from 'tsyringe';

import { View } from './View';
import { EMarkerTypes } from '../constants';

import type { MarkerData, MarkerKey } from '../types';

@injectable()
export class Model {
  private state: Record<MarkerKey, MarkerData> = {};
  private activeOrders: Record<number, Set<MarkerKey>> = {};
  private ordersByCourier: Record<number, Set<number>> = {};

  constructor(
    @inject(View) private readonly view: View,
  ) { }

  public get markerArray() {
    return Object.values(this.state);
  }

  public setCourierActive(courierId: number, key: MarkerKey, isActive: boolean) {
    this.handleCourierActive(courierId, key, isActive);
    this.updateMarkersHighlight();
  }

  public setOrderActive(orderId: number, key: MarkerKey, isActive: boolean) {
    this.handleOrderActive(orderId, key, isActive);
    this.updateMarkersHighlight();
  }

  private handleCourierActive(courierId: number, key: MarkerKey, isActive: boolean) {
    const activeOrderIds = this.ordersByCourier[courierId];
    activeOrderIds?.forEach(orderId => this.handleOrderActive(orderId, key, isActive));
  }

  private handleOrderActive(orderId: number, key: MarkerKey, isActive: boolean) {
    const set = this.activeOrders[orderId] ?? (this.activeOrders[orderId] = new Set());

    if (isActive) {
      set.add(key);
    } else {
      set.delete(key);

      if (!set.size) {
        delete this.activeOrders[orderId];
      }
    }
  }

  private updateMarkersHighlight() {
    const markersArray = this.markerArray;
    const activeOrderSet = new Set(Object.keys(this.activeOrders).map(k => +k));
    const hasActiveOrders = activeOrderSet.size > 0;

    for (let i = 0; i < this.markerArray.length; i++) {
      const markerData = markersArray[i];
      let isHighlighted = false;
      let isDimmed = false;

      switch (markerData.type) {
        case EMarkerTypes.SENDER:
        case EMarkerTypes.RECEIVER: {
          const orderId = markerData.order?.id!;
          const set = this.activeOrders[orderId];

          const isActive = !!set?.size;

          isHighlighted = isActive;
          isDimmed = hasActiveOrders && !isActive;
          break;
        }
        case EMarkerTypes.COURIER: {
          const orderIds = Array.from(this.ordersByCourier[markerData.data.id] ?? []);
          const courierHasActiveOrders = orderIds.some(orderId => activeOrderSet.has(orderId));

          isHighlighted = hasActiveOrders;
          isDimmed = hasActiveOrders && !courierHasActiveOrders;
          break;
        }
      }

      this.upsertMarkerData(markerData.key, { isHighlighted, isDimmed });
    }
  }

  public upsertMarkerData(key: MarkerKey, newState: Partial<MarkerData>) {
    const curentState = this.state[key];
    let renderData;

    if (curentState) {
      renderData = Object.assign(this.state[key], newState);
    } else {
      renderData = this.state[key] = newState as MarkerData;
    }

    this.readMarkerData(renderData);
    this.view.upsertMarker(renderData);
  }

  private readMarkerData(data: Partial<MarkerData>) {
    if (data.type === EMarkerTypes.SENDER || data.type === EMarkerTypes.RECEIVER) {
      const order = data.order;

      if (!order) {
        return;
      }

      const courierId = order.courierId;
      const orderId = order.id;

      const set = this.ordersByCourier[courierId] || (this.ordersByCourier[courierId] = new Set<number>());
      set.add(orderId);
    }
  }
}
