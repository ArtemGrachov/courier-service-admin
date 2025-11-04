import type { TFunction } from 'i18next';
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next';

export const getErrorMessage = (t: TFunction, error: any) => {
  const message = error?.data?.message ?? error?.details?.message ?? error?.message ?? error;

  if (typeof message === 'string') {
    return message;
  }

  return t('common_errors.generic');
}

export const useGetErrorMessage = () => {
  const { t } = useTranslation();

  return (error: any) => {
    return getErrorMessage(t, error);
  };
}

export const useErrorMessage = (error: any) => {
  const { t } = useTranslation();

  return useMemo(() => {
    return getErrorMessage(t, error);
  }, [error]);
}
