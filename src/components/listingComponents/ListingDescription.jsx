import React from "react";
import styles from '../css/ListingInfo.module.css'

const ListingDescription = ({onDescriptionChange}) => {
    return(
        <div className={styles.DescriptionContainer}>
            <label className={styles.DescriptionLabel} htmlFor="description">Опис житла</label>
            <textarea className={styles.DescriptionInput} id="description" onChange={(e) => onDescriptionChange(e.target.value)} />
        </div>
    );
}
export default ListingDescription