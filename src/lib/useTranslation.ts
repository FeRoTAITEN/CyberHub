import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Lang = 'en' | 'ar';

const translations = { en, ar };

export function useTranslation(lang: Lang) {
  function t(path: string): string {
    const keys = path.split('.');
    let value: unknown = translations[lang];
    for (const key of keys) {
      if (typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
      if (value === undefined) return path;
    }
    return typeof value === 'string' ? value : path;
  }
  return { t };
} 