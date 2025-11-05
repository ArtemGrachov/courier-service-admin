import Box from '@mui/material/Box';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { ROUTES } from '~/router/routes';

import { UpsertCourierProvider, useUpsertCourierCtx } from './providers/upsert-courier';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useSuccessSnackbar } from '~/hooks/other/use-success-snackbar';
import FormCourier from '~/components/forms/FormCourier';

import type { IFormCourier } from '~/types/forms/form-courier';

const ViewEditCourier: ComponentType = observer(() => {
  const { store, submitCreate: submit } = useUpsertCourierCtx();
  const { t } = useTranslation();
  const errorSnackbar = useErrorSnackbar();
  const successSnackbar = useSuccessSnackbar();
  const navigate = useNavigate();

  const submitHandler = async (formValue: IFormCourier) => {
    try {
      await submit(formValue);
      successSnackbar(t('view_upsert_courier.create_success'));
      await navigate(ROUTES.COURIERS);
    } catch (err) {
      errorSnackbar(err);
      throw err;
    }
  }

  return (
    <Box padding={3}>
      <Box maxWidth={500} margin="auto">
        <FormCourier
          submitStatus={store.submitStatus}
          submitError={store.submitError}
          onSubmit={submitHandler}
        />
      </Box>
    </Box>
  )
})

const Wrapper = () => {
  return (
    <UpsertCourierProvider>
      <ViewEditCourier />
    </UpsertCourierProvider>
  )
}

export default Wrapper;
