import { useState, useEffect } from 'react';

function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('jwtToken')));

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'jwtToken') {
        setIsAuthenticated(Boolean(e.newValue));
      }
    };
    window.addEventListener('storage', onStorage);

    setIsAuthenticated(Boolean(localStorage.getItem('jwtToken')));

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return isAuthenticated;
}

export default useIsAuthenticated;