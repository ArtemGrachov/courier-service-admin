import { useEffect, type ComponentType } from 'react';
import { useRouteError } from 'react-router';
import Box from '@mui/material/Box';

import PageError from '~/components/other/PageError';

const ErrorBoundary: ComponentType = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, []);

  return (
    <Box
      padding={3}
      width="100%"
      height="100%"
      boxSizing="border-box"
    >
      <PageError error={error} />
    </Box>
  )
}

export default ErrorBoundary;

