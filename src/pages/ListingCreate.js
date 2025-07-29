import React, { useState, useEffect, useRef } from 'react';
import MultiImageInput from '../components/listingComponents/MultiImageInput';
import Footer from '../components/Footer';
import NavigationLord from '../components/profileComponents/NavigationLord';
import Header from '../components/Header';
import ListingInfo from '../components/listingComponents/ListingInfo.jsx';
import styles from '../css/UserProfile.module.css';
import AmenitiesSet from '../components/listingComponents/AmenitiesSet';
import ListingDescription from '../components/listingComponents/ListingDescription';
import { NGROK_URL } from '../Hooks/config';

const ParentComponent = () => {
  const [images, setImages] = useState([]); // [{ file, url }]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [listingInfoData, setListingInfoData] = useState({});

  // const refreshTimeout = useRef(null);

  // const refreshJWT = async () => {
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (!refreshToken) throw new Error('No refresh token available');

  //   const response = await fetch(`${NGROK_URL}/api/Auth/refresh`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ refreshToken }),
  //   });

  //   if (!response.ok) throw new Error('Failed to refresh token');

  //   const data = await response.json();
  //   const { jwtToken, refreshToken: newRefreshToken, expires } = data;

  //   localStorage.setItem('jwtToken', jwtToken);
  //   localStorage.setItem('refreshToken', newRefreshToken);
  //   localStorage.setItem('expireToken', expires);

  //   startTokenRefreshTimer();
  // };

  // const startTokenRefreshTimer = () => {
  //   const expiresInStr = localStorage.getItem('expireToken');
  //   if (!expiresInStr) return;

  //   const expiresInSec = parseInt(expiresInStr, 10);
  //   if (isNaN(expiresInSec) || expiresInSec <= 0) return;

  //   const refreshBeforeSec = 120;
  //   const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

  //   if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

  //   refreshTimeout.current = setTimeout(async () => {
  //     try {
  //       await refreshJWT();
  //     } catch (err) {
  //       console.error('Error refreshing token:', err);
  //     }
  //   }, timeoutMs);
  // };

  // useEffect(() => {
  //   refreshJWT();
  //   return () => {
  //     if (refreshTimeout.current) {
  //       clearTimeout(refreshTimeout.current);
  //     }
  //   };
  // }, []);

  const handleFormDataChange = (data) => {
    setListingInfoData(data);
  };

  const uploadPhotos = async (listingId) => {
    const filesToUpload = images.map(img => img.file);
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const formData = new FormData();
      formData.append('listingId', listingId);

      filesToUpload.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch(`${NGROK_URL}/api/listing/upload-photos`, {
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
      setImages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const allData = {
      description,
      amenities,
      ...listingInfoData,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${NGROK_URL}/Api/Listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        alert('Помилка при відправці.');
        return;
      }

      const data = await response.json();
      const listingId = data.id;

      await uploadPhotos(listingId);

      alert('Дані успішно відправлено на сервер!');
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
            disabled={uploading || images.length === 0}
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
