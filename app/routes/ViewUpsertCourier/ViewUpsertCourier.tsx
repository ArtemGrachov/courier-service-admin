import Box from '@mui/material/Box';
import { useMemo, type ComponentType } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import type { Route } from '.react-router/types/app/routes/ViewUpsertCourier/+types/ViewUpsertCourier';

import { ROUTES } from '~/router/routes';

import { EStatus } from '~/constants/status';

import { UpsertCourierProvider, useUpsertCourierCtx } from './providers/upsert-courier';
import { CourierProvider, useCourierCtx } from '~/providers/courier';
import { fetchCourier } from '~/providers/courier/data';
import type { ICourierStoreData } from '~/providers/courier/store';

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
      if (isEdit) {
        await submitUpdate(formValue);
      } else {
        await submitCreate(formValue);
      }
    } catch (err) {
      errorSnackbar(err);
      throw err;
    }
  }

  const submitCreate = async (formValue: IFormCourier) => {
    await submit(formValue);
    successSnackbar(t('view_upsert_courier.create_success'));
    await navigate(ROUTES.COURIERS);
  }

  const submitUpdate = async (formValue: IFormCourier) => {
    await submit(formValue);
    successSnackbar(t('view_upsert_courier.edit_success'));
    await navigate(ROUTES.COURIERS);
  }

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
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <CourierProvider initialData={loaderData.courierData}>
      <UpsertCourierProvider>
        <ViewUpsertCourier />
      </UpsertCourierProvider>
    </CourierProvider>
  )
}

export default Wrapper;

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const courierState: ICourierStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  if (params.courierId) {
    try {
      const data = await fetchCourier(+params.courierId!);
      courierState.data = data;
      courierState.getStatus = EStatus.SUCCESS;
    } catch (err) {
      courierState.getError = err;
      courierState.getStatus = EStatus.ERROR;
    }
  }

  return {
    courierData: courierState,
  };
}
