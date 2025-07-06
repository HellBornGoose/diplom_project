import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import '../css/Login.css';
import emailIcon from "../img/email-icon.svg";
import passwordIcon from '../img/password-icon.svg';
import showPasswordIcon from '../img/showpassword.svg';
import { Link } from 'react-router-dom';

function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://82cf-78-30-214-177.ngrok-free.app/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || 'Помилка входу');
        return;
      }

      const data = await response.json();
      localStorage.setItem('jwtToken', data.jwtToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpires', data.expires);
      const profileResponse = await fetch('https://your-api.com/api/Profile/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!profileResponse.ok) {
        setErrorMsg('Не вдалося отримати дані профілю');
        return;
      }

      const profileData = await profileResponse.json();

      const isLandLord = profileData.isLandLord;

      // Перенаправление по роли
      if (isLandLord) {
        navigate('/profile/landlord');
      } else {
        navigate('/profile/user');
      }
    } catch (error) {
      setErrorMsg('Щось пішло не так. Спробуйте ще раз.');
    }
    
  };
    return(
        <div>
            <Header />
        <div className="main-content">
        
        <div className="login-container">
        <h1 className="h1">Увійти <br /> в акаунт</h1>
        {error && <div className="error" id="error-message">{error}</div>}
        <form className="form-bar" onSubmit={handleSubmit}>
            <div className="input-group">
                <img className="form-icon" src={emailIcon} alt="email icon" />
                <input type="email" value={email} placeholder="Електронна адреса" required onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="input-group">
                <div className="password-wrapper">
                    <img className="form-icon password-icon" src={passwordIcon} alt="password icon" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Пароль" value={password} required onChange={e => setPassword(e.target.value)}/>
                    <img className="password-toggle" onClick={togglePassword} src={showPasswordIcon} alt="Show password" />
                </div>
            </div>
            <div className="button-container">
            <button type="submit">Увійти</button>
            </div>
            <div className="forgot-password">
                <Link to="#">Забули пароль?</Link>
            </div>
            <div className="registration-link">
                <Link to="./registration.html">Немає акаунту? Створити</Link>
            </div>
        </form>
        
        </div>
    </div>
    </div>
    )
}

export default Login;