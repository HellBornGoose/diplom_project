import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { maybeRefresh } from './useAuthRefresh';

const AuthRefresher = ({ isAuthenticated }) => {
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      maybeRefresh();
    }
  }, [location.pathname, isAuthenticated]);

  return null;
};

export default AuthRefresher;
