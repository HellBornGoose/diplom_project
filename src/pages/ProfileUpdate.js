import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'intl-tel-input/build/css/intlTelInput.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AvatarChange from '../components/AvatarChange';
import CustomPhoneInput from '../components/CustomPhoneInput';
import LanguageSelector from '../components/LanguageSelector';
import InstDarkLogo from '../img/InstDarkLogo.svg';
import FacebookDarkLogo from '../img/FacebookDarkLogo.svg';
import TelegramDarkLogo from '../img/TelegramDarkLogo.svg';
import UpdateStyles from '../css/ProfileUpdate.module.css';
import { NGROK_URL } from '../Hooks/config';

const GEO_API_KEY = 'b4c12022c2c846d6a7bdeb5e79d87424';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  // const refreshTimeout = useRef(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    surname: '',
    gender: '',
    phone: '',
    location: '',
    email: '',
    dateOfBirth: { day: '', month: '', year: '' },
    instagram: '',
    facebook: '',
    telegram: '',
    languages: [],
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Обновление фото
  const handlePhotoUrlChange = (newUrl) => setPhotoUrl(newUrl);

  // Обновление телефона + синхронизация с profile
  const handlePhoneChange = (newPhone) => {
    setProfile(prev => ({ ...prev, phone: newPhone }));
  };

  // Обновление локации и подсказки из Geoapify
  const handleLocationInput = async (e) => {
    const query = e.target.value.trim();
    setProfile(prev => ({ ...prev, location: query }));

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=uk&limit=5&apiKey=${GEO_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch location suggestions');
      const data = await res.json();

      const newSuggestions = data.features.map(feature => {
        const { country = '', state = '', county = '', region = '', formatted = '' } = feature.properties;
        const regionName = state || county || region;
        return country && regionName ? `${country}, ${regionName}` : formatted;
      });
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
    }
  };

  // Обработка выбора подсказки локации
  const handleSuggestionClick = (suggestion) => {
    setProfile(prev => ({ ...prev, location: suggestion }));
    setSuggestions([]);
  };

  // Обновление JWT токена
  // const refreshJWT = async () => {
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (!refreshToken) throw new Error('No refresh token available');

  //   const response = await fetch(`${NGROK_URL}/api/Auth/refresh`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ refreshToken }),
  //   });

  //   if (!response.ok) throw new Error('Failed to refresh token');

  //   const data = await response.json();
  //   localStorage.setItem('jwtToken', data.jwtToken);
  //   localStorage.setItem('refreshToken', data.refreshToken);
  //   localStorage.setItem('expireToken', data.expires);

  //   startTokenRefreshTimer();
  // };

  // // Таймер обновления токена
  // const startTokenRefreshTimer = () => {
  //   const expiresInStr = localStorage.getItem('expireToken');
  //   if (!expiresInStr) return;

  //   const expiresInSec = parseInt(expiresInStr, 10);
  //   if (isNaN(expiresInSec) || expiresInSec <= 0) return;

  //   const refreshBeforeSec = 120;
  //   const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

  //   if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

  //   refreshTimeout.current = setTimeout(async () => {
  //     try {
  //       await refreshJWT();
  //     } catch (err) {
  //       console.error('Error refreshing token:', err);
  //     }
  //   }, timeoutMs);
  // };

  // Загрузка профиля с сервера
  const loadProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${NGROK_URL}/api/Profile/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      const data = await res.json();

      const [year = '', month = '', day = ''] = data.dateOfBirth?.split('T')[0].split('-') || [];

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
        languages: data.languages?.map(lang => lang.code) || [],
      });

      setPhotoUrl(data.photoUrl || '');
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // Отправка обновлённого профиля на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const { firstName, lastName, surname, gender, phone, location, email, dateOfBirth, instagram, facebook, telegram, languages } = profile;

    const dateOfBirthStr = `${dateOfBirth.year}-${dateOfBirth.month.padStart(2, '0')}-${dateOfBirth.day.padStart(2, '0')}`;

    const payload = {
      firstName,
      lastName,
      surname,
      gender,
      phone,
      location,
      email,
      dateOfBirth: dateOfBirthStr,
      instagram,
      facebook,
      telegram,
      languageCodes: languages,
      photoUrl,
    };

    try {
      const response = await fetch(`${NGROK_URL}/api/Profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMsg(error.message || 'Помилка оновлення профілю');
        return;
      }
    await refreshJWT(); // Ждём обновления токена, ведь если таки имейл будет поменян, то работать не будет(

    
    const newToken = localStorage.getItem('jwtToken'); // Берём обновлённый токен из localStorage
      // После обновления профиля повторно получить данные для проверки ролей
      const profileRes = await fetch(`${NGROK_URL}/api/Profile/get`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      if (!profileRes.ok) {
        setErrorMsg('Не вдалося отримати дані профілю');
        return;
      }

      const profileData = await profileRes.json();
      const roles = profileData.roles || [];

      if (roles.includes('Landlord')) {
        navigate('/profile/Lord');
      } else {
        navigate('/profile/User');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Сталася помилка');
    }
  };

  // Инициализация при монтировании компонента
  useEffect(() => {
    // refreshJWT();
    loadProfile();

    // return () => {
    //   if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    // };
  }, []);

  return (
    <div className={UpdateStyles.profileUpdateContainer}>
      <Header />
      <main>
        <h1>Редагування профілю</h1>

        {errorMsg && <p className={UpdateStyles.errorMsg}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className={UpdateStyles.form}>
          <div className={UpdateStyles.formGroup}>
            <label htmlFor="avatar" className="text-sm font-medium mb-1">
              Аватарка:
            </label>
            <AvatarChange serverFilePath={photoUrl} onPhotoUrlChange={handlePhotoUrlChange} />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="firstName">Ім'я*</label>
            <input
              id="firstName"
              type="text"
              value={profile.firstName}
              onChange={e => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="lastName">Прізвище*</label>
            <input
              id="lastName"
              type="text"
              value={profile.lastName}
              onChange={e => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="surname">По-батькові</label>
            <input
              id="surname"
              type="text"
              value={profile.surname}
              onChange={e => setProfile(prev => ({ ...prev, surname: e.target.value }))}
            />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="gender">Стать</label>
            <select
              id="gender"
              value={profile.gender}
              onChange={e => setProfile(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Виберіть стать</option>
              <option value="Male">Чоловіча</option>
              <option value="Female">Жіноча</option>
              <option value="Other">Інша</option>
            </select>
          </div>

          <div className={UpdateStyles.formGroup}>
            <label>Дата народження</label>
            <div className={UpdateStyles.dateOfBirth}>
              <input
                type="number"
                placeholder="День"
                min="1"
                max="31"
                value={profile.dateOfBirth.day}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    dateOfBirth: { ...prev.dateOfBirth, day: e.target.value },
                  }))
                }
              />
              <input
                type="number"
                placeholder="Місяць"
                min="1"
                max="12"
                value={profile.dateOfBirth.month}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    dateOfBirth: { ...prev.dateOfBirth, month: e.target.value },
                  }))
                }
              />
              <input
                type="number"
                placeholder="Рік"
                min="1900"
                max={new Date().getFullYear()}
                value={profile.dateOfBirth.year}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    dateOfBirth: { ...prev.dateOfBirth, year: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className={UpdateStyles.formGroup}>
            <label>Телефон</label>
            <CustomPhoneInput value={profile.phone} onChange={handlePhoneChange} defaultCountry="UA" />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="location">Локація</label>
            <input
              id="location"
              type="text"
              value={profile.location}
              onChange={handleLocationInput}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className={UpdateStyles.suggestionsList}>
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="instagram">Instagram</label>
            <input
              id="instagram"
              type="text"
              value={profile.instagram}
              onChange={e => setProfile(prev => ({ ...prev, instagram: e.target.value }))}
            />
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img src={InstDarkLogo} alt="Instagram" />
            </a>
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="facebook">Facebook</label>
            <input
              id="facebook"
              type="text"
              value={profile.facebook}
              onChange={e => setProfile(prev => ({ ...prev, facebook: e.target.value }))}
            />
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img src={FacebookDarkLogo} alt="Facebook" />
            </a>
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="telegram">Telegram</label>
            <input
              id="telegram"
              type="text"
              value={profile.telegram}
              onChange={e => setProfile(prev => ({ ...prev, telegram: e.target.value }))}
            />
            <a href="https://web.telegram.org" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img src={TelegramDarkLogo} alt="Telegram" />
            </a>
          </div>

          <div className={UpdateStyles.formGroup}>
            <label>Мови</label>
            <LanguageSelector selectedLanguages={profile.languages} onChange={(langs) => setProfile(prev => ({ ...prev, languages: langs }))} />
          </div>

          <button type="submit" className={UpdateStyles.submitBtn}>Оновити</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileUpdate;
