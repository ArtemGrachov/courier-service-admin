import Axios, { type AxiosInstance } from 'axios';
import qs from 'query-string';

export class HttpClient {
  private static _instance: HttpClient;

  private _httpClient: AxiosInstance;

  public get httpClient() {
    return this._httpClient;
  }

  private constructor(httpClient: AxiosInstance) {
    this._httpClient = httpClient;
  } 

  public static get instance(): HttpClient {
    if (!HttpClient._instance) {
      const httpClient = Axios.create({ baseURL: import.meta.env.VITE_API_URL });
      httpClient.defaults.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'none' });
      HttpClient._instance = new HttpClient(httpClient);
    }

    return HttpClient._instance;
  }
}

