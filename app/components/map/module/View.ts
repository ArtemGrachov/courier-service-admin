import { inject, injectable } from 'tsyringe';
import L from 'leaflet';

import { EMarkerTypes } from '../constants';

import { MapService } from './services/MapService';
import { EventService } from './services/EventService';

import type { IMarker, MarkerData, MarkerKey } from '../types';

import { popupPortalName } from '../utils';

import srcIconSender from '~/assets/icons/map/sender.svg';
import srcIconReceiver from '~/assets/icons/map/receiver.svg';
import srcIconCourier from '~/assets/icons/map/courier.svg';

@injectable()
export class View {
  private static readonly ICONS = {
    SENDER: L.icon({
      iconUrl: srcIconSender,
      iconSize: [42, 42],
    }),
    RECEIVER: L.icon({
      iconUrl: srcIconReceiver,
      iconSize: [42, 42],
    }),
    COURIER: L.icon({
      iconUrl: srcIconCourier,
      iconSize: [42, 42],
    }),
  };

  private static readonly MARKER_CLASS_NAMES = {
    MAIN: 'csa-marker',
    IS_HIGHLIGHTED: 'csa-is-highlighted',
  };

  private static readonly MAP_HIGHLIGHT_CLASS_NAME = 'csa-has-highlight';

  private markers: Record<MarkerKey, IMarker> = {};
  private markerPopups: Record<MarkerKey, L.Popup> = {};

  constructor(
    @inject(MapService) private readonly mapService: MapService,
    @inject(EventService) private readonly eventService: EventService,
  ) { }

  public get markerArray() {
    return Object.values(this.markers);
  }

  public deleteMarker(key: MarkerKey) {
    const lMarker = this.markers[key]?.lMarker;
    const lPopup = this.markerPopups[key];

    if (lMarker) {
      lMarker.remove();
    }

    if (lPopup) {
      lPopup.close();
      lPopup.remove();
    }

    delete this.markers[key];
    delete this.markerPopups[key];
  }

  private createMarker(markerData: MarkerData) {
    let icon;

    switch (markerData.type) {
      case EMarkerTypes.SENDER: {
        icon = View.ICONS.SENDER;
        break;
      }
      case EMarkerTypes.RECEIVER: {
        icon = View.ICONS.RECEIVER;
        break;
      }
      case EMarkerTypes.COURIER: {
        icon = View.ICONS.COURIER;
        break;
      }
    }

    const lMarker = L.marker(
      [markerData.location.lat, markerData.location.lng],
      { icon },
    )
      .addTo(this.mapService.map)
      .addEventListener('click', () => this.eventService.emitter.emit('markerClick', { marker }));

    lMarker.getElement()?.classList.add(View.MARKER_CLASS_NAMES.MAIN);

    const marker: IMarker = {
      key: markerData.key,
      lMarker,
      data: markerData,
      renderedData: { ...markerData },
    };

    this.markers[markerData.key] = marker;

    return marker;
  }

  private renderMarker(marker: IMarker, newMarkerData: MarkerData) {
    let markerEl = marker.lMarker.getElement();

    if (newMarkerData.location !== marker.renderedData?.location) {
      marker.lMarker.setLatLng([
        marker.data.location.lat,
        marker.data.location.lng,
      ]);
    }

    if (!markerEl) {
      return;
    }

    if (newMarkerData.isHighlighted !== marker.renderedData?.isHighlighted) {
      if (newMarkerData.isHighlighted) {
        markerEl.classList.add(View.MARKER_CLASS_NAMES.IS_HIGHLIGHTED);
      } else {
        markerEl.classList.remove(View.MARKER_CLASS_NAMES.IS_HIGHLIGHTED);
      }
    }

    marker.data = newMarkerData;
    marker.renderedData = { ...newMarkerData };
  }

  public upsertMarker(markerData: MarkerData) {
    const marker = this.markers[markerData.key] ?? this.createMarker(markerData);

    this.renderMarker(marker, markerData);
  }

  public openMarkerPopup(key: MarkerKey) {
    if (this.markerPopups[key]) {
      return null;
    }

    const marker = this.markers[key];

    if (!marker) {
      throw new Error(`Marker with key ${key} not found`);
    }

    const { lMarker } = marker;

    const popup = L
      .popup({
        closeOnClick: false,
        closeOnEscapeKey: false,
        autoClose: false,
        minWidth: 300,
        maxWidth: 1000,
        className: 'csa-map-popup',
      });

    popup.setLatLng(lMarker.getLatLng());
    popup.setContent(`<div id="${popupPortalName(key)}"></div>`);
    popup.openOn(this.mapService.map);

    this.eventService.emitter.emit('markerPopupOpen', { marker });

    const removeListener = () => {
      this.eventService.emitter.emit('markerPopupClose', { marker });
      delete this.markerPopups[key];
      popup.removeEventListener('remove', removeListener);
    }

    popup.addEventListener('remove', removeListener);

    this.markerPopups[key] = popup;

    return popup;
  }

  public closeAllPopups() {
    Object.entries(this.markerPopups).forEach(([key, lPopup]) => {
      lPopup.close();
    });
  }

  public updateHighlight(isActive: boolean) {
    const mapRef = this.mapService.mapRef;

    if (isActive) {
      mapRef?.classList.add(View.MAP_HIGHLIGHT_CLASS_NAME);
    } else {
      mapRef?.classList.remove(View.MAP_HIGHLIGHT_CLASS_NAME);
    }
  }
}
