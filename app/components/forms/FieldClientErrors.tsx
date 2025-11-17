import { type ComponentType, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type FieldError } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

interface IProps {
  error?: FieldError | any;
  customMessages?: Record<string, string>;
}

const FieldClientErrors: ComponentType<IProps> = ({ error, customMessages }) => {
  const { t } = useTranslation();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    if (error?.message) {
      return customMessages?.message ?? t(error.message);
    }

    let message;

    switch (error.type) {
      case 'containUpperCase': {
        message = customMessages?.containUpperCase ?? t('common_validation.contain_upper_case');
        break;
      }
      case 'containLowerCase': {
        message = customMessages?.containLowerCase ?? t('common_validation.contain_lower_case');
        break;
      }
      case 'containNumber': {
        message = customMessages?.containNumber ?? t('common_validation.contain_number');
        break;
      }
      case 'onlyLatin': {
        message = customMessages?.onlyLatin ?? t('common_validation.only_latin');
        break;
      }
      case 'specialSymbol': {
        message = customMessages?.specialSymbol ?? t('common_validation.special_symbol');
        break;
      }
      case 'minLength': {
        message = customMessages?.minLength;
        break;
      }
      case 'sameAs': {
        message = customMessages?.sameAs;
        break;
      }
    }

    if (message) {
      return message;
    }

    return t(`common_validation.${error?.type}`);
  }, [error]);

  if (!error) {
    return null;
  }

  return (
    <FormHelperText error={true}>
      {errorMessage}
    </FormHelperText>
  )
}

export default FieldClientErrors;
