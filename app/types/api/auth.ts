import type { IApiResponse } from './response';

export interface ILoginResponse extends IApiResponse<{ token: string }> {}

export interface IForgotPasswordResponse extends IApiResponse {}

