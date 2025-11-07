import { inject, injectable } from 'tsyringe';

import { View } from './View';

import type { MarkerData, MarkerKey } from '../types';

@injectable()
export class Model {
  private state: Record<MarkerKey, MarkerData> = {};

  constructor(
    @inject(View) private readonly view: View,
  ) { }

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
