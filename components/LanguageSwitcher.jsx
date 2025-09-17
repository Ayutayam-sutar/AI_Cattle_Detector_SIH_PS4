// components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    console.log('Attempting to change language to:', langCode); 
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="language-switcher">
      <select 
        className="border border-stone-200 bg-stone-50 rounded-md p-2 text-sm text-stone-700 hover:bg-stone-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        onChange={handleLanguageChange} 
        value={i18n.resolvedLanguage}
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;

