'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

export const LangContext = createContext<{ lang: 'en' | 'ar'; setLang: (l: 'en' | 'ar') => void }>({ lang: 'en', setLang: () => {} });
export const ThemeContext = createContext<{ theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam'; setTheme: (t: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => void }>({ theme: 'default', setTheme: () => {} });
export const FontContext = createContext<{ font: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | ''; setFont: (f: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '') => void }>({ font: '', setFont: () => {} });

export function useLang() {
  return useContext(LangContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useFont() {
  return useContext(FontContext);
}

// LocalStorage keys for persistence
const LANG_STORAGE_KEY = 'cyber-hub-language';
const THEME_STORAGE_KEY = 'cyber-hub-theme';
const FONT_STORAGE_KEY = 'cyber-hub-font';

// Utility function to load values from localStorage
const loadFromStorage = (key: string, defaultValue: string) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored || defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Utility function to save values to localStorage
const saveToStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Function to apply font to body element
const applyFontToBody = (font: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '') => {
  if (typeof window === 'undefined') return;
  
  const body = document.body;
  // Remove all font classes
  body.classList.remove('font-cairo', 'font-tajawal', 'font-noto', 'font-amiri', 'font-frutiger', 'font-icomoon', 'font-kufi');
  // Add selected font class if specified
  if (font) {
    body.classList.add(`font-${font}`);
  }
  // If no font specified, default font from CSS will be applied
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Load saved values from localStorage
  const [lang, setLangState] = useState<'en' | 'ar'>('en');
  
  const [theme, setThemeState] = useState<'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam'>('default');

  const [font, setFontState] = useState<'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | ''>('');

  // Loading state to prevent SSR issues
  const [isLoaded, setIsLoaded] = useState(false);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Function to update language with persistence
  const setLang = (newLang: 'en' | 'ar') => {
    setLangState(newLang);
    saveToStorage(LANG_STORAGE_KEY, newLang);
  };

  // Function to update theme with persistence
  const setTheme = (newTheme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => {
    setThemeState(newTheme);
    saveToStorage(THEME_STORAGE_KEY, newTheme);
  };

  // Function to update font with persistence and application
  const setFont = (newFont: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '') => {
    setFontState(newFont);
    saveToStorage(FONT_STORAGE_KEY, newFont);
    applyFontToBody(newFont);
  };

  // Apply theme to body element
  useEffect(() => {
    const body = document.body;
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-midnight', 'theme-novel', 'theme-cyber', 'theme-salam');
    
    // Add current theme class
    if (theme !== 'default') {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // Apply font to body element
  useEffect(() => {
    applyFontToBody(font);
  }, [font]);

  // Load saved values on application start
  useEffect(() => {
    // Load saved values once on application start
    const savedLang = loadFromStorage(LANG_STORAGE_KEY, 'en') as 'en' | 'ar';
    const savedTheme = loadFromStorage(THEME_STORAGE_KEY, 'default') as 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
    const savedFont = loadFromStorage(FONT_STORAGE_KEY, 'cairo') as 'cairo' | 'tajawal' | 'noto';
    
    // Update state only if values are different
    if (savedLang !== lang) {
      setLangState(savedLang);
    }
    
    if (savedTheme !== theme) {
      setThemeState(savedTheme);
    }

    if (savedFont !== font) {
      setFontState(savedFont);
    }
    
    // Mark application as loaded
    setIsLoaded(true);
  }, []); // Empty dependency array ensures execution only once

  // Show loading until values are loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">
            {lang === 'ar' ? 'جاري تحميل البوابة...' : 'Loading Portal...'}
          </p>
        </div>
      </div>
    );
  }

  const { t } = useTranslation(lang);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <FontContext.Provider value={{ font, setFont }}>
        <div lang={lang} dir={dir} style={{ minHeight: '100vh' }}>
          {children}
        </div>
        </FontContext.Provider>
      </ThemeContext.Provider>
    </LangContext.Provider>
  );
} 