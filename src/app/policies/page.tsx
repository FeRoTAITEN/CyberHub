"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useLang } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";

interface Policy {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  version: string;
  file_size: string;
  file_url?: string;
  downloads: number;
  views: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PoliciesPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch policies from API
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies');
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        } else {
          console.error('Failed to fetch policies');
        }
      } catch (error) {
        console.error('Error fetching policies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleDownload = async (policy: Policy) => {
    try {
      // Update download count via API
      await fetch(`/api/policies/${policy.id}/download`, {
        method: 'POST',
      });

      // Simulate download
      const link = document.createElement('a');
      link.href = policy.file_url || "#";
      link.download = `${lang === 'ar' ? policy.title_ar : policy.title_en}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state
      setPolicies(
        policies.map((p) =>
          p.id === policy.id ? { ...p, downloads: p.downloads + 1 } : p
        )
      );
    } catch (error) {
      console.error('Error downloading policy:', error);
    }
  };

  const handleView = async (policy: Policy) => {
    try {
      // Update view count via API
      await fetch(`/api/policies/${policy.id}/view`, {
        method: 'POST',
      });

      // Update local state
      setPolicies(
        policies.map((p) =>
          p.id === policy.id ? { ...p, views: p.views + 1 } : p
        )
      );
      
      // Open policy in new tab
      window.open(policy.file_url || "#", '_blank');
    } catch (error) {
      console.error('Error viewing policy:', error);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 content-animate">
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">
              {policies.length}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_policies")}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-blue-400 mb-3">
              {policies.reduce((acc: number, policy: Policy) => acc + policy.downloads, 0)}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_downloads")}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-purple-400 mb-3">
              {policies.reduce((acc: number, policy: Policy) => acc + policy.views, 0)}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_views")}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-slate-400">{t("grc.loading")}</div>
          </div>
        )}

        {/* Policies Grid */}
        {!isLoading && policies.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <div className="text-slate-400 text-lg">
              {t("grc.no_policies")}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 content-animate">
          {policies.map((policy: Policy, index: number) => (
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
                      {lang === 'ar' ? policy.title_ar : policy.title_en}
                    </h3>
                    <div
                      className={`flex items-center text-sm text-slate-400 ${
                        lang === "ar"
                          ? "space-x-reverse space-x-3"
                          : "space-x-3"
                      }`}
                    >
                      <span className="font-medium">
                        {lang === 'ar' ? policy.category_ar : policy.category_en}
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
                {lang === 'ar' ? policy.description_ar : policy.description_en}
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
                    {new Date(policy.updated_at).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  <span className="font-medium">
                    {lang === "ar" ? "الحجم" : "Size"}:
                  </span>{" "}
                  {policy.file_size}
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
                      {policy.downloads} {t("grc.downloads")}
                    </span>
                  </div>
                  <div
                    className={`flex items-center ${
                      lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                  >
                    <EyeIcon className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">
                      {policy.views} {t("grc.views")}
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
