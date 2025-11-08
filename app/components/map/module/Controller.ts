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
    const { key } = marker;
    const popup = this.view.openMarkerPopup(key);

    if (!popup) {
      return;
    }

    this.markerSelectHandler(marker, true);
  }

  private markerSelectHandler(marker: IMarker, isSelected: boolean) {
    this.model.setMarkerActive(
      marker.key,
      isSelected,
    );
  }

  private markerClickListener = ({ marker }: IMarkerClickPayload) => {
    this.markerClickHandler(marker);
  }

  private markerPopupCloseListener = ({ marker }: IMarkerPopupClosePayload) => {
    this.markerSelectHandler(marker, false);
  }
}
