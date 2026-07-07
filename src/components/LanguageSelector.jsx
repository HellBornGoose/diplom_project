import React, { useEffect, useState, useRef } from 'react';
import ISO6391 from 'iso-639-1';

function LanguageSelector({ languages = [], setLanguages }) {
  const [languagesList] = useState(() =>{
    const allCodes = ISO6391.getAllCodes();
    return ISO6391.getLanguages(allCodes).map(lang =>({
      code: lang.code,
      name: lang.name
    }))
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


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
    if (!Array.isArray(languages) || typeof setLanguages !== 'function') {
      console.error('Invalid languages or setLanguages prop:', { languages, setLanguages });
      return;
    }

    const updatedLanguages = languages.includes(code)
      ? languages.filter(c => c !== code)
      : [...languages, code];

    console.log('Toggling language:', { code, updatedLanguages });
    setLanguages(updatedLanguages);
  };

  // Для отображения выбраны названия, а не коды
  const selectedNames = languages.map(code => {
    const lang = languagesList.find(l => l.code === code);
    return lang ? lang.name : code;
  });

  const selectedText = selectedNames.length > 0 ? selectedNames.join(', ') : 'Выберите языки';

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: 470, userSelect: 'none' }}>
      <div
        onClick={() => setIsOpen(prev => !prev)}
        style={{ border: '3px solid #5D589A', borderRadius: '10px', backgroundColor: '#FFF', padding: '8px', cursor: 'pointer', color: '#5D589A' }}
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
            <label key={code} style={{ display: 'block', padding: '0.2em 0.5em' }}>
              <input
                type="checkbox"
                checked={languages.includes(code)}
                onChange={() => toggleLanguage(code)}
                style={{display: 'inline-block', padding: '0.2em 0.5em', marginRight: 8 }}
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