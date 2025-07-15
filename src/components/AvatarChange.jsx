import React, { useState, useEffect } from 'react';
import UpdateStyles from '../css/ProfileUpdate.module.css';
import defaultAvatar from '../img/default-avatar.jpg';

const ngrokLink = 'http://your-ngrok-address';

function AvatarChange({ serverFilePath, onPhotoUrlChange }) {
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    ? `${ngrokLink}/api/Profile/get-avatar/${encodeURIComponent(serverFilePath)}`
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

      const res = await fetch(`${ngrokLink}/api/Profile/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type не ставим, браузер сам выставит multipart/form-data
        },
        body: formData,
      });

      if (!res.ok) {
        // Попробуем прочитать ошибку в формате JSON или текстом
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
        onPhotoUrlChange(data.photoUrl); // сообщаем родителю про новый URL
        setLocalFile(null); // сбрасываем локальный файл (превью заменится серверным)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {(localPreview || serverImageUrl) && (
        <img
          src={localPreview || serverImageUrl || defaultAvatar}
          alt="Аватар"
          className={UpdateStyles.Preview}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
        />
      )}

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {uploading && <div style={{ marginTop: '10px' }}>Загрузка...</div>}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

export default AvatarChange;
