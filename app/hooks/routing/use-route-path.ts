import { pathcat } from 'pathcat';

const generateRoutePath = (pathName: string, params?: Record<string, any>) => {
  return pathcat('/', pathName, params ?? {});
}

export const useRoutePath = () => {
  return (pathName: string, params?: Record<string, any>) => generateRoutePath(pathName, params);
}
