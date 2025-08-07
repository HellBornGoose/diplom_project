import React, { useEffect, useState } from "react";
import styles from '../css/ListingInfo.module.css';

const SearchDescription = ({ onDescriptionChange, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue); 
  }, [initialValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onDescriptionChange(newValue);
  };

  return (
    <div className={styles.DescriptionContainer}>
      <label className={styles.DescriptionLabel} htmlFor="description">Опис</label>
      <textarea
        className={styles.DescriptionInput}
        id="description"
        value={value}
        onChange={handleChange}
        readOnly
      />
    </div>
  );
};

export default SearchDescription;
