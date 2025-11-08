import { inject, injectable } from 'tsyringe';

import { View } from './View';

import type { MarkerData, MarkerKey } from '../types';

@injectable()
export class Model {
  private state: Record<MarkerKey, MarkerData> = {};
  private activeOrders: Record<number, Set<string>> = {};

  constructor(
    @inject(View) private readonly view: View,
  ) { }

  public get markerArray() {
    return Object.values(this.state);
  }

  public get hasActiveOrders() {
    return Object.keys(this.activeOrders).length > 0;
  }

  public setOrderActive(orderId: number, token: string, isActive: boolean) {
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

    this.updateActiveOrders();
  }

  public updateActiveOrders() {
    const markers = this.markerArray;
    const hasActiveOrders = this.hasActiveOrders;

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const orderId = marker.order?.id;

      if (orderId == null) {
        continue;
      }

      const isHighlighted = !!this.activeOrders[orderId]?.size;
      const isDimmed = hasActiveOrders && !isHighlighted;

      if (marker.isHighlighted === isHighlighted && marker.isDimmed === isDimmed) {
        continue;
      }

      this.upsertMarkerData(marker.key, { isHighlighted, isDimmed });
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

    this.view.upsertMarker(renderData);
  }
}
