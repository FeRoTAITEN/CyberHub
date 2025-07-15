import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Lang = 'en' | 'ar';

const translations = { en, ar };

export function useTranslation(lang: Lang) {
  function t(path: string): string {
    const keys = path.split('.');
    let value: any = translations[lang];
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return path;
    }
    return value;
  }
  return { t };
} 