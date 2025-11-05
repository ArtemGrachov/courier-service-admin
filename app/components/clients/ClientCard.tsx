import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Rating from '~/components/other/Rating';

import type { IClient } from '~/types/models/client';

interface IProps {
  client: IClient;
  isReceiver?: boolean;
  isSender?: boolean;
}

const ClientCard: ComponentType<IProps> = ({ client, isReceiver, isSender }) => {
  const { t } = useTranslation();
  const routePath = useRoutePath();

  const idLabel = useMemo(() => {
    if (isReceiver) {
      return t('client_card.receiver_id');
    } else if (isSender) {
      return t('client_card.sender_id');
    } else {
      return t('client_card.client_id');
    }
  }, [isReceiver, isSender])

  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <Typography variant="subtitle1" component="div">
            {idLabel} #{client.id}
          </Typography>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_card.rating')}
            </Typography>
            <Rating rating={client.rating} />
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_card.name')}
            </Typography>
            <Typography variant="h5" component="div">
              {client.name}
            </Typography>
          </Box>
          <Box>
            <Link
              to={routePath(ROUTES.CLIENT, { clientId: client.id })}
              component={RouterLink}
            >
              {t('client_card.link')}
            </Link>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ClientCard;
