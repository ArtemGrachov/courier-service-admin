import { useRef } from 'react';
import Axios, { type AxiosInstance } from 'axios';

export const useHttpClientService = () => {
  const httpClientRef = useRef<AxiosInstance>(null as unknown as AxiosInstance);

  if (!httpClientRef.current) {
    httpClientRef.current = Axios.create({ baseURL: import.meta.env.VITE_API_URL });
  }

  return httpClientRef.current;
}

