import React, { useEffect, useState } from "react";
import styles from '../css/ListingInfo.module.css';

const ListingDescription = ({ onDescriptionChange, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue); // оновлюється, коли initialValue змінюється (наприклад, після fetch)
  }, [initialValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onDescriptionChange(newValue);
  };

  return (
    <div className={styles.DescriptionContainer}>
      <label className={styles.DescriptionLabel} htmlFor="description">Опис житла</label>
      <textarea
        className={styles.DescriptionInput}
        id="description"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default ListingDescription;
