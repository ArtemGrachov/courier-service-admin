import { type ComponentType } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import ClientPreview, { type IProps } from '~/components/clients/ClientPreview';

const ClientCard: ComponentType<IProps> = (props) => {
  return (
    <Card>
      <CardContent>
        <ClientPreview {...props} />
      </CardContent>
    </Card>
  )
}

export default ClientCard;
