import { useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete, {
  type AutocompleteInputChangeReason,
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';

interface IProps {
  label?: ReactNode;
  onOpenLoad?: () => any;
  onSearchLoad?: (query: string) => any;
  searchTimeoutMs?: number;
}

type AutocompleExternalProps = Omit<AutocompleteProps<any, any, any, any>, 'renderInput'> & {
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
};

const DEFAULT_SEARCH_TIMEOUT_MS = 300;

const AutocompleteExternal = ({
  label,
  searchTimeoutMs,
  onSearchLoad,
  onOpenLoad,
  onOpen,
  onInputChange,
  renderInput,
  ...props
}: AutocompleExternalProps & IProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputValueRef = useRef<string>('');

  const searchLoadDebounce = useDebouncedCallback(async () => {
    if (onSearchLoad) {
      setIsProcessing(true);
      await onSearchLoad(inputValueRef.current);
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
    if (onOpen) {
      onOpen(event);
    }

    if (onOpenLoad) {
      setIsProcessing(true);
      await onOpenLoad();
      setIsProcessing(false);
    }
  }

  const inputChangeHandler = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
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
