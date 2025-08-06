"use client";

import { useState } from "react";
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
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useLang, useTheme } from "./ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import Image from "next/image";

export default function HomePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);

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
      color: "bg-green-600",
    },
    {
      title: t("nav.policies"),
      description:
        lang === "ar" ? "السياسات والمعايير والإجراءات" : "Policies, Standards & Procedures",
      icon: DocumentTextIcon,
      href: "/policies",
      color: "bg-slate-700",
    },
    {
      title: t("nav.projects"),
      description: lang === "ar" ? "المشاريع الجارية" : "Ongoing Projects",
      icon: ChartBarIcon,
      href: "/projects",
      color: "bg-blue-800",
    },
    {
      title: t("nav.news"),
      description: lang === "ar" ? "الأخبار والتحديثات" : "News & Updates",
      icon: InformationCircleIcon,
      href: "/news",
      color: "bg-yellow-700",
    },
  ];

  const stats = [
    { label: t("home.active_projects"), value: "12", change: "+2", icon: "🔧" },
    { label: t("home.employees"), value: "35", change: "+1", icon: "🧑‍💼" },
    {
      label: t("home.security_incidents"),
      value: "2",
      change: "-1",
      icon: "🚨",
    },
    { label: t("home.security_rate"), value: "97%", change: "+2%", icon: "🛡️" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "success",
      title: lang === "ar" ? "تقييم داخلي" : "Internal Assessment",
      time: lang === "ar" ? "9 يوليو" : "July 9",
      icon: "✅",
    },
    {
      id: 2,
      type: "info",
      title: lang === "ar" ? "تحديث سياسة" : "Policy Update",
      time: lang === "ar" ? "7 يوليو" : "July 7",
      icon: "🔄",
    },
    {
      id: 3,
      type: "error",
      title: lang === "ar" ? "محاولة اختراق" : "Breach Attempt",
      time: lang === "ar" ? "6 يوليو" : "July 6",
      icon: "❌",
    },
  ];

  const upcomingEvents = [
    {
      date: lang === "ar" ? "15 يوليو" : "July 15",
      title: lang === "ar" ? "تقييم المخاطر" : "Risk Assessment",
      type: "assessment",
    },
    {
      date: lang === "ar" ? "20 يوليو" : "July 20",
      title: lang === "ar" ? "تمرين داخلي" : "Internal Exercise",
      type: "exercise",
    },
  ];

  const latestReports = [
    {
      date: lang === "ar" ? "10 يوليو" : "July 10",
      title: lang === "ar" ? "تقرير حادثة اختراق" : "Breach Incident Report",
      type: "incident",
    },
    {
      date: lang === "ar" ? "Q2" : "Q2",
      title: lang === "ar" ? "تقرير تحليل التهديدات" : "Threat Analysis Report",
      type: "analysis",
    },
  ];

  const globalThreats = [
    {
      source: "CISA",
      threat: lang === "ar" ? "ثغرة جديدة" : "New Vulnerability",
      severity: "high",
    },
    {
      source: "Kaspersky",
      threat: lang === "ar" ? "نشاط مشبوه" : "Suspicious Activity",
      severity: "medium",
    },
  ];

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="page-header content-animate">
          <div className="page-header-icon icon-animate">
            <Image
              src="/images/250411_Salam_Logo_En_RGB_White_Wordmark.png"
              alt="Salam Logo"
              width={200}
              height={80}
              className=""
            />
          </div>
          <h1 className="page-title title-animate">
            {t("home.welcome")} {" "}
            <span className="text-gradient">{t("home.portal")}</span>
          </h1>
          <p className="page-subtitle subtitle-animate">{t("home.subtitle")}</p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 content-animate">
          {/* Alerts Section */}
          <div className="card p-6 content-animate">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-[#003931]' : ''
            }`}>
              <ExclamationTriangleIcon className={`w-5 h-5 ${
                isSalam ? `text-[${salamColors.activeIcon}]` : 'text-yellow-500'
              }`} />
              {t("home.important_alerts")}
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg stagger-animate ${
                    isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                  }`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        alert.type === "critical"
                          ? isSalam ? `bg-[${salamColors.successAlert}]` : "bg-red-500"
                          : alert.type === "warning"
                          ? isSalam ? `bg-[${salamColors.warningAlert}]` : "bg-yellow-500"
                          : isSalam ? `bg-[${salamColors.infoAlert}]` : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-sm ${
                        isSalam ? 'text-black' : 'text-white'
                      }`}>
                        {alert.title}
                      </p>
                      <p className={`text-xs truncate ${
                        isSalam ? 'text-black' : 'text-slate-400'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`btn-icon ${
                      isSalam ? `text-[${salamColors.secondaryText}] hover:text-[${salamColors.activeIcon}]` : ''
                    }`}
                    onClick={() => handleDismissAlert(alert.id)}
                    aria-label={
                      lang === "ar" ? "إغلاق التنبيه" : "Dismiss alert"
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="card p-6 content-animate">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-[#003931]' : ''
            }`}>
              <span className="text-2xl">📊</span>
              <span>{lang === "ar" ? "الإحصائيات" : "Statistics"}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-3 rounded-lg stagger-animate ${
                    isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                  }`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-xl font-bold mb-1 ${
                    isSalam ? `text-[${salamColors.highlightText}]` : 'text-green-400'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs mb-2 ${
                    isSalam ? 'text-black' : 'text-slate-300'
                  }`}>
                    {stat.label}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      stat.change.startsWith("+")
                        ? isSalam ? `text-[${salamColors.successAlert}]` : "text-green-400"
                        : isSalam ? "text-red-600" : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 content-animate">
          {/* Quick Links */}
          <div className="card p-6 content-animate">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-[#003931]' : ''
            }`}>
              <span className="text-2xl">🔗</span>
              <span>{lang === "ar" ? "الروابط السريعة" : "Quick Links"}</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link key={index} href={link.href}>
                    <div className={`card-hover group cursor-pointer p-4 text-center stagger-animate ${
                      isSalam ? 'hover:scale-105' : ''
                    }`} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                          isSalam ? `bg-[${salamColors.primaryButton}]` : link.color
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${
                          isSalam ? `text-[${salamColors.primaryButtonText}]` : 'text-white'
                        }`} />
                      </div>
                      <h3 className={`text-sm font-bold mb-2 ${
                        isSalam ? 'text-black' : 'text-white'
                      }`}>
                        {link.title}
                      </h3>
                      <p className={`text-xs ${
                        isSalam ? 'text-black' : 'text-slate-400'
                      }`}>
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6 content-animate">
            <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
              isSalam ? 'text-[#003931]' : ''
            }`}>
              <span className="text-2xl">🕒</span>
              <span>{lang === "ar" ? "النشاط الأخير" : "Recent Activity"}</span>
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 rounded-lg stagger-animate ${
                    isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                  }`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <span className="text-lg flex-shrink-0">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${
                      isSalam ? 'text-black' : 'text-white'
                    }`}>
                      {activity.title}
                    </p>
                    <p className={`text-xs ${
                      isSalam ? 'text-black' : 'text-slate-400'
                    }`}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cyber Tip of the Day */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
            isSalam ? 'text-[#003931]' : ''
          }`}>
            <LightBulbIcon className={`w-5 h-5 ${
              isSalam ? `text-[${salamColors.activeIcon}]` : 'text-yellow-500'
            }`} />
            <span>
              {lang === "ar"
                ? "نصيحة الأمن السيبراني اليوم"
                : "Cyber Tip of the Day"}
            </span>
          </h2>
          <p className={`text-lg ${
            isSalam ? 'text-black' : 'text-slate-300'
          }`}>
            {lang === "ar"
              ? '"لا تفتح مرفقات البريد من مصادر مجهولة."'
              : '"Do not open email attachments from unknown sources."'}
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
            isSalam ? 'text-[#003931]' : ''
          }`}>
            <CalendarIcon className={`w-5 h-5 ${
              isSalam ? `text-[${salamColors.activeIcon}]` : 'text-blue-500'
            }`} />
            <span>{lang === "ar" ? "الأحداث القادمة" : "Upcoming Events"}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg stagger-animate ${
                  isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                }`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className={`font-bold flex-shrink-0 ${
                  isSalam ? `text-[${salamColors.highlightText}]` : 'text-blue-400'
                }`}>
                  {event.date}
                </div>
                <div className={`font-medium ${
                  isSalam ? 'text-black' : 'text-white'
                }`}>{event.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reports */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
            isSalam ? 'text-[#003931]' : ''
          }`}>
            <DocumentTextIcon className={`w-5 h-5 ${
              isSalam ? `text-[${salamColors.activeIcon}]` : 'text-green-500'
            }`} />
            <span>{lang === "ar" ? "أحدث التقارير" : "Latest Reports"}</span>
          </h2>
          <div className="space-y-3">
            {latestReports.map((report, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg stagger-animate ${
                  isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                }`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className={`font-bold flex-shrink-0 ${
                  isSalam ? `text-[${salamColors.highlightText}]` : 'text-green-400'
                }`}>
                  {report.date}
                </div>
                <div className={`font-medium ${
                  isSalam ? 'text-black' : 'text-white'
                }`}>{report.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Threat Feed */}
        <div className="card p-6 content-animate">
          <h2 className={`heading-2 mb-4 flex items-center gap-2 ${
            isSalam ? 'text-[#003931]' : ''
          }`}>
            <GlobeAltIcon className={`w-5 h-5 ${
              isSalam ? `text-[${salamColors.activeIcon}]` : 'text-red-500'
            }`} />
            <span>
              {lang === "ar"
                ? "تغذية التهديدات العالمية"
                : "Global Threat Feed"}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {globalThreats.map((threat, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg stagger-animate ${
                  isSalam ? `bg-[${salamColors.cardBackground}]/90 border border-[${salamColors.cardBorder}] shadow-sm` : 'bg-slate-800'
                }`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div
                  className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                    threat.severity === "high"
                      ? isSalam ? `bg-[${salamColors.successAlert}] text-[${salamColors.whiteText}]` : "bg-red-600 text-white"
                      : isSalam ? `bg-[${salamColors.warningAlert}] text-[${salamColors.primaryText}]` : "bg-yellow-600 text-white"
                  }`}
                >
                  {threat.source}
                </div>
                <div className={`font-medium ${
                  isSalam ? 'text-black' : 'text-white'
                }`}>{threat.threat}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
