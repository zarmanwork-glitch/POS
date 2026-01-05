'use client';

import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { languages } from '@/enums/language';
import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function LanguageSwitch() {
  const { i18n: i18nInstance } = useTranslation();
  const [value, setValue] = React.useState<string>(
    i18nInstance.language || 'en'
  );

  React.useEffect(() => {
    setValue(i18nInstance.language || 'en');
  }, [i18nInstance.language]);

  const switchLanguage = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    localStorage.setItem('language', newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    setValue(newLocale);
  };

  return (
    <div className='inline-block'>
      <Select
        value={value}
        onValueChange={switchLanguage}
      >
        <SelectTrigger
          size='sm'
          className='w-36'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem
              key={lang.value}
              value={lang.value}
            >
              {lang.displayText}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
