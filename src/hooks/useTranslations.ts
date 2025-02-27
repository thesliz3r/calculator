import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslations = () => {
  const { language } = useContext(LanguageContext);
  return { t: translations[language] };
}; 