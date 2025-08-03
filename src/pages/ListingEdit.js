import React, { useState, useEffect } from 'react';
import MultiImageInput from '../components/listingComponents/MultiImageInput';
import Footer from '../components/Footer';
import NavigationLord from '../components/profileComponents/NavigationLord';
import Header from '../components/Header';
import ListingInfo from '../components/listingComponents/ListingInfo.jsx';
import styles from '../css/UserProfile.module.css';
import AmenitiesSet from '../components/listingComponents/AmenitiesSet';
import ListingDescription from '../components/listingComponents/ListingDescription';
import { NGROK_URL } from '../Hooks/config';
import { useParams } from 'react-router-dom';

const ListingEdit = () => {
  const { listingId } = useParams();
  const [images, setImages] = useState([]); // [{ file, url }]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [listingInfoData, setListingInfoData] = useState({});
  const [initialServerImages, setInitialServerImages] = useState([]);

  const handleFormDataChange = (data) => {
    setListingInfoData(data);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
  
        // Получение основного объекта объявления
        const response = await fetch(`${NGROK_URL}/api/listing/${listingId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error('Не вдалося отримати оголошення');
  
        const data = await response.json();
  
        const locationString = [
          data.street,
          data.city,
          data.country
        ].filter(Boolean).join(', ');
  
        setListingInfoData({
          name: data.name || '',
          country: data.country || '',
          price: data.perDay || '',
          houseTypeId: data.houseTypeId || '',
          location: locationString || '',
          selectedParameters: data.selectedParameters || '',
          checkInTime: data.checkInTime || '',
          checkOutTime: data.checkOutTime || '',
          maxTenants: data.maxTenants || '',
        });
  
        setDescription(data.description || '');
        setAmenities(data.amenities?.map(a => a.id) || []);
  
        const photosResponse = await fetch(`${NGROK_URL}/api/Listing/get-all-photos/${listingId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!photosResponse.ok) {
          throw new Error('Не вдалося завантажити фото оголошення');
        }
  
        const photosData = await photosResponse.json();
        setInitialServerImages(photosData || []);
        
      } catch (err) {
        setError(err.message || 'Помилка при завантаженні оголошення');
      }
    };
  
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);


  const uploadPhotos = async () => {
    const filesToUpload = images.map(img => img.file).filter(Boolean);
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('listingId', listingId);
      filesToUpload.forEach(file => formData.append('files', file));

      const res = await fetch(`${NGROK_URL}/api/listing/upload-photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Помилка при завантаженні зображень');
      }

      const data = await res.json();
      console.log('Завантажені фото:', data.photoUrls);
      setImages([]); // очищаємо нові файли
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const allData = {
      id: listingId,
      description,
      amenities,
      ...listingInfoData,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${NGROK_URL}/api/listing/updateListing/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        alert('Помилка при збереженні даних.');
        return;
      }

      await uploadPhotos();

      alert('Оголошення успішно оновлено!');
    } catch (err) {
      console.error(err);
      alert('Сталася помилка при оновленні.');
    }
  };

  const landLordNavigationStyle = { backgroundColor: '#E07B3B' };
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
          <h1 className={styles.h1} style={landLordStyle}>
            Редагувати оголошення
          </h1>

          <section className={styles.content}>
            <MultiImageInput
              initialServerImages={initialServerImages}
              setImages={setImages}
              listingId={listingId}
            />
            <ListingInfo
              onFormDataChange={handleFormDataChange}
              initialData={listingInfoData}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </section>

          <section className={styles.content}>
            <AmenitiesSet
              onAmenitiesChange={setAmenities}
              initialSelected={amenities}
            />
            <ListingDescription
              onDescriptionChange={setDescription}
              initialValue={description}
            />
          </section>

          <button
            className={styles.ListingButton}
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? 'Загрузка...' : 'Зберегти'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingEdit;
