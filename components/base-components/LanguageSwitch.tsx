'use client';

import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { languages } from '@/enums/language';

export default function LanguageSwitch() {
  const { i18n: i18nInstance } = useTranslation();

  const switchLanguage = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    localStorage.setItem('language', newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  return (
    <div className='relative inline-block text-left'>
      <select
        value={i18n.language}
        onChange={(e) => switchLanguage(e.target.value)}
        className='block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
      >
        {languages.map((lang) => (
          <option
            key={lang.value}
            value={lang.value}
          >
            {lang.displayText}
          </option>
        ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg
          className='fill-current h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
        </svg>
      </div>
    </div>
  );
}
