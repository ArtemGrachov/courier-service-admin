import { useState } from 'react';

export interface IOptions<T> {
  initialData?: T | null;
  loader: () => Promise<any>;
}

export const usePageDataService = <T, >({ initialData, loader }: IOptions<T>) => {
  const [state, setState] = useState<T | null | undefined>(initialData);

  const reload = async () => {
    const newState = await loader();
    setState(newState);
  }

  return {
    state,
    reload,
  }
}

