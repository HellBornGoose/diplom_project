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
import { useAuthRefresh } from '../Hooks/useAuthRefresh';
import Navigation from "../components/profileComponents/Navigation";
import styles from "../css/UserProfile.module.css";

const GEO_API_KEY = 'b4c12022c2c846d6a7bdeb5e79d87424';

const ProfileUpdateLord = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('jwtToken'));
  const { refreshJWT } = useAuthRefresh(isAuthenticated);
  const [location, setLocation] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

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
  const timeoutRef = useRef(null);
  const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';

  // Обновление фото
  const handlePhotoUrlChange = (newUrl) => setPhotoUrl(newUrl);

  // Обновление телефона + синхронизация с profile
  const handlePhoneChange = (newPhone) => {
    setProfile(prev => ({ ...prev, phone: newPhone }));
  };

  // Обновление локации и подсказки из Geoapify
  useEffect(() => {
    if (hasSelectedSuggestion) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (location.trim()) {
      timeoutRef.current = setTimeout(async () => {
        setAddressLoading(true);
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(location)}&lang=en&limit=5&types=city,town,village&apiKey=${apiKey}`
          );
          if (!response.ok) throw new Error(`Geoapify API error: ${response.status}`);
          const data = await response.json();
          setSuggestions(data.features || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching address suggestions:', err);
          setSuggestions([]);
        } finally {
          setAddressLoading(false);
        }
      }, 1000);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [location]);

  const handleSelectSuggestion = (suggestion) => {
    const props = suggestion.properties;
    setLocation(props.formatted || '');
    setHasSelectedSuggestion(true);
    setShowSuggestions(false);
  };

  // Загрузка профиля с сервера
  const loadProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      //navigate('/login');
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
    loadProfile();
  }, []);

  return (
    <div className={styles.layout}>
        <Header />
        

        <main className={styles.main}>
            <aside className={styles.sidebar}>
                <Navigation/>
            </aside>
            <div className={styles.mainContent}>
            <h1 className={styles.h1}>Редагування профілю</h1>
            <section className={styles.content}>
            <form onSubmit={handleSubmit} className={UpdateStyles.form}>
          <div className={`${UpdateStyles.formGroup}, ${UpdateStyles.firstColumn}`}>
            <AvatarChange serverFilePath={photoUrl} onPhotoUrlChange={handlePhotoUrlChange} />
          </div>
          <div className={UpdateStyles.secondColumn}>
        <div className={UpdateStyles.names}>
          <div className={UpdateStyles.formGroup}>
            <label htmlFor="firstName">Ім'я <span className={UpdateStyles.star}>*</span></label>
            <input
              id="firstName"
              type="text"
              value={profile.firstName}
              onChange={e => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>

          <div className={UpdateStyles.formGroup}>
            <label htmlFor="lastName">Прізвище <span className={UpdateStyles.star}>*</span></label>
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
          </div>
          <div className={UpdateStyles.formGroup}>
            <label htmlFor="gender">Стать</label>
            <select
            className={UpdateStyles.gender}
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
            <label>Дата народження <span className={UpdateStyles.star}>*</span></label>
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
          <div className={UpdateStyles.Adress} style={{ position: 'relative' }}>
            <label htmlFor='Address'>Країна або регіон <span className={UpdateStyles.star}>*</span></label>
          <input
            type="text"
            value={location}
            placeholder=""
            onChange={(e) => {
              setLocation(e.target.value);
              setHasSelectedSuggestion(false);
            }}
            id="Address"
            autoComplete="off"
            onFocus={() => {
              if (!hasSelectedSuggestion && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={addressLoading}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className={UpdateStyles.suggestionsList}>
              {suggestions.map((sugg, index) => (
                <li
                  key={index}
                  className={UpdateStyles.suggestionItem}
                  onMouseDown={() => handleSelectSuggestion(sugg)}
                >
                  {sugg.properties.formatted}
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
              readOnly
            />
          </div>
          <div className={`${UpdateStyles.formGroup}, ${UpdateStyles.phoneInput}`}>
            <label>Номер телефону</label>
            <CustomPhoneInput value={profile.phone} onChange={handlePhoneChange} defaultCountry="UA" />
          </div>
          </div>
        <div className={UpdateStyles.thirdColumn}>
          <div className={UpdateStyles.snGroup}>
            <label htmlFor="instagram">Посилання на соціальні мережі</label>
            <input
              id="instagram"
              type="text"
              value={profile.instagram}
              onChange={e => setProfile(prev => ({ ...prev, instagram: e.target.value }))}
            />
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img className={UpdateStyles.instIcon} src={InstDarkLogo} alt="Instagram" />
            </a>
          </div>

          <div className={UpdateStyles.snGroup}>
            <input
              id="facebook"
              type="text"
              value={profile.facebook}
              onChange={e => setProfile(prev => ({ ...prev, facebook: e.target.value }))}
            />
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img className={UpdateStyles.fbIcon} src={FacebookDarkLogo} alt="Facebook" />
            </a>
          </div>

          <div className={UpdateStyles.snGroup}>
            <input
              id="telegram"
              type="text"
              value={profile.telegram}
              onChange={e => setProfile(prev => ({ ...prev, telegram: e.target.value }))}
            />
            <a href="https://web.telegram.org" target="_blank" rel="noopener noreferrer" className={UpdateStyles.iconLink}>
              <img className={UpdateStyles.tgIcon} src={TelegramDarkLogo} alt="Telegram" />
            </a>
          </div>

          <div className={UpdateStyles.languages}>
            <label>Мови</label>
            <LanguageSelector selectedLanguages={profile.languages} onChange={(langs) => setProfile(prev => ({ ...prev, languages: langs }))} />
          </div>
          </div>
          
        </form>
        
            </section>
            <button type="submit" className={UpdateStyles.submitBtn}>Зберегти</button>
            </div>
            
        </main>

    
    <Footer />
</div>
  );
};

export default ProfileUpdateLord;
