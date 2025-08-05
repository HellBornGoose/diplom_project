import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MultiImageInput from '../components/listingComponents/MultiImageInput';
import Footer from '../components/Footer';
import NavigationLord from '../components/profileComponents/NavigationLord';
import Header from '../components/Header';
import ListingInfo from '../components/listingComponents/ListingInfo';
import AmenitiesSet from '../components/listingComponents/AmenitiesSet';
import ListingDescription from '../components/listingComponents/ListingDescription';
import { NGROK_URL } from '../Hooks/config';
import styles from '../css/UserProfile.module.css';

const ListingEdit = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]); // [{ file, url }]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [perDay, setPerDay] = useState('0');
  const [houseTypeId, setHouseTypeId] = useState('1');
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [checkInTime, setCheckInTime] = useState('16:00');
  const [checkOutTime, setCheckOutTime] = useState('10:00');
  const [maxTenants, setMaxTenants] = useState(1);
  const [initialServerImages, setInitialServerImages] = useState([]);
  const [allParameters, setAllParameters] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Флаг загрузки данных для ListingInfo
  const [areImagesLoaded, setAreImagesLoaded] = useState(false); // Флаг загрузки изображений

  const isEditMode = !!listingId;

  // Загрузка списка параметров
  useEffect(() => {
    const fetchMainFeatures = async () => {
      try {
        const res = await fetch(`${NGROK_URL}/api/listing/main-features`);
        if (!res.ok) throw new Error(`Failed to fetch main features: ${res.status}`);
        const data = await res.json();
        setAllParameters(data.map(item => ({
          id: item.id,
          name: item.name,
          value: item.value || null,
        })));
      } catch (err) {
        console.error('Error fetching main features:', err);
        setAllParameters([]);
      }
    };
    fetchMainFeatures();
  }, []);

  // Загрузка данных объявления (для режима редактирования)
  useEffect(() => {
    const fetchListing = async () => {
      if (!isEditMode) return;

      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('Токен авторизації відсутній');

        const response = await fetch(`${NGROK_URL}/api/listing/${listingId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Не вдалося отримати оголошення');

        const data = await response.json();
        console.log('Fetched listing data:', data);

        const selectedParameters = (data.mainFeatures || []).map(feature =>
          allParameters.find(p => p.id === feature.id)?.name || feature.name
        ).filter(Boolean);

        setTitle(data.title || '');
        setCountry(data.country || '');
        setCity(data.city || '');
        setLocation(data.location || '');
        setPerDay(data.price?.toString() || '0');
        setHouseTypeId(String(data.houseType || '1'));
        setSelectedParameters(selectedParameters);
        setCheckInTime(data.checkInTime || '16:00');
        setCheckOutTime(data.checkOutTime || '10:00');
        setMaxTenants(data.maxTenants || 1);
        setDescription(data.description || '');
        setAmenities(data.amenities || []);

        setIsDataLoaded(true);


        const photosResponse = await fetch(`${NGROK_URL}/api/Listing/get-all-photos/${listingId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!photosResponse.ok) {
          throw new Error('Не вдалося завантажити фото оголошення');
        }

        const photosData = await photosResponse.json();
        console.log('Initial server images data:', photosData.photoUrls || []);
        // Формируем полный URL с эндпоинтом и кодированием
        const formattedImages = (photosData.photoUrls || []).map(url =>
          `${NGROK_URL}/api/Listing/get-photo/${encodeURIComponent(url)}`
        );
        console.log('Formatted initial server images:', formattedImages);
        setInitialServerImages(formattedImages);
        setAreImagesLoaded(true);
      } catch (err) {
        setError(err.message || 'Помилка при завантаженні оголошення');
      }
    };

    fetchListing();
  }, [listingId, allParameters, isEditMode, NGROK_URL]);

  const handleFormDataChange = (data) => {
    setTitle(data.title || '');
    setCountry(data.country || '');
    setCity(data.city || '');
    setLocation(data.location || '');
    setPerDay(data.perDay?.toString() || '0');
    setHouseTypeId(String(data.houseTypeId || '1'));
    setSelectedParameters(data.selectedParameters || []);
    setCheckInTime(data.checkInTime || '16:00');
    setCheckOutTime(data.checkOutTime || '10:00');
    setMaxTenants(data.maxTenants || 1);
  };

  const uploadPhotos = async (id) => {
    const filesToUpload = images.map(img => img.file).filter(Boolean);
    if (filesToUpload.length === 0) return id;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Токен авторизації відсутній');

      const formData = new FormData();
      formData.append('listingId', id);
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
      setImages([]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Токен авторизації відсутній');

      const allData = {
        id: listingId,
        description,
        amenities,
        title,
        country,
        city,
        location,
        perDay: parseFloat(perDay.replace(/[^0-9.]/g, '')) || 0,
        houseTypeId: parseInt(houseTypeId),
        selectedParameters,
        checkInTime,
        checkOutTime,
        maxTenants,
      };

      const endpoint = isEditMode
        ? `${NGROK_URL}/api/listing/updateListing/${listingId}`
        : `${NGROK_URL}/api/listing/create`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Помилка при збереженні оголошення');
      }

      const responseData = await response.json();
      const newListingId = isEditMode ? listingId : responseData.id;

      await uploadPhotos(newListingId);


      alert(`Оголошення успішно ${isEditMode ? 'оновлено' : 'створено'}!`);
      navigate(isEditMode ? `/profile/Lord/Listing` : `/listing/edit/${newListingId}`);
    } catch (err) {
      console.error('Error saving listing:', err);
      setError(err.message || 'Сталася помилка при збереженні');
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
            {isEditMode ? 'Редагувати оголошення' : 'Створити оголошення'}
          </h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <section className={styles.content}>
            {areImagesLoaded && (
              <MultiImageInput
                initialServerImages={initialServerImages} // Передаем загруженные изображения
                setImages={setImages}
                listingId={listingId}
              />
            )}
            {isDataLoaded && (
              <ListingInfo
                onFormDataChange={handleFormDataChange}
                initialData={{
                  title,
                  country,
                  city,
                  location,
                  perDay,
                  houseTypeId,
                  selectedParameters,
                  checkInTime,
                  checkOutTime,
                  maxTenants,
                }}
              />
            )}
          </section>
          <section className={styles.content}>
            <AmenitiesSet
              initialSelected={amenities} // Передаем загруженные amenities
              onAmenitiesChange={setAmenities}
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
            {uploading ? 'Завантаження...' : isEditMode ? 'Зберегти' : 'Створити'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingEdit;
