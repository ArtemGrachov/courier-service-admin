import { useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete, {
  type AutocompleteInputChangeReason,
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';

interface IProps {
  searchMin?: number;
  label?: ReactNode;
  onOpenLoad?: () => any;
  onSearchLoad?: (query: string) => any;
  searchTimeoutMs?: number;
}

type AutocompleExternalProps = Omit<AutocompleteProps<any, any, any, any>, 'renderInput'> & {
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
};

const DEFAULT_SEARCH_TIMEOUT_MS = 500;

const AutocompleteExternal = ({
  label,
  searchTimeoutMs,
  searchMin,
  onSearchLoad,
  onOpenLoad,
  onOpen,
  onInputChange,
  renderInput,
  ...props
}: AutocompleExternalProps & IProps) => {
  const isFirstLoad = useRef(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputValueRef = useRef<string>('');
  const errorSnackbar = useErrorSnackbar();

  const searchLoadDebounce = useDebouncedCallback(async () => {
    if (onSearchLoad) {
      const value = inputValueRef.current;

      if (searchMin && value && value.length < searchMin) {
        return;
      }

      setIsProcessing(true);

      try {
        await onSearchLoad(value);
      } catch (err) {
        errorSnackbar(err);
      }

      setIsProcessing(false);
    }
  }, searchTimeoutMs ?? DEFAULT_SEARCH_TIMEOUT_MS);

  const timeoutHandler = () => {
    searchLoadDebounce();
  }

  renderInput = renderInput ?? (params => (
    <TextField
      {...params}
      label={label}
      slotProps={{
        input: {
          ...params.InputProps,
          endAdornment: isProcessing ? <CircularProgress color="inherit" size={20} /> : params.InputProps.endAdornment,
        }
      }}
    />
  ));

  const openHandler = async (event: SyntheticEvent<Element, Event>) => {
    if (!isFirstLoad.current) {
      return;
    }

    if (onOpen) {
      onOpen(event);
    }

    if (onOpenLoad) {
      setIsProcessing(true);

      try {
        await onOpenLoad();
      } catch (err) {
        errorSnackbar(err);
      }

      setIsProcessing(false);
    }

    isFirstLoad.current = false;
  }

  const inputChangeHandler = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === 'reset') {
      return;
    }

    if (onInputChange) {
      onInputChange(event, value, reason);
    }

    inputValueRef.current = value;
    timeoutHandler();
  }

  return (
    <Autocomplete
      filterOptions={(x) => x}
      {...props}
      renderInput={renderInput}
      onOpen={openHandler}
      onInputChange={inputChangeHandler}
    />
  )
}

export default AutocompleteExternal;

