import React, { useState } from 'react';
import styles from '../css/AmenitiesSet.module.css';

const AmenitiesSet = ({onAmenitiesChange}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  const allItems = [
    'Тераса',
    'Новий ремонт',
    'Зона паркування',
    'Басейн',
    'Гімнастичний зал',
    'Сад',
    'Балкон',
    'Кондиціонер',
    'Інтернет',
    'Телевізор',
    'Кухня',
    'Гараж',
    'Тренувальний зал',
    'Гриль',
    'Кавамашина',
    'Джакузі',
    'Вана',
    'Духовка',
    'Посудомийна машина',
    'Пральня',
    'Аудіо система',
    'Столові прибори',
    'Ігрова консоль',
    'Міні-бар',
    'Фен',
    'Холодильник',
    'Детектор чадного газу',
    'Детектор диму',
    'Шампунь',
    'Гель для душу',
    'Праска',
    'Сушка для одягу'

  ];

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