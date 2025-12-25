import type { IStatsRecord } from '../models/stats';

export interface IGetStatsResponse {
  statistic: Record<string, IStatsRecord>;
}

