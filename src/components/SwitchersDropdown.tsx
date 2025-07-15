import { useRef, useState, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import FontSwitcher from './FontSwitcher';

interface SwitchersDropdownProps {
  theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber';
  setTheme: (t: 'default' | 'light' | 'midnight' | 'novel' | 'cyber') => void;
  lang: 'en' | 'ar';
  setLang: (l: 'en' | 'ar') => void;
}

export default function SwitchersDropdown({ theme, setTheme, lang, setLang }: SwitchersDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className={`p-2 rounded-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${open ? 'ring-2 ring-green-500' : ''}`}
        aria-label={lang === 'ar' ? 'خيارات التبديل' : 'Switchers options'}
        aria-expanded={open}
      >
        <Cog6ToothIcon className="w-6 h-6" />
      </button>
      {open && (
        <div className={`absolute top-full right-0 mt-2 min-w-[180px] z-50 ${theme === 'default' ? 'bg-slate-800' : 'card-glass'} p-3 flex flex-row gap-3 shadow-2xl border border-slate-700 rounded-xl items-center justify-center`}>
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