import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { enUS, ukUA } from '@mui/x-data-grid/locales';
import type { Localization } from '@mui/x-data-grid/internals';

export const useDataGridLabels = () => {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    let lcl: Localization | undefined;

    switch (i18n.language) {
      case 'en': {
        lcl = enUS;
        break;
      }
      case 'uk': {
        lcl = ukUA;
        break;
      }
    }

    return lcl?.components.MuiDataGrid.defaultProps.localeText;
  }, [i18n.language]);
}
