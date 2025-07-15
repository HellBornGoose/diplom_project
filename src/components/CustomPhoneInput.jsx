import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import phoneIcon from "../img/phoneIcon.svg";
import './css/PhoneInput.css';
import DownArrow from '../img/DownArrow.svg';

function CustomPhoneInput({ value, onChange, placeholder = 'Номер телефона', defaultCountry }) {
  const [error, setError] = useState('');

  const handleChange = (value) => {
    onChange(value);
    setError('');
  };

  const handleBlur = () => {
    if (value && !isValidPhoneNumber(value)) {
      setError('Недействительный номер телефона');
    } else {
      setError('');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <img src={phoneIcon}
        style={{
          position: 'absolute',
          left: '12px',
          top: '21px',
          transform: 'translateY(-50%)',
          color: '#f28c38',
          fontSize: '16px',
          zIndex: '5',
          width: '23px',
          height: '23px'
        }}
      
      />
      <img src={DownArrow} className="PhoneInputImgIconArrow" />
      <PhoneInput
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        defaultCountry={defaultCountry}
        className="customphoneinput"
        style={{
          color: '#f28c38',
          fontSize: '16px',
          display: 'block',
          width: '100%',
          
        }}
      />
      {error && (
        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomPhoneInput;