'use client';

import Navigation from '@/components/Navigation';
import { 
  UserGroupIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function StaffPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState<Array<{
    id: number;
    name: string;
    name_ar?: string;
    email: string;
    phone?: string;
    position?: string;
    position_ar?: string;
    job_title?: string;
    job_title_ar?: string;
    department?: {
      id: number;
      name: string;
      description?: string;
    };
    is_active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  
  const isSalam = theme === 'salam';
  
  // Theme colors
  const themeColors = {
    // Page header
    headerIcon: isSalam ? 'text-[#36C639]' : 'text-white',
    headerTitle: isSalam ? 'text-[#003931]' : 'text-white',
    headerSubtitle: isSalam ? 'text-white' : 'text-slate-300',
    
    // Search input
    searchBg: isSalam ? 'bg-white' : 'bg-slate-800',
    searchBorder: isSalam ? 'border-[#003931] text-[#003931]' : 'border-slate-600 text-white',
    searchFocus: isSalam ? 'focus:ring-[#00F000] focus:border-[#00F000]' : 'focus:ring-green-500 focus:border-green-500',
    searchPlaceholder: isSalam ? 'placeholder-[#005147]' : 'placeholder-slate-400',
    
    // Cards
    cardBg: isSalam ? 'bg-white/95' : 'bg-slate-900/80',
    cardBorder: isSalam ? 'border-[#003931]' : 'border-transparent',
    cardHover: isSalam ? 'hover:border-[#00F000]/60 hover:shadow-[#00F000]/20' : 'hover:border-green-400/60 hover:shadow-green-500/30',
    cardShadow: isSalam ? 'shadow-xl hover:shadow-2xl' : 'shadow-xl',
    
    // Avatar/Image
    avatarBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-white',
    avatarBorder: isSalam ? 'border-[#00F000]' : 'border-green-100',
    avatarHover: isSalam ? 'group-hover:shadow-[#00F000]/30' : 'group-hover:shadow-green-400/30',
    
    // Text colors
    nameText: isSalam ? 'text-[#003931]' : 'text-white',
    positionText: isSalam ? 'text-[#00F000]' : 'text-green-500',
    contactText: isSalam ? 'text-[#005147]' : 'text-slate-400',
    
    // Icons
    emailIcon: isSalam ? 'text-[#36C639]' : 'text-blue-400',
    phoneIcon: isSalam ? 'text-[#00F000]' : 'text-green-400',
    
    // Loading/Empty states
    messageText: isSalam ? 'text-[#005147]' : 'text-slate-400'
  };

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      try {
        const res = await fetch('/api/staff');
        const data = await res.json();
        
        if (data.success) {
          setEmployees(data.data || []);
        } else {
          console.error('API Error:', data.error);
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  const filteredStaff = employees.filter(member => {
    const name = (lang === 'ar' ? (member.name_ar || member.name || '') : (member.name || '')).toLowerCase();
    const position = (lang === 'ar' ? (member.job_title_ar || member.job_title || '') : (member.job_title || '')).toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || position.includes(q);
  });

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <UserGroupIcon className={`w-12 h-12 ${themeColors.headerIcon}`} />
          </div>
          <h1 className={`page-title title-animate ${themeColors.headerTitle}`}>{t('staff.title')}</h1>
          <p className={`page-subtitle subtitle-animate ${themeColors.headerSubtitle}`}>
            {t('staff.intro')}
          </p>
        </div>
        
        {/* Search Box */}
        <div className="flex justify-center mb-10 content-animate">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم الموظف أو المنصب...' : 'Search by name or position...'}
            className={`w-full max-w-md px-4 py-3 text-lg rounded-lg border ${themeColors.searchBg} ${themeColors.searchBorder} ${themeColors.searchFocus} ${themeColors.searchPlaceholder} transition-all duration-200`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* Staff Grid */}
        {loading ? (
          <div className={`text-center ${themeColors.messageText} text-xl py-16 content-animate`}>
            <div className={`w-16 h-16 ${isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-800'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <UserGroupIcon className={`w-8 h-8 ${isSalam ? 'text-[#00F000]' : 'text-green-400'} animate-pulse`} />
            </div>
            {lang === 'ar' ? 'جاري تحميل الموظفين...' : 'Loading staff...'}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className={`text-center ${themeColors.messageText} text-xl py-16 content-animate`}>
            <div className={`w-16 h-16 ${isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-800'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <UserGroupIcon className={`w-8 h-8 ${isSalam ? 'text-[#36C639]' : 'text-slate-400'}`} />
            </div>
            {lang === 'ar' ? 'لا يوجد موظف يطابق البحث.' : 'No staff member matches your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 content-animate">
            {filteredStaff.map((member, index) => (
              <div
                key={member.id}
                className={`group ${themeColors.cardBg} p-7 flex flex-col items-center text-center rounded-2xl ${themeColors.cardShadow} hover:-translate-y-2 transition-all duration-300 border-2 ${themeColors.cardBorder} ${themeColors.cardHover} stagger-animate`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className={`w-24 h-24 rounded-full ${themeColors.avatarBg} flex items-center justify-center mb-5 shadow-lg border-4 ${themeColors.avatarBorder} group-hover:scale-105 ${themeColors.avatarHover} transition-transform overflow-hidden`}>
                  <Image 
                    src="/icons/noun-hacker.svg" 
                    alt={lang === 'ar' ? member.name_ar || member.name : member.name} 
                    width={80} 
                    height={80} 
                    className={`object-contain w-20 h-20 ${isSalam ? 'filter brightness-50' : ''}`}
                  />
                </div>
                <h2 className={`text-2xl font-bold ${themeColors.nameText} mb-1 font-display`}>
                  {lang === 'ar' ? member.name_ar || member.name : member.name}
                </h2>
                <p className={`${themeColors.positionText} text-lg font-semibold mb-3`}>
                  {lang === 'ar' ? member.job_title_ar || member.job_title : member.job_title}
                </p>
                <div className="flex flex-col gap-1 items-center w-full">
                  <div className={`flex items-center gap-2 ${themeColors.contactText} text-sm`}>
                    <EnvelopeIcon className={`w-5 h-5 ${themeColors.emailIcon}`} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className={`flex items-center gap-2 ${themeColors.contactText} text-sm`}>
                      <DevicePhoneMobileIcon className={`w-5 h-5 ${themeColors.phoneIcon}`} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 