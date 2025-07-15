'use client';

import Navigation from '@/components/Navigation';
import { UserGroupIcon, ShieldCheckIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useLang } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import Image from 'next/image';
import { useState } from 'react';

const staffData = [
  {
    id: 1,
    name: { en: 'Ahmed Al-Salem', ar: 'أحمد السالم' },
    position: { en: 'Cyber Security Manager', ar: 'مدير الأمن السيبراني' },
    email: 'ahmed.salem@salam.com',
    phone: '+966 555 123 456',
    avatar: '/cyber-hero.svg'
  },
  {
    id: 2,
    name: { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' },
    position: { en: 'Security Analyst', ar: 'محلل أمان' },
    email: 'sara.qahtani@salam.com',
    phone: '+966 555 234 567',
    avatar: '/window.svg'
  },
  {
    id: 3,
    name: { en: 'Mohammed Al-Harbi', ar: 'محمد الحربي' },
    position: { en: 'Compliance Specialist', ar: 'مختص الامتثال' },
    email: 'mohammed.harbi@salam.com',
    phone: '+966 555 345 678',
    avatar: '/file.svg'
  },
  {
    id: 4,
    name: { en: 'Fatimah Al-Dosari', ar: 'فاطمة الدوسري' },
    position: { en: 'Security Engineer', ar: 'مهندس أمان' },
    email: 'fatimah.dosari@salam.com',
    phone: '+966 555 456 789',
    avatar: '/globe.svg'
  }
];

export default function StaffPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [search, setSearch] = useState('');

  const filteredStaff = staffData.filter(member => {
    const name = member.name[lang].toLowerCase();
    const position = member.position[lang].toLowerCase();
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
            <UserGroupIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">{t('staff.title')}</h1>
          <p className="page-subtitle subtitle-animate">
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
            className="input-field max-w-md text-lg placeholder-slate-400"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* Staff Grid */}
        {filteredStaff.length === 0 ? (
          <div className="text-center text-slate-400 text-xl py-16 content-animate">
            {lang === 'ar' ? 'لا يوجد موظف يطابق البحث.' : 'No staff member matches your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 content-animate">
            {filteredStaff.map((member, index) => (
              <div
                key={member.id}
                className="group card-glass p-7 flex flex-col items-center text-center rounded-2xl shadow-xl hover:shadow-green-500/30 hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-green-400/60 stagger-animate"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-5 shadow-lg border-4 border-green-100 group-hover:scale-105 group-hover:shadow-green-400/30 transition-transform overflow-hidden">
                  <Image src="/icons/noun-hacker.svg" alt={member.name[lang]} width={80} height={80} className="object-contain w-20 h-20" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1 font-display">{member.name[lang]}</h2>
                <p className="text-green-500 text-lg font-semibold mb-3">{member.position[lang]}</p>
                <div className="flex flex-col gap-1 items-center w-full">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <PhoneIcon className="w-5 h-5 text-green-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 