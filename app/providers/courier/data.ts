import type { ICourier } from '~/types/models/courier';
import { mockRequest } from '~/utils/mock-request';

export const fetchCourier = async (courierId: number) => {
  const couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);
  const courier = couriers.find(c => c.id === courierId);
  const data = await mockRequest(courier);

  if (!data) {
    throw new Error('404');
  }

  return data;
}
