import type { TFunction } from 'i18next';
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next';

export const getErrorMessage = (t: TFunction, error: any, fallback = true) => {
  const message = error?.data?.message ?? error?.details?.message ?? error?.message ?? error;

  if (typeof message === 'string') {
    return message;
  }

  if (fallback) {
    return t('common_errors.generic');
  }

  return null;
}

export const useGetErrorMessage = () => {
  const { t } = useTranslation();

  return (error: any, fallback?: boolean) => {
    return getErrorMessage(t, error, fallback);
  };
}

export const useErrorMessage = (error: any, fallback?: boolean) => {
  const { t } = useTranslation();

  return useMemo(() => {
    return getErrorMessage(t, error, fallback);
  }, [error]);
}
