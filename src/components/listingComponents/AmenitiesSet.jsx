import React, { useState, useEffect } from 'react';
import styles from '../css/AmenitiesSet.module.css';
import { NGROK_URL } from '../../Hooks/config';

const AmenitiesSet = ({ onAmenitiesChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    async function fetchAmenities() {
      try {
        const response = await fetch(`${NGROK_URL}/api/listing/amenities`); 
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setAllItems(data.map(item => typeof item === 'string' ? item : item.name));
      } catch (error) {
        console.error('Ошибка загрузки удобств:', error);
      }
    }
    fetchAmenities();
  }, []);

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      onAmenitiesChange(newSelectedItems);
    }
  };

  const handleRemoveItem = (item) => {
    const newSelectedItems = selectedItems.filter((i) => i !== item);
    setSelectedItems(newSelectedItems);
    onAmenitiesChange(newSelectedItems);
  };

  return (
    <div className={styles.multiSelect}>
      <label className={styles.AmenitiesLabel}>Оберіть параметри</label>
      <div className={styles.selectedItems}>
        {selectedItems.map((item) => (
          <span key={item} className={styles.itemTag}>
            {item}
            <button onClick={() => handleRemoveItem(item)}>x</button>
          </span>
        ))}
      </div>
      <div className={styles.availableItems}>
        {allItems
          .filter((item) => !selectedItems.includes(item))
          .map((item) => (
            <div
              key={item}
              className={styles.selectableItem}
              onClick={() => handleSelectItem(item)}
            >
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AmenitiesSet;
