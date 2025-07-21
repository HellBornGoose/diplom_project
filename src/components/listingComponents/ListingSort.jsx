import React, { useState, useEffect } from 'react';
import styles from '../css/ListingSort.module.css';

// Компонент для отображения сетки свойств
const ListingSort = () => {
  // Состояние для хранения списка свойств
  const [properties, setProperties] = useState([
    { id: 17, title: 'The house comfort+', country: 'The United Kingdom', isModerated: false, isOccupied: null, averageRating: null, photoUrl: null },
    { id: 18, title: 'Villa Sereno', country: 'Italy', isModerated: true, isOccupied: false, averageRating: 4.5, photoUrl: 'https://via.placeholder.com/300x200' },
    { id: 19, title: 'Chalet Alpine', country: 'Switzerland', isModerated: true, isOccupied: true, averageRating: 4.7, photoUrl: 'https://via.placeholder.com/300x200' },
    { id: 20, title: 'Beach Haven', country: 'Spain', isModerated: true, isOccupied: null, averageRating: 4.2, photoUrl: 'https://via.placeholder.com/300x200' },
    { id: 21, title: 'Mountain Retreat', country: 'Austria', isModerated: false, isOccupied: true, averageRating: null, photoUrl: 'https://via.placeholder.com/300x200' },
    { id: 22, title: 'City Loft', country: 'Germany', isModerated: true, isOccupied: false, averageRating: 4.9, photoUrl: 'https://via.placeholder.com/300x200' },
  ]);
  const [sortBy, setSortBy] = useState('none'); // По умолчанию все свойства

  // Эффект для загрузки данных с сервера при монтировании компонента
  useEffect(() => {
    fetch('/api/properties')
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Ошибка при загрузке свойств:', error));
  }, []);

  // Функция для определения статуса свойства
  const getStatus = (p) => {
    if (!p.isModerated) {
      return 'moderation';
    } else if (p.isOccupied) {
      return 'booked';
    } else {
      return 'free';
    }
  };

  // Фильтрация свойств в зависимости от выбранной опции
  const filteredProperties = sortBy === 'none' ? properties : properties.filter(p => getStatus(p) === sortBy);

  return (
    <div className={styles.propertyGridContainer}>
      {/* Элемент управления фильтрацией */}
      <div className={styles.sortControls}>
        <h2>Фільтри</h2>
        <button
          className={`${styles.sortBtn} ${sortBy === 'free' ? styles.active : ''}`}
          onClick={() => setSortBy('free')}
        >
          Вільне житло
        </button>
        <button
          className={`${styles.sortBtn} ${sortBy === 'booked' ? styles.active : ''}`}
          onClick={() => setSortBy('booked')}
        >
          Заброньоване
        </button>
        <button
          className={`${styles.sortBtn} ${sortBy === 'moderation' ? styles.active : ''}`}
          onClick={() => setSortBy('moderation')}
        >
          На модерації
        </button>
        <button
          className={`${styles.sortBtn} ${sortBy === 'none' ? styles.active : ''}`}
          onClick={() => setSortBy('none')}
        >
          Без сортування
        </button>
      </div>

      {/* Сетка свойств */}
      <div className={styles.propertyGrid}>
        {filteredProperties.map(property => (
          <div key={property.id} className={styles.propertyCard}>
            <img src={property.photoUrl || '/path/to/placeholder.jpg'} alt={property.title} className={styles.propertyImage} />
            {property.averageRating ? (
              <div className={styles.rating}>
                <span>★</span> {property.averageRating}
              </div>
            ) : null}
            <div className={styles.propertyInfo}>
              <h3 className={styles.propertyName}>{property.title}</h3>
              <p className={styles.propertySubtitle}>{property.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingSort;