import React, { useState, useEffect } from 'react';
import styles from '../css/AmenitiesSet.module.css';
import { NGROK_URL } from '../../Hooks/config';

const AmenitiesSet = ({ onAmenitiesChange, initialSelected = [] }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const mockAmenities = [
    'Wi-Fi',
    'Басейн',
    'Кондиціонер',
    'Зона барбекю',
    'Парковка',
    'Дитяча зона',
    'Тераса',
    'Посудомийка',
    'Новий ремонт',
    'Пральна машина',
  ];

  useEffect(() => {
    let isMounted = true;

    // const fetchAmenities = async () => {
    //   try {
    //     const response = await fetch(`${NGROK_URL}/api/listing/amenities`);
    //     if (!response.ok) {
    //       throw new Error('Ошибка загрузки данных');
    //     }
    //     const data = await response.json();
    //     const normalized = data.map(item =>
    //       typeof item === 'string' ? item : item.name
    //     );
    //     if (isMounted) {
    //       setAllItems(normalized);
    //     }
    //   } catch (error) {
    //     console.error('Ошибка загрузки удобств:', error);
    //   }
    // };
    const fetchAmenities = async () => {
      try {
        // Імітація затримки
        await new Promise(res => setTimeout(res, 300));
        if (isMounted) {
          setAllItems(mockAmenities);
        }
      } catch (error) {
        console.error('Ошибка загрузки удобств:', error);
      }
    };

    fetchAmenities();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const isEqual =
      initialSelected.length === selectedItems.length &&
      initialSelected.every(item => selectedItems.includes(item));

    if (!isEqual) {
      setSelectedItems(initialSelected);
      onAmenitiesChange(initialSelected);
    }
  }, [initialSelected]);

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item)) {
      const newSelected = [...selectedItems, item];
      setSelectedItems(newSelected);
      onAmenitiesChange(newSelected);
    }
  };

  const handleRemoveItem = (item) => {
    const newSelected = selectedItems.filter(i => i !== item);
    setSelectedItems(newSelected);
    onAmenitiesChange(newSelected);
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
          .filter(item => !selectedItems.includes(item))
          .map(item => (
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
