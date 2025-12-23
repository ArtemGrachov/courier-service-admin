import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Rating from '~/components/other/Rating';

import type { IClient } from '~/types/models/client';

interface IProps {
  client: IClient;
}

const ClientDetails: ComponentType<IProps> = ({ client }) => {
  const { phone, email } = client;
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_details.client_id')} #{client.id}
            </Typography>
            <Typography variant="h5" component="div">
              {client.name}
            </Typography>
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_details.rating')}
            </Typography>
            <Rating rating={client.rating} />
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_details.phone')}
            </Typography>
            {phone ? (<Link
              component="a"
              href={`tel:${phone}`}
              target="_blank"
            >
              {phone}
            </Link>) : '-'}
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('client_details.email')}
            </Typography>
            {email ? (<Link
              component="a"
              href={`mailto:${email}`}
              target="_blank"
            >
              {email}
            </Link>) : '-'}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ClientDetails;
