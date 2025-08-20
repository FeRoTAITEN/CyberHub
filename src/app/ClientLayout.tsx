'use client';

import { useState, createContext, useContext, useEffect } from 'react';

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

// مفاتيح localStorage
const LANG_STORAGE_KEY = 'cyber-hub-language';
const THEME_STORAGE_KEY = 'cyber-hub-theme';
const FONT_STORAGE_KEY = 'cyber-hub-font';

// دالة لتحميل القيم من localStorage
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

// دالة لحفظ القيم في localStorage
const saveToStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// دالة لتطبيق الخط على body
const applyFontToBody = (font: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '') => {
  if (typeof window === 'undefined') return;
  
  const body = document.body;
  // إزالة جميع فئات الخطوط
  body.classList.remove('font-cairo', 'font-tajawal', 'font-noto', 'font-amiri', 'font-frutiger', 'font-icomoon', 'font-kufi');
  // إضافة فئة الخط المحدد إذا كان محدداً
  if (font) {
    body.classList.add(`font-${font}`);
  }
  // إذا لم يكن هناك خط محدد، سيتم تطبيق الخط الأساسي من CSS
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // تحميل القيم المحفوظة من localStorage
  const [lang, setLangState] = useState<'en' | 'ar'>('en');
  
  const [theme, setThemeState] = useState<'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam'>('default');

  const [font, setFontState] = useState<'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | ''>('');

  // حالة loading لضمان عدم حدوث مشاكل في SSR
  const [isLoaded, setIsLoaded] = useState(false);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // دالة لتحديث اللغة مع الحفظ
  const setLang = (newLang: 'en' | 'ar') => {
    setLangState(newLang);
    saveToStorage(LANG_STORAGE_KEY, newLang);
  };

  // دالة لتحديث الثيم مع الحفظ
  const setTheme = (newTheme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => {
    setThemeState(newTheme);
    saveToStorage(THEME_STORAGE_KEY, newTheme);
  };

  // دالة لتحديث الخط مع الحفظ والتطبيق
  const setFont = (newFont: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | 'kufi' | '') => {
    setFontState(newFont);
    saveToStorage(FONT_STORAGE_KEY, newFont);
    applyFontToBody(newFont);
  };

  // تطبيق الثيم على body
  useEffect(() => {
    const body = document.body;
    // إزالة جميع فئات الثيم
    body.classList.remove('theme-light', 'theme-midnight', 'theme-novel', 'theme-cyber', 'theme-salam');
    
    // إضافة فئة الثيم الحالي
    if (theme !== 'default') {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // تطبيق الخط على body
  useEffect(() => {
    applyFontToBody(font);
  }, [font]);

  // تحميل القيم المحفوظة عند بدء التطبيق
  useEffect(() => {
    // تحميل القيم المحفوظة مرة واحدة فقط عند بدء التطبيق
    const savedLang = loadFromStorage(LANG_STORAGE_KEY, 'en') as 'en' | 'ar';
    const savedTheme = loadFromStorage(THEME_STORAGE_KEY, 'default') as 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
    const savedFont = loadFromStorage(FONT_STORAGE_KEY, 'cairo') as 'cairo' | 'tajawal' | 'noto';
    
    // تحديث الحالة فقط إذا كانت القيم مختلفة
    if (savedLang !== lang) {
      setLangState(savedLang);
    }
    
    if (savedTheme !== theme) {
      setThemeState(savedTheme);
    }

    if (savedFont !== font) {
      setFontState(savedFont);
    }
    
    // تحديد أن التطبيق تم تحميله
    setIsLoaded(true);
  }, [lang, theme, font]); // Added missing dependencies

  // تطبيق الخط واللغة والثيم على document.documentElement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.fontFamily = font;
      document.documentElement.lang = lang;
      document.documentElement.className = theme;
    }
  }, [font, lang, theme]);



  // عرض loading حتى يتم تحميل القيم
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