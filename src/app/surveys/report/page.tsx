"use client";

import Navigation from '@/components/Navigation';
import { useTheme, useLang } from '../../ClientLayout';
import { ChartBarIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReportAdminSection from './admin';

// Fake statistics data for demonstration
const stats = [
  { icon: <UserGroupIcon className="w-7 h-7 text-blue-400" />, label: { en: 'Total Users', ar: 'إجمالي المستخدمين' }, value: 1200 },
  { icon: <ClipboardDocumentCheckIcon className="w-7 h-7 text-green-400" />, label: { en: 'Completed Surveys', ar: 'الاستبيانات المكتملة' }, value: 340 },
  { icon: <ChartBarIcon className="w-7 h-7 text-pink-400" />, label: { en: 'Active Surveys', ar: 'الاستبيانات النشطة' }, value: 12 },
];

const completionRate = 78;
const participationRate = 56;

const themeCardStyles = {
  default: 'bg-[#0a1826] border border-slate-600',
  light: 'bg-white border border-slate-200',
  midnight: 'bg-slate-900 border border-slate-700',
  novel: 'bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-300',
  cyber: 'bg-gradient-to-br from-[#0f172a] to-[#0a1826] border border-green-500/30 shadow-[0_0_24px_#39ff14cc]',
};

export default function SurveyReportPage() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const styles = themeCardStyles[theme] || themeCardStyles.default;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 content-animate">
          {/* Sidebar with statistics cards */}
          <aside className="md:col-span-1 flex flex-col gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className={`card card-hover ${styles} p-8 rounded-xl w-full flex flex-col items-center text-center`} dir={dir}>
                {stat.icon}
                <div className="text-2xl font-bold mt-2 mb-1 text-blue-900 dark:text-white">{stat.value}</div>
                <div className="text-base text-slate-500 dark:text-slate-300">{stat.label[lang]}</div>
              </div>
            ))}
          </aside>
          {/* Main content with circular charts */}
          <section className="md:col-span-2 flex flex-col gap-8">
            <div className={`card card-hover ${styles} p-8 rounded-xl w-full flex flex-col items-center`}>
              <h2 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">{lang === 'ar' ? 'معدلات المشاركة' : 'Participation Rates'}</h2>
              <div className="flex flex-col md:flex-row gap-12 w-full items-center justify-center">
                {/* Completion Rate */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-2">
                    <CircularProgressbar
                      value={completionRate}
                      text={`${completionRate}%`}
                      styles={buildStyles({
                        pathColor: '#39ff14',
                        textColor: '#39ff14',
                        trailColor: '#222f43',
                        backgroundColor: '#101e2c',
                      })}
                    />
                  </div>
                  <div className="text-sm font-bold text-green-400">
                    {lang === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                  </div>
                </div>
                {/* Participation Rate */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-2">
                    <CircularProgressbar
                      value={participationRate}
                      text={`${participationRate}%`}
                      styles={buildStyles({
                        pathColor: '#00e0ff',
                        textColor: '#00e0ff',
                        trailColor: '#222f43',
                        backgroundColor: '#101e2c',
                      })}
                    />
                  </div>
                  <div className="text-sm font-bold text-cyan-300">
                    {lang === 'ar' ? 'معدل المشاركة' : 'Participation Rate'}
                  </div>
                </div>
              </div>
            </div>
            {/* Placeholder for more report content */}
            <div className={`card card-hover ${styles} p-8 rounded-xl w-full`}>
              <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-white">{lang === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-base">
                {lang === 'ar'
                  ? 'يمكنك هنا إضافة جداول أو رسوم بيانية أو أي تفاصيل أخرى متعلقة بالتقارير.'
                  : 'You can add tables, charts, or any other report details here.'}
              </p>
            </div>
            <ReportAdminSection />
          </section>
        </div>
      </main>
    </div>
  );
} 