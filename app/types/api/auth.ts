import type { IApiResponse } from './response';

export interface ILoginResponse extends IApiResponse<{ token: string }> {}

