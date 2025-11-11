import { useState, type ComponentType, type ReactNode } from 'react';
import { Alert, AlertTitle, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useReloadPageCtx } from '~/providers/reload-page';

import { useErrorMessage } from '~/hooks/errors/use-error-message';

interface IProps {
  title?: ReactNode;
  error?: any;
  isProcessing?: boolean;
}

const PageError: ComponentType<IProps> = ({ title, error, isProcessing }) => {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage(error);
  const reloadFunction = useReloadPageCtx();
  const [isLoading, setIsLoading] = useState(false);

  const reloadHandler = async () => {
    if (isProcessing == null) {
      setIsLoading(true);
    }

    reloadFunction();
  }

  return (
    <Alert color="error" sx={{ maxWidth: 500, margin: '0 auto', width: '100%', alignSelf: 'flex-start' }}>
      <AlertTitle>
        {title ?? t('page_error.title')}
      </AlertTitle>
      <Typography sx={{ width: '100%' }} variant="subtitle2" marginTop={2} marginBottom={2}>
        {errorMessage}
      </Typography>
      <Button
        fullWidth={true}
        color="warning"
        variant="contained"
        loading={isProcessing ?? isLoading}
        onClick={reloadHandler}
      >
        {t('page_error.reload')}
      </Button>
    </Alert>
  )
}

export default PageError;
