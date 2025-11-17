import { useEffect, useState, type ComponentType } from 'react';
import { useNavigation } from 'react-router';
import LinearProgress from '@mui/material/LinearProgress';

const PageLoader: ComponentType = () => {
  const { state } = useNavigation();
  const [isNavigation, setIsNavigation] = useState(false);

  useEffect(() => {
    if (state === 'loading') {
      setIsNavigation(true);
    } else {
      setIsNavigation(false);
    }
  }, [state]);

  if (!isNavigation) {
    return null;
  }

  return (
    <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3000 }} />
  )
}

export default PageLoader;
