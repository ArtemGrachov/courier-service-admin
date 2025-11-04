import { lazy, type ComponentType, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldError } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { PASSWORD_MIN_LENGTH } from '~/validators/password.validator';

const Popper = lazy(() => import('@mui/material/Popper'));

interface IProps {
  error?: FieldError;
  ref: RefObject<any>;
  open?: boolean;
}

const VALIDATIONS = [
  {
    key: 'containUpperCase',
    translation: 'password_validation_hint.contain_upper_case',
  },
  {
    key: 'containLowerCase',
    translation: 'password_validation_hint.contain_lower_case',
  },
  {
    key: 'containNumber',
    translation: 'password_validation_hint.contain_number',
  },
  {
    key: 'onlyLatin',
    translation: 'password_validation_hint.only_latin',
  },
  {
    key: 'specialSymbol',
    translation: 'password_validation_hint.special_symbol',
  },
  {
    key: 'minLength',
    translation: 'password_validation_hint.min_length',
    translationParameters: { minLength: PASSWORD_MIN_LENGTH }
  },
];

const PasswordValidationHint: ComponentType<IProps> = ({ ref, open, error }) => {
  const { t } = useTranslation();

  return (
    <Popper
      anchorEl={ref.current}
      open={open ?? false}
      placement="bottom-start"
    >
      <Paper elevation={8}>
        <List dense>
          {VALIDATIONS.map(item => (
            <ListItem key={item.key}>
              <ListItemIcon>
                {error?.types?.[item.key] ?  <CloseIcon color="error" /> : <CheckIcon color="success" />}
              </ListItemIcon>
              <ListItemText>
                {t(item.translation, item.translationParameters)}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  )
}

export default PasswordValidationHint;
