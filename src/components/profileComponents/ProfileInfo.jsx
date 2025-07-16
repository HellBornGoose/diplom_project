import style from '../css/ProfileInfo.module.css';
import EmailIcon from '../../img/ProfileEmail.svg';
import PhoneIcon from '../../img/ProfilePhone.svg';
import InstLogo from '../../img/InstOrange.svg';
import FacebookLogo from '../../img/FacebookOrange.svg';
import TelegramLogo from '../../img/TelegramOrange.svg';
import EditIcon from '../../img/EditIcon.svg';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../../img/default-avatar.jpg'
 

const ProfileInfo = () => {
  return (
    <div className={style.profileCard}>
        <div className={style.editIcon}>
            <Link to="/profile/edit"><img src={EditIcon} alt="" /></Link>
        </div>
      <div className={style.profileImage}>
        <img src={DefaultAvatar} alt="Олег Гончар" />
      </div>
      <div className={style.profileInfo}>
        <h2>Олег Гончар</h2>
        <p className={style.birthdate}>07.09.1997</p>
        <p className={style.location}>Україна, Карпати</p>
        <p className={style.role}>Мандрівник</p>
        <div className={style.contact}>
          <div className={style.email}>
            <img src={EmailIcon} alt="Email icon" />
            <span>oleggon4ar@gmail.com</span>
          </div>
          <div className={style.phone}>
            <img src={PhoneIcon} alt="Phone icon" />
            <span>+38 (069) 23 26 754</span>
          </div>
        </div>
        <div className={style.social}>
          <a href=''><img src={InstLogo} alt="Instagram logo" /></a>
          <a href=''><img src={FacebookLogo} className={style.FacebookIcon} alt="Facebook logo" /></a>
          <a href=''><img src={TelegramLogo} alt="Telegram logo" /></a>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
