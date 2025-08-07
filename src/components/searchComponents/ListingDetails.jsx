import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../css/ListingDetails.module.css';

const ListingDetail = () => {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const mockListings = [
      {
        id: 'the-house-comfort-plus-united-kingdom',
        title: 'The house comfort+',
        country: 'The United Kingdom',
        city: 'London',
        photos: ['listings/17/22abf4d8-322f-478e-a90e-5a041631e716.jpg'],
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

  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  const numberOfNights = useMemo(() => {
    if (checkInStr && checkOutStr) {
      const checkInDate = new Date(checkInStr);
      const checkOutDate = new Date(checkOutStr);
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const diff = checkOutDate - checkInDate;
      if (diff > 0) {
        return Math.round(diff / millisecondsPerDay);
      }
    }
    return null;
  }, [checkInStr, checkOutStr]);

  if (!listing) return <div>Завантаження...</div>;

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.detailContainer}>
          {listing.photos.length > 0 && (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className={styles.listingImage}
            />
          )}
          <div className={styles.detailContent}>
            <h1>{listing.title}</h1>
            <p>
              {listing.city !== 'empty'
                ? `${listing.city}, ${listing.country}`
                : listing.country}
            </p>
            <p className={styles.listingType}>{listing.housetype.name}</p>
            <p>Ціна: <strong>{listing.originalPrices.perDay} €</strong></p>
            <p>Макс. осіб: {listing.maxTenants}</p>
            <p>Рейтинг: {listing.rating || 'Не вказаний'}</p>
            <p>Умови: {listing.amenities.map((a) => a.name).join(', ')}</p>
            <div className={styles.searchParams}>
              <p>Параметри пошуку:</p>
              <ul>
                {numberOfNights !== null && (
                  <li>Гості: {searchParams.get('guests')} Доби: {numberOfNights} </li>
                )}
              </ul>
            </div>
            <button className={styles.bookButton}>Обрати</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
