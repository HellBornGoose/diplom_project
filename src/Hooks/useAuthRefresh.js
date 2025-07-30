import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useAuthRefresh(isAuthenticated) {
  const location = useLocation();
  const refreshTimeout = useRef(null);

  const startTokenRefreshTimer = useCallback(() => {
    const expiresStr = localStorage.getItem('tokenExpires');
    if (!expiresStr) return;

    const expiresAt = new Date(expiresStr).getTime();
    const now = Date.now();
    const refreshBeforeMs = 2 * 60 * 1000;
    const timeoutMs = Math.max(expiresAt - now - refreshBeforeMs, 10000);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    refreshTimeout.current = setTimeout(() => {
      refreshJWT();
    }, timeoutMs);
  }, []);

  const refreshJWT = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const response = await fetch('/api/Auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Failed to refresh');

    const data = await response.json();
    const { jwtToken, refreshToken: newToken, expires } = data;

    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('refreshToken', newToken);
    localStorage.setItem('tokenExpires', expires);

    startTokenRefreshTimer();
  }, [startTokenRefreshTimer]);

  const maybeRefresh = useCallback(async () => {
    const expiresStr = localStorage.getItem('tokenExpires');
    if (!expiresStr) return;

    const now = Date.now();
    const expiresAt = new Date(expiresStr).getTime();

    if (expiresAt - now < 2 * 60 * 1000) {
      try {
        await refreshJWT();
      } catch (e) {
        console.error('Token refresh failed:', e);
      }
    }
  }, [refreshJWT]);

  useEffect(() => {
    if (!isAuthenticated) return;

    maybeRefresh();
  }, [location.pathname, isAuthenticated, maybeRefresh]);

  useEffect(() => {
    if (!isAuthenticated) return;

    startTokenRefreshTimer();

    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [isAuthenticated, startTokenRefreshTimer]);

  return { refreshJWT, maybeRefresh };
}
