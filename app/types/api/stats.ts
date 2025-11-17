import type { IStatsRecord } from '../models/stats';

export interface IGetStatsResponse {
  stats: Record<string, IStatsRecord>;
}

