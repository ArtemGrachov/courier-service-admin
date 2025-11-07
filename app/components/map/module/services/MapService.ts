import L from 'leaflet';
import { injectable } from 'tsyringe';

import 'leaflet/dist/leaflet.css';

@injectable()
export class MapService {
  private _map: L.Map | null = null;

  public get map() {
    if (!this._map) {
      throw new Error('Map is not initialized');
    }

    return this._map;
  }

  public init(mapRef: HTMLElement) {
    this._map = L.map(mapRef).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this._map);
  }

  public destroy() {
    this._map?.remove();
  }
}
