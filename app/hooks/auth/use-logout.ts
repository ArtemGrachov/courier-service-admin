import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '~/router/routes';

import { useConfirmation } from '~/hooks/other/use-confirmation';
import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx'

export const useLogout = () => {
  const { t } = useTranslation();
  const { unauthorize } = useAuthCtx();
  const confirmation = useConfirmation();
  const navigate = useNavigate();

  return async () => {
    const confirmed = await confirmation({
      title: t('logout.title'),
      question: t('logout.question'),
      confirmLabel: t('common_modals.yes'),
      rejectLabel: t('common_modals.no'),
    });

    if (!confirmed) {
      return;
    }

    unauthorize();
    navigate(ROUTES.LOGIN);
  }
}
