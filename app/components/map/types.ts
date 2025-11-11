import type { EMarkerTypes } from './constants';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IGeoPos } from '~/types/models/geo-pos';
import type { IOrder } from '~/types/models/order';

export interface IMarkerData<T> {
  key: string;
  location: IGeoPos;
  type: EMarkerTypes;
  data: T;
  order?: IOrder;
  isHighlighted?: boolean;
}

export interface IMarkerDataSender extends IMarkerData<IClient> { }

export interface IMarkerDataReceiver extends IMarkerData<IClient> { }

export interface IMarkerDataCourier extends IMarkerData<ICourier> { }

export type MarkerData = IMarkerDataSender | IMarkerDataReceiver | IMarkerDataCourier;

export type MarkerKey = string;

export interface IMarker {
  lMarker: L.Marker;
  key: MarkerKey;
  data: MarkerData;
  renderedData: MarkerData;
}
