import { injectable } from 'tsyringe';
import { createEmitter } from '@kitbag/events';

import type { IMarker, MarkerData } from '../../types';

export interface IMarkerClickPayload {
  marker: IMarker;
}

export interface IMarkerPopupOpenPayload {
  marker: IMarker;
}

export interface IMarkerPopupClosePayload {
  marker: IMarker;
}

export type Events = {
  markerClick: IMarkerClickPayload;
  markerPopupOpen: IMarkerPopupOpenPayload;
  markerPopupClose: IMarkerPopupClosePayload;
};

@injectable()
export class EventService {
  private _emitter = createEmitter<Events>();

  public get emitter() {
    return this._emitter;
  }
}
