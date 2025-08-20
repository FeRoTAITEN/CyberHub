'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  HomeIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  PlayIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
// import LanguageSwitcher from './LanguageSwitcher'; // Unused component
// import ThemeSwitcher from './ThemeSwitcher'; // Unused component
// import FontSwitcher from './FontSwitcher'; // Unused component
import Image from 'next/image';
import SwitchersDropdown from './SwitchersDropdown';
import UserMenu from './UserMenu';

// Helper hook to get window width
function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation(lang);
  const width = useWindowWidth();
  const menuRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Theme-aware styling
  const isSalam = theme === 'salam';
  // const isLight = theme === 'light'; // Unused variable
  // const isDark = !isSalam && !isLight; // Unused variable

  // Theme colors for More dropdown
  const themeColors = {
    modalBg: isSalam ? 'bg-white/95' : 'bg-slate-900/95',
    border: isSalam ? 'border-[#003931]' : 'border-slate-700',
    activeBg: isSalam ? 'bg-[#00F000]' : 'bg-green-600',
    activeText: isSalam ? 'text-[#003931]' : 'text-white',
    inactiveText: isSalam ? 'text-[#005147]' : 'text-slate-300',
    hoverText: isSalam ? 'text-[#003931]' : 'text-white',
    hoverBg: isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-700',
    buttonHover: isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-700',
    buttonFocus: isSalam ? 'focus:ring-[#00F000]' : 'focus:ring-green-500',
    buttonFocusOffset: isSalam ? 'focus:ring-offset-white' : 'focus:ring-offset-slate-900'
  };

  // جميع عناصر الـ navbar
  const navigationItems = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    { name: t('nav.about'), href: '/about', icon: ShieldCheckIcon },
    { name: t('nav.news'), href: '/news', icon: NewspaperIcon },
    { name: t('nav.staff'), href: '/staff', icon: UserGroupIcon },
    { name: t('nav.qa'), href: '/qa', icon: QuestionMarkCircleIcon },
    { name: t('nav.games'), href: '/games', icon: PlayIcon },
          { name: lang === 'ar' ? 'الحوكمة' : 'Governance', href: '/governance', icon: DocumentTextIcon },
    { name: t('nav.projects'), href: '/projects', icon: ChartBarIcon },
    // تصغير اسم لوحة التحكم
    { name: lang === 'ar' ? 'لوحة' : 'Dash', href: '/dashboard', icon: ChartBarIcon },
    // Add Services page to More dropdown
    { name: lang === 'ar' ? 'الخدمات' : 'Services', href: '/services', icon: ShieldCheckIcon },
    // Add Shift Management page
    { name: lang === 'ar' ? 'المناوبات' : 'Shifts', href: '/shifts', icon: ClockIcon },
    // Add GRC Management page
    { name: t('nav.grc'), href: '/grc', icon: DocumentTextIcon },
    // Add Excellent page
    { name: lang === 'ar' ? 'التميز' : 'Excellent', href: '/excellent', icon: ShieldCheckIcon },
    // Add Survey Reports page to More dropdown
    { name: lang === 'ar' ? 'التقارير' : 'Reports', href: '/surveys/report', icon: ClipboardDocumentCheckIcon },
  ];

  // تحديد العناصر المرئية حسب حجم الشاشة
  const getVisibleItems = () => {
    if (width >= 1300) { // >=1300px - أول 4 عناصر نصية + قائمة المزيد
      return {
        visibleItems: navigationItems.slice(0, 4),
        moreItems: navigationItems.slice(4),
        showIcons: false,
        showMenu: false
      };
    } else if (width >= 768) { // أقل من 1300px - أيقونات فقط + قائمة المزيد
      return {
        visibleItems: navigationItems.slice(0, 4),
        moreItems: navigationItems.slice(4),
        showIcons: true,
        showMenu: false
      };
    } else { // sm وأقل - كل شيء في menu
      return {
        visibleItems: [],
        moreItems: navigationItems,
        showIcons: false,
        showMenu: true
      };
    }
  };

  const { visibleItems, moreItems, showIcons, showMenu } = getVisibleItems();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // إغلاق القوائم عند تغيير الصفحة
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoreDropdownOpen(false);
  }, [pathname]);

  // منع تمرير الصفحة عند فتح القوائم
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const username = 'Turki Alshehri'; // اجعلها ديناميكية لاحقًا إذا أردت

  return (
    <nav className={`bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50 transition-all duration-300 ${isMobileMenuOpen || isMoreDropdownOpen ? 'shadow-2xl' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo + Brand */}
          <div className={`flex items-center gap-4 ${lang === 'ar' ? 'ml-12' : 'mr-12'}`}> 
            <Link href="/" className="flex items-center gap-0 -mr-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/images/salam logo.png" 
              alt="Salam Logo" 
                width={60} 
                height={60} 
                className=""
            />
              <span className="text-xl font-bold text-white leading-tight">Cyber Hub</span>
            </Link>
          </div>

          {/* Center: Navigation Items */}
          <div className={`hidden md:flex items-center gap-4 ${lang === 'ar' ? 'mr-6' : 'ml-6'}`}>
            {/* أول 4 عناصر */}
            {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive(item.href)
                        ? 'active'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  {!showIcons && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              );
            })}
            {/* قائمة المزيد */}
            {moreItems.length > 0 && !showMenu && (
              <div ref={moreDropdownRef} className={`relative ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <button
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${themeColors.inactiveText} ${themeColors.hoverText} ${themeColors.buttonHover} focus:outline-none focus:ring-2 ${themeColors.buttonFocus} focus:ring-offset-2 ${themeColors.buttonFocusOffset} ${isMoreDropdownOpen ? `ring-2 ${themeColors.buttonFocus}` : ''}`}
                  aria-label={t('nav.more')}
                  aria-expanded={isMoreDropdownOpen}
                >
                  {!showIcons && <span className="text-sm font-medium">{t('nav.more')}</span>}
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* قائمة المزيد المنسدلة */}
                {isMoreDropdownOpen && (
                  <div className={`absolute top-full right-0 mt-2 w-56 ${themeColors.modalBg} backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl z-50 py-3`}>
                    <div className="space-y-1">
                      {moreItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMoreDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                              isActive(item.href)
                                ? `${themeColors.activeBg} ${themeColors.activeText} shadow-lg`
                                : `${themeColors.inactiveText} ${themeColors.hoverText} ${themeColors.hoverBg}`
                            }`}
                            style={{
                              animation: `slideInFromTop 0.3s ease-out ${index * 50}ms forwards`
                            }}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
                )}
              </div>
            )}
            {/* فاصل ديناميكي بين القائمة والسويتشرات */}
            <div className={`${lang === 'ar' ? 'mr-0 ml-8' : 'ml-0 mr-8'}`}></div>
          </div>

          {/* Right: Switchers + Mobile Menu */}
          <div className={`flex items-center gap-4 ${lang === 'ar' ? 'pl-2' : 'pr-2'}`}> 
            <SwitchersDropdown 
              theme={theme} 
              setTheme={setTheme} 
              lang={lang} 
              setLang={setLang} 
            />
            {/* زر اسم المستخدم */}
            <UserMenu username={username} lang={lang} />
            {/* زر القائمة للهواتف */}
            {showMenu && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${themeColors.inactiveText} ${themeColors.hoverText} ${themeColors.buttonHover} transition-all duration-200 focus:outline-none focus:ring-2 ${themeColors.buttonFocus} focus:ring-offset-2 ${themeColors.buttonFocusOffset}`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && showMenu && (
        <div ref={menuRef} className={`absolute left-0 right-0 ${themeColors.modalBg} backdrop-blur-md border-t ${themeColors.border} shadow-2xl z-50`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-4">
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:scale-105 ${
                    isActive(item.href)
                        ? `${themeColors.activeBg} ${themeColors.activeText} shadow-lg`
                      : `${themeColors.inactiveText} ${themeColors.hoverText} ${themeColors.hoverBg}`
                  }`}
                    style={{
                      animation: `slideInFromTop 0.3s ease-out ${index * 50}ms forwards`
                    }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 