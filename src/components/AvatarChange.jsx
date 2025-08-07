import React, { useState, useEffect, useRef } from 'react';
import UpdateStyles from '../css/ProfileUpdate.module.css';
import defaultAvatar from '../img/default-avatar.jpg';
import { NGROK_URL } from '../Hooks/config';
import styles from './css/AvatarChange.module.css';
import plusIcon from '../img/plusIcon.svg';

function AvatarChange({ serverFilePath, onPhotoUrlChange }) {
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef(null);

  // Создаем превью локального файла
  useEffect(() => {
    if (!localFile) {
      setLocalPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLocalPreview(reader.result);
    reader.readAsDataURL(localFile);
  }, [localFile]);

  // Формируем URL аватара с сервера, если он есть
  const serverImageUrl = serverFilePath
    ? `${NGROK_URL}/api/Profile/get-avatar/${encodeURIComponent(serverFilePath)}`
    : null;

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение.');
        return;
      }
      setLocalFile(file);
      uploadAvatar(file);
    }
  };

  // Функция загрузки аватара на сервер
  const uploadAvatar = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${NGROK_URL}/api/Profile/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        // Попробуем прочитать ошибку в формате JSON
        let errorMessage = 'Ошибка загрузки файла.';
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch {
          errorMessage = await res.text();
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (data.photoUrl) {
        onPhotoUrlChange(data.photoUrl); // если есть что-то на сервере
        setLocalFile(null); // превью от серверного изображения
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  const handleBigPlusClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.avatarWrapper}>
      {(localPreview || serverImageUrl) && (
  <div
    className={styles.avatarHoverWrapper}
    onClick={handleBigPlusClick}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && handleBigPlusClick()}
  >
    <img
      src={localPreview || serverImageUrl || defaultAvatar}
      alt="Аватар"
      className={UpdateStyles.Preview}
      style={{
        width: '160px',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '50%',
        cursor: 'pointer',
      }}
    />
    <img
      src={plusIcon}
      alt="Изменить изображение"
      className={styles.hoverPlusIcon}
    />
  </div>
)}


      {/* {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} */}
      {uploading && <div style={{ marginTop: '10px' }}>Загрузка...</div>}
      {!localPreview && !serverImageUrl && (
  <div
    className={styles.emptyState}
    onClick={handleBigPlusClick}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && handleBigPlusClick()}
  >
    <img src={plusIcon} alt="Добавить изображение" className={styles.bigPlusIcon} />
  </div>
)}

<input
  ref={inputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  disabled={uploading}
  style={{ display: 'none' }} // 👈 скрываем input
/>
    </div>
  );
}

export default AvatarChange;
