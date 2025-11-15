import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import 'reflect-metadata';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { StorageProvider } from '~/providers/storage';
import { AuthProvider } from '~/providers/auth';
import { ModalsProvider } from '~/providers/modals';

import ModalRoot from '~/components/modals/ModalRoot';
import PageLoader from '~/components/other/PageLoader';
import ViewError from '~/routes/ViewError/ViewError';

import i18n from '~/i18n/config';
import './app.scss';

const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StorageProvider>
          <AuthProvider>
            <ThemeProvider theme={darkTheme}>
              <ModalsProvider>
                <CssBaseline />
                <PageLoader />
                {children}
                <ModalRoot />
              </ModalsProvider>
            </ThemeProvider>
          </AuthProvider>
        </StorageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />
}

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('meta.title') }) },
    { name: 'description', content: t('meta.description') },
  ];
}

export function ErrorBoundary() {
  return (
    <ViewError />
  )
}

