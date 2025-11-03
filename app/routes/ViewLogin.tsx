import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import AuthLinks from '~/components/auth/AuthLinks';
import FormLogin from '~/components/forms/FormLogin';

const ViewLogin: ComponentType = () => {
  const { t } = useTranslation();
  return (
    <Card sx={{ width: '100%', maxWidth: 340 }}>
      <CardContent>
        <Typography component="h1" variant="h4" marginBottom={2}>
          {t('view_login.title')}
        </Typography>
        <FormLogin />
        <AuthLinks />
      </CardContent>
    </Card>
  )
}

export default ViewLogin;
