import React, { useState, useEffect, useRef } from 'react';
import MultiImageInput from '../components/listingComponents/MultiImageInput';
import Footer from '../components/Footer';
import NavigationLord from '../components/profileComponents/NavigationLord';
import Header from '../components/Header';
import ListingInfo from '../components/listingComponents/ListingInfo.jsx';
import styles from '../css/UserProfile.module.css';
import AmenitiesSet from '../components/listingComponents/AmenitiesSet';
import ListingDescription from '../components/listingComponents/ListingDescription';

const ngrokLink = 'http://localhost:5197';

const ParentComponent = () => {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [listingInfoData, setListingInfoData] = useState({});

  const refreshTimeout = useRef(null);

  const refreshJWT = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${ngrokLink}/api/Auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Failed to refresh token');

    const data = await response.json();
    const { jwtToken, refreshToken: newRefreshToken, expires } = data;

    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('expireToken', expires);

    startTokenRefreshTimer();
  };

  const startTokenRefreshTimer = () => {
    const expiresInStr = localStorage.getItem('expireToken');
    if (!expiresInStr) return;

    const expiresInSec = parseInt(expiresInStr, 10);
    if (isNaN(expiresInSec) || expiresInSec <= 0) return;

    const refreshBeforeSec = 120;
    const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    refreshTimeout.current = setTimeout(async () => {
      try {
        await refreshJWT();
      } catch (err) {
        console.error('Error refreshing token:', err);
      }
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

  const handleFilesChange = (files) => {
    setFilesToUpload(files);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(newImageUrls);
  };

  const handleFormDataChange = (data) => {
    setListingInfoData(data);
  };

  const uploadPhotos = async () => {
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const formData = new FormData();
      formData.append('listingId', '123'); // заменить при необходимости

      filesToUpload.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch(`${ngrokLink}/api/Profile/upload-photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Ошибка загрузки файлов.';
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch {
          errorMessage = await res.text();
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('Загружено:', data.photoUrls);
      setFilesToUpload([]);
      setImages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    await uploadPhotos();

    const allData = {
      description,
      amenities,
      ...listingInfoData,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${ngrokLink}/Api/Listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(allData),
      });

      if (response.ok) {
        alert('Дані успішно відправлено на сервер!');
        nav
      } else {
        alert('Помилка при відправці.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Сталася помилка при відправці.');
    }
  };

  const landLordNavigationStyle = {
    backgroundColor: '#E07B3B',
  };

  const landLordStyle = {
    color: '#E07B3B',
    borderColor: '#E07B3B',
    fill: '#E07B3B',
  };

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <NavigationLord landLordNavigationStyle={landLordNavigationStyle} />
        </aside>

        <div className={styles.mainContent}>
          <h1 className={styles.h1} style={landLordStyle}>Створити оголошення</h1>

          <section className={styles.content}>
            <MultiImageInput
              images={images}
              setImages={setImages}
              onFilesChange={handleFilesChange}
            />
            <ListingInfo onFormDataChange={handleFormDataChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </section>

          <section className={styles.content}>
            <AmenitiesSet onAmenitiesChange={setAmenities} />
            <ListingDescription onDescriptionChange={setDescription} />
          </section>

          <button
            className={styles.ListingButton}
            onClick={handleSubmit}
            disabled={uploading || filesToUpload.length === 0}
          >
            {uploading ? 'Загрузка...' : 'Зберегти'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParentComponent;
