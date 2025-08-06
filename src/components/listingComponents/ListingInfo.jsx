import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/ListingInfo.module.css';
import { NGROK_URL } from '../../Hooks/config';

const ListingInfo = ({ initialData = {}, onFormDataChange }) => {
  const [name, setName] = useState('');
  const [housingTypeId, setHousingType] = useState('1');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [streetWithNumber, setStreet] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  const [country, setCountry] = useState('');
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [checkIn, setCheckIn] = useState('16:00');
  const [checkOut, setCheckOut] = useState('10:00');
  const [guests, setGuests] = useState(1);
  const [price, setPrice] = useState('');
  const [showParameterSelector, setShowParameterSelector] = useState(false);
  const [allParameters, setAllParameters] = useState([]);
  const [parametersLoading, setParametersLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

  const timeoutRef = useRef(null);
  const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';
  const isInitialSet = useRef(false);

  // Инициализация с initialData
  useEffect(() => {
    if (initialData && !isInitialSet.current) {
      console.log('Initializing with initialData:', initialData); // Отладка
      setName(initialData.title || '');
      setCountry(initialData.country || '');
      setHousingType(String(initialData.houseTypeId || '1'));
      setLocation(initialData.location || '');
      setCity(initialData.city || '');
      setStreet(initialData.location || ''); // Временное решение
      setCheckIn(initialData.checkInTime || '16:00');
      setCheckOut(initialData.checkOutTime || '10:00');
      setGuests(initialData.maxTenants || 1);
      setPrice(initialData.perDay?.toString() || '0');
      const params = (initialData.selectedParameters || []).map(param =>
        typeof param === 'string' ? param : param.name || param
      ).filter(Boolean);
      setSelectedParameters(params);
      isInitialSet.current = true;
      onFormDataChange(generatePostData());
    }
  }, [initialData, onFormDataChange]);

  // Загрузка параметров
  useEffect(() => {
    const fetchMainFeatures = async () => {
      try {
        const res = await fetch(`${NGROK_URL}/api/listing/main-features`);
        if (!res.ok) throw new Error(`Failed to fetch main features: ${res.status}`);
        const data = await res.json();
        setAllParameters(data.map(item => ({
          id: item.id,
          name: item.name,
          value: item.value || null,
        })));
      } catch (err) {
        console.error('Error fetching main features:', err);
        setAllParameters([]);
      } finally {
        setParametersLoading(false);
      }
    };
    fetchMainFeatures();
  }, []);

  // Загрузка стран
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name'); 
        if (!res.ok) throw new Error(`Failed to fetch countries: ${res.status}`);
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

  // Автоподсказки адреса
  useEffect(() => {
    setHasSelectedSuggestion(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (location.trim()) {
      timeoutRef.current = setTimeout(async () => {
        setAddressLoading(true);
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(location)}&lang=en&limit=5&apiKey=${apiKey}`
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

  // Обработка выбора адреса
  const handleSelectSuggestion = (suggestion) => {
    const props = suggestion.properties;
    let street = props.street || '';
    if (props.housenumber) street += ` ${props.housenumber}`;
    setLocation(props.formatted || '');
    setStreet(street || props.formatted || '');
    setCountry(props.country || '');
    setCity(props.city || props.state || props.town || props.village || '');
    setHasSelectedSuggestion(true);
    setShowSuggestions(false);
    onFormDataChange(generatePostData());
  };

  // Управление параметрами
  const handleAddParameter = (paramName) => {
    if (selectedParameters.length < 5 && !selectedParameters.includes(paramName)) {
      setSelectedParameters([...selectedParameters, paramName]);
      onFormDataChange(generatePostData());
    }
  };

  const handleRemoveParameter = (paramName) => {
    setSelectedParameters(selectedParameters.filter(p => p !== paramName));
    onFormDataChange(generatePostData());
  };

  // Формирование данных для отправки
  const generatePostData = () => {
    const mainFeatureIds = selectedParameters
      .map(paramName => allParameters.find(p => p.name === paramName)?.id || null)
      .filter(id => id != null);
    const mainFeatureValues = selectedParameters
      .map(paramName => allParameters.find(p => p.name === paramName)?.value || null)
      .filter((value, index) => mainFeatureIds[index] != null);

    return {
      title: name,
      houseTypeId: parseInt(housingTypeId) || 1,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      perDay: parseFloat(price.replace(/[^0-9.]/g, '') || '0') || 0,
      perMonth: null,
      perWeak: null,
      location: streetWithNumber,
      model3DUrl: null,
      mainFeatureIds,
      mainFeatureValues,
      maxTenants: parseInt(guests) || 1,
      city,
      country,
      selectedParameters, // Добавляем selectedParameters в возвращаемые данные
    };
  };

  // Обновление данных формы при изменении
  useEffect(() => {
    onFormDataChange(generatePostData());
  }, [name, country, housingTypeId, location, selectedParameters, checkIn, checkOut, guests, price, city, streetWithNumber]);

  return (
    <div className={styles.bookingForm}>
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
              disabled={selectedParameters.length >= 5 || parametersLoading}
            >
              +
            </button>
          </div>
          {showParameterSelector && (
            <div className={styles.parameterSelector}>
              <h3>Виберіть параметри</h3>
              {parametersLoading ? (
                <p>Завантаження...</p>
              ) : allParameters.length === 0 ? (
                <p>Параметри недоступні</p>
              ) : (
                allParameters
                  .filter(p => !selectedParameters.includes(p.name))
                  .map((param) => (
                    <label key={param.id} className={styles.parameterLabel}>
                      <input
                        type="checkbox"
                        checked={selectedParameters.includes(param.name)}
                        onChange={() => handleAddParameter(param.name)}
                        disabled={selectedParameters.length >= 5}
                      />
                      {param.name}
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