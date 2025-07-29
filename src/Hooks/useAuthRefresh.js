import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NGROK_URL } from './config';

export function useAuthRefresh() {
  const refreshTimeout = useRef(null);
  const navigate = useNavigate();

  const refreshJWT = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn('No refresh token available');
      return;
    }

    try {
      const response = await fetch(`${NGROK_URL}/api/Auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { jwtToken, refreshToken: newRefreshToken, expires } = data;

      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('expireToken', expires);

      startTokenRefreshTimer();
    } catch (error) {
      console.error('Error refreshing JWT:', error);
      navigate('/login');
    }
  };

  const startTokenRefreshTimer = () => {
    const expiresInStr = localStorage.getItem('expireToken');
    if (!expiresInStr) return;

    const expiresInSec = parseInt(expiresInStr, 10);
    if (isNaN(expiresInSec) || expiresInSec <= 0) return;

    const refreshBeforeSec = 120; // обновляем за 2 минуты до окончания
    const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000 - Date.now(), 10000);

    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    refreshTimeout.current = setTimeout(() => {
      refreshJWT();
    }, timeoutMs);
  };

  useEffect(() => {
    refreshJWT(); 
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);
}
