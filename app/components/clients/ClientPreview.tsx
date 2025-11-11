import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Rating from '~/components/other/Rating';

import type { IClient } from '~/types/models/client';

export interface IProps {
  client: IClient;
  isReceiver?: boolean;
  isSender?: boolean;
}

const ClientPreview: ComponentType<IProps> = ({ client, isReceiver, isSender }) => {
  const { t, i18n } = useTranslation();
  const routePath = useRoutePath();
  const { id, name, rating, phoneNumber, email } = client;

  const idLabel = useMemo(() => {
    if (isReceiver) {
      return t('client_card.receiver_id');
    } else if (isSender) {
      return t('client_card.sender_id');
    } else {
      return t('client_card.client_id');
    }
  }, [isReceiver, isSender, i18n.language])

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <Box gap={1}>
          <Typography variant="subtitle1" component="div">
            {idLabel} #{id}
          </Typography>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
        </Box>
        <Box gap={1}>
          <Typography variant="caption" component="div">
            {t('client_card.rating')}
          </Typography>
          <Rating rating={rating} />
        </Box>
      </Stack>
      <Box>
        <Link
          to={routePath(ROUTES.CLIENT, { clientId: id })}
          component={RouterLink}
        >
          {t('client_card.link')}
        </Link>
      </Box>
      {phoneNumber && <Box>
        <Link
          component="a"
          href={`tel:${phoneNumber}`}
          target="_blank"
        >
          {phoneNumber}
        </Link>
      </Box>}
      {email && <Box>
        <Link
          component="a"
          href={`mailto:${email}`}
          target="_blank"
        >
          {email}
        </Link>
      </Box>}
    </Stack>
  )
}

export default ClientPreview;
