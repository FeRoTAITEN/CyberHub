import { useRef, useState, useEffect } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useLang, useFont } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';

const FONTS = [
  { 
    code: 'default', 
    name: 'Default', 
    nameAr: 'افتراضي',
    description: 'Cyber Hub Original',
    descriptionAr: 'الأصلي Cyber Hub'
  },
  { 
    code: 'cairo', 
    name: 'Cairo', 
    nameAr: 'كايرو',
    description: 'Modern Arabic',
    descriptionAr: 'عربي عصري'
  },
  { 
    code: 'tajawal', 
    name: 'Tajawal', 
    nameAr: 'تجوال',
    description: 'Professional',
    descriptionAr: 'احترافي'
  },
  { 
    code: 'noto', 
    name: 'Noto Sans Arabic', 
    nameAr: 'نوتو سانس',
    description: 'Google Font',
    descriptionAr: 'خط جوجل'
  },
  { 
    code: 'amiri', 
    name: 'Amiri', 
    nameAr: 'أميري',
    description: 'Classic Arabic',
    descriptionAr: 'خط عربي كلاسيكي'
  },
  { 
    code: 'frutiger', 
    name: 'Frutiger LT Arabic', 
    nameAr: 'فروتيجر إل تي',
    description: 'Professional Arabic',
    descriptionAr: 'خط عربي احترافي'
  },
  { 
    code: 'icomoon', 
    name: 'Icomoon', 
    nameAr: 'أيكون مون',
    description: 'Icon Font',
    descriptionAr: 'خط الأيقونات'
  },
];

interface FontSwitcherProps {
  dropdownStyle?: boolean;
  theme?: 'default' | 'light' | 'midnight' | 'novel' | 'cyber';
}

export default function FontSwitcher({ dropdownStyle, theme }: FontSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLang();
  const { font, setFont } = useFont();
  const { t } = useTranslation(lang);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleFontChange = (newFont: 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | '') => {
    setFont(newFont);
    setIsOpen(false);
  };

  if (dropdownStyle) {
    return (
      <div className="flex flex-col gap-2 min-w-[160px]">
        {FONTS.map(fontOption => (
          <button
            key={fontOption.code}
            onClick={() => handleFontChange(fontOption.code as 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | '')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
              font === fontOption.code ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex-1 text-left">
              <div className={`${fontOption.code ? `font-${fontOption.code}` : ''} font-medium`}>
                {lang === 'ar' ? fontOption.nameAr : fontOption.name}
              </div>
              <div className="text-xs opacity-70">
                {lang === 'ar' ? fontOption.descriptionAr : fontOption.description}
              </div>
            </div>
            {font === fontOption.code && <span className="w-2 h-2 bg-green-400 rounded-full ml-auto"></span>}
          </button>
        ))}
      </div>
    );
  }
  
  // السلوك الافتراضي (زر وقائمة منسدلة)
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lang-switch group"
        aria-label={t('font.switch')}
      >
        <SparklesIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[200px]">
          <div className={`${theme === 'default' ? 'bg-slate-800' : 'card-glass'} p-2 space-y-1 rounded-xl`}>
            {FONTS.map(fontOption => (
              <button
                key={fontOption.code}
                onClick={() => handleFontChange(fontOption.code as 'cairo' | 'tajawal' | 'noto' | 'amiri' | 'frutiger' | 'icomoon' | '')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                  font === fontOption.code ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{fontOption.icon}</span>
                <div className="flex-1 text-left">
                  <div className={`${fontOption.code ? `font-${fontOption.code}` : ''} font-medium`}>
                    {lang === 'ar' ? fontOption.nameAr : fontOption.name}
                  </div>
                  <div className="text-xs opacity-70">
                    {lang === 'ar' ? fontOption.descriptionAr : fontOption.description}
                  </div>
                </div>
                {font === fontOption.code && <span className="w-2 h-2 bg-green-400 rounded-full ml-auto"></span>}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
} 