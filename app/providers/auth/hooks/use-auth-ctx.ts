import { useContext } from 'react';
import { AuthContext } from '../';

export const useAuthCtx = () => useContext(AuthContext);
