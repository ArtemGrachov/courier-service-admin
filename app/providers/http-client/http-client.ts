import Axios, { type AxiosInstance } from 'axios';

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
      HttpClient._instance = new HttpClient(Axios.create({ baseURL: import.meta.env.VITE_API_URL }));
    }

    return HttpClient._instance;
  }
}

