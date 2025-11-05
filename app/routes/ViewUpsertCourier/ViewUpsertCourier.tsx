import Box from '@mui/material/Box';
import { useEffect, useMemo, type ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { ROUTES } from '~/router/routes';

import { UpsertCourierProvider, useUpsertCourierCtx } from './providers/upsert-courier';
import { CourierProvider, useCourierCtx } from '~/providers/courier';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useSuccessSnackbar } from '~/hooks/other/use-success-snackbar';
import FormCourier from '~/components/forms/FormCourier';

import type { IFormCourier } from '~/types/forms/form-courier';

const ViewUpsertCourier: ComponentType = observer(() => {
  const { store: upsertCourierStore, submitCreate: submit } = useUpsertCourierCtx();
  const { store: courierStore, fetch } = useCourierCtx();
  const { t } = useTranslation();
  const errorSnackbar = useErrorSnackbar();
  const successSnackbar = useSuccessSnackbar();
  const navigate = useNavigate();
  const { courierId } = useParams();
  const isEdit = !!courierId;

  const showForm = useMemo(() => {
    if (!isEdit) {
      return true;
    }

    return courierStore.isSuccess;
  }, [isEdit, courierStore.isSuccess])

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

  const getData = async () => {
    try {
      await fetch(+courierId!);
    } catch (err) {
      errorSnackbar(err);
    }
  }

  useEffect(() => {
    if (courierId) {
      getData();
    }
  }, []);

  return (
    <Box padding={3}>
      <Box maxWidth={500} margin="auto">
        {showForm && <FormCourier
          initialValue={courierStore.data!}
          submitStatus={upsertCourierStore.submitStatus}
          submitError={upsertCourierStore.submitError}
          onSubmit={submitHandler}
        />}
      </Box>
    </Box>
  )
})

const Wrapper = () => {
  return (
    <CourierProvider>
      <UpsertCourierProvider>
        <ViewUpsertCourier />
      </UpsertCourierProvider>
    </CourierProvider>
  )
}

export default Wrapper;
