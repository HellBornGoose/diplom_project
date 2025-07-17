import { useEffect, useState } from 'react';
import style from '../css/ProfileInfo.module.css';
import EmailIcon from '../../img/ProfileEmail.svg';
import PhoneIcon from '../../img/ProfilePhone.svg';
import InstLogo from '../../img/InstOrange.svg';
import FacebookLogo from '../../img/FacebookOrange.svg';
import TelegramLogo from '../../img/TelegramOrange.svg';
import EditIcon from '../../img/EditIcon.svg';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../img/default-avatar.jpg'; 

const ngrokLink = "https://4db1eec56caf.ngrok-free.app";

const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', surname: '', gender: '', phone: '', location: '',
    email: '', dateOfBirth: { day: '', month: '', year: '' }, instagram: '',
    facebook: '', telegram: '', languages: [], photoUrl: ''
  });

  const {
    firstName, surname, phone, email, location, instagram, facebook,
    telegram, dateOfBirth, photoUrl
  } = profile;

  const avatarUrl = photoUrl && photoUrl !== defaultAvatar
    ? `${ngrokLink}/api/Profile/get-avatar/${encodeURIComponent(photoUrl)}`
    : defaultAvatar;

  const loadProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await fetch(`${ngrokLink}/api/Profile/get`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      const data = await res.json();
      const photo = data.photoUrl && data.photoUrl.trim() !== '' ? data.photoUrl : defaultAvatar;
      const [year, month, day] = data.dateOfBirth ? data.dateOfBirth.split("T")[0].split("-") : ['', '', ''];

      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        surname: data.surname || '',
        gender: data.gender || '',
        phone: data.phone || '',
        location: data.location || '',
        email: data.email || '',
        dateOfBirth: { day, month, year },
        instagram: data.instagram || '', 
        facebook: data.facebook || '',   
        telegram: data.telegram || '',  
        photoUrl: photo,
        languages: data.languages || []
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className={style.profileCard}>
      <div className={style.editIcon}>
        <Link to="/registerUser">
          <img src={EditIcon} alt="Edit" />
        </Link>
      </div>

      <div className={style.profileImage}>
        <img src={avatarUrl} alt={`${firstName} ${surname}`} />
      </div>

      <div className={style.profileInfo}>
        <h2>{`${firstName} ${surname}`}</h2>
        <p className={style.birthdate}>
          {dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
            ? `${dateOfBirth.day}.${dateOfBirth.month}.${dateOfBirth.year}`
            : ''}
        </p>
        <p className={style.location}>{location}</p>
        <p className={style.role}>Мандрівник</p>

        <div className={style.contact}>
          <div className={style.email}>
            <img src={EmailIcon} alt="Email icon" />
            <span>{email}</span>
          </div>
          <div className={style.phone}>
            <img src={PhoneIcon} alt="Phone icon" />
            <span>{phone}</span>
          </div>
        </div>

        <div className={style.social}>
          {instagram && (
            <a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">
              <img src={InstLogo} alt="Instagram" />
            </a>
          )}
          {facebook && (
            <a href={`https://www.facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer">
              <img src={FacebookLogo} className={style.FacebookIcon} alt="Facebook" />
            </a>
          )}
          {telegram && (
            <a href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer">
              <img src={TelegramLogo} alt="Telegram" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
