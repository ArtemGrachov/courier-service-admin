import { container, inject, injectable } from 'tsyringe';

import { Controller } from './Controller';
import { Model } from './Model';
import { View } from './View';

import { MarkersService } from './services/MarkersService';
import { MapService } from './services/MapService';
import { EventService } from './services/EventService';

import type { MarkerData } from '../types';
import type { ICourier } from '~/types/models/courier';
import type { IOrder } from '~/types/models/order';
import type { IGeoPos } from '~/types/models/geo-pos';

@injectable()
export class MapModule {
  public static createModule() {
    const rootContainer = container.createChildContainer();
    rootContainer.registerSingleton(Model);
    rootContainer.registerSingleton(View);
    rootContainer.registerSingleton(Controller);
    rootContainer.registerSingleton(MapService);
    rootContainer.registerSingleton(MarkersService);
    rootContainer.registerSingleton(EventService);

    const mapModule = rootContainer.resolve(MapModule);

    return mapModule;
  }

  constructor(
    @inject(Model) private readonly model: Model,
    @inject(View) private readonly view: View,
    @inject(Controller) private readonly controller: Controller,
    @inject(MapService) private readonly mapService: MapService,
    @inject(MarkersService) private readonly markersService: MarkersService,
    @inject(EventService) private readonly eventService: EventService,
  ) { }

  public get eventEmitter() {
    return this.eventService.emitter;
  }

  public init(mapEl: HTMLElement, center?: IGeoPos | null) {
    this.mapService.init(mapEl, center);
    this.controller.init();
  }

  public destroy() {
    this.mapService.destroy();
    this.controller.destroy();
  }

  public updateOrder(order: IOrder) {
    const markers = this.markersService.getOrderMarkersData(order);
    markers.forEach(m => this.model.upsertMarkerData(m.key, m));
  }

  public updateOrders(orders: IOrder[]) {
    const markers = orders.reduce((acc, curr) => {
      acc.push(...this.markersService.getOrderMarkersData(curr));
      return acc;
    }, [] as MarkerData[]);

    markers.forEach(m => this.model.upsertMarkerData(m.key, m));
  }

  public updateCouriers(couriers: ICourier[]) {
    const markers = couriers.map(c => this.markersService.getCourierMarkerData(c));

    markers.filter(m => !!m).forEach(m => this.model.upsertMarkerData(m.key, m));
  }

  public closeAllPopups() {
    this.view.closeAllPopups();
  }

  public scaleToMarkers() {
    const markersArray = this.view.markerArray;
    const positions = markersArray.map(mrk => mrk.data.location);

    if (positions.length === 0) {
      return;
    }

    this.mapService.scaleToPoints(positions);
  }
}
