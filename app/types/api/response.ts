export interface IApiResponse<T = any> {
  code: string;
  details: T;
  message: string;
  statusCode: number;
  type: 'success' | 'error';
}

