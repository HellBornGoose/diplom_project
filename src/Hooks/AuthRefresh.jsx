import { useAuthRefresh } from './useAuthRefresh';

const AuthRefresh = ({ isAuthenticated }) => {
  useAuthRefresh(isAuthenticated);
  return null;
};

export default AuthRefresh;
