import type { ICourier } from '~/types/models/courier';

export const fetchCourier = async (courierId: number) => {
  const couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);
  const data = couriers.find(c => c.id === courierId);

  if (!data) {
    throw new Error('404');
  }

  return data;
}
