import { inject, injectable } from 'tsyringe';

import { View } from './View';
import { EMarkerTypes } from '~/components/map/constants';

import type { MarkerData, MarkerKey } from '../types';

@injectable()
export class Model {
  private state: Record<MarkerKey, MarkerData> = {};
  private activeOrders: Record<number, Set<string>> = {};
  private allDimmed: boolean = false;

  constructor(
    @inject(View) private readonly view: View,
  ) { }

  public get markerArray() {
    return Object.values(this.state);
  }

  public get hasActiveOrders() {
    return Object.keys(this.activeOrders).length > 0;
  }

  private updateSingleOrder(orderId: number, token: string, isActive: boolean) {
    let set = this.activeOrders[orderId];
    const hasSet = !!set;

    if (!hasSet) {
      set = this.activeOrders[orderId] = new Set<string>();
    }

    if (isActive) {
      set.add(token);
    } else {
      set.delete(token);
    }

    if (hasSet && isActive) {
      return;
    }

    if (!isActive && set.size === 0) {
      delete this.activeOrders[orderId];
    }
  }

  public setOrderActive(orderId: number, token: string, isActive: boolean) {
    this.updateSingleOrder(orderId, token, isActive);
    this.updateActiveMarkers();
  }

  public setOrdersActive(orderId: number[], token: string, isActive: boolean) {
    orderId.forEach(orderId => this.updateSingleOrder(orderId, token, isActive));
    this.updateActiveMarkers();
  }

  public setCourierActive(courierId: number, token: string, isActive: boolean) {
    const courierOrderMarkers: MarkerData[] = [];

    const markers = this.markerArray;

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];

      switch (marker.type) {
        case EMarkerTypes.SENDER:
        case EMarkerTypes.RECEIVER: {
          if (marker.order?.courierId === courierId) {
            courierOrderMarkers.push(marker);
          }
          break;
        }
      }
    }

    if (courierOrderMarkers.length === 0) {
      this.allDimmed = isActive;
    }

    this.setOrdersActive(courierOrderMarkers.map(m => m.order!.id), token, isActive);
  }

  public updateActiveMarkers() {
    const markers = this.markerArray;
    const hasActiveOrders = this.hasActiveOrders;

    for (let i = 0; i < markers.length; i++) {
      const markerData = markers[i];
      const orderId = markerData.order?.id;

      switch (markerData.type) {
        case EMarkerTypes.SENDER:
        case EMarkerTypes.RECEIVER: {
          if (orderId == null) {
            continue;
          }
          this.updateOrderMarker(markerData, hasActiveOrders);
          break;
        }
        case EMarkerTypes.COURIER: {
          break;
        }
      }
    }
  }

  private updateOrderMarker(markerData: MarkerData, hasActiveOrders: boolean) {
    const orderId = markerData.order!.id;

    const isHighlighted = !!this.activeOrders[orderId]?.size;
    const isDimmed = this.allDimmed || (hasActiveOrders && !isHighlighted);

    if (markerData.isHighlighted === isHighlighted && markerData.isDimmed === isDimmed) {
      return;
    }

    this.upsertMarkerData(markerData.key, { isHighlighted, isDimmed });
  }

  public upsertMarkerData(key: MarkerKey, newState: Partial<MarkerData>) {
    const curentState = this.state[key];
    let renderData;

    if (curentState) {
      renderData = Object.assign(this.state[key], newState);
    } else {
      renderData = this.state[key] = newState as MarkerData;
    }

    this.view.upsertMarker(renderData);
  }
}
