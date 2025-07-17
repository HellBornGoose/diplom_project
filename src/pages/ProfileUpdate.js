import React, { useState, useEffect, useRef } from 'react';
import 'intl-tel-input/build/css/intlTelInput.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InstDarkLogo from '../img/InstDarkLogo.svg';
import FacebookDarkLogo from '../img/FacebookDarkLogo.svg';
import TelegramDarkLogo from '../img/TelegramDarkLogo.svg';
import CustomPhoneInput from '../components/CustomPhoneInput';
import UpdateStyles from '../css/ProfileUpdate.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import AvatarChange from '../components/AvatarChange';
import defaultAvatar from '../img/default-avatar.jpg';

const ProfileUpdate = () => {
    const [profile, setProfile] = useState({
        firstName: '', lastName: '', surname: '', gender: '', phone: '', location: '',
        email: '', dateOfBirth: { day: '', month: '', year: '' }, instagram: '',
        facebook: '', telegram: '', languages: [], photoUrl: ''
    });
    
    const [errorMsg, setErrorMsg] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [phone, setPhone] = useState('');
    const [languages, setLanguages] = useState([]);
    const [photoUrl, setPhotoUrl] = useState('');
    const navigate = useNavigate();
    const refreshTimeout = useRef(null);

    const handlePhotoUrlChange = (newUrl) => {
        setPhotoUrl(newUrl);
      };

    const handlePhoneChange = (newPhone) => {
        setPhone(newPhone);
        setProfile(prev => ({ ...prev, phone: newPhone }));
    };

    const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';
    const ngrokLink = 'http://localhost:5197';

    // Обнова дживити
    const refreshJWT = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
         if (!refreshToken) {
             throw new Error('No refresh token available');
         }

        const response = await fetch(`${ngrokLink}/api/Auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

         if (!response.ok) {
             throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        const { jwtToken, refreshToken: newRefreshToken, expires } = data;

        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('expireToken', expires);

        startTokenRefreshTimer();
    };

    // Start token refresh timer
    const startTokenRefreshTimer = () => {
        const expiresInStr = localStorage.getItem('expireToken');
        if (!expiresInStr) return;

        const expiresInSec = parseInt(expiresInStr, 10);
        if (isNaN(expiresInSec) || expiresInSec <= 0) return;

        const refreshBeforeSec = 120;
        const timeoutMs = Math.max((expiresInSec - refreshBeforeSec) * 1000, 10000);

        if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

        refreshTimeout.current = setTimeout(async () => {
            try {
                await refreshJWT();
            } catch (err) {
                console.error('Error refreshing token:', err);
            }
        }, timeoutMs);
    };

    // Заполнение профиля
    const loadProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${ngrokLink}/api/Profile/get`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`);
            }

            const data = await res.json();
            // const photo = data.photoUrl && data.photoUrl.trim() !== '' ? data.photoUrl : defaultAvatar;
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
            });
            setPhone(data.phone || '');
            setLanguages(data.languages.map(lang => lang.code));
        } catch (err) {
            console.error('Error loading profile:', err);
        }
    };

    // Подсказки в выборе региона\страны
    const handleLocationInput = async (e) => {
        const query = e.target.value.trim();
        setProfile({ ...profile, location: query });

        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=uk&limit=5&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const newSuggestions = data.features.map(place => {
            const country = place.properties.country || '';
            const region = place.properties.state || place.properties.county || place.properties.region || '';
            return country && region ? `${country}, ${region}` : place.properties.formatted;
        });
        setSuggestions(newSuggestions);
    };

    // Нажатие подсказки
    const handleSuggestionClick = (suggestion) => {
        setProfile({ ...profile, location: suggestion });
        setSuggestions([]);
    };

    // Формирование запроса и отправка данных
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, surname, gender, phone, location, email, dateOfBirth, instagram, facebook, telegram } = profile;
        const dateOfBirthStr = `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`;
        const payload = {
            firstName, lastName, surname, gender, phone, location, email, dateOfBirth: dateOfBirthStr, instagram, facebook, telegram, languageCodes: languages
        };

        try {
            const token = localStorage.getItem('jwtToken');

            const response = await fetch(`${ngrokLink}/api/Profile/update`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ← добавлен JWT
    },
    body: JSON.stringify(payload)
});

            if (!response.ok) {
                const error = await response.json();
                setErrorMsg(error.message || 'Помилка оновлення профілю');
                return;
            }

            navigate('/profile/user');
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    // Инициализация
    useEffect(() => {
        refreshJWT();
        loadProfile();
        return () => {
            if (refreshTimeout.current) {
                clearTimeout(refreshTimeout.current);
            }
        };
    }, []);

    return (
        <div className="">
            <Header />
            <main >
                <h1>Редагування профілю</h1>
                <p className="error" style={{ opacity: errorMsg ? 100 : 0 }}>{errorMsg}</p>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="avatar" className="text-sm font-medium mb-1">Аватарка:</label>
                        <AvatarChange
                            serverFilePath={photoUrl} // передаем текущий URL для отображения
                            onPhotoUrlChange={handlePhotoUrlChange} // колбек для обновления URL
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="firstName" className="text-sm font-medium mb-1">Ім'я*</label>
                        <input
                            type="text"
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            required
                            className="border rounded p-2"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="lastName" className="text-sm font-medium mb-1">Прізвище*</label>
                        <input
                            type="text"
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            required
                            className="border rounded p-2"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="surname" className="text-sm font-medium mb-1">По-батькові</label>
                        <input
                            type="text"
                            id="surname"
                            value={profile.surname}
                            onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                            className="border rounded p-2"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="gender" className="text-sm font-medium mb-1">Стать</label>
                        <select
                            id="gender"
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                            className="border rounded p-2"
                        >
                            <option value="Male">Чоловіча</option>
                            <option value="Female">Жіноча</option>
                            <option value="Other">Інше</option>
                        </select>
                    </div>
                    <div className="formGroup">
                        <label className="text-sm font-medium mb-1">Дата народження*</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                id="birthday-day"
                                value={profile.dateOfBirth.day}
                                onChange={(e) => setProfile({ ...profile, dateOfBirth: { ...profile.dateOfBirth, day: e.target.value } })}
                                min="1"
                                max="31"
                                required
                                className="border rounded p-2 w-20"
                                placeholder="День"
                            />
                            <input
                                type="number"
                                id="birthday-month"
                                value={profile.dateOfBirth.month}
                                onChange={(e) => setProfile({ ...profile, dateOfBirth: { ...profile.dateOfBirth, month: e.target.value } })}
                                min="1"
                                max="12"
                                required
                                className="border rounded p-2 w-20"
                                placeholder="Місяць"
                            />
                            <input
                                type="number"
                                id="birthday-year"
                                value={profile.dateOfBirth.year}
                                onChange={(e) => setProfile({ ...profile, dateOfBirth: { ...profile.dateOfBirth, year: e.target.value } })}
                                min="1900"
                                max="2025"
                                required
                                className="border rounded p-2 w-24"
                                placeholder="Рік"
                            />
                        </div>
                    </div>
                    <div className="formGroup">
                        <label htmlFor="location" className="text-sm font-medium mb-1">Місцезнаходження</label>
                        <input
                            type="text"
                            id="location"
                            value={profile.location}
                            onChange={handleLocationInput}
                            placeholder="Україна, Карпати"
                            autoComplete="off"
                            className="border rounded p-2"
                        />
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-10">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="formGroup">
                        <label htmlFor="email" className="text-sm font-medium mb-1">Адреса електронної пошти*</label>
                        <input
                            type="email"
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            required
                            className="border rounded p-2"
                        />
                    </div>
                    <div className="formGroup">
                    <CustomPhoneInput
                        value={phone}
                        onChange={setPhone}
                        placeholder="Номер телефона"
                        defaultCountry="UA"
                    />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor="language" className="text-sm font-medium mb-1">Язики</label>
                        <LanguageSelector id="language" languages={languages} setLanguages={setLanguages} />

                    </div>
                    <div className="formGroup">
                        <label className="text-sm font-medium mb-1">Посилання на соціальні мережі</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <img src={InstDarkLogo} alt="Instagram" className="h-6" />
                                <input
                                    type="text"
                                    id="social-ig"
                                    placeholder="Instagram ID"
                                    value={profile.instagram}
                                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                                    className="border rounded p-2 flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={FacebookDarkLogo} alt="Facebook" className="h-6" />
                                <input
                                    type="text"
                                    id="social-fb"
                                    placeholder="Facebook ID"
                                    value={profile.facebook}
                                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                                    className="border rounded p-2 flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={TelegramDarkLogo} alt="Telegram" className="h-6" />
                                <input
                                    type="text"
                                    id="social-tg"
                                    placeholder="Telegram ID"
                                    value={profile.telegram}
                                    onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                                    className="border rounded p-2 flex-1"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div>
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                            Додати фото паспорта
                        </button>
                    </div>
                    <div className="formGroup">
                        <input
                            type="checkbox"
                            id="consent"
                            className="h-4 w-4"
                        />
                        <label htmlFor="consent" className="text-sm">Надавати повідомлення про оновлення та рекламні пропозиції на мою пошту</label>
                    </div> */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Зберегти
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default ProfileUpdate;