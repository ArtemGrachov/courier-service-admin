import { type ComponentType, useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import type { IStatsRecord } from '~/types/models/stats';

interface IProps {
  stats?: Record<string, IStatsRecord> | null;
}

const X_AXIS = [{
  id: 'days',
  dataKey: 'date',
  scaleType: 'time' as 'linear',
  valueFormatter: (date: string) => dayjs(date).format('YYYY.MM.DD'),
}];

const SERIES = [
  {
    id: 'cancelled',
    label: 'order_status.cancelled',
    dataKey: 'cancelled',
    connectNulls: true,
  },
  {
    id: 'completed',
    label: 'order_status.completed',
    dataKey: 'completed',
    connectNulls: true,
  },
];

const OrdersChart: ComponentType<IProps> = ({ stats }) => {
  const { t, i18n } = useTranslation();

  const dataset = useMemo(() => {
    if (!stats) {
      return [];
    }

    return Object
      .entries(stats)
      .sort(([aKey], [bKey]) => {
        const aDate = dayjs(aKey);
        const bDate = dayjs(bKey);

        return aDate.isBefore(bDate) ? -1 : bDate.isBefore(aDate) ? 1 : 0;
      })
      .map(([dateKey, record]) => {
        return {
          date: dayjs(dateKey).toDate(),
          cancelled: record.cancelled ?? null,
          completed: record.completed ?? null,
        };
      });
  }, [stats]);

  const series = useMemo(() => {
    return SERIES.map(s => ({
      ...s,
      label: t(s.label),
    }));
  }, [i18n.language]);

  if (!stats) {
    return null;
  }

  return (
    <LineChart
      xAxis={X_AXIS}
      dataset={dataset}
      series={series}
      height={300}
    />
  )
}

export default OrdersChart;

