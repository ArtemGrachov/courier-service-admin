import { useEffect, type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { CouriersProvider, useCouriersCtx } from '~/providers/couriers';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import CouriersHeader from './components/CouriersHeader';
import CouriersTable from '~/components/couriers/CouriersTable';

const ViewCouriers: ComponentType = observer(() => {
  const { store, fetch } = useCouriersCtx();
  const errorSnackbar = useErrorSnackbar();

  const getData = async () => {
    try {
      if (store.isProcessing) {
        return;
      }

      await fetch();
    } catch (err) {
      errorSnackbar(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      flexDirection="column"
      display="flex"
      gap={2}
      padding={3}
      width="100%"
    >
      <CouriersHeader />
      <CouriersTable
        isProcessing={store.isProcessing}
        items={store.data?.data}
      />
    </Box>
  )
})

const Wrapper: ComponentType = () => {
  return (
    <CouriersProvider>
      <ViewCouriers />
    </CouriersProvider>
  )
}

export default Wrapper;
