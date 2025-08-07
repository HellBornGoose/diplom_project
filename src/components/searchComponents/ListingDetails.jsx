import React, { useState } from 'react';
import styles from '../css/ListingDetails.module.css';

const ListingDetail = ({ searchParams, listing }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photoBaseUrl = 'http://localhost:5197/api/Listing/get-photo/';

  if (!listing) return <div>Дані не знайдено</div>;

  // Деструктуризация
  const {
    title = 'Без назви',
    city = 'Місце не вказано',
    country = 'Місце не вказано',
    housetype = {},
    maxTenants = 'Не вказано',
    rating = null,
    amenities = [],
    originalPrices = {},
    photos = [],
  } = listing;

  // Расчёт ночей
  let numberOfNights = null;
  const checkInStr = searchParams.checkIn;
  const checkOutStr = searchParams.checkOut;

  if (checkInStr && checkOutStr) {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    numberOfNights = Math.round((checkOutDate - checkInDate) / millisecondsPerDay);
  }

  const getPhotoUrl = (photoPath) =>
    photoBaseUrl + encodeURIComponent(photoPath);

  return (
    <div className={styles.detailContainer}>
      {photos.length > 0 && (
        <div className={styles.photoCarousel}>
          <img
            src={getPhotoUrl(photos[currentPhotoIndex])}
            alt={title}
            className={styles.listingImage}
          />
          <div className={styles.dots}>
            {photos.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === currentPhotoIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentPhotoIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.detailContent}>
        <h1>{title}</h1>
        <p className="location">
          {city !== 'empty' ? `${city}, ${country}` : country}
        </p>
        <p className={styles.listingType} style={{ color: '#FFF', paddingTop: '3px' }}>
          {housetype.name || 'Тип не вказано'}
        </p>
        <p>Макс. осіб: {maxTenants}</p>
        <p>Рейтинг: {rating || 'Не вказаний'}</p>
        <p>Умови: {amenities.map((a) => a.name).join(', ') || 'Немає умов'}</p>
        <div className={styles.searchParams}>
          <ul>
            <li>Гості: {searchParams.guests || 'Не вказано'}, Доби: {numberOfNights || 'Не вказано'}</li>
            <p className={styles.price}>
              <strong>{originalPrices.perDay || 0} ₴</strong>
            </p>
            <button className={styles.bookButton}>Забронювати</button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;