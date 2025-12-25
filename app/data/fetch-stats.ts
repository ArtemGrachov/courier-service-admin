import { HttpClient } from '~/providers/http-client/http-client';
import type { IGetStatsResponse } from '~/types/api/stats';

export const fetchStats = async () => {
  const httpClient = HttpClient.instance.httpClient;

  const { data } = await httpClient.get<IGetStatsResponse>('/statistic');

  return data;
}

