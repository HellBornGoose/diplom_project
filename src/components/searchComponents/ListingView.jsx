import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/ListingView.module.css';

const ListingsDisplay = ({ listings }) => {
  const navigate = useNavigate();

  if (!listings || listings.length === 0) {
    return <div className={styles.noListings}>Немає доступних оголошень</div>;
  }

  const handleCardClick = (listing) => {
    // Извлекаем текущие параметры поиска из URL
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams = urlParams.toString();

    // Формируем новый маршрут с listingId и query-параметрами
    const listingId = listing.title.replace(/\s+/g, '-') + '-' + listing.country.replace(/\s+/g, '-'); // Уникальный ID на основе title и country
    navigate(`/listing/search/${listingId}?${queryParams}`);
  };

  return (
    <div className={styles.listingsContainer}>
      {listings.map((listing) => (
        <div
          key={listing.title + listing.country + listing.city}
          className={styles.listingCard}
          onClick={() => handleCardClick(listing)}
        >
          <img
            src={listing.photos.length > 0 ? listing.photos[0] : 'path/to/default-image.jpg'}
            alt={listing.title}
            className={styles.listingImage}
          />
          <div className={styles.listingDetails}>
            <h3 className={styles.listingTitle}>{listing.title}</h3>
            <p className={styles.listingLocation}>
              {listing.city !== 'empty' ? `${listing.city}, ${listing.country}` : listing.country}
            </p>
            <p className={styles.listingType}>{listing.housetype.name}</p>
            <p className={styles.listingPrice}>{listing.originalPrices.perDay} €</p>
            <p className={styles.listingTenants}>Макс. {listing.maxTenants} осіб</p>
            <div className={styles.ratingContainer}>
              <span className={styles.rating}>
                {listing.rating ? `Рейтинг: ${listing.rating}` : 'Рейтинг не вказаний'}
              </span>
            </div>
            <div className={styles.amenities}>
              {listing.amenities.map((amenity, index) => (
                <span key={index} className={styles.amenity}>
                  {amenity.name}
                  {index < listing.amenities.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
          <button className={styles.bookButton}>Обрати</button>
        </div>
      ))}
    </div>
  );
};

export default ListingsDisplay;