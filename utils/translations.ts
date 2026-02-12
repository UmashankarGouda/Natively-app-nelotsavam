
import { translations } from '../data/translations';
import { AppLanguage } from '../types';

export const getTranslation = (key: string, language: AppLanguage): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  
  return translation[language.code] || translation.en || key;
};

export const t = (key: string, language: AppLanguage): string => {
  return getTranslation(key, language);
};
