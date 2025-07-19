import React, { useState, useRef } from 'react';
import styles from '../css/MultiImageInput.module.css';
import plusIcon from '../../img/plusIcon.svg';

const MultiImageInput = ({ images = [], setImages }) => {
  const [activeIndex, setActiveIndex] = useState(0); // 0 — пустой экран, 1..N — картинки
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    if (activeIndex === 0 && newImages.length > 0) {
      setActiveIndex(1);
    }
    e.target.value = null;
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleBigPlusClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.wrapper}>
      {activeIndex === 0 ? (
        <div
          className={styles.emptyState}
          onClick={handleBigPlusClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleBigPlusClick()}
        >
          <img src={plusIcon} alt="Добавить изображение" className={styles.bigPlusIcon} />
        </div>
      ) : (
        <img
          src={images[activeIndex - 1].url}
          alt={`Preview ${activeIndex - 1}`}
          className={styles.image}
        />
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className={styles.input}
        style={{ display: 'none' }}
      />

      <div className={styles.dots}>
        {/* Точка для пустого состояния */}
        <span
          onClick={() => handleDotClick(0)}
          className={`${styles.dot} ${activeIndex === 0 ? styles.dotActive : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleDotClick(0)}
          aria-label="Показать пустое поле с загрузкой"
        />

        {/* Точки для картинок */}
        {images.map((_, index) => (
          <span
            key={index + 1}
            onClick={() => handleDotClick(index + 1)}
            className={`${styles.dot} ${activeIndex === index + 1 ? styles.dotActive : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleDotClick(index + 1)}
            aria-label={`Показать изображение ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiImageInput;
