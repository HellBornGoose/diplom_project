import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import emailIcon from "../img/email-icon.svg";
import passwordIcon from '../img/password-icon.svg';
import showPasswordIcon from '../img/showpassword.svg';
import 'intl-tel-input/build/css/intlTelInput.css';
import CustomPhoneInput from '../components/CustomPhoneInput';
import styles from '../css/Registration.module.css';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  
  useEffect(() => {
    const regex = /^[A-Za-z0-9]*$/;
    if (password === '') {
      setErrorMessage('');
      setIsPasswordValid(false);
    } else if (!regex.test(password)) {
      setErrorMessage('Пароль має бути лише латиницею(a,b,c...)');
      setIsPasswordValid(false);
    } else {
      setErrorMessage('');
      setIsPasswordValid(true);
    }
  }, [password]);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setErrorMessage('Невалідний пароль');
      return;
    }
    if(password.length<8){
      setErrorMessage("Пароль має бути більше, ніж 8 символів");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Паролі не співпадають!');
      return;
    }
    

    try {
      const response = await fetch('http://localhost:5197/api/Auth/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, password, isLandlord: false })
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || 'Помилка реєстрації');
        return;
      }

      const data = await response.json();
      localStorage.setItem('jwtToken', data.jwtToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpires', data.expires);

      navigate('/login');
    } catch (error) {
      setErrorMessage('Серверна помилка');
    }
  };

  return (
    <div>
    <Header />
    <div className={styles.maincontent}>
      <div className={styles.logincontainer}>
        <p className={styles.ph1}>Створити акаунт</p>
        <h1 className={styles.h1}>Користувача</h1>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <form className={styles.formbar} onSubmit={handleSubmit}>
          <div className={styles.inputgroup}>
            <img className={styles.formiconregistration} src={emailIcon} alt="email icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Електронна адреса"
              required
            />
          </div>

        <div className={styles.inputgroup}>
          <CustomPhoneInput
          value={phone}
          onChange={setPhone}
          placeholder="Номер телефона"
          defaultCountry="UA"
        />
        </div>

          <div className={styles.inputgroup}>
            <div className={styles.passwordwrapper}>
              <img className={styles.formiconregistration} src={passwordIcon} alt="password icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
              />
              <img
                className={styles.passwordtoggle}
                onClick={togglePassword}
                src={showPasswordIcon}
                alt="Show password"
              />
            </div>
          </div>

          <div className={styles.inputgroup}>
            <div className={styles.passwordwrapper}>
              <img className={styles.formiconregistration} src={passwordIcon} alt="password icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Підтвердити пароль"
                required
              />
              <img
                className={styles.passwordtoggle}
                onClick={toggleConfirmPassword}
                src={showPasswordIcon}
                alt="Show password"
              />
            </div>
          </div>

          <div className={styles.buttoncontainer}>
            <button type="submit">Зареєструватися</button>
          </div>

          <div className={styles.loginlink}>
            <Link to="/login">Вже є акаунт? Увійти</Link>
          </div>
          <div className={styles.ownerlink}>
            <Link to="/registerLord">Створити акаунт орендодавця</Link>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default RegisterUser;