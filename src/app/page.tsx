"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Alert from "@/components/Alert";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  TrophyIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useLang, useTheme } from "./ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Dashboard data
const employee = {
  name: 'Turki Alshehri',
  position: 'Full Stack Developer',
  department: 'Cyber Security Sector',
  email: 'tu.alshehri@salam.sa',
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

// ThemeCardStyles for dashboard cards
const themeCardStyles = {
  default: {
    card: 'bg-[#0a1826] border border-slate-600',
    name: 'text-green-400',
    department: 'text-slate-400',
    secondary: 'text-blue-300',
    avatar: 'bg-slate-800 border-green-400',
  },
  light: {
    card: 'bg-white border border-slate-200',
    name: 'text-blue-700',
    department: 'text-slate-400',
    secondary: 'text-slate-700',
    avatar: 'bg-blue-100 border-blue-400',
  },
  midnight: {
    card: 'bg-slate-900 border border-slate-700',
    name: 'text-white',
    department: 'text-slate-400',
    secondary: 'text-blue-300',
    avatar: 'bg-slate-800 border-blue-400',
  },
  novel: {
    card: 'bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-300',
    name: 'text-slate-900',
    department: 'text-slate-500',
    secondary: 'text-blue-700',
    avatar: 'bg-slate-200 border-slate-400',
  },
  cyber: {
    card: 'bg-gradient-to-br from-[#0f172a] to-[#0a1826] border border-green-500/30 shadow-[0_0_24px_#39ff14cc]',
    name: 'text-green-400',
    department: 'text-slate-400',
    secondary: 'text-cyan-300',
    avatar: 'bg-[#0a1826] border-green-400',
  },
  salam: {
    card: 'bg-white border border-[#003931]',
    name: 'text-[#003931]',
    department: 'text-[#005147]',
    secondary: 'text-[#005147]',
    avatar: 'bg-[#EEFDEC] border-[#00F000]',
  },
};

// Hack effect utility for scrambling text
const HACK_CHARS = '@#$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function scrambleText(target: string, progress: number): string {
  let out = '';
  for (let i = 0; i < target.length; i++) {
    if (i < progress) {
      out += target[i];
    } else if (target[i] === ' ') {
      out += ' ';
    } else {
      out += HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)];
    }
  }
  return out;
}

export default function HomePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const styles = themeCardStyles[theme] || themeCardStyles.default;

  // تحديد ما إذا كان الثيم Salam أم لا
  const isSalam = theme === 'salam';
  
  // نظام الألوان الجديد لثيم Salam
  const salamColors = {
    // النصوص
    primaryText: '#000000',      // أسود - للنصوص الرئيسية
    secondaryText: '#003931',    // Reliable Green - للعناوين الفرعية
    whiteText: '#FFFFFF',        // Cloud White - للنصوص على خلفيات داكنة
    highlightText: '#00F000',    // Vibrant Green - للنصوص المميزة
    
    // الأزرار
    primaryButton: '#00F000',    // Vibrant Green
    primaryButtonText: '#005147', // Dark Saudi Green
    secondaryButton: '#FFFFFF',   // Cloud White
    secondaryButtonText: '#003931', // Reliable Green
    secondaryButtonBorder: '#00F000', // Vibrant Green
    
    // البطاقات
    cardBackground: '#FFFFFF',    // Cloud White مع opacity
    cardBorder: '#003931',       // Reliable Green
    
    // التنبيهات
    successAlert: '#00F000',     // Vibrant Green
    infoAlert: '#EEFDEC',        // Light Mint Green
    warningAlert: '#A0FB8E',     // Fresh Green
    
    // الأيقونات
    activeIcon: '#00F000',       // Vibrant Green
    inactiveIcon: '#005147',     // Dark Saudi Green
  };

  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "critical" as const,
      title: lang === "ar" ? "تهديد نشط" : "Active Threat",
      message:
        lang === "ar"
          ? "تم اكتشاف محاولة اختراق جديدة. يرجى تحديث كلمات المرور فوراً."
          : "A new breach attempt detected. Please update your passwords immediately.",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "warning" as const,
      title: lang === "ar" ? "تحديث أمني" : "Security Update",
      message:
        lang === "ar"
          ? "سيتم إجراء صيانة دورية للنظام يوم الخميس القادم من الساعة 2-4 صباحاً."
          : "Scheduled maintenance on Thursday from 2-4 AM.",
      date: "2024-01-14",
    },
    {
      id: "3",
      type: "info" as const,
      title: lang === "ar" ? "إشعار داخلي" : "Internal Notice",
      message:
        lang === "ar"
          ? "سيتم عقد دورة تدريبية حول الأمن السيبراني الأسبوع القادم."
          : "Cybersecurity training next week.",
      date: "2024-01-13",
    },
  ]);

  const quickLinks = [
    {
      title: t("nav.staff"),
      description:
        lang === "ar" ? "فريق الأمن السيبراني" : "Cyber Security Team",
      icon: UserGroupIcon,
      href: "/staff",
      color: isSalam ? salamColors.primaryButton : "bg-blue-600",
      hoverColor: isSalam ? salamColors.primaryButton : "hover:bg-blue-700",
    },
    {
      title: t("nav.projects"),
      description:
        lang === "ar" ? "إدارة المشاريع" : "Project Management",
      icon: ChartBarIcon,
      href: "/projects",
      color: isSalam ? salamColors.primaryButton : "bg-green-600",
      hoverColor: isSalam ? salamColors.primaryButton : "hover:bg-green-700",
    },
    {
      title: t("nav.governance"),
      description:
        lang === "ar" ? "السياسات والمعايير" : "Policies & Standards",
      icon: DocumentTextIcon,
      href: "/governance",
      color: isSalam ? salamColors.primaryButton : "bg-purple-600",
      hoverColor: isSalam ? salamColors.primaryButton : "hover:bg-purple-700",
    },
    {
      title: t("nav.qa"),
      description:
        lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions",
      icon: LightBulbIcon,
      href: "/qa",
      color: isSalam ? salamColors.primaryButton : "bg-yellow-600",
      hoverColor: isSalam ? salamColors.primaryButton : "hover:bg-yellow-700",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "success" as const,
      message:
        lang === "ar"
          ? "تم تحديث سياسة كلمات المرور بنجاح"
          : "Password policy updated successfully",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info" as const,
      message:
        lang === "ar"
          ? "تم إضافة 3 موظفين جدد للنظام"
          : "3 new employees added to the system",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "error" as const,
      message:
        lang === "ar"
          ? "تم اكتشاف محاولة تسجيل دخول مشبوهة"
          : "Suspicious login attempt detected",
      time: "6 hours ago",
    },
  ];

  const activeProjects = [
    {
      id: 1,
      name: "SOC Modernization",
      progress: 75,
      status: "active",
      team: 8,
      deadline: "2024-03-15",
    },
    {
      id: 2,
      name: "Zero Trust Implementation",
      progress: 45,
      status: "active",
      team: 12,
      deadline: "2024-04-20",
    },
    {
      id: 3,
      name: "Employee Awareness Program",
      progress: 90,
      status: "active",
      team: 5,
      deadline: "2024-02-28",
    },
  ];

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Dashboard calculations
  const completedTasks = tasksData.filter((t) => t.status === 'Completed').length;
  const totalTasks = tasksData.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Leave data
  const totalLeaves = 30;
  const usedLeaves = 16;
  const remainingLeaves = totalLeaves - usedLeaves;
  const leavesRate = Math.round((remainingLeaves / totalLeaves) * 100);

  // Project data
  const completedProjects = projectsData.filter((p) => p.status === 'Completed').length;
  const totalProjects = projectsData.length;
  const projectsRate = Math.round((completedProjects / totalProjects) * 100);

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center content-animate">
            <h1 className="page-title text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">
                {t("home.welcome")} {t("home.portal")}
              </span>
            </h1>
            <p className="page-subtitle text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
              {t("home.subtitle")}
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`${link.color} ${link.hoverColor} text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 group`}
                >
                  <link.icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  {link.title}
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Alerts & Quick Stats */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Important Alerts */}
            <section className="content-animate">
              <h2 className="heading-2 mb-6 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                {t("home.important_alerts")}
              </h2>
                             <div className="space-y-4">
                 {alerts.map((alert) => (
                   <Alert
                     key={alert.id}
                     id={alert.id}
                     type={alert.type}
                     title={alert.title}
                     message={alert.message}
                     date={alert.date}
                     onDismiss={handleDismissAlert}
                   />
                 ))}
               </div>
            </section>

            {/* Quick Stats */}
            <section className="content-animate">
              <h2 className="heading-2 mb-6 flex items-center gap-3">
                <ChartBarIcon className="w-6 h-6 text-blue-400" />
                {lang === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="stat-card p-4 text-center">
                  <div className="stat-value text-2xl font-bold text-green-400">
                    {activeProjects.length}
                  </div>
                  <div className="stat-label text-sm text-slate-400">
                    {t("home.active_projects")}
                  </div>
                </div>
                <div className="stat-card p-4 text-center">
                  <div className="stat-value text-2xl font-bold text-blue-400">
                    {completionRate}%
                  </div>
                  <div className="stat-label text-sm text-slate-400">
                    {lang === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activities */}
            <section className="content-animate">
              <h2 className="heading-2 mb-6 flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-yellow-400" />
                {t("home.recent_activity")}
              </h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`activity-${activity.type} p-3 rounded-lg`}
                  >
                    <p className="text-sm text-slate-300 mb-1">
                      {activity.message}
                    </p>
                    <span className="text-xs text-slate-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Center Column - Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* User Info & Achievements */}
            <section className="content-animate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info Card */}
                <div className={`card card-hover ${styles.card} p-6 rounded-xl flex flex-col items-center text-center`} dir={dir}>
                  <div className={`rounded-full p-3 border-2 mb-4 ${styles.avatar}`}>
                    <UserIcon className="w-12 h-12 text-base-content" />
                  </div>
                  <div className={`text-xl font-bold mb-2 ${styles.name}`}>
                    {employee.name}
                  </div>
                  <div className={`text-base font-semibold mb-2 ${styles.secondary}`}>
                    {employee.position}
                  </div>
                  <div className={`text-sm ${styles.department}`}>
                    {employee.department}
                  </div>
                </div>

                {/* Achievements Card */}
                <div className={`card card-hover ${styles.card} p-6 rounded-xl`} dir={dir}>
                  <div className="flex items-center gap-2 mb-4">
                    <TrophyIcon className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-bold">
                      {lang === 'ar' ? 'إنجازات المستخدم' : 'User Achievements'}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {achievementsData.slice(0, 2).map((ach, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        {ach.icon}
                        <span>{lang === 'ar' ? ach.ar : ach.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Progress Circles */}
            <section className="content-animate">
              <div className="card-hover group p-6 rounded-xl bg-[#101e2c] border border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tasks Completion */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-2">
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

                  {/* Leave Balance */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-2">
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
                    <div className="w-24 h-24 mb-2">
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
            </section>

            {/* Projects & Tasks */}
            <section className="content-animate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Projects */}
                <div className="card-hover group p-6 rounded-xl bg-[#101e2c] border border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <ChartBarIcon className="w-6 h-6 text-blue-400" />
                    <h2 className="text-lg font-bold text-white">{lang === 'ar' ? 'المشاريع المرتبطة' : 'Related Projects'}</h2>
                  </div>
                  <div className="space-y-3">
                    {projectsData.slice(0, 2).map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                        <span className="font-bold text-white text-sm">{p.name}</span>
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold text-white bg-green-600">{p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="card-hover group p-6 rounded-xl bg-[#101e2c] border border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-lg font-bold text-white">{lang === 'ar' ? 'المهام المرتبطة' : 'Related Tasks'}</h2>
                  </div>
                  <div className="space-y-3">
                    {tasksData.slice(0, 2).map((t) => (
                      <div key={t.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                        <span className="font-bold text-white text-sm">{t.title}</span>
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600">{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Active Projects */}
            <section className="content-animate">
              <h2 className="heading-2 mb-6 flex items-center gap-3">
                <ChartBarIcon className="w-6 h-6 text-green-400" />
                {t("home.active_projects")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map((project) => (
                  <div key={project.id} className="card card-hover p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'active' ? (lang === 'ar' ? 'نشط' : 'Active') : project.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">{lang === 'ar' ? 'الفريق' : 'Team'}</span>
                          <div className="font-semibold">{project.team} {lang === 'ar' ? 'أعضاء' : 'members'}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">{lang === 'ar' ? 'الموعد' : 'Deadline'}</span>
                          <div className="font-semibold">{project.deadline}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
