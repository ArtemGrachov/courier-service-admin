import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCALES } from '~/i18n/locales';

export const useLanguageSwitch = () => {
  const { t, i18n } = useTranslation();

  const options = useMemo(() => {
    return LOCALES.map(locale => {
      return {
        locale,
        label: t(`common_locales.${locale}`),
      };
    })
  }, [i18n.language]);

  const currentLocaleLabel = useMemo(() => {
    return i18n.language.toLocaleUpperCase();
  }, [i18n.language]);

  const changeLocale = (locale: string) => {
    i18n.changeLanguage(locale);
  }

  return {
    options,
    currentLocaleLabel,
    changeLocale,
  };
}
