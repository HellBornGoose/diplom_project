import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from '../css/SearchBar.module.css';
import LocationIcon from '../../img/LocationIcon.svg';
import DataIcon from '../../img/DataIcon.svg';
import PeopleIcon from '../../img/PeopleIcon.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSameMonth, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import searchArrow from '../../img/searchArrow.svg';

const SearchBar = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [addressLoading, setAddressLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
  const [startDate, setStartDate] = useState(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null
  );
  const [endDate, setEndDate] = useState(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [adults, setAdults] = useState(parseInt(searchParams.get('guests')) || 1);
  const [children, setChildren] = useState(0);
  const [showPeopleMenu, setShowPeopleMenu] = useState(false);

  const timeoutRef = useRef(null);
  const calendarRef = useRef(null);
  const apiKey = 'b4c12022c2c846d6a7bdeb5e79d87424';

  // Устанавливаем минимальную дату как текущую (7 августа 2025, 08:40 AM CEST)
  const today = new Date('2025-08-07T06:40:00Z'); // Пересчитано на UTC для соответствия CEST

  const handleDateClick = () => {
    setShowCalendar(true);
  };

  const handlePeopleClick = () => {
    setShowPeopleMenu(!showPeopleMenu);
  };

  const increment = (setter) => setter((prev) => prev + 1);
  const decrement = (setter) => setter((prev) => Math.max(0, prev - 1));

  const totalPeopleLabel = children > 0 ? `${adults} Дорослих, ${children} Дітей` : `${adults} Дорослих`;

  const handleSearch = () => {
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
    const totalGuests = adults + children;

    onSearch({
      country: country || '',
      city: city || '',
      guests: totalGuests || 0,
      checkIn: formattedStartDate,
      checkOut: formattedEndDate,
    });
  };

  // Синхронизация состояния с URL
  useEffect(() => {
    const params = {
      location,
      city,
      country,
      checkIn: startDate ? startDate.toISOString().split('T')[0] : '',
      checkOut: endDate ? endDate.toISOString().split('T')[0] : '',
      guests: (adults + children).toString(),
    };
    const newSearchParams = new URLSearchParams(params).toString();
    setSearchParams(newSearchParams);
  }, [location, city, country, startDate, endDate, adults, children, setSearchParams]);

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
    let street = props.street || '';
    if (props.housenumber) street += ` ${props.housenumber}`;
    setLocation(props.formatted || '');
    setCountry(props.country || '');
    setCity(props.city || props.town || props.village || '');
    setHasSelectedSuggestion(true);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target) && !event.target.closest(`.${styles.dataButton}`)) {
        setShowCalendar(false);
      }
      if (showPeopleMenu && !event.target.closest(`.${styles.filterButton}`) && !event.target.closest(`.${styles.peopleMenu}`)) {
        setShowPeopleMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCalendar, showPeopleMenu]);

  let dateLabel = 'Виберіть дати';
  if (startDate && endDate) {
    if (isSameMonth(startDate, endDate)) {
      dateLabel = `${format(startDate, 'd')}–${format(endDate, 'd')} ${format(endDate, 'MMMM', { locale: uk })}`;
    } else {
      dateLabel = `${format(startDate, 'd MMMM', { locale: uk })} – ${format(endDate, 'd MMMM', { locale: uk })}`;
    }
  }

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInput}>
        <img src={LocationIcon} className={styles.searchIcon} alt="Location" />
        <div className={styles.Adress} style={{ position: 'relative' }}>
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
      </div>
      <div className={styles.filterButtons}>
        <div onClick={handleDateClick} className={`${styles.filterButton} ${styles.dataButton}`}>
          <img src={DataIcon} className={styles.filterIcon} alt="Date" />
          <span>{dateLabel}</span>
          {showCalendar && (
            <div className={styles.calendarWrapper} ref={calendarRef}>
              <DatePicker
                className={styles.datePicker}
                locale={uk}
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                  if (start && end) {
                    setShowCalendar(false);
                  }
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                monthsShown={2}
                dateFormat="d MMMM yyyy"
                popperClassName={styles.airbnbDatePicker}
                placeholderText="Дати заїзду та виїзду"
                open={showCalendar}
                onClickOutside={() => setShowCalendar(false)}
                minDate={today} // Запрещаем выбор дат раньше текущей
              />
            </div>
          )}
        </div>
        <div onClick={handlePeopleClick} className={`${styles.filterButton} ${styles.peopleButton}`}>
          <img src={PeopleIcon} className={styles.filterIcon} alt="People" />
          <span className={styles.totalPeople}>{totalPeopleLabel}</span>
          {showPeopleMenu && (
            <div className={styles.peopleMenu}>
              <div>
                <label className={styles.peopleType}>Дорослі:</label>
                <button onClick={() => decrement(setAdults)} className={styles.decrement}>-</button>
                <span className={styles.peopleText}>{adults}</span>
                <button onClick={() => increment(setAdults)} className={styles.increment}>+</button>
              </div>
              <div>
                <label className={styles.peopleType}>Діти:</label>
                <button onClick={() => decrement(setChildren)} className={styles.decrement}>-</button>
                <span className={styles.peopleText}>{children}</span>
                <button onClick={() => increment(setChildren)} className={styles.increment}>+</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <button className={styles.submitButton} onClick={handleSearch}>
        <img src={searchArrow} className={styles.arrowIcon} />
      </button>
    </div>
  );
};

export default SearchBar;