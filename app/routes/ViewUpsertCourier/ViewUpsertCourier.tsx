import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { useMemo, useState, type ComponentType } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import type { Route } from '.react-router/types/app/routes/ViewUpsertCourier/+types/ViewUpsertCourier';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';
import { ROUTES } from '~/router/routes';

import routeLoader from '~/router/route-loader';

import { PageDataContext, usePageDataCtx } from '~/providers/page-data';
import { usePageDataService } from '~/providers/page-data/service';
import { UpsertCourierProvider, useUpsertCourierCtx } from './providers/upsert-courier';
import { CourierProvider, useCourierCtx } from '~/providers/courier';
import type { ICourierStoreData } from '~/providers/courier/store';
import { ReloadPageProvider } from '~/providers/reload-page';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useSuccessSnackbar } from '~/hooks/other/use-success-snackbar';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import FormCourier from '~/components/forms/FormCourier';
import ErrorBoundary from '~/components/other/ErrorBoundary';

import type { IFormCourier } from '~/types/forms/form-courier';

import { loadCourier } from './loaders/load-courier';

const ViewUpsertCourier: ComponentType = observer(() => {
  const { store: upsertCourierStore, submitCreate: submit } = useUpsertCourierCtx();
  const { store: courierStore } = useCourierCtx();
  const { t } = useTranslation();
  const errorSnackbar = useErrorSnackbar();
  const successSnackbar = useSuccessSnackbar();
  const navigate = useNavigate();
  const { courierId } = useParams();
  const isEdit = !!courierId;
  const titlePortalRef = useTitlePortalCtx();
  const routePath = useRoutePath();
  const { reload } = usePageDataCtx();
  const [_isLoading, setIsLoading] = useState(false);

  const courier = courierStore.data;

  const showForm = useMemo(() => {
    if (!isEdit) {
      return true;
    }

    return courierStore.isSuccess;
  }, [isEdit, courierStore.isSuccess]);

  const reloadPageData = async () => {
    setIsLoading(true);

    try {
      await reload();
    } catch (err) {
      errorSnackbar(err);
    }

    setIsLoading(false);
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
    await navigate(routePath(ROUTES.COURIERS));
  }

  const submitUpdate = async (formValue: IFormCourier) => {
    await submit(formValue);
    successSnackbar(t('view_upsert_courier.edit_success'));
    await navigate(routePath(ROUTES.COURIER, { courierId: courierId ?? 1 }));
  }

  return (
    <ReloadPageProvider reloadFunction={reloadPageData} isDefaultReload={false}>
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
  const { courerId } = useParams();

  const service = usePageDataService<ILoaderResult>({
    initialData: loaderData,
    loader: () => loader(+courerId!),
    updateCondition: newState => newState?.courierState?.getStatus !== EStatus.ERROR,
  });

  return (
    <PageDataContext value={service}>
      <CourierProvider initialData={service.state?.courierState}>
        <UpsertCourierProvider>
          <ViewUpsertCourier />
        </UpsertCourierProvider>
      </CourierProvider>
    </PageDataContext>
  )
}

export default Wrapper;

interface ILoaderResult {
  courierState: ICourierStoreData
}

const loader = async (courierId: number) => {
  const courierState = await loadCourier(courierId);

  const hasError = courierState.getStatus === EStatus.ERROR;

  if (hasError) {
    throw courierState.getError;
  }

  const result = {
    courierState,
  };

  return result;
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs): Promise<ILoaderResult> {
  const courierId = +params.courierId!;

  return routeLoader<ILoaderResult>(request.url, async () => {
    return loader(courierId);
  });
}

export { ErrorBoundary };

export function meta({ loaderData }: Route.MetaArgs) {
  const { t } = i18n;
  const courier = loaderData.courierState.data;

  return [
    { title: t('common_meta.title_template', { title: t('view_upsert_courier.title', { id: courier?.id, name: courier?.name }) }) },
  ];
}

