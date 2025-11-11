import L from 'leaflet';
import { injectable } from 'tsyringe';

import type { IGeoPos } from '~/types/models/geo-pos';

import 'leaflet/dist/leaflet.css';

@injectable()
export class MapService {
  private static readonly MAP_HOST_CLASSNAME = 'csa-map';

  private _map: L.Map | null = null;
  private _mapRef: HTMLElement | null = null;

  public get map() {
    if (!this._map) {
      throw new Error('Map is not initialized');
    }

    return this._map;
  }

  public get mapRef() {
    return this._mapRef;
  }

  public init(mapRef: HTMLElement, center?: IGeoPos | null) {
    this._map = L.map(mapRef).setView([center?.lat ?? 0, center?.lng ?? 0], 13);
    this._mapRef = mapRef;

    mapRef.classList.add(MapService.MAP_HOST_CLASSNAME);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this._map);
  }

  public scaleToPoints(points: IGeoPos[]) {
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    this._map?.fitBounds(bounds);
  }

  public destroy() {
    this._map?.remove();
  }
}
