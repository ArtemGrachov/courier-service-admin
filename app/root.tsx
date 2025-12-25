import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import 'reflect-metadata';
import { useTranslation } from 'react-i18next';
import { lazy, Suspense } from 'react';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { StorageProvider } from '~/providers/storage';
import { AuthProvider } from '~/providers/auth';
import { ModalsProvider } from '~/providers/modals';
import { HttpClientProvider } from '~/providers/http-client';

import ViewError from '~/routes/ViewError/ViewError';
import ModalRoot from '~/components/modals/ModalRoot';
import PageLoader from '~/components/other/PageLoader';

import i18n from '~/i18n/config';
import './app.scss';

const PageLongLoading = lazy(() => import('~/components/other/PageLongLoading'));

const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
});

const isBrowser = typeof window !== 'undefined';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Courier Service Admin" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        <HttpClientProvider>
          <StorageProvider>
            <AuthProvider>
              <ThemeProvider theme={darkTheme}>
                <ModalsProvider>
                  <CssBaseline />
                  <PageLoader />
                  <Suspense fallback={null}>
                    {isBrowser && <PageLongLoading />}
                  </Suspense>
                  {children}
                  <ModalRoot />
                </ModalsProvider>
              </ThemeProvider>
            </AuthProvider>
          </StorageProvider>
        </HttpClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { ready } = useTranslation();

  if (!ready) {
    return null;
  }

  return <Outlet />
}

export function meta() {
  const { t } = i18n;

  let title = '...';

  if (t('meta.title') !== 'meta.title') {
    title = t('common_meta.title_template', { title: t('meta.title') });
  }

  return [
    { title },
    { name: 'description', content: t('meta.description') },
  ];
}

export function ErrorBoundary() {
  return (
    <ViewError />
  )
}

