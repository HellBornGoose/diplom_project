import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/ListingInfo.module.css';

const ListingInfo = ({ onFormDataChange }) => {
  const [name, setName] = useState('The house comfort+');
  const [country, setCountry] = useState('Ukraine');
  const [housingType, setHousingType] = useState('Квартира');
  const [address, setAddress] = useState('Pinewoods Holiday Park, NR23 1DR');
  const [selectedParameters, setSelectedParameters] = useState([
    'Тераса',
    'Новий ремонт',
    'Зона паркування',
    'Басейн'
  ]);
  const [checkIn, setCheckIn] = useState('16:00');
  const [checkOut, setCheckOut] = useState('10:00');
  const [guests, setGuests] = useState(4);
  const [price, setPrice] = useState('4 800 ₴');
  const [showParameterSelector, setShowParameterSelector] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';
  const timeoutRef = useRef(null);

  const allParameters = [
    'Тераса',
    'Новий ремонт',
    'Зона паркування',
    'Басейн',
    'Гімнастичний зал',
    'Сад',
    'Балкон',
    'Кондиціонер',
    'Інтернет',
    'Телевізор'
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const countryList = data.map(country => country.name.common).sort();
        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (address.trim() && !addressLoading) {
      timeoutRef.current = setTimeout(async () => {
        setAddressLoading(true);
        try {
          const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&lang=uk&apiKey=${apiKey}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.features?.length > 0) {
            const props = data.features[0].properties;
            setAddress(props.formatted);
            if (props.country) setCountry(props.country);
          }
        } catch (error) {
          console.error('Error validating address:', error);
        } finally {
          setAddressLoading(false);
        }
      }, 500);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [address]);

  useEffect(() => {
    onFormDataChange({
      name,
      country,
      housingType,
      address,
      selectedParameters,
      checkIn,
      checkOut,
      guests,
      price
    });
  }, [name, country, housingType, address, selectedParameters, checkIn, checkOut, guests, price]);

  const handleAddParameter = (param) => {
    if (selectedParameters.length < 5 && !selectedParameters.includes(param)) {
      setSelectedParameters([...selectedParameters, param]);
    }
  };

  const handleRemoveParameter = (param) => {
    setSelectedParameters(selectedParameters.filter(p => p !== param));
  };

  return (
    <div className={styles.bookingForm}>
      {/* Заголовок, країна та тип житла */}
      <div className={styles.headerSection}>
        <div className={styles.title}>
          <label htmlFor='name'>Назва</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={name}
            id='name'
          />
        </div>
        <div className={styles.typeDropdown}>
          <label htmlFor='HousingType'>Тип житла</label>
          <select value={housingType} onChange={(e) => setHousingType(e.target.value)} id='HousingType'>
            <option value="Квартира">Квартира</option>
            <option value="Будинок">Будинок</option>
            <option value="Вілла">Вілла</option>
            <option value="Готель">Готель</option>
          </select>
        </div>
      </div>
      <div className={styles.addressSection}>
        <div className={styles.Country}>
          <label htmlFor='Country'>Країна</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} id='Country' disabled={loading}>
            {loading ? (
              <option value="">Завантаження...</option>
            ) : countries.length > 0 ? (
              countries.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))
            ) : (
              <option value="">Немає даних</option>
            )}
          </select>
        </div>
        <div className={styles.Adress}>
          <label htmlFor='Address'>Адреса</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={address}
            id='Address'
            disabled={addressLoading}
          />
        </div>
        <div className={styles.capacityGroup}>
          <label htmlFor='setGuests'>Макс. кількість гостей</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            id='setGuests'
            placeholder={guests}
          />
        </div>
      </div>
      <div className={styles.parametersSection}>
        <div className={styles.parametersLabel}>
          <label>Головні параметри (до 5 на вибір)</label>
          <div className={styles.selectedParameters}>
            {selectedParameters.map((param) => (
              <span key={param} className={styles.parameterTag}>
                {param}
                <button onClick={() => handleRemoveParameter(param)}>x</button>
              </span>
            ))}
            <button
              className={styles.addParameterButton}
              onClick={() => setShowParameterSelector(!showParameterSelector)}
            >
              +
            </button>
          </div>
          {showParameterSelector && (
            <div className={styles.parameterSelector}>
              <h3>Виберіть параметри</h3>
              {allParameters
                .filter((param) => !selectedParameters.includes(param))
                .map((param) => (
                  <label htmlFor='showParameters' key={param} className={styles.parameterLabel}>
                    <input
                      type="checkbox"
                      onChange={() => handleAddParameter(param)}
                      disabled={selectedParameters.length >= 5}
                      id='showParameters'
                    />
                    {param}
                  </label>
                ))}
              <button onClick={() => setShowParameterSelector(false)} className={styles.ParameterButton}>Закрити</button>
            </div>
          )}
        </div>
        <div className={styles.priceCapacitySection}>
          <div className={styles.priceGroup}>
            <label htmlFor='pricePerDay'>Вкажіть ціну за добу</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              id='pricePerDay'
              placeholder={price}
            />
          </div>
        </div>
      </div>
      <div className={styles.timeSection}>
        <div className={styles.timeGroup}>
          <label htmlFor='CheckIn'>Час заїзду</label>
          <input
            type="time"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            id='CheckIn'
          />
        </div>
        <div className={styles.timeGroupRight}>
          <label htmlFor='CheckOut'>Час виїзду</label>
          <input
            type="time"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            id='CheckOut'
          />
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
