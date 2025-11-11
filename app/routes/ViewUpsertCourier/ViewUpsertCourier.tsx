import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { useMemo, type ComponentType } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import type { Route } from '.react-router/types/app/routes/ViewUpsertCourier/+types/ViewUpsertCourier';

import i18n from '~/i18n/config';

import { ROUTES } from '~/router/routes';

import { EStatus } from '~/constants/status';

import { UpsertCourierProvider, useUpsertCourierCtx } from './providers/upsert-courier';
import { CourierProvider, useCourierCtx } from '~/providers/courier';
import { fetchCourier } from '~/providers/courier/data';
import type { ICourierStoreData } from '~/providers/courier/store';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useSuccessSnackbar } from '~/hooks/other/use-success-snackbar';
import FormCourier from '~/components/forms/FormCourier';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import type { IFormCourier } from '~/types/forms/form-courier';

const ViewUpsertCourier: ComponentType = observer(() => {
  const { store: upsertCourierStore, submitCreate: submit } = useUpsertCourierCtx();
  const { store: courierStore, setProcessing } = useCourierCtx();
  const { t } = useTranslation();
  const errorSnackbar = useErrorSnackbar();
  const successSnackbar = useSuccessSnackbar();
  const navigate = useNavigate();
  const { courierId } = useParams();
  const isEdit = !!courierId;
  const titlePortalRef = useTitlePortalCtx();

  const courier = courierStore.data;

  const showForm = useMemo(() => {
    if (!isEdit) {
      return true;
    }

    return courierStore.isSuccess;
  }, [isEdit, courierStore.isSuccess]);

  const reloadPageData = () => {
    setProcessing();
  }

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
    <ReloadPageProvider reloadFunction={reloadPageData}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_upsert_courier.title', { id: courier?.id, name: courier?.name })}
      </Portal>
      <Box padding={3}>
        <Box maxWidth={500} margin="auto">
          {showForm && <FormCourier
            initialValue={courier!}
            submitStatus={upsertCourierStore.submitStatus}
            submitError={upsertCourierStore.submitError}
            onSubmit={submitHandler}
          />}
        </Box>
      </Box>
    </ReloadPageProvider>
  )
})

const Wrapper = () => {
  const loaderData = useLoaderData<Awaited<ReturnType<typeof clientLoader>>>();

  return (
    <CourierProvider initialData={loaderData.courierState}>
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
    const data = await fetchCourier(+params.courierId!);
    courierState.data = data;
    courierState.getStatus = EStatus.SUCCESS;
  }

  return {
    courierState,
  };
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const courier = loaderData.courierState.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_upsert_courier.title', { id: courier?.id, name: courier?.name }) }) },
  ];
}

