import { useContext } from 'react';
import { StorageContext } from '../';

export const useStorageCtx = () => {
  return useContext(StorageContext);
}
