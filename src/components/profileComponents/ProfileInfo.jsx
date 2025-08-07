import { useState, useEffect } from 'react';
import style from '../css/ProfileInfo.module.css';
import InstLogo from '../../img/InstOrange.svg';
import FacebookLogo from '../../img/FacebookOrange.svg';
import TelegramLogo from '../../img/TelegramOrange.svg';
import defaultAvatar from '../../img/default-avatar.jpg';
import { NGROK_URL } from '../../Hooks/config';
import { Link } from 'react-router-dom';

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
