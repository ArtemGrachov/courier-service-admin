import { useSnackbar } from '~/hooks/other/use-snackbar';

export const useSuccessSnackbar = () => {
  const snackbar = useSnackbar();

  return (message?: string) => {
    snackbar({
      severity: 'success',
      content: message,
    });
  }
}
