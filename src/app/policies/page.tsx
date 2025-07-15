"use client";

import Navigation from "@/components/Navigation";
import {
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useLang } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";

const policiesData = [
  {
    id: 1,
    title: {
      en: "Password Policy",
      ar: "سياسة كلمات المرور",
    },
    summary: {
      en: "Defines requirements for password complexity, rotation, and management.",
      ar: "تحدد متطلبات تعقيد كلمات المرور وتغييرها وإدارتها.",
    },
    category: {
      en: "Access Control",
      ar: "التحكم في الوصول",
    },
    version: "3.2",
    updated: "2024-05-15",
    fileSize: "245 KB",
    downloads: 156,
  },
  {
    id: 2,
    title: {
      en: "Acceptable Use Policy",
      ar: "سياسة الاستخدام المقبول",
    },
    summary: {
      en: "Outlines acceptable and prohibited uses of company IT resources.",
      ar: "توضح الاستخدامات المقبولة والممنوعة لموارد تقنية المعلومات بالشركة.",
    },
    category: {
      en: "Resource Management",
      ar: "إدارة الموارد",
    },
    version: "4.0",
    updated: "2024-04-28",
    fileSize: "890 KB",
    downloads: 234,
  },
  {
    id: 3,
    title: {
      en: "Incident Response Policy",
      ar: "سياسة الاستجابة للحوادث",
    },
    summary: {
      en: "Describes procedures for responding to cybersecurity incidents.",
      ar: "تصف إجراءات الاستجابة للحوادث السيبرانية.",
    },
    category: {
      en: "Incident Management",
      ar: "إدارة الحوادث",
    },
    version: "2.1",
    updated: "2024-03-10",
    fileSize: "1.2 MB",
    downloads: 89,
  },
  {
    id: 4,
    title: {
      en: "Data Protection Policy",
      ar: "سياسة حماية البيانات",
    },
    summary: {
      en: "Guidelines for protecting sensitive company and customer data.",
      ar: "إرشادات لحماية البيانات الحساسة للشركة والعملاء.",
    },
    category: {
      en: "Data Security",
      ar: "أمان البيانات",
    },
    version: "1.8",
    updated: "2024-02-20",
    fileSize: "756 KB",
    downloads: 178,
  },
  {
    id: 5,
    title: {
      en: "Network Security Policy",
      ar: "سياسة أمان الشبكات",
    },
    summary: {
      en: "Standards and procedures for network security and infrastructure.",
      ar: "معايير وإجراءات أمان الشبكات والبنية التحتية.",
    },
    category: {
      en: "Network Security",
      ar: "أمان الشبكات",
    },
    version: "3.1",
    updated: "2024-01-15",
    fileSize: "1.5 MB",
    downloads: 95,
  },
];

export default function PoliciesPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);

  const handleDownload = (policy: any) => {
    // في التطبيق الحقيقي، هنا سيتم تحميل الملف
    console.log(`Downloading ${policy.title[lang]}`);
    alert(
      `${lang === "ar" ? "سيتم تحميل" : "Downloading"}: ${policy.title[lang]}`
    );
  };

  const handleView = (policy: any) => {
    // في التطبيق الحقيقي، هنا سيتم عرض الملف
    console.log(`Viewing ${policy.title[lang]}`);
    alert(`${lang === "ar" ? "سيتم عرض" : "Viewing"}: ${policy.title[lang]}`);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <DocumentTextIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">{t("policies.title")}</h1>
          <p className="page-subtitle subtitle-animate">
            {t("policies.intro")}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 content-animate">
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">
              {policiesData.length}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {lang === "ar" ? "إجمالي السياسات" : "Total Policies"}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-blue-400 mb-3">
              {policiesData.reduce((acc, policy) => acc + policy.downloads, 0)}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {lang === "ar" ? "إجمالي التحميلات" : "Total Downloads"}
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 content-animate">
          {policiesData.map((policy, index) => (
            <div
              key={policy.id}
              className="card-hover group p-8 stagger-animate"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`flex items-center ${
                    lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
                  }`}
                >
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {policy.title[lang]}
                    </h3>
                    <div
                      className={`flex items-center text-sm text-slate-400 ${
                        lang === "ar"
                          ? "space-x-reverse space-x-3"
                          : "space-x-3"
                      }`}
                    >
                      <span className="font-medium">
                        {policy.category[lang]}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>v{policy.version}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center ${
                    lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                  }`}
                >
                  <span className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium border border-green-500/30">
                    {lang === "ar" ? "نشط" : "Active"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 mb-8 leading-relaxed text-base">
                {policy.summary[lang]}
              </p>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div
                  className={`flex items-center text-sm text-slate-400 ${
                    lang === "ar" ? "space-x-reverse space-x-3" : "space-x-3"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5 text-slate-500" />
                  <span className="font-medium">
                    {new Date(policy.updated).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  <span className="font-medium">
                    {lang === "ar" ? "الحجم" : "Size"}:
                  </span>{" "}
                  {policy.fileSize}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div
                  className={`flex items-center text-sm text-slate-400 ${
                    lang === "ar" ? "space-x-reverse space-x-6" : "space-x-6"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">
                      {policy.downloads} {lang === "ar" ? "تحميل" : "downloads"}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center ${
                    lang === "ar" ? "space-x-reverse space-x-3" : "space-x-3"
                  }`}
                >
                  <button
                    onClick={() => handleView(policy)}
                    className="btn-secondary text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-700"
                  >
                    <EyeIcon
                      className={`w-4 h-4 ${lang === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {lang === "ar" ? "عرض" : "View"}
                  </button>
                  <button
                    onClick={() => handleDownload(policy)}
                    className="btn-primary text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-700"
                  >
                    <ArrowDownTrayIcon
                      className={`w-4 h-4 ${lang === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {lang === "ar" ? "تحميل" : "Download"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="card border-green-500/30 p-8 content-animate">
          <div
            className={`flex items-start ${
              lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
            }`}
          >
            <DocumentTextIcon className="w-7 h-7 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {lang === "ar" ? "ملاحظة مهمة" : "Important Notice"}
              </h3>
              <p className="text-slate-300 leading-relaxed text-base">
                {lang === "ar"
                  ? "جميع السياسات المذكورة أعلاه إلزامية لجميع موظفي الشركة. يرجى قراءة وفهم هذه السياسات والالتزام بها. في حالة وجود أي استفسارات، يرجى التواصل مع فريق الأمن السيبراني."
                  : "All policies listed above are mandatory for all company employees. Please read and understand these policies and comply with them. If you have any questions, please contact the cybersecurity team."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
