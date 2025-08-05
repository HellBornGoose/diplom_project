import React, { useState, useRef, useEffect } from 'react';
import styles from '../css/MultiImageInput.module.css';
import plusIcon from '../../img/plusIcon.svg';
import axios from 'axios';
import trashIcon from '../../img/Trash-Icon.svg';
import { NGROK_URL } from '../../Hooks/config'; // Импортируем NGROK_URL

const MultiImageInput = ({ initialServerImages = [], setImages, listingId }) => {
  const [images, setLocalImages] = useState([]); // { url, file?, isServer }
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Инициализация изначальных серверных изображений
  useEffect(() => {
    if (initialServerImages && initialServerImages.length > 0 && !images.length) {
      const serverFormatted = initialServerImages.map(url => ({
        url,
        isServer: true,
      }));
      setLocalImages(serverFormatted);
      setImages(serverFormatted); 
      setActiveIndex(serverFormatted.length > 0 ? 1 : 0);
    }
  }, [initialServerImages, images.length, setImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isServer: false,
    }));

    const updated = [...images, ...newImages];
    setLocalImages(updated);
    setImages(updated);

    if (activeIndex === 0 && newImages.length > 0) {
      setActiveIndex(images.length + 1);
    }

    e.target.value = null;
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleBigPlusClick = () => {
    inputRef.current?.click();
  };

  const handleDeleteImage = async () => {
    const deleteIndex = activeIndex - 1;
    if (deleteIndex < 0 || deleteIndex >= images.length) return;

    const imageToDelete = images[deleteIndex];

    // Удаляем с сервера, если это серверное фото и есть listingId
    if (imageToDelete.isServer && listingId) {
      try {
        const photoUrl = imageToDelete.url.replace(`${NGROK_URL}/api/Listing/get-photo/`, '');
        await axios.delete(`${NGROK_URL}/api/listings/delete-photo`, {
          params: {
            listingId,
            photoUrl: encodeURIComponent(photoUrl), // Кодируем путь
          }
        });
      } catch (err) {
        console.error('Ошибка при удалении фото с сервера:', err);
        return;
      }
    }

    const updatedImages = [...images];
    updatedImages.splice(deleteIndex, 1);
    setLocalImages(updatedImages);
    setImages(updatedImages);

    if (updatedImages.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex > updatedImages.length) {
      setActiveIndex(updatedImages.length);
    } else {
      setActiveIndex(activeIndex);
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
        <div className={styles.imageContainer}>
          <img
            src={images[activeIndex - 1]?.url}
            alt={`Preview ${activeIndex - 1}`}
            className={styles.image}
          />
          <button
            onClick={handleDeleteImage}
            className={styles.deleteButton}
          >
            <img src={trashIcon} alt="Trash icon" />
          </button>
        </div>
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
        <span
          onClick={() => handleDotClick(0)}
          className={`${styles.dot} ${activeIndex === 0 ? styles.dotActive : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleDotClick(0)}
        />
        {images.map((_, index) => (
          <span
            key={index + 1}
            onClick={() => handleDotClick(index + 1)}
            className={`${styles.dot} ${activeIndex === index + 1 ? styles.dotActive : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleDotClick(index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiImageInput;
