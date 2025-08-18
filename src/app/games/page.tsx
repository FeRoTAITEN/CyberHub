'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PuzzlePieceIcon,
  PlayIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

// بيانات الألعاب
const games = [
  {
    id: 'cyber-guardian',
    title: {
      en: 'Cyber Security Guardian',
      ar: 'حارس الأمن السيبراني'
    },
    description: {
      en: 'Protect your company from cyber attacks by making the right security decisions. Learn about passwords, phishing, malware, and network security.',
      ar: 'احمِ شركتك من الهجمات السيبرانية باتخاذ القرارات الأمنية الصحيحة. تعلم عن كلمات المرور والتصيد الاحتيالي والبرمجيات الخبيثة وأمان الشبكات.'
    },
    icon: ShieldCheckIcon,
    difficulty: 'beginner',
    duration: '5-10 min',
    players: '1',
    category: 'defense',
    features: [
      { en: 'Password Security', ar: 'أمان كلمات المرور' },
      { en: 'Phishing Detection', ar: 'اكتشاف التصيد الاحتيالي' },
      { en: 'Malware Protection', ar: 'حماية من البرمجيات الخبيثة' },
      { en: 'Network Security', ar: 'أمان الشبكات' }
    ],
    color: 'green',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'security-detective',
    title: {
      en: 'Security Detective',
      ar: 'محقق الأمن'
    },
    description: {
      en: 'Solve cybersecurity mysteries by analyzing suspicious emails, links, and files. Become a digital detective and uncover security threats.',
      ar: 'حل ألغاز الأمن السيبراني من خلال تحليل رسائل البريد الإلكتروني والروابط والملفات المشبوهة. كن محققاً رقمياً واكتشف التهديدات الأمنية.'
    },
    icon: MagnifyingGlassIcon,
    difficulty: 'intermediate',
    duration: '8-15 min',
    players: '1',
    category: 'investigation',
    features: [
      { en: 'Email Analysis', ar: 'تحليل البريد الإلكتروني' },
      { en: 'Link Investigation', ar: 'فحص الروابط' },
      { en: 'File Forensics', ar: 'التحليل الجنائي للملفات' },
      { en: 'Threat Detection', ar: 'اكتشاف التهديدات' }
    ],
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'digital-fortress',
    title: {
      en: 'Digital Fortress Builder',
      ar: 'باني الحصن الرقمي'
    },
    description: {
      en: 'Build and defend your digital fortress against cyber attacks. Choose security tools, configure firewalls, and test your defenses.',
      ar: 'ابنِ واحمِ حصنك الرقمي من الهجمات السيبرانية. اختر أدوات الأمان، وكون جدران الحماية، واختبر دفاعاتك.'
    },
    icon: PuzzlePieceIcon,
    difficulty: 'advanced',
    duration: '12-20 min',
    players: '1-2',
    category: 'strategy',
    features: [
      { en: 'Security Architecture', ar: 'الهندسة الأمنية' },
      { en: 'Firewall Configuration', ar: 'تكوين جدران الحماية' },
      { en: 'Monitoring Systems', ar: 'أنظمة المراقبة' },
      { en: 'Defense Testing', ar: 'اختبار الدفاعات' }
    ],
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30'
  }
];



export default function GamesPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  
  const isSalam = theme === 'salam';
  
  // Theme-aware colors
  const themeColors = {
    // Page header
    headerIcon: isSalam ? 'text-[#36C639]' : 'text-white',
    headerTitle: isSalam ? 'text-[#003931]' : 'text-white',
    headerSubtitle: isSalam ? 'text-white' : 'text-slate-300',
    
    // Game cards
    cardBg: isSalam ? 'bg-white' : 'bg-slate-900',
    cardBorder: isSalam ? 'border-[#003931]' : 'border-slate-700',
    cardHover: isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800',
    
    // Text colors
    textPrimary: isSalam ? 'text-[#003931]' : 'text-white',
    textSecondary: isSalam ? 'text-[#005147]' : 'text-slate-300',
    textMuted: isSalam ? 'text-[#005147]' : 'text-slate-400',
    
    // Game specific colors for Salam theme
    gameColors: {
      green: {
        icon: isSalam ? 'text-[#00F000]' : 'text-green-400',
        iconBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-green-500/20',
        badge: isSalam ? 'bg-[#EEFDEC] text-[#003931]' : 'bg-green-500/20 text-green-400',
        bullet: isSalam ? 'bg-[#00F000]' : 'bg-green-400',
        button: isSalam ? 'bg-[#00F000] hover:bg-[#73F64B] text-[#003931]' : 'bg-green-600 hover:bg-green-700 text-white'
      },
      blue: {
        icon: isSalam ? 'text-[#36C639]' : 'text-blue-400',
        iconBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-blue-500/20',
        badge: isSalam ? 'bg-[#EEFDEC] text-[#003931]' : 'bg-blue-500/20 text-blue-400',
        bullet: isSalam ? 'bg-[#36C639]' : 'bg-blue-400',
        button: isSalam ? 'bg-[#36C639] hover:bg-[#00F000] text-[#003931]' : 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      purple: {
        icon: isSalam ? 'text-[#73F64B]' : 'text-purple-400',
        iconBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-purple-500/20',
        badge: isSalam ? 'bg-[#EEFDEC] text-[#003931]' : 'bg-purple-500/20 text-purple-400',
        bullet: isSalam ? 'bg-[#73F64B]' : 'bg-purple-400',
        button: isSalam ? 'bg-[#73F64B] hover:bg-[#00F000] text-[#003931]' : 'bg-purple-600 hover:bg-purple-700 text-white'
      }
    },
    
    // Benefits section
    benefitsBg: isSalam ? 'bg-white' : 'bg-slate-900',
    benefitsBorder: isSalam ? 'border-[#00F000]' : 'border-green-500/30'
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <PlayIcon className={`w-12 h-12 ${themeColors.headerIcon}`} />
          </div>
          <h1 className={`page-title title-animate ${themeColors.headerTitle}`}>
            {lang === 'ar' ? 'ألعاب الأمن السيبراني' : 'Cybersecurity Games'}
          </h1>
          <p className={`page-subtitle subtitle-animate ${themeColors.headerSubtitle}`}>
            {lang === 'ar' 
              ? 'تعلم الأمن السيبراني بطريقة تفاعلية وممتعة'
              : 'Learn cybersecurity through interactive and fun games'
            }
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-animate">
          {games.map((game, index) => {
            const Icon = game.icon;
            const gameTheme = themeColors.gameColors[game.color as keyof typeof themeColors.gameColors];
            return (
              <div 
                key={game.id}
                className={`${themeColors.cardBg} ${themeColors.cardBorder} border ${themeColors.cardHover} hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl stagger-animate`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-6">
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${gameTheme.iconBg}`}>
                      <Icon className={`w-8 h-8 ${gameTheme.icon}`} />
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 ${gameTheme.badge} text-xs font-medium rounded`}>
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Game Title & Description */}
                  <h3 className={`text-xl font-bold ${themeColors.textPrimary} mb-3`}>
                    {game.title[lang]}
                  </h3>
                  <p className={`${themeColors.textSecondary} text-sm leading-relaxed mb-4`}>
                    {game.description[lang]}
                  </p>

                  {/* Game Features */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold ${themeColors.textPrimary} mb-2`}>
                      {lang === 'ar' ? 'المميزات:' : 'Features:'}
                    </h4>
                    <div className="space-y-1">
                      {game.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${gameTheme.bullet}`}></div>
                          <span className={`text-xs ${themeColors.textSecondary}`}>{feature[lang]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className={`flex items-center justify-between mb-4 text-xs ${themeColors.textMuted}`}>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Link href={`/games/${game.id}`}>
                    <button className={`w-full ${gameTheme.button} font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group`}>
                      <PlayIcon className="w-5 h-5" />
                      <span>{lang === 'ar' ? 'ابدأ اللعب' : 'Start Playing'}</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Benefits Section */}
        <div className="mt-12 content-animate">
          <div className={`${themeColors.benefitsBg} border ${themeColors.benefitsBorder} p-8 rounded-xl shadow-lg`}>
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold ${themeColors.textPrimary} mb-2`}>
                {lang === 'ar' ? 'فوائد التعلم من خلال الألعاب' : 'Benefits of Learning Through Games'}
              </h2>
              <p className={themeColors.textSecondary}>
                {lang === 'ar' 
                  ? 'تعلم الأمن السيبراني بطريقة تفاعلية وممتعة'
                  : 'Learn cybersecurity in an interactive and engaging way'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 ${themeColors.gameColors.green.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <ChartBarIcon className={`w-6 h-6 ${themeColors.gameColors.green.icon}`} />
                </div>
                <h3 className={`font-semibold ${themeColors.textPrimary} mb-2`}>
                  {lang === 'ar' ? 'تحسين الأداء' : 'Performance Improvement'}
                </h3>
                <p className={`text-sm ${themeColors.textSecondary}`}>
                  {lang === 'ar' 
                    ? 'تعلم عملي يترجم إلى مهارات حقيقية'
                    : 'Practical learning that translates to real skills'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 ${themeColors.gameColors.blue.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <ExclamationTriangleIcon className={`w-6 h-6 ${themeColors.gameColors.blue.icon}`} />
                </div>
                <h3 className={`font-semibold ${themeColors.textPrimary} mb-2`}>
                  {lang === 'ar' ? 'الوعي الأمني' : 'Security Awareness'}
                </h3>
                <p className={`text-sm ${themeColors.textSecondary}`}>
                  {lang === 'ar' 
                    ? 'زيادة الوعي بالتهديدات السيبرانية'
                    : 'Increased awareness of cyber threats'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 ${themeColors.gameColors.purple.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <TrophyIcon className={`w-6 h-6 ${themeColors.gameColors.purple.icon}`} />
                </div>
                <h3 className={`font-semibold ${themeColors.textPrimary} mb-2`}>
                  {lang === 'ar' ? 'المنافسة الصحية' : 'Healthy Competition'}
                </h3>
                <p className={`text-sm ${themeColors.textSecondary}`}>
                  {lang === 'ar' 
                    ? 'منافسة مع الزملاء لتحسين المهارات'
                    : 'Compete with colleagues to improve skills'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 