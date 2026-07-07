import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NGROK_URL } from './config';

export function useAuthRefresh(isAuthenticated) {
  const location = useLocation();
  const refreshTimeout = useRef(null);

  // Функция обновления JWT
  const refreshJWT = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken'); //проверка на рефрештокен
    if (!refreshToken) {
      console.warn('[AuthRefresh] Нет refreshToken в localStorage');
      return;
    }

    try {
      const response = await fetch(`${NGROK_URL}/api/Auth/refresh`, { //запрос на рефреш
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка обновления: ${response.status}`);
      }

      const data = await response.json();
      const { jwtToken, refreshToken: newRefreshToken } = data;

      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      console.log('[refreshJWT] обновлён успешно');
      startTokenRefreshTimer(); // таймер идет заново
    } catch (error) {
      console.error('[refreshJWT] Ошибка при обнове:', error);
    }
  }, []);

  // Таймер обновления токена
  const startTokenRefreshTimer = useCallback(() => {
    const timeoutMs = 14 * 60 * 1000; // 14 минут, для уменьшения или увеличения- поменять значение "14" на желаемое. И столько будет минут

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    console.log(`[startTokenRefreshTimer] Осталось ${timeoutMs / 1000 / 60} минут до конца срока жизни JWT`);

    refreshTimeout.current = setTimeout(() => { //таймер истек, запуск обновления
      refreshJWT().catch(err =>
        console.error('[startTokenRefreshTimer] Ошибка при автоматическом обновлении токена:', err)
      );
    }, timeoutMs);
  }, [refreshJWT]);

const maybeRefresh = useCallback(async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.warn('[maybeRefresh] Нет jwtToken');
    return;
  }

  const payloadBase64 = jwtToken.split('.')[1];
  if (!payloadBase64) {
    console.warn('[maybeRefresh] JWT токен некорректен');
    return;
  }

  try {
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const exp = payload.exp;
    if (!exp) {
      console.warn('[maybeRefresh] Нет поля exp в токене');
      return;
    }

    const expMs = exp * 1000;
    const nowMs = Date.now();
    const diffMs = expMs - nowMs;

    if (diffMs < 60 * 1000) {
      console.log('[maybeRefresh] Обновляем токен, скоро истекает срок');
      await refreshJWT();
    } else {
      console.log(`[maybeRefresh] Токен ещё валиден. До истечения: ${Math.round(diffMs / 1000)} сек`);
    }
  } catch (err) {
    console.error('[maybeRefresh] Ошибка разбора JWT:', err);
  }
}, [refreshJWT]);


  // При смене страниц- если пользователь авторизован и если мало времени осталось до конца токена- обновляем
  useEffect(() => {
    if (!isAuthenticated) return;
    console.log('[useEffect] Навигация. Проверка необходимости обновления токена...');
    maybeRefresh();
  }, [location.pathname, isAuthenticated, maybeRefresh]);

  // При авторизации пользователя — стартуем таймер
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('[useEffect] Пользователь авторизован. Запускаем таймер обновления токена...');
    startTokenRefreshTimer();

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
        console.log('[useEffect] 🧹 Таймер обновления токена очищен');
      }
    };
  }, [isAuthenticated, startTokenRefreshTimer]);

  return { refreshJWT, maybeRefresh };
}
