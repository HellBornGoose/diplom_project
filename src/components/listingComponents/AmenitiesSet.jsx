import React, { useState, useEffect } from 'react';
import styles from '../css/AmenitiesSet.module.css';
import { NGROK_URL } from '../../Hooks/config';

const useMockData = false;

const AmenitiesSet = ({ onAmenitiesChange, initialSelected = [] }) => {
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSynced, setIsInitialSynced] = useState(false);

  // Загрузка данных с сервера или мок
  useEffect(() => {
    const loadData = async () => {
      console.log('[LoadData] Начинаем загрузку данных...');
      setIsLoading(true);
      try {
        if (useMockData) {
          console.log('[LoadData] Используем моковые данные');
          const mockData = [
            { id: 1, name: 'Wi-Fi', description: 'Інтернет доступ' },
            { id: 2, name: 'Басейн', description: 'Плавальний басейн' },
            { id: 3, name: 'Кондиціонер', description: 'Охолодження повітря' },
          ];
          setAllItems(mockData);
          console.log('[LoadData] Моковые данные загружены:', mockData);
        } else {
          console.log('[LoadData] Загружаем данные с сервера:', `${NGROK_URL}/api/listing/amenities`);
          const response = await fetch(`${NGROK_URL}/api/listing/amenities`);
          if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
          const data = await response.json();
          console.log('[LoadData] Ответ сервера:', data);
          if (Array.isArray(data)) {
            setAllItems(data);
            console.log('[LoadData] Данные успешно установлены');
          } else {
            console.error('[LoadData] Ожидался массив, получено:', data);
            setAllItems([]);
          }
        }
      } catch (error) {
        console.error('[LoadData] Ошибка при загрузке данных:', error);
        setAllItems([]);
      } finally {
        setIsLoading(false);
        console.log('[LoadData] Загрузка данных завершена');
      }
    };

    loadData();
  }, []);

  // Синхронизация начального выбранного списка с загруженными элементами — выполняется один раз
  useEffect(() => {
    console.log('[SyncInitial] isLoading:', isLoading, 'isInitialSynced:', isInitialSynced, 'initialSelected:', initialSelected);
    if (!isLoading && !isInitialSynced && initialSelected.length > 0) {
      const validSelected = initialSelected
        .map(name => {
          const found = allItems.find(item => item.name === name);
          if (found) {
            console.log(`[SyncInitial] Найдено совпадение: "${name}" => id ${found.id}`);
            return found.id;
          } else {
            console.warn(`[SyncInitial] Не найдено совпадение по названию: "${name}"`);
            return null;
          }
        })
        .filter(id => id !== null);
  
      console.log('[SyncInitial] Валидные выбранные id:', validSelected);
      setSelectedItems(validSelected);
      onAmenitiesChange(validSelected);
      setIsInitialSynced(true);
      console.log('[SyncInitial] Синхронизация начального выбора выполнена');
    }
  }, [initialSelected, allItems, isLoading, isInitialSynced, onAmenitiesChange]);
  

  // Выбор элемента
  const handleSelectItem = (id) => {
    console.log('[SelectItem] Выбрано ID:', id);
    if (!selectedItems.includes(id)) {
      const updated = [...selectedItems, id];
      setSelectedItems(updated);
      onAmenitiesChange(updated);
      console.log('[SelectItem] Обновленный список выбранных:', updated);
    } else {
      console.log('[SelectItem] ID уже выбран');
    }
  };

  // Удаление выбранного элемента
  const handleRemoveItem = (id) => {
    console.log('[RemoveItem] Удаляем ID:', id);
    const updated = selectedItems.filter(itemId => itemId !== id);
    setSelectedItems(updated);
    onAmenitiesChange(updated);
    console.log('[RemoveItem] Обновленный список выбранных:', updated);
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
