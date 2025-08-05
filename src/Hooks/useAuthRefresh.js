import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useAuthRefresh(isAuthenticated) {
  const location = useLocation();
  const refreshTimeout = useRef(null);

  // Обновление JWT токена
  const refreshJWT = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn('[AuthRefresh] Нет refreshToken в localStorage');
      return;
    }

    try {
      const response = await fetch('/api/Auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh, status: ${response.status}`);
      }

      const data = await response.json();
      const { jwtToken, refreshToken: newToken, expires } = data;

      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('refreshToken', newToken);
      localStorage.setItem('tokenExpires', expires);

      console.log('Токен обновлён успешно');
      startTokenRefreshTimer();
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
    }
  }, []);

  // Безопасный парсинг даты: обрезаем лишние миллисекунды
  const getParsedExpiresAt = () => {
    let expiresStr = localStorage.getItem('tokenExpires');
    if (!expiresStr) return null;

    expiresStr = expiresStr.replace(/(\.\d{3})\d*Z$/, '$1Z');

    const expiresAt = new Date(expiresStr).getTime();
    if (isNaN(expiresAt)) {
      console.error('Невозможно распарсить tokenExpires:', expiresStr);
      return null;
    }

    return expiresAt;
  };

  // Запуск таймера обновления токена
  const startTokenRefreshTimer = useCallback(() => {
    const expiresAt = getParsedExpiresAt();
    if (!expiresAt) return;

    const now = Date.now();
    const refreshBeforeMs = 2 * 60 * 1000; // 2 минуты
    const timeoutMs = Math.max(expiresAt - now - refreshBeforeMs, 10000);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    console.log(`Запуск таймера обновления токена через ${timeoutMs} мс`);

    refreshTimeout.current = setTimeout(() => {
      console.log('Время пришло, обновляем токен...');
      refreshJWT().catch(err =>
        console.error('Ошибка при автоматическом обновлении токена:', err)
      );
    }, timeoutMs);
  }, [refreshJWT]);

  // Условное обновление, если скоро истекает
  const maybeRefresh = useCallback(async () => {
    const expiresAt = getParsedExpiresAt();
    if (!expiresAt) return;

    const now = Date.now();

    if (expiresAt - now < 2 * 60 * 1000) {
      console.log('Токен скоро истечёт, обновляем...');
      try {
        await refreshJWT();
      } catch (e) {
        console.error('Ошибка при условном обновлении токена:', e);
      }
    } else {
      console.log('Токен ещё валиден, обновление не требуется');
    }
  }, [refreshJWT]);

  // Обновляем при переходе по страницам, если нужно
  useEffect(() => {
    if (!isAuthenticated) return;
    console.log('Навигация. Проверка необходимости обновления токена...');
    maybeRefresh();
  }, [location.pathname, isAuthenticated, maybeRefresh]);

  // Старт таймера при авторизации
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Пользователь авторизован. Запускаем таймер...');
    startTokenRefreshTimer();

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
        console.log('Очищен старый таймер обновления токена');
      }
    };
  }, [isAuthenticated, startTokenRefreshTimer]);

  return { refreshJWT, maybeRefresh };
}
