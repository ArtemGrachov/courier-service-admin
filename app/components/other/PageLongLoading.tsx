import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Box, Typography } from '@mui/material';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useTranslation } from 'react-i18next';

import { useHttpClientCtx } from '~/providers/http-client';

const TIMEOUT_MS = 3000;

const PageLongLoading: ComponentType = () => {
  const httpClientCtx = useHttpClientCtx();
  const checkLongLoading = useRef(true);
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const requestCallback = (req: InternalAxiosRequestConfig) => {
      setTimeout(() => {
        if (!checkLongLoading.current) {
          return;
        }

        setShow(true);
      }, TIMEOUT_MS);
      return req;
    }

    const responseCallback = (res: AxiosResponse) => {
      checkLongLoading.current = false;
      setShow(false);

      httpClientCtx.interceptors.request.eject(reqInterceptor);
      httpClientCtx.interceptors.response.eject(resInterceptor)
      return res
    }

    const reqInterceptor = httpClientCtx.interceptors.request.use(requestCallback, requestCallback);
    const resInterceptor = httpClientCtx.interceptors.response.use(responseCallback, responseCallback)
  }, []);

  if (!show) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
      <Typography component="div" variant="h5" textAlign="center">
        {t('page_long_loading.title')}
        <br />
        {t('page_long_loading.subtitle')}
      </Typography>
    </Box>
  )
}

export default PageLongLoading;
