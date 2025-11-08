import { inject, injectable } from 'tsyringe';

import { View } from './View';
import { EMarkerTypes } from '../constants';

import type { MarkerData, MarkerKey } from '../types';
import { Graph } from '~/types/adt/graph';

import { getCourierKey, getReceiverKey, getSenderKey } from '../utils';

@injectable()
export class Model {
  private state: Record<MarkerKey, MarkerData> = {};
  private markersGraph = new Graph<MarkerKey>();
  private activeMarkers: Set<MarkerKey> = new Set();

  constructor(
    @inject(View) private readonly view: View,
  ) { }

  public get markerArray() {
    return Object.values(this.state);
  }

  public get highlightedMarkers() {
    const arr = Array.from(this.activeMarkers).reduce((acc, curr) => {
      const neighbours = this.markersGraph.neighbours(curr);
      acc.push(...neighbours);
      return acc;
    }, [] as MarkerKey[]);

    const set = new Set(arr);

    return set;
  }

  public setMarkerActive(key: MarkerKey, isActive: boolean) {
    const oldSize = this.activeMarkers.size;

    if (isActive) {
      this.activeMarkers.add(key);
    } else {
      this.activeMarkers.delete(key);
    }

    const newSize = this.activeMarkers.size;
    const updateAll = !!oldSize !== !!newSize;

    if (updateAll) {
      this.markersUpdateHandler();
    } else {
      this.highlightPartial(key);
    }
  }

  private highlightMakrers(keys: MarkerKey[]) {
    const highlighted = this.highlightedMarkers;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const markerData = this.state[key];

      if (!markerData) {
        continue;
      }

      const isHighlighted = this.activeMarkers.has(markerData.key) || highlighted.has(markerData.key);
      const isDimmed = !isHighlighted;

      this.upsertMarkerData(markerData.key, { isHighlighted, isDimmed });
    }
  }

  private highlightPartial(key: MarkerKey) {
    const nodes = this.markersGraph.neighbours(key);
    this.highlightMakrers(nodes);
  }

  private highlightOn() {
    this.highlightMakrers(Object.keys(this.state));
  }

  private highlightOff() {
    const markerArray = this.markerArray;

    for (let i = 0; i < markerArray.length; i++) {
      const markerData = markerArray[i];
      this.upsertMarkerData(markerData.key, { isHighlighted: false, isDimmed: false });
    }
  }

  private markersUpdateHandler() {
    if (this.activeMarkers.size) {
      this.highlightOn();
    } else {
      this.highlightOff();
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
    switch (data.type) {
      case EMarkerTypes.SENDER:
      case EMarkerTypes.RECEIVER: {
        const order = data.order;

        if (!order) {
          return;
        }

        const { id, courierId } = order;

        let senderKey;
        let receiverKey;
        let courierKey;

        if (id != null) {
          senderKey = getSenderKey(id);
          receiverKey = getReceiverKey(id);

          this.markersGraph.addNode(senderKey);
          this.markersGraph.addNode(receiverKey);

          this.markersGraph.addEdge(senderKey, receiverKey);
        }

        if (courierId != null && senderKey != null && receiverKey != null) {
          courierKey = getCourierKey(courierId);
          this.markersGraph.addNode(courierKey);

          this.markersGraph.addEdge(courierKey, senderKey);
          this.markersGraph.addEdge(courierKey, receiverKey);
        }

        break;
      }
      case EMarkerTypes.COURIER: {
        const courierId = data.data?.id;

        if (!courierId) {
          return;
        }

        const courierKey = getCourierKey(courierId);
        this.markersGraph.addNode(courierKey);
        break;
      }
    }
  }
}
