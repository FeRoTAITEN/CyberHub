'use client';

import { useRef, useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLang } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

interface LanguageSwitcherProps {
  onLanguageChange: (lang: 'en' | 'ar') => void;
  currentLanguage: 'en' | 'ar';
  dropdownStyle?: boolean;
  theme?: 'default' | 'light' | 'midnight' | 'novel' | 'cyber';
}

const LanguageSwitcher = ({ onLanguageChange, currentLanguage, dropdownStyle, theme }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', flag: '🇺🇸' },
    { code: 'ar', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lang-switch group p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
        aria-label={t('lang.' + (lang === 'ar' ? 'en' : 'ar'))}
      >
        <GlobeAltIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[160px]">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2 space-y-1 rounded-xl shadow-2xl">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code as 'en' | 'ar')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{t('lang.' + language.code)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 