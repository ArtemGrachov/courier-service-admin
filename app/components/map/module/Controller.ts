import { inject, injectable } from 'tsyringe';

import { EMarkerTypes } from '../constants';

import { Model } from './Model';
import { View } from './View';
import {
  EventService,
  type IMarkerClickPayload,
  type IMarkerPopupClosePayload,
} from './services/EventService';

import type { IMarker } from '../types';

@injectable()
export class Controller {
  constructor(
    @inject(View) private readonly view: View,
    @inject(Model) private readonly model: Model,
    @inject(EventService) private readonly eventService: EventService,
  ) { }

  public init() {
    this.eventService.emitter.on('markerClick', this.markerClickListener);
    this.eventService.emitter.on('markerPopupClose', this.markerPopupCloseListener);
  }

  public destroy() {
    this.eventService.emitter.off('markerClick', this.markerClickListener);
    this.eventService.emitter.off('markerPopupClose', this.markerPopupCloseListener);
  }

  public markerClickHandler(marker: IMarker) {
    const { key, data } = marker;
    const popup = this.view.openMarkerPopup(key);

    if (!popup) {
      return;
    }

    switch (data.type) {
      case EMarkerTypes.SENDER:
      case EMarkerTypes.RECEIVER: {
        if (data.order) {
          this.clientSelectHandler(marker, true);
        }
        break;
      }
      case EMarkerTypes.COURIER: {
        this.courierSelectHandler(marker, true);
        break;
      }
    }
  }

  private clientSelectHandler(marker: IMarker, isSelected: boolean) {
    this.model.setOrderActive(
      marker.data.order!.id,
      marker.key,
      isSelected,
    );
  }

  private courierSelectHandler(marker: IMarker, isSelected: boolean) {
    this.model.setCourierActive(marker.data.data.id, marker.key, isSelected);
  }

  private markerClickListener = ({ marker }: IMarkerClickPayload) => {
    this.markerClickHandler(marker);
  }

  private markerPopupCloseListener = ({ marker }: IMarkerPopupClosePayload) => {
    const { data } = marker;

    switch (data.type) {
      case EMarkerTypes.SENDER:
      case EMarkerTypes.RECEIVER: {
        if (data.order) {
          this.clientSelectHandler(marker, false);
        }
        break;
      }
      case EMarkerTypes.COURIER: {
        this.courierSelectHandler(marker, false);
        break;
      }
    }
  }
}
