import { useState, type SyntheticEvent } from 'react';
import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';

import { EStatus } from '~/constants/status';

interface IProps {
  onOpenLoad?: () => any;
  onSearchLoad?: (query: string) => any;
  loadStatus?: EStatus;
}

const AutocompleteExternal = ({ onSearchLoad, onOpenLoad, ...props }: AutocompleteProps<any, any, any, any> & IProps) => {
  return (
    <Autocomplete
      filterOptions={(x) => x}
      {...props}
      onOpen={(event: SyntheticEvent<Element, Event>) => {
        if (props.onOpen) {
          props.onOpen(event);
        }
  
        if (onOpenLoad) {
          onOpenLoad();
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (props.onInputChange) {
          props.onInputChange(event, newInputValue, reason);
        }
  
        if (onSearchLoad) {
          onSearchLoad(newInputValue);
        }
      }}
    />
  )
}

export default AutocompleteExternal;
