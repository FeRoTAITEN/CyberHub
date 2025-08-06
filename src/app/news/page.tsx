'use client';

import Navigation from '@/components/Navigation';
import { 
  NewspaperIcon, 
  GlobeAltIcon, 
  CalendarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

// بيانات الأخبار الداخلية
const internalNewsData = [
  {
    id: 1,
    title: {
      en: 'Salam launches new cybersecurity awareness campaign',
      ar: 'سلام تطلق حملة توعية جديدة بالأمن السيبراني'
    },
    date: '2024-06-01',
    summary: {
      en: 'The campaign aims to educate employees on the latest cyber threats and best practices.',
      ar: 'تهدف الحملة إلى توعية الموظفين بأحدث التهديدات السيبرانية وأفضل الممارسات.'
    },
    type: 'internal'
  },
  {
    id: 2,
    title: {
      en: 'Incident response drill successfully conducted',
      ar: 'تنفيذ تمرين استجابة للحوادث بنجاح'
    },
    date: '2024-05-20',
    summary: {
      en: 'The cybersecurity team conducted a simulated incident response to test readiness.',
      ar: 'نفذ فريق الأمن السيبراني تمريناً لمحاكاة الاستجابة للحوادث لاختبار الجاهزية.'
    },
    type: 'internal'
  },
  {
    id: 3,
    title: {
      en: 'New security policies released',
      ar: 'إصدار سياسات أمنية جديدة'
    },
    date: '2024-05-10',
    summary: {
      en: 'Updated policies are now available for all employees on the portal.',
      ar: 'السياسات المحدثة متاحة الآن لجميع الموظفين على البوابة.'
    },
    type: 'internal'
  }
];

export default function NewsPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  const twitterRef = useRef<HTMLDivElement>(null);

  // تحديد ما إذا كان الثيم Salam أم لا
  const isSalam = theme === 'salam';

  // تضمين سكربت تويتر مرة واحدة فقط
  useEffect(() => {
    if (window && twitterRef.current && !twitterRef.current.querySelector('iframe')) {
      const script = document.createElement('script');
      script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
      script.setAttribute('async', 'true');
      script.setAttribute('charset', 'utf-8');
      twitterRef.current.appendChild(script);
    }
  }, []);

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === 'ar' ? 'ar-EG' : 'en-US', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <NewspaperIcon className={`w-12 h-12 ${isSalam ? 'text-[#36C639]' : 'text-white'}`} />
          </div>
          <h1 className={`page-title title-animate ${isSalam ? 'text-[#003931]' : ''}`}>{t('news.title')}</h1>
          <p className={`page-subtitle subtitle-animate ${isSalam ? 'text-[#005147]' : ''}`}>
            {t('news.intro')}
          </p>
        </div>

        {/* Internal News Section - First */}
        <div className="mb-12 content-animate">
          <div className="flex items-center gap-3 mb-6">
            <NewspaperIcon className="w-6 h-6 text-green-400" />
            <h2 className="heading-2">
              {lang === 'ar' ? 'الأخبار والتحديثات الداخلية' : 'Internal News & Updates'}
            </h2>
          </div>
          <div className="space-y-6">
            {internalNewsData.map((item, index) => (
              <div key={item.id} className="card-hover group p-6 flex flex-col md:flex-row items-start md:items-center gap-6 stagger-animate" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                <div className="flex-shrink-0 w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <NewspaperIcon className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title[lang]}</h3>
                  <p className="text-slate-400 mb-2">{item.summary[lang]}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-12 content-animate">
          <div className="flex items-center gap-3 mb-6">
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            <h2 className="heading-2">
              {lang === 'ar' ? 'آخر المنشورات من حساباتنا الاجتماعية' : 'Latest Posts from Our Social Media'}
            </h2>
          </div>

          {/* X (Twitter) Timeline Embed */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">
                {lang === 'ar' ? 'منشورات X' : 'X Posts'}
              </h3>
            </div>
            <div ref={twitterRef} className="flex justify-center">
              <a
                className="twitter-timeline"
                data-width="600"
                data-height="600"
                data-dnt="true"
                data-theme="dark"
                href="https://twitter.com/salam?ref_src=twsrc%5Etfw"
              >
                Tweets by salam
              </a>
            </div>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="mt-16 flex justify-center content-animate">
          <div className="card-glass p-8 rounded-2xl flex flex-col items-center w-full max-w-2xl shadow-2xl border-0">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center text-gradient">
              {lang === 'ar' ? 'تابعنا على منصاتنا الاجتماعية' : 'Follow Us on Social Media'}
            </h3>
            <p className="text-slate-300 mb-8 text-center text-lg max-w-xl">
              {lang === 'ar' 
                ? 'انضم إلى مجتمع سلام وكن أول من يتابع آخر أخبار الأمن السيبراني والتقنية.'
                : 'Join Salam community and be the first to get the latest cybersecurity and tech updates.'
              }
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-center items-center">
              {/* زر X */}
              <button
                onClick={() => handleExternalLink('https://twitter.com/salam')}
                className="group flex items-center gap-3 w-full md:w-auto justify-center px-5 py-4 rounded-2xl border-2 border-black shadow-lg bg-black/90 min-w-[140px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 hover:shadow-green-500/30 hover:border-green-500"
                style={{ boxShadow: '0 4px 24px 0 rgba(16,185,129,0.10)' }}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-black shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="#000" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </span>
                <span style={{color:'#fff'}} className="text-lg font-bold tracking-wide">X</span>
              </button>
              {/* زر LinkedIn */}
              <button
                onClick={() => handleExternalLink('https://www.linkedin.com/company/salam-ksa/')}
                className="group flex items-center gap-3 w-full md:w-auto justify-center px-5 py-4 rounded-2xl border-2 border-[#0077b5] shadow-lg bg-[#0077b5]/90 min-w-[140px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 hover:shadow-green-500/30 hover:border-green-500"
                style={{ boxShadow: '0 4px 24px 0 rgba(16,185,129,0.10)' }}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#0077b5] shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="#0077b5" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
                  </svg>
                </span>
                <span style={{color:'#fff'}} className="text-lg font-bold tracking-wide">LinkedIn</span>
              </button>
              {/* زر سناب شات */}
              <button
                onClick={() => handleExternalLink('https://www.snapchat.com/@salam.saudi')}
                className="group flex items-center gap-3 w-full md:w-auto justify-center px-5 py-4 rounded-2xl border-2 border-yellow-400 shadow-lg bg-[#FFFC00] min-w-[140px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 hover:shadow-green-500/30 hover:border-green-500"
                style={{ boxShadow: '0 4px 24px 0 rgba(250,204,21,0.10)' }}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-black shadow-md group-hover:scale-110 transition-transform">
                  <Image src="/icons/snapchat.svg" alt="Snapchat" width={32} height={32} />
                </span>
                <span style={{color:'#fff'}} className="text-lg font-bold tracking-wide">Snapchat</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 