import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/ListingInfo.module.css';
import { NGROK_URL } from '../../Hooks/config';

const ListingInfo = ({ onFormDataChange }) => {
  const [name, setName] = useState('The house comfort+');
  const [country, setCountry] = useState('Ukraine');
  const [countriesList, setCountriesList] = useState([]);

  const [housingTypeId, setHousingType] = useState('1');
  const [location, setAddress] = useState('Pinewoods Holiday Park, NR23 1DR');
  const [locationInput, setLocationInput] = useState('Kyiv, Ukraine');
  const [selectedParameters, setSelectedParameters] = useState(['Тераса', 'Новий ремонт', 'Зона паркування', 'Басейн']);
  const [checkIn, setCheckIn] = useState('16:00');
  const [checkOut, setCheckOut] = useState('10:00');
  const [guests, setGuests] = useState(4);
  const [price, setPrice] = useState('4 800 ₴');

  const [showParameterSelector, setShowParameterSelector] = useState(false);
  const [allParameters, setAllParameters] = useState([]);
  const [parametersLoading, setParametersLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timeoutRef = useRef(null);
  const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';

  // Завантаження параметрів
  useEffect(() => {
    const fetchMainFeatures = async () => {
      try {
        const res = await fetch(`${NGROK_URL}/api/listing/main-features`);
        const data = await res.json();
        setAllParameters(data.map(item => typeof item === 'string' ? item : item.name));
      } catch (err) {
        console.error('Error fetching main features:', err);
      } finally {
        setParametersLoading(false);
      }
    };
    fetchMainFeatures();
  }, []);

  // Завантаження країн з REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name');
        const data = await res.json();
        const sorted = data
          .map(c => c.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setCountriesList(sorted);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    fetchCountries();
  }, []);

  // Адреса: автопідказки
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (locationInput.trim()) {
      timeoutRef.current = setTimeout(async () => {
        setAddressLoading(true);
        try {
          const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(locationInput)}&lang=en&limit=5&apiKey=${apiKey}`);
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
  }, [locationInput]);

  const handleSelectSuggestion = (suggestion) => {
    const props = suggestion.properties;
    setLocationInput(props.formatted);
    setAddress(props.formatted);
    if (props.country) setCountry(props.country);
    setShowSuggestions(false);
  };

  const handleAddParameter = (param) => {
    if (selectedParameters.length < 5 && !selectedParameters.includes(param)) {
      setSelectedParameters([...selectedParameters, param]);
    }
  };

  const handleRemoveParameter = (param) => {
    setSelectedParameters(selectedParameters.filter(p => p !== param));
  };

  const generatePostData = () => {
    const parameterIdMap = {
      'Тераса': 2,
      'Новий ремонт': 4,
      'Зона паркування': 6,
      'Басейн': 8,
    };

    const parameterValueMap = {
      'Тераса': null,
      'Новий ремонт': '4',
      'Зона паркування': '100',
      'Басейн': null,
    };

    return {
      houseTypeId: parseInt(housingTypeId),
      title: name,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      perWeak: null,
      perDay: parseFloat(price.replace(/[^0-9.]/g, '').replace(',', '.')),
      perMonth: null,
      location: location,
      model3DUrl: null,
      amenityIds: [1, 2],
      mainFeatureIds: selectedParameters.map(param => parameterIdMap[param] || 0).filter(id => id !== 0),
      mainFeatureValues: selectedParameters.map(param => parameterValueMap[param] || null),
      maxTenants: parseInt(guests),
      country: country
    };
  };

  useEffect(() => {
    onFormDataChange(generatePostData());
  }, [name, country, housingTypeId, location, selectedParameters, checkIn, checkOut, guests, price]);

  return (
    <div className={styles.bookingForm}>
      {/* Назва + Тип */}
      <div className={styles.headerSection}>
        <div className={styles.title}>
          <label htmlFor='name'>Назва</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id='name'
          />
        </div>
        <div className={styles.typeDropdown}>
          <label htmlFor='HousingType'>Тип житла</label>
          <select
            value={housingTypeId}
            onChange={(e) => setHousingType(e.target.value)}
            id='HousingType'
          >
            <option value="1">Квартира</option>
            <option value="2">Будинок</option>
            <option value="3">Вілла</option>
            <option value="4">Готель</option>
          </select>
        </div>
      </div>

      {/* Країна + Адреса */}
      <div className={styles.addressSection}>
        <div className={styles.Country}>
          <label htmlFor='Country'>Країна</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            id='Country'
          >
            <option value="">Оберіть країну</option>
            {countriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.Adress} style={{ position: 'relative' }}>
          <label htmlFor='Address'>Адреса</label>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            id='Address'
            autoComplete="off"
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={addressLoading}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((sugg, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onMouseDown={() => handleSelectSuggestion(sugg)}
                >
                  {sugg.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.capacityGroup}>
          <label htmlFor='setGuests'>Макс. кількість гостей</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            id='setGuests'
          />
        </div>
      </div>

      {/* Параметри */}
      <div className={styles.parametersSection}>
        <div className={styles.parametersLabel}>
          <label>Головні параметри (до 5 на вибір)</label>
          <div className={styles.selectedParameters}>
            {selectedParameters.map((param) => (
              <span key={param} className={styles.parameterTag}>
                {param}
                <button type="button" onClick={() => handleRemoveParameter(param)}>x</button>
              </span>
            ))}
            <button
              type="button"
              className={styles.addParameterButton}
              onClick={() => setShowParameterSelector(!showParameterSelector)}
              disabled={selectedParameters.length >= 5}
            >
              +
            </button>
          </div>

          {showParameterSelector && (
            <div className={styles.parameterSelector}>
              <h3>Виберіть параметри</h3>
              {parametersLoading ? (
                <p>Завантаження...</p>
              ) : (
                allParameters
                  .filter(p => !selectedParameters.includes(p))
                  .map((param) => (
                    <label key={param} className={styles.parameterLabel}>
                      <input
                        type="checkbox"
                        onChange={() => handleAddParameter(param)}
                        disabled={selectedParameters.length >= 5}
                      />
                      {param}
                    </label>
                  ))
              )}
              <button
                type="button"
                onClick={() => setShowParameterSelector(false)}
                className={styles.ParameterButton}
              >
                Закрити
              </button>
            </div>
          )}
        </div>

        <div className={styles.priceCapacitySection}>
          <div className={styles.priceGroup}>
            <label htmlFor='pricePerDay'>Ціна за добу</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              id='pricePerDay'
            />
          </div>
        </div>
      </div>

      {/* Час */}
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
