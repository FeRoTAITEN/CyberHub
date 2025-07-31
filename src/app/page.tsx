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
import { useLang } from "./ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import Image from "next/image";

export default function HomePage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);

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
              src="/images/logo.png"
              alt="Cyber Hub Logo"
              width={80}
              height={80}
              className="rounded-full"
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
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              {t("home.important_alerts")}
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg stagger-animate"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        alert.type === "critical"
                          ? "bg-red-500"
                          : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm">
                        {alert.title}
                      </p>
                      <p className="text-slate-400 text-xs truncate">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn-icon"
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
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>{lang === "ar" ? "الإحصائيات" : "Statistics"}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-slate-800 rounded-lg stagger-animate"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-green-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-300 text-xs mb-2">
                    {stat.label}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      stat.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
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
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              <span>{lang === "ar" ? "الروابط السريعة" : "Quick Links"}</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link key={index} href={link.href}>
                    <div className="card-hover group cursor-pointer p-4 text-center stagger-animate" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                      <div
                        className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        {link.title}
                      </h3>
                      <p className="text-slate-400 text-xs">
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
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <span className="text-2xl">🕒</span>
              <span>{lang === "ar" ? "النشاط الأخير" : "Recent Activity"}</span>
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg stagger-animate"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <span className="text-lg flex-shrink-0">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">
                      {activity.title}
                    </p>
                    <p className="text-slate-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cyber Tip of the Day */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className="heading-2 mb-4 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            <span>
              {lang === "ar"
                ? "نصيحة الأمن السيبراني اليوم"
                : "Cyber Tip of the Day"}
            </span>
          </h2>
          <p className="text-slate-300 text-lg">
            {lang === "ar"
              ? '"لا تفتح مرفقات البريد من مصادر مجهولة."'
              : '"Do not open email attachments from unknown sources."'}
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className="heading-2 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            <span>{lang === "ar" ? "الأحداث القادمة" : "Upcoming Events"}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg stagger-animate"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="text-blue-400 font-bold flex-shrink-0">
                  {event.date}
                </div>
                <div className="text-white font-medium">{event.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reports */}
        <div className="card p-6 mb-6 content-animate">
          <h2 className="heading-2 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-green-500" />
            <span>{lang === "ar" ? "أحدث التقارير" : "Latest Reports"}</span>
          </h2>
          <div className="space-y-3">
            {latestReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg stagger-animate"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="text-green-400 font-bold flex-shrink-0">
                  {report.date}
                </div>
                <div className="text-white font-medium">{report.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Threat Feed */}
        <div className="card p-6 content-animate">
          <h2 className="heading-2 mb-4 flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-red-500" />
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
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg stagger-animate"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div
                  className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                    threat.severity === "high"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {threat.source}
                </div>
                <div className="text-white font-medium">{threat.threat}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
