import React, { useState, useEffect } from 'react';
import styles from '../css/AmenitiesSet.module.css';
import { NGROK_URL } from '../../Hooks/config';

const useMockData = false;

const AmenitiesSet = ({ onAmenitiesChange, initialSelected = [] }) => {
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSynced, setIsInitialSynced] = useState(false);

  // Загрузка зручностей з сервера або моку
  useEffect(() => {
    const loadData = async () => {
      console.log('[LoadData] Починаємо завантаження...');
      setIsLoading(true);
      try {
        if (useMockData) {
          console.log('[LoadData] Використовуємо мок');
          const mockData = [
            { id: 1, name: 'Wi-Fi', description: 'Інтернет доступ' },
            { id: 2, name: 'Басейн', description: 'Плавальний басейн' },
            { id: 3, name: 'Кондиціонер', description: 'Охолодження повітря' },
          ];
          setAllItems(mockData);
        } else {
          const response = await fetch(`${NGROK_URL}/api/listing/amenities`);
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setAllItems(data);
            console.log('[LoadData] Завантажено зручності:', data);
          } else {
            console.warn('[LoadData] Очікувався масив, отримано:', data);
            setAllItems([]);
          }
        }
      } catch (error) {
        console.error('[LoadData] Помилка завантаження:', error);
        setAllItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  
  useEffect(() => {
    if (!isLoading && !isInitialSynced) {
      let validSelected = [];

      
      if (initialSelected.length > 0 && typeof initialSelected[0] === 'string') {
        validSelected = initialSelected
          .map(name => {
            const match = allItems.find(item => item.name === name);
            if (match) {
              console.log(`[SyncInitial] Назва "${name}" => ID ${match.id}`);
              return match.id;
            } else {
              console.warn(`[SyncInitial] Не знайдено зручність з назвою "${name}"`);
              return null;
            }
          })
          .filter(id => id !== null);
      }

      

      setSelectedItems(validSelected);
      onAmenitiesChange(validSelected);
      setIsInitialSynced(true);
    }
  }, [initialSelected, allItems, isLoading, isInitialSynced, onAmenitiesChange]);

  const handleSelectItem = (id) => {
    if (!selectedItems.includes(id)) {
      const updated = [...selectedItems, id];
      setSelectedItems(updated);
      onAmenitiesChange(updated);
    }
  };

  const handleRemoveItem = (id) => {
    const updated = selectedItems.filter(itemId => itemId !== id);
    setSelectedItems(updated);
    onAmenitiesChange(updated);
  };

  return (
    <div className={styles.multiSelect}>
      <label className={styles.AmenitiesLabel}>Оберіть зручності:</label>

      {isLoading ? (
        <p>Завантаження зручностей...</p>
      ) : (
        <>
          <div className={styles.selectedItems}>
            {selectedItems.map(id => {
              const item = allItems.find(i => i.id === id);
              return (
                <span key={id} className={styles.itemTag}>
                  {item?.name || `ID ${id}`}
                  <button onClick={() => handleRemoveItem(id)}>x</button>
                </span>
              );
            })}
          </div>

          <div className={styles.availableItems}>
            {allItems
              .filter(item => !selectedItems.includes(item.id))
              .map(item => (
                <div
                  key={item.id}
                  className={styles.selectableItem}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <strong>{item.name}</strong>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AmenitiesSet;
