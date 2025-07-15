'use client';

import { useRef, useState, useEffect } from 'react';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useLang } from '@/app/ClientLayout';

interface ThemeSwitcherProps {
  onThemeChange: (theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber') => void;
  currentTheme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber';
}

const ThemeSwitcher = ({ onThemeChange, currentTheme }: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  const themes = [
    { 
      code: 'default', 
      name: 'Default', 
      nameAr: 'افتراضي',
      icon: '🌙',
      description: 'Cyber Hub Original',
      descriptionAr: 'الأصلي Cyber Hub'
    },
    { 
      code: 'light', 
      name: 'Light', 
      nameAr: 'فاتح',
      icon: '☀️',
      description: 'Clean & Modern',
      descriptionAr: 'نظيف وعصري'
    },
    { 
      code: 'midnight', 
      name: 'Midnight', 
      nameAr: 'منتصف الليل',
      icon: '🌌',
      description: 'Deep Slate Gradient',
      descriptionAr: 'تدرج رمادي عميق'
    },
    { 
      code: 'novel', 
      name: 'Novel', 
      nameAr: 'روائي',
      icon: '📚',
      description: 'Classic Termius',
      descriptionAr: 'كلاسيكي Termius'
    },
    { 
      code: 'cyber', 
      name: 'Cyber', 
      nameAr: 'سيبراني',
      icon: '⚡',
      description: 'Matrix Style',
      descriptionAr: 'نمط المصفوفة'
    }
  ];

  const handleThemeChange = (theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber') => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(theme => theme.code === currentTheme);

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
        className="lang-switch group"
        aria-label="Toggle theme"
      >
        <PaintBrushIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[200px]">
          <div className={`${currentTheme === 'default' ? 'bg-slate-800' : 'card-glass'} p-2 space-y-1 rounded-xl`}>
            {themes.map((theme) => (
              <button
                key={theme.code}
                onClick={() => handleThemeChange(theme.code as 'default' | 'light' | 'midnight' | 'novel' | 'cyber')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 ${
                  currentTheme === theme.code
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang === 'ar' ? theme.nameAr : theme.name}</div>
                  <div className="text-xs opacity-70">{lang === 'ar' ? theme.descriptionAr : theme.description}</div>
                </div>
                {currentTheme === theme.code && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
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

export default ThemeSwitcher; 