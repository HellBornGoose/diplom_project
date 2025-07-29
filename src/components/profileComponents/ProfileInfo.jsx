import { useState, useEffect } from 'react';
import style from '../css/ProfileInfo.module.css';
import InstLogo from '../../img/InstOrange.svg';
import FacebookLogo from '../../img/FacebookOrange.svg';
import TelegramLogo from '../../img/TelegramOrange.svg';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../img/default-avatar.jpg';
import { NGROK_URL } from '../../Hooks/config';

const ProfileInfo = ({landLordStyle, landLordPhoneIconStyle}) => {
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
    ? `${NGROK_URL}/api/Profile/get-avatar/${encodeURIComponent(photoUrl)}`
    : defaultAvatar;

  const loadProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await fetch(`${NGROK_URL}/api/Profile/get`, {
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
    <div className={style.profileCard} style={landLordStyle}>
        <div className={style.editIcon}>
            <Link className={style.editLink} to="/profile/edit">
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" style={landLordStyle}>
                <path d="M7.29167 30.625C6.48958 30.625 5.80319 30.3397 5.2325 29.769C4.66181 29.1983 4.37597 28.5114 4.375 27.7083V7.29167C4.375 6.48958 4.66083 5.80319 5.2325 5.2325C5.80417 4.66181 6.49056 4.37597 7.29167 4.375H16.8073C17.2934 4.375 17.658 4.52715 17.901 4.83146C18.1441 5.13576 18.2656 5.46972 18.2656 5.83333C18.2656 6.19694 18.1383 6.53139 17.8835 6.83667C17.6288 7.14194 17.2579 7.29361 16.7708 7.29167H7.29167V27.7083H27.7083V18.1927C27.7083 17.7066 27.8605 17.342 28.1648 17.099C28.4691 16.8559 28.8031 16.7344 29.1667 16.7344C29.5303 16.7344 29.8647 16.8559 30.17 17.099C30.4753 17.342 30.6269 17.7066 30.625 18.1927V27.7083C30.625 28.5104 30.3397 29.1973 29.769 29.769C29.1983 30.3406 28.5114 30.626 27.7083 30.625H7.29167ZM13.125 20.4167V16.8802C13.125 16.4913 13.1979 16.1204 13.3437 15.7675C13.4896 15.4146 13.6962 15.1049 13.9635 14.8385L26.5052 2.29688C26.7969 2.00521 27.125 1.78646 27.4896 1.64062C27.8542 1.49479 28.2188 1.42188 28.5833 1.42188C28.9722 1.42188 29.3431 1.49479 29.696 1.64062C30.049 1.78646 30.3708 2.00521 30.6615 2.29688L32.7031 4.375C32.9705 4.66667 33.1771 4.98896 33.3229 5.34188C33.4687 5.69479 33.5417 6.05306 33.5417 6.41667C33.5417 6.78028 33.4751 7.13903 33.3419 7.49292C33.2087 7.84681 32.9958 8.16861 32.7031 8.45833L20.1615 21C19.8941 21.2674 19.5844 21.4803 19.2325 21.6388C18.8806 21.7972 18.5097 21.876 18.1198 21.875H14.5833C14.1701 21.875 13.824 21.735 13.545 21.455C13.266 21.175 13.126 20.8289 13.125 20.4167ZM16.0417 18.9583H18.0833L26.5417 10.5L25.5208 9.47917L24.4635 8.45833L16.0417 16.8802V18.9583Z" />
              </svg>
            </Link>
        </div>
      <div className={style.profileImage}>
        <img src={avatarUrl || defaultAvatar} alt="Profile avatar" />
      </div>
      <div className={style.profileInfo}>
        <h2>{`${firstName} ${surname}`}</h2>
        <p className={style.birthdate} style={landLordStyle}>{dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
            ? `${dateOfBirth.day}.${dateOfBirth.month}.${dateOfBirth.year}`
            : ''}</p>
        <p className={style.location} style={landLordStyle}>{location}</p>
        <p className={style.role}>Мандрівник</p>
        <div className={style.contact}>
          <div className={style.email}>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={landLordStyle}>
              <path d="M18.75 0H1.25C0.918479 0 0.600537 0.131696 0.366116 0.366116C0.131696 0.600537 0 0.918479 0 1.25V13.75C0 14.0815 0.131696 14.3995 0.366116 14.6339C0.600537 14.8683 0.918479 15 1.25 15H18.75C19.0815 15 19.3995 14.8683 19.6339 14.6339C19.8683 14.3995 20 14.0815 20 13.75V1.25C20 0.918479 19.8683 0.600537 19.6339 0.366116C19.3995 0.131696 19.0815 0 18.75 0ZM17.7875 13.75H2.2875L6.6625 9.225L5.7625 8.35625L1.25 13.025V2.2L9.01875 9.93125C9.25295 10.1641 9.56977 10.2947 9.9 10.2947C10.2302 10.2947 10.547 10.1641 10.7812 9.93125L18.75 2.00625V12.9437L14.15 8.34375L13.2687 9.225L17.7875 13.75ZM2.06875 1.25H17.7375L9.9 9.04375L2.06875 1.25Z"/>
            </svg>

            <span style={landLordStyle}>{email}</span>
          </div>
          <div className={style.phone}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={landLordPhoneIconStyle} >
              <path d="M11.5 10.6019C9.50421 12.7019 4.41361 7.65683 6.41685 5.54847C7.64013 4.26096 6.25853 2.79011 5.49356 1.7076C4.05779 -0.321585 0.907105 2.48011 1.0021 4.26263C1.30459 9.88435 7.38514 16.5461 13.2732 15.9644C15.1148 15.7827 17.2314 12.456 15.119 11.2402C14.0623 10.6319 12.6116 9.43185 11.5 10.601" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={landLordStyle}>{phone}</span>
          </div>
        </div>
        <div className={style.social}>
          <a href={`https://www.instagram.com/${instagram}`}><img src={InstLogo} alt="Instagram logo" /></a>
          <a href={`https://www.facebook.com/${facebook}`}><img src={FacebookLogo} className={style.FacebookIcon} alt="Facebook logo" /></a>
          <a href={`https://t.me/${telegram}`}><img src={TelegramLogo} alt="Telegram logo" /></a>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
