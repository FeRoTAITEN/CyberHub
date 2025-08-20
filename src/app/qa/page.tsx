'use client';

import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  LockClosedIcon,
  CogIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '../ClientLayout';

// Load questions from external JSON file
type QAItem = {
  id: number;
  category: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
  tags: string[];
  difficulty: string;
};

// فئات الأسئلة
const categories = [
  { id: 'all', name: { en: 'All Questions', ar: 'جميع الأسئلة' }, icon: ShieldCheckIcon },
  { id: 'general', name: { en: 'General Security', ar: 'الأمان العام' }, icon: ShieldCheckIcon },
  { id: 'passwords', name: { en: 'Passwords', ar: 'كلمات المرور' }, icon: LockClosedIcon },
  { id: 'phishing', name: { en: 'Phishing', ar: 'التصيد الاحتيالي' }, icon: CogIcon },
  { id: 'malware', name: { en: 'Malware', ar: 'البرمجيات الخبيثة' }, icon: ComputerDesktopIcon },
  { id: 'vpn', name: { en: 'VPN & Privacy', ar: 'VPN والخصوصية' }, icon: UserGroupIcon },
  { id: 'social', name: { en: 'Social Media', ar: 'وسائل التواصل' }, icon: UserIcon },
  { id: 'encryption', name: { en: 'Encryption', ar: 'التشفير' }, icon: CogIcon },
  { id: 'incident', name: { en: 'Incident Response', ar: 'الاستجابة للحوادث' }, icon: AcademicCapIcon },
  { id: 'backup', name: { en: 'Backup & Recovery', ar: 'النسخ الاحتياطي' }, icon: DocumentTextIcon },
  { id: 'compliance', name: { en: 'Compliance', ar: 'الامتثال' }, icon: ShieldCheckIcon }
];

export default function QAPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [qaData, setQaData] = useState<QAItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch questions from JSON file
  useEffect(() => {
    setLoading(true);
    fetch('/qa/questions.json')
      .then(res => res.json())
      .then(data => {
        setQaData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // تصفية الأسئلة حسب البحث والفئة
  const filteredQA = useMemo(() => {
    if (!qaData) return [];
    return qaData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.question[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [qaData, searchTerm, selectedCategory, lang]);



  // إحصائيات Q&A
  const stats = [
    { label: lang === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions', value: qaData ? qaData.length.toString() : '...', icon: '❓' },
    { label: lang === 'ar' ? 'الأسئلة المطروحة' : 'Questions Asked', value: '1,247', icon: '💬' }
  ];

  // Modern, theme-aware card design with icons (same as services)
  const isDark = theme === 'default' || theme === 'cyber' || theme === 'midnight';
  const isSalam = theme === 'salam';
  
  // Salam theme specific styling - matching the exact design from image
  const cardBg = isSalam ? 'bg-white' : (isDark ? 'bg-slate-900' : 'bg-white');
  const cardTitle = isSalam ? 'text-green-800' : (isDark ? 'text-white' : 'text-slate-900');
  const cardDesc = isSalam ? 'text-green-700' : (isDark ? 'text-slate-400' : 'text-slate-600');
  const cardShadow = isSalam ? 'shadow-lg' : (isDark ? 'shadow-lg' : 'shadow-md');
  const cardHover = isSalam 
    ? 'hover:shadow-xl hover:border-green-500/50 transition-all duration-300'
    : (isDark ? 'hover:shadow-2xl' : 'hover:shadow-lg');
  const cardClass = `card p-8 rounded-xl border border-green-200/30 ${cardBg} ${cardShadow} transition-all duration-300 hover:-translate-y-1 hover:border-green-500 ${cardHover} flex flex-col h-full items-center text-center`;

  // Helper to get icon for category
  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.icon : ChartBarIcon;
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ShieldCheckIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Q&A'}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {lang === 'ar' 
              ? 'إجابات على أكثر الأسئلة شيوعاً في مجال الأمن السيبراني'
              : 'Answers to the most common cybersecurity questions'}
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        {/* Vertical Layout: إحصائيات ثم البحث والفلاتر */}
        <div className="flex flex-col gap-6 mb-6 content-animate">
          {/* إحصائيات */}
          <div className="card p-6">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-green-800' : ''
            }`}>
              <span className="text-2xl">📊</span>
              <span>{lang === 'ar' ? 'إحصائيات الأسئلة' : 'Q&A Statistics'}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
                <div key={index} className={`text-center p-4 rounded-xl stat-card ${
                  isSalam ? 'bg-white border border-green-200/30 shadow-lg' : 'bg-slate-800'
                }`}>
              <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className={`text-2xl font-bold mb-2 ${
                    isSalam ? 'text-green-800' : 'text-green-400'
                  }`}>{stat.value}</div>
                  <div className={`text-sm font-medium ${
                    isSalam ? 'text-green-700' : 'text-slate-300'
                  }`}>{stat.label}</div>
            </div>
          ))}
        </div>
          </div>
          {/* البحث والفلاتر */}
          <div className="card p-6">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-green-800' : ''
            }`}>
              <ShieldCheckIcon className={`w-5 h-5 ${
                isSalam ? 'text-green-600' : 'text-green-400'
              }`} />
              <span>{lang === 'ar' ? 'بحث وفلاتر' : 'Search & Filters'}</span>
            </h2>
            {/* Search Bar */}
            <div className="relative mb-6">
              <ShieldCheckIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isSalam ? 'text-green-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في الأسئلة والأجوبة...' : 'Search questions and answers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`input-field pl-12 pr-4 py-4 rounded-xl ${
                  isSalam ? 'bg-white border-green-200/50 focus:border-green-500 focus:ring-green-500' : ''
                }`}
              />
            </div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? isSalam 
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-green-600 text-white shadow-lg'
                        : isSalam
                          ? 'bg-white text-green-700 hover:bg-green-50 border border-green-200/50 shadow-sm'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* عدد النتائج */}
        <div className="mb-6 content-animate">
          <p className={isSalam ? 'text-green-700' : 'text-slate-300'}>
            {lang === 'ar' 
              ? `تم العثور على ${filteredQA.length} سؤال`
              : `Found ${filteredQA.length} questions`}
          </p>
        </div>

        {/* Q&A Cards Grid */}
        {loading ? (
          <div className={`text-center py-16 text-lg ${
            isSalam ? 'text-green-600' : 'text-slate-400'
          }`}>{lang === 'ar' ? 'جاري تحميل الأسئلة...' : 'Loading questions...'}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 content-animate">
            {filteredQA.map((item, idx) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={item.id}
                  className={`${cardClass} ${isSalam ? 'hover:scale-105' : ''}`}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
                >
                  {/* Category Icon - matching the icon style from image */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    isSalam ? 'bg-green-600' : (isDark ? 'bg-slate-800' : 'bg-slate-200')
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSalam ? 'text-white' : (isDark ? 'text-green-400' : 'text-green-600')
                    }`} />
                  </div>
                  <h2 className={`text-xl font-bold mb-3 ${cardTitle}`}>{item.question[lang]}</h2>
                  <p className={`text-base leading-relaxed ${cardDesc}`}>{item.answer[lang]}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* قسم المساعدة */}
        <div className="mt-12 content-animate">
          <div className={`card p-8 rounded-xl ${
            isSalam 
              ? 'bg-white border border-green-200/30 shadow-lg' 
              : 'border-green-500/30'
          }`}>
            <div className={`flex items-start ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSalam ? 'bg-green-600' : 'bg-green-500'
              }`}>
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-4 ${
                  isSalam ? 'text-green-800' : 'text-white'
                }`}>
                  {lang === 'ar' ? 'هل لديك سؤال آخر؟' : 'Have another question?'}
                </h3>
                <p className={`leading-relaxed text-base mb-6 ${
                  isSalam ? 'text-green-700' : 'text-slate-300'
                }`}>
                  {lang === 'ar' 
                    ? 'إذا لم تجد إجابة لسؤالك هنا، يمكنك التواصل مع فريق الأمن السيبراني للحصول على المساعدة.'
                    : 'If you couldn\'t find an answer to your question here, you can contact the cybersecurity team for assistance.'}
                </p>
                <button className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isSalam 
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl shadow-lg'
                    : 'btn-primary'
                }`}>
                  {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
