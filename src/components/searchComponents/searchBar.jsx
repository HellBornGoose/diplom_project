import styles from '../css/SearchBar.module.css';
import LocationIcon from '../../img/LocationIcon.svg';
import DataIcon from '../../img/DataIcon.svg';
import PeopleIcon from '../../img/PeopleIcon.svg';

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInput}>
        <img src={LocationIcon} className={styles.searchIcon}/>
        <input type="text" placeholder="Фраза, Кемпері" />
      </div>
      <div className={styles.filterButtons}>
        <button className={styles.filterButton}>
          <img src={DataIcon} className={styles.filterIcon}/>
          4-6 Липня
        </button>
        <button className={styles.filterButton}>
          <img src={PeopleIcon} className={styles.filterIcon}/>
          1 Дорослий
        </button>
      </div>
      <button className={styles.submitButton}>
        <span className={styles.arrowIcon}>➡️</span>
      </button>
    </div>
  );
};

export default SearchBar;