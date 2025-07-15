import React, { useEffect, useState, useRef } from 'react';

function LanguageSelector({ selectedLanguages, setSelectedLanguages }) {
  const [languagesList, setLanguagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=languages');
        if (!response.ok) throw new Error('Ошибка при загрузке языков');

        const countries = await response.json();

        // Собираем пары {code, name}
        const langsWithCodes = countries.flatMap(country => {
          if (!country.languages) return [];
          return Object.entries(country.languages).map(([code, name]) => ({ code, name }));
        });

        // Уникальные по коду
        const uniqueLangsMap = new Map();
        langsWithCodes.forEach(({ code, name }) => {
          if (!uniqueLangsMap.has(code)) {
            uniqueLangsMap.set(code, name);
          }
        });

        // Массив объектов {code, name}, отсортированный по имени
        const uniqueLangs = Array.from(uniqueLangsMap, ([code, name]) => ({ code, name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setLanguagesList(uniqueLangs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, []);

  // Закрытие дропдауна при клике вне
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (code) => {
    if (selectedLanguages.includes(code)) {
      setSelectedLanguages(selectedLanguages.filter(c => c !== code));
    } else {
      setSelectedLanguages([...selectedLanguages, code]);
    }
  };

  if (loading) return <p>Загрузка языков...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  // Для отображения выбраны названия, а не коды
  const selectedNames = selectedLanguages
    .map(code => {
      const lang = languagesList.find(l => l.code === code);
      return lang ? lang.name : code;
    });

  const selectedText = selectedNames.length > 0 ? selectedNames.join(', ') : 'Выберите языки';

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: 250, userSelect: 'none' }}>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        style={{ border: '1px solid #ccc', padding: '8px', cursor: 'pointer' }}
      >
        {selectedText}
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          {languagesList.map(({ code, name }) => (
            <label key={code} style={{ display: 'block', padding: '4px 8px' }}>
              <input
                type="checkbox"
                checked={selectedLanguages.includes(code)}
                onChange={() => toggleLanguage(code)}
                style={{ marginRight: 8 }}
              />
              {name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
