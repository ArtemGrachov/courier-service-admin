import { useRef } from 'react';
import { type AxiosInstance } from 'axios';
import { HttpClient } from './http-client';

export const useHttpClientService = () => {
  const httpClientRef = useRef<AxiosInstance>(null as unknown as AxiosInstance);

  if (!httpClientRef.current) {
    httpClientRef.current = HttpClient.instance.httpClient;
  }

  return httpClientRef.current;
}

