import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../css/ListingDetails.module.css';

const ListingDetail = () => {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // ← текущая фотография

  // Базовый URL для получения фото
  const photoBaseUrl = 'http://localhost:5197/api/Listing/get-photo/';

  useEffect(() => {
    const mockListings = [
      {
        id: 'the-house-comfort-plus-united-kingdom',
        title: 'The house comfort+',
        country: 'The United Kingdom',
        city: 'London',
        photos: [
          'listings\\17\\22abf4d8-322f-478e-a90e-5a041631e716.jpg',
          'listings\\17\\photo2.jpg',
          'listings\\17\\photo3.jpg',
        ],
        housetype: { id: 4, name: 'Готель' },
        price: 120000.0,
        originalPrices: { perWeek: null, perDay: 20000.0, perMonth: null },
        maxTenants: 5,
        rating: 4.2,
        amenities: [
          { id: 1, name: 'Безкоштовний Wi-Fi' },
          { id: 2, name: 'Опалення' },
        ],
      },
    ];

    const foundListing = mockListings.find((l) => l.id === listingId);
    setListing(foundListing);
  }, [listingId]);

  if (!listing) return <div>Завантаження...</div>;

  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  let numberOfNights = null;
  if (checkInStr && checkOutStr) {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    numberOfNights = Math.round((checkOutDate - checkInDate) / millisecondsPerDay);
  }

  // Формируем URL картинки, заменяя \ на /
  const getPhotoUrl = (photoPath) =>
    photoBaseUrl + photoPath.replace(/\\/g, '/');

  return (
    <div className={styles.detailContainer}>
      {listing.photos.length > 0 && (
        <div className={styles.photoCarousel}>
          <img
            src={getPhotoUrl(listing.photos[currentPhotoIndex])}
            alt={listing.title}
            className={styles.listingImage}
          />
          <div className={styles.dots}>
            {listing.photos.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  index === currentPhotoIndex ? styles.activeDot : ''
                }`}
                onClick={() => setCurrentPhotoIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.detailContent}>
        <h1>{listing.title}</h1>
        <p className='location'>
          {listing.city !== 'empty' ? `${listing.city}, ${listing.country}` : listing.country}
        </p>
        <p className={styles.listingType} style={{color:"#FFF", paddingTop:"3px"}}>{listing.housetype.name}</p>
        <p>Макс. осіб: {listing.maxTenants}</p>
        <p>Рейтинг: {listing.rating || 'Не вказаний'}</p>
        <p>Умови: {listing.amenities.map((a) => a.name).join(', ')}</p>
        <div className={styles.searchParams}>
          <ul>
            <li>Гості: {searchParams.get('guests')}, Доби: {numberOfNights}</li>
            <p className={styles.price}>
              <strong>{listing.originalPrices.perDay} ₴</strong>
            </p>
            <button className={styles.bookButton}>Забронювати</button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
