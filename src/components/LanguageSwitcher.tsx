'use client';

import { useRef, useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLang } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

interface LanguageSwitcherProps {
  onLanguageChange: (lang: 'en' | 'ar') => void;
  currentLanguage: 'en' | 'ar';
  dropdownStyle?: boolean;
  theme?: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
}

export default function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange, 
  theme 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const { t } = useTranslation(lang);

  const languages = [
    { code: 'en', flag: '🇺🇸' },
    { code: 'ar', flag: '🇸🇦' }
  ];

  // Theme-specific color schemes for modals
  const themeColors = {
    default: {
      modalBg: 'bg-slate-900/95',
      border: 'border-slate-700',
      activeBg: 'bg-green-600/20',
      activeText: 'text-green-400',
      activeBorder: 'border-green-500/30',
      inactiveText: 'text-slate-300',
      hoverText: 'text-white',
      hoverBg: 'hover:bg-white/10',
      activeIndicator: 'bg-green-400'
    },
    light: {
      modalBg: 'bg-white/95',
      border: 'border-slate-200',
      activeBg: 'bg-green-100',
      activeText: 'text-green-700',
      activeBorder: 'border-green-400',
      inactiveText: 'text-slate-600',
      hoverText: 'text-slate-900',
      hoverBg: 'hover:bg-slate-100',
      activeIndicator: 'bg-green-600'
    },
    midnight: {
      modalBg: 'bg-slate-800/95',
      border: 'border-slate-600',
      activeBg: 'bg-cyan-500/20',
      activeText: 'text-cyan-400',
      activeBorder: 'border-cyan-500/30',
      inactiveText: 'text-slate-300',
      hoverText: 'text-white',
      hoverBg: 'hover:bg-white/10',
      activeIndicator: 'bg-cyan-400'
    },
    novel: {
      modalBg: 'bg-gray-800/95',
      border: 'border-gray-600',
      activeBg: 'bg-yellow-600/20',
      activeText: 'text-yellow-400',
      activeBorder: 'border-yellow-500/30',
      inactiveText: 'text-gray-300',
      hoverText: 'text-white',
      hoverBg: 'hover:bg-white/10',
      activeIndicator: 'bg-yellow-400'
    },
    cyber: {
      modalBg: 'bg-zinc-900/95',
      border: 'border-zinc-700',
      activeBg: 'bg-green-500/20',
      activeText: 'text-green-400',
      activeBorder: 'border-green-500/30',
      inactiveText: 'text-zinc-300',
      hoverText: 'text-white',
      hoverBg: 'hover:bg-white/10',
      activeIndicator: 'bg-green-400'
    },
    salam: {
      modalBg: 'bg-white/95',
      border: 'border-[#003931]',
      activeBg: 'bg-[#EEFDEC]',
      activeText: 'text-[#003931]',
      activeBorder: 'border-[#00F000]',
      inactiveText: 'text-[#005147]',
      hoverText: 'text-black',
      hoverBg: 'hover:bg-[#EEFDEC]/50',
      activeIndicator: 'bg-[#00F000]'
    }
  };

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  // const currentLang = languages.find(lang => lang.code === currentLanguage); // Unused variable
  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lang-switch group p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
        aria-label={t('lang.' + (lang === 'ar' ? 'en' : 'ar'))}
      >
        <GlobeAltIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[160px]">
          <div className={`${colors.modalBg} backdrop-blur-xl border ${colors.border} p-2 space-y-1 rounded-xl shadow-2xl`}>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code as 'en' | 'ar')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${colors.hoverBg} ${
                  currentLanguage === language.code 
                    ? `${colors.activeBg} ${colors.activeText} border ${colors.activeBorder}` 
                    : `${colors.inactiveText} hover:${colors.hoverText}`
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{t('lang.' + language.code)}</div>
                </div>
                {currentLanguage === language.code && <span className={`w-2 h-2 ${colors.activeIndicator} rounded-full ml-auto`}></span>}
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