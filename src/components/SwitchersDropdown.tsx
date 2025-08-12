import { useRef, useState, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import FontSwitcher from './FontSwitcher';

interface SwitchersDropdownProps {
  theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
  setTheme: (t: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => void;
  lang: 'en' | 'ar';
  setLang: (l: 'en' | 'ar') => void;
}

export default function SwitchersDropdown({ theme, setTheme, lang, setLang }: SwitchersDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Theme-specific color schemes for the settings modal
  const themeColors = {
    default: {
      modalBg: 'bg-slate-800',
      border: 'border-slate-700',
      buttonHover: 'hover:bg-slate-700',
      ringColor: 'focus:ring-green-500',
      ringOffset: 'focus:ring-offset-slate-900'
    },
    light: {
      modalBg: 'bg-white',
      border: 'border-slate-200',
      buttonHover: 'hover:bg-slate-100',
      ringColor: 'focus:ring-green-500',
      ringOffset: 'focus:ring-offset-white'
    },
    midnight: {
      modalBg: 'bg-slate-800',
      border: 'border-slate-600',
      buttonHover: 'hover:bg-slate-700',
      ringColor: 'focus:ring-cyan-500',
      ringOffset: 'focus:ring-offset-slate-800'
    },
    novel: {
      modalBg: 'bg-gray-800',
      border: 'border-gray-600',
      buttonHover: 'hover:bg-gray-700',
      ringColor: 'focus:ring-yellow-500',
      ringOffset: 'focus:ring-offset-gray-800'
    },
    cyber: {
      modalBg: 'bg-zinc-900',
      border: 'border-zinc-700',
      buttonHover: 'hover:bg-zinc-800',
      ringColor: 'focus:ring-green-500',
      ringOffset: 'focus:ring-offset-zinc-900'
    },
    salam: {
      modalBg: 'bg-white',
      border: 'border-[#003931]',
      buttonHover: 'hover:bg-[#EEFDEC]',
      ringColor: 'focus:ring-[#00F000]',
      ringOffset: 'focus:ring-offset-white'
    }
  };

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-lg ${colors.buttonHover} transition-all duration-200 focus:outline-none focus:ring-2 ${colors.ringColor} focus:ring-offset-2 ${colors.ringOffset} ${open ? `ring-2 ${colors.ringColor}` : ''}`}
        aria-label={lang === 'ar' ? 'خيارات التبديل' : 'Switchers options'}
        aria-expanded={open}
      >
        <Cog6ToothIcon className="w-6 h-6" />
      </button>
      {open && (
        <div className={`absolute top-full right-0 mt-2 min-w-[180px] z-50 ${colors.modalBg} p-3 flex flex-row gap-3 shadow-2xl border ${colors.border} rounded-xl items-center justify-center`}>
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} theme={theme} />
          <FontSwitcher theme={theme} />
        </div>
      )}
      {/* Backdrop لإغلاق القائمة عند الضغط خارجها */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
} 