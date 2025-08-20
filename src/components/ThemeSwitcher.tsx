'use client';

import { useRef, useState, useEffect } from 'react';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { useLang } from '@/app/ClientLayout';

interface ThemeSwitcherProps {
  onThemeChange: (theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => void;
  currentTheme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam';
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
    },
    { 
      code: 'salam', 
      name: 'Salam', 
      nameAr: 'سلام',
      icon: '🟢',
      description: 'Salam Company Brand',
      descriptionAr: 'علامة شركة سلام'
    }
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

  const handleThemeChange = (theme: 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam') => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  const colors = themeColors[currentTheme as keyof typeof themeColors] || themeColors.default;

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
        aria-label="Toggle theme"
      >
        <PaintBrushIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[200px]">
          <div className={`${colors.modalBg} backdrop-blur-xl border ${colors.border} p-2 space-y-1 rounded-xl shadow-2xl`}>
            {themes.map((theme) => (
              <button
                key={theme.code}
                onClick={() => handleThemeChange(theme.code as 'default' | 'light' | 'midnight' | 'novel' | 'cyber' | 'salam')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${colors.hoverBg} ${
                  currentTheme === theme.code
                    ? `${colors.activeBg} ${colors.activeText} border ${colors.activeBorder}`
                    : `${colors.inactiveText} hover:${colors.hoverText}`
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang === 'ar' ? theme.nameAr : theme.name}</div>
                  <div className="text-xs opacity-70">{lang === 'ar' ? theme.descriptionAr : theme.description}</div>
                </div>
                {currentTheme === theme.code && (
                  <div className={`w-2 h-2 ${colors.activeIndicator} rounded-full`}></div>
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