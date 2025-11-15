import dayjs from 'dayjs';
import { EOrderStatus } from '~/constants/order';
import type { IOrder } from '~/types/models/order';

export const fetchStats = async () => {
  const orders = await import('~/mock-data/orders.json').then(m => m.default as IOrder[]);

  const stats = orders.reduce((acc, curr) => {
    const { dateTimeClosed, dateTimeOrdered, status } = curr;
    const orderedDay = dayjs(dateTimeOrdered).format('YYYY.MM.DD');

    if (status === EOrderStatus.ORDERED) {
      const orderedDayData = acc[orderedDay] || (acc[orderedDay] = {});
      orderedDayData.ordered = (orderedDayData.ordered ?? 0) + 1;
    }

    if (dateTimeClosed) {
      const closedDay = dayjs(dateTimeClosed).format('YYYY.MM.DD');
      const closedDayData = acc[closedDay] || (acc[closedDay] = {});

      switch (status) {
        case EOrderStatus.COMPLETED: {
          closedDayData.completed = (closedDayData.completed ?? 0) + 1;
          break;
        }
        case EOrderStatus.CANCELLED: {
          closedDayData.cancelled = (closedDayData.cancelled ?? 0) + 1;
          break;
        }
      }
    }

    return acc;
  }, {});

  return {
    stats,
  };
}

