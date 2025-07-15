'use client';

import Navigation from '@/components/Navigation';
import { useTheme } from '../ClientLayout';
import { useLang } from '../ClientLayout';
import { ChartBarIcon, ClipboardDocumentCheckIcon, UserIcon, BriefcaseIcon, BuildingOffice2Icon, EnvelopeIcon, DevicePhoneMobileIcon, AcademicCapIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const employee = {
  name: 'تركي الشهري',
  position: 'Full Stack Developer',
  department: 'قسم التطوير',
  email: 'ahmed@company.com',
  phone: '+966501234567',
};

const projectsData = [
  { id: 1, name: 'SOC Modernization', status: 'Active' },
  { id: 2, name: 'Zero Trust Implementation', status: 'Planning' },
  { id: 3, name: 'Employee Awareness Program', status: 'Completed' },
  { id: 4, name: 'Threat Intelligence Platform', status: 'Active' },
];

const tasksData = [
  { id: 1, title: 'Prepare Security Report', status: 'In Progress' },
  { id: 2, title: 'Review Access Policies', status: 'Completed' },
  { id: 3, title: 'UI Design', status: 'In Progress' },
  { id: 4, title: 'Database Update', status: 'Pending' },
  { id: 5, title: 'Training Session', status: 'Completed' },
];

const coursesData = [
  {
    id: 1,
    name: {
      ar: 'مقدمة في الأمن السيبراني',
      en: 'Introduction to Cybersecurity',
    },
    description: {
      ar: 'تعرف على أساسيات الأمن السيبراني وأهميته.',
      en: 'Learn the basics of cybersecurity and its importance.',
    },
    status: 'completed',
  },
  {
    id: 2,
    name: {
      ar: 'إدارة كلمات المرور',
      en: 'Password Management',
    },
    description: {
      ar: 'كيفية إنشاء وإدارة كلمات مرور قوية.',
      en: 'How to create and manage strong passwords.',
    },
    status: 'pending',
  },
  {
    id: 3,
    name: {
      ar: 'التوعية بالتصيد الاحتيالي',
      en: 'Phishing Awareness',
    },
    description: {
      ar: 'تعلم كيفية اكتشاف رسائل التصيد الاحتيالي.',
      en: 'Learn how to spot phishing emails.',
    },
    status: 'pending',
  },
];

const achievementsData = [
  {
    icon: <TrophyIcon className="w-6 h-6 text-yellow-400" />,
    ar: 'أفضل موظف الشهر',
    en: 'Employee of the Month',
  },
  {
    icon: <StarIcon className="w-6 h-6 text-green-400" />,
    ar: 'إكمال جميع الدورات التدريبية',
    en: 'Completed All Training Courses',
  },
  {
    icon: <StarIcon className="w-6 h-6 text-blue-400" />,
    ar: 'مساهمة في مشروع رئيسي',
    en: 'Contributed to Major Project',
  },
];

const themeCardStyles = {
  default: {
    card: 'bg-[#0a1826] border border-slate-600',
    name: 'text-green-400',
    department: 'text-slate-400',
    secondary: 'text-blue-300',
  },
  light: {
    card: 'bg-white border border-slate-200',
    name: 'text-blue-700',
    department: 'text-slate-400',
    secondary: 'text-slate-700',
  },
  midnight: {
    card: 'bg-slate-900 border border-slate-700',
    name: 'text-white',
    department: 'text-slate-400',
    secondary: 'text-blue-300',
  },
  novel: {
    card: 'bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-300',
    name: 'text-slate-900',
    department: 'text-slate-500',
    secondary: 'text-blue-700',
  },
  cyber: {
    card: 'bg-gradient-to-br from-[#0f172a] to-[#0a1826] border border-green-500/30 shadow-[0_0_24px_#39ff14cc]',
    name: 'text-green-400 drop-shadow-neon-green',
    department: 'text-slate-400',
    secondary: 'text-cyan-300',
  },
};

export default function DashboardPage() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const styles = themeCardStyles[theme] || themeCardStyles.default;

  const rowDir = lang === 'ar' ? 'flex-row-reverse' : 'flex-row';

  const completedTasks = tasksData.filter((t) => t.status === 'Completed').length;
  const totalTasks = tasksData.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // بيانات الإجازات
  const totalLeaves = 30;
  const usedLeaves = 16;
  const remainingLeaves = totalLeaves - usedLeaves;
  const leavesRate = Math.round((remainingLeaves / totalLeaves) * 100);

  // بيانات المشاريع
  const completedProjects = projectsData.filter((p) => p.status === 'Completed').length;
  const totalProjects = projectsData.length;
  const projectsRate = Math.round((completedProjects / totalProjects) * 100);

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 content-animate">
          {/* Employee Card */}
          <aside className="md:col-span-1 flex flex-col items-center justify-start gap-6">
            <div className={`card-hover group p-8 rounded-xl w-full flex flex-col items-center text-center ${styles.card}`} dir={dir}>
              <div className="bg-slate-800 rounded-full p-3 border-2 border-green-400 mb-4">
                <UserIcon className="w-16 h-16 text-green-400" />
              </div>
              {/* Full Name */}
              <div className={`text-2xl font-bold mb-2 flex items-center gap-2 ${rowDir} ${styles.name}`} style={{ fontFamily: 'VT323, monospace' }}>
                <UserIcon className={`w-6 h-6 ${styles.name}`} />
                {employee.name}
              </div>
              {/* Department */}
              <div className={`text-base mb-2 flex items-center gap-2 ${rowDir} ${styles.department}`} style={{ fontFamily: 'VT323, monospace' }}>
                <BuildingOffice2Icon className={`w-5 h-5 ${styles.department}`} />
                {employee.department}
              </div>
              {/* Job Title */}
              <div className={`text-lg font-semibold mb-2 flex items-center gap-2 ${rowDir} ${styles.secondary}`} style={{ fontFamily: 'VT323, monospace' }}>
                <BriefcaseIcon className={`w-5 h-5 ${styles.secondary}`} />
                {employee.position}
              </div>
              {/* Email */}
              <div className={`text-base mb-2 flex items-center gap-2 ${rowDir} ${styles.secondary}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <EnvelopeIcon className={`w-5 h-5 ${styles.secondary}`} />
                {employee.email}
              </div>
              {/* Phone */}
              <div className={`text-base flex items-center gap-2 ${rowDir} ${styles.secondary}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <DevicePhoneMobileIcon className={`w-5 h-5 ${styles.secondary}`} />
                {employee.phone}
              </div>
            </div>
            {/* User Achievements Card */}
            <div className={`card-hover group p-6 rounded-xl w-full flex flex-col items-start ${styles.card}`} dir={dir}>
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="w-7 h-7 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'إنجازات المستخدم' : 'User Achievements'}
                </h3>
              </div>
              <ul className="space-y-3 w-full">
                {achievementsData.map((ach, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-200 text-sm">
                    {ach.icon}
                    <span>{lang === 'ar' ? ach.ar : ach.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Projects & Tasks */}
          <section className="md:col-span-2 flex flex-col gap-8">
            {/* Tasks Completion Circles */}
            <div className="card-hover group p-8 rounded-xl mb-4 bg-[#101e2c] border border-slate-600 flex flex-col items-center justify-center">
              <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
                {/* Tasks Completion */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 mb-2">
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
                    {lang === 'ar' ? 'إكمال المهام' : 'Tasks Completion'}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {completedTasks} / {totalTasks} {lang === 'ar' ? 'مكتملة' : 'Completed'}
                  </div>
                </div>
                {/* Leaves Balance */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 mb-2">
                    <CircularProgressbar
                      value={leavesRate}
                      text={`${remainingLeaves}`}
                      styles={buildStyles({
                        pathColor: '#00e0ff',
                        textColor: '#00e0ff',
                        trailColor: '#222f43',
                        backgroundColor: '#101e2c',
                      })}
                    />
                  </div>
                  <div className="text-sm font-bold text-cyan-300">
                    {lang === 'ar' ? 'رصيد الإجازات' : 'Leave Balance'}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {remainingLeaves} / {totalLeaves} {lang === 'ar' ? 'يوم متبقي' : 'days left'}
                  </div>
                </div>
                {/* Projects Completion */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 mb-2">
                    <CircularProgressbar
                      value={projectsRate}
                      text={`${projectsRate}%`}
                      styles={buildStyles({
                        pathColor: '#ff00c8',
                        textColor: '#ff00c8',
                        trailColor: '#222f43',
                        backgroundColor: '#101e2c',
                      })}
                    />
                  </div>
                  <div className="text-sm font-bold text-pink-400">
                    {lang === 'ar' ? 'إنجاز المشاريع' : 'Projects Completion'}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {completedProjects} / {totalProjects} {lang === 'ar' ? 'مكتمل' : 'Completed'}
                  </div>
                </div>
              </div>
            </div>
            {/* Projects */}
            <div className="card-hover group p-8 rounded-xl mb-4 bg-[#101e2c] border border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <ChartBarIcon className="w-7 h-7 text-blue-400" />
                <h2 className="text-xl font-bold text-white">{lang === 'ar' ? 'المشاريع المرتبطة' : 'Related Projects'}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {projectsData.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{p.name}</span>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Tasks */}
            <div className="card-hover group p-8 rounded-xl bg-[#101e2c] border border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardDocumentCheckIcon className="w-7 h-7 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">{lang === 'ar' ? 'المهام المرتبطة' : 'Related Tasks'}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {tasksData.slice(0, 2).map((t) => (
                  <div key={t.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{t.title}</span>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Courses */}
            <div className="card-hover group p-8 rounded-xl bg-[#101e2c] border border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <AcademicCapIcon className="w-7 h-7 text-green-400" />
                <h2 className="text-xl font-bold text-white">{lang === 'ar' ? 'الدورات الموصى بها' : 'Recommended Courses'}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {coursesData.map((course) => (
                  <div key={course.id} className={`flex flex-col md:flex-row md:items-center justify-between bg-slate-800 rounded-lg px-5 py-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className="flex-1">
                      <div className="font-bold text-white text-base mb-1 flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5 text-green-400" />
                        {course.name[lang]}
                      </div>
                      <div className="text-slate-300 text-sm mb-1">{course.description[lang]}</div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold mt-2 md:mt-0 ${course.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                      {lang === 'ar'
                        ? course.status === 'completed' ? 'مكتمل' : 'غير مكتمل'
                        : course.status === 'completed' ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 