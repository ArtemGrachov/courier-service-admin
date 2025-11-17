import { useSnackbar } from '~/hooks/other/use-snackbar';
import { useGetErrorMessage } from '~/hooks/errors/use-error-message';

export const useErrorSnackbar = () => {
  const snackbar = useSnackbar();
  const getErrorMesssage = useGetErrorMessage();

  return (error?: any) => {
    snackbar({
      severity: 'error',
      content: getErrorMesssage(error),
    });
  }
}
