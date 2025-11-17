import { useEffect, useState } from 'react';

export interface IOptions<T> {
  initialData?: T | null;
  loader: () => Promise<any>;
  updateCondition?: (newState?: T | null) => boolean;
}

export const usePageDataService = <T, >({ initialData, loader, updateCondition }: IOptions<T>) => {
  const [state, setState] = useState<T | null | undefined>(initialData);

  const reload = async () => {
    const newState = await loader();
    setState(newState);
  }

  useEffect(() => {
    if (updateCondition && !updateCondition(initialData)) {
      return;
    }

    setState(initialData);
  }, [initialData]);

  return {
    state,
    reload,
  }
}

