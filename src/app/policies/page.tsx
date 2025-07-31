"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useLang, useTheme } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";

interface Policy {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  version: string;
  file_size: string;
  file_url?: string;
  downloads: number;
  views: number;
  status: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export default function PoliciesPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  
  // Tab state management
  const [activeTab, setActiveTab] = useState<'policies' | 'standards' | 'procedures'>('policies');
  
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [standards, setStandards] = useState<Policy[]>([]);
  const [procedures, setProcedures] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Theme colors based on current theme
  const colors = {
    default: {
      primary: 'text-green-500',
      primaryHover: 'text-green-400',
      primaryBg: 'bg-green-500',
      primaryBgHover: 'bg-green-400',
      cardBg: 'bg-slate-900',
      cardBgHover: 'bg-slate-800',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      borderPrimary: 'border-slate-700',
      borderHover: 'border-green-500',
    },
    light: {
      primary: 'text-green-600',
      primaryHover: 'text-green-500',
      primaryBg: 'bg-green-600',
      primaryBgHover: 'bg-green-500',
      cardBg: 'bg-white',
      cardBgHover: 'bg-slate-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      borderPrimary: 'border-slate-200',
      borderHover: 'border-green-500',
    },
    midnight: {
      primary: 'text-green-400',
      primaryHover: 'text-green-300',
      primaryBg: 'bg-green-400',
      primaryBgHover: 'bg-green-300',
      cardBg: 'bg-slate-800',
      cardBgHover: 'bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      borderPrimary: 'border-slate-600',
      borderHover: 'border-green-400',
    },
    novel: {
      primary: 'text-green-500',
      primaryHover: 'text-green-400',
      primaryBg: 'bg-green-500',
      primaryBgHover: 'bg-green-400',
      cardBg: 'bg-slate-900',
      cardBgHover: 'bg-slate-800',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      borderPrimary: 'border-slate-700',
      borderHover: 'border-green-500',
    },
    cyber: {
      primary: 'text-green-400',
      primaryHover: 'text-green-300',
      primaryBg: 'bg-green-400',
      primaryBgHover: 'bg-green-300',
      cardBg: 'bg-slate-900',
      cardBgHover: 'bg-slate-800',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      borderPrimary: 'border-slate-700',
      borderHover: 'border-green-400',
    }
  }[theme];

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/api/policies';
        
        // Use different endpoints for different tabs
        if (activeTab === 'standards') {
          endpoint = '/api/standards';
        } else if (activeTab === 'procedures') {
          endpoint = '/api/procedures';
        }
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          
          if (activeTab === 'policies') {
            setPolicies(data);
          } else if (activeTab === 'standards') {
            setStandards(data);
          } else if (activeTab === 'procedures') {
            setProcedures(data);
          }
        } else {
          console.error(`Failed to fetch ${activeTab}:`, response.status, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDownload = async (item: Policy) => {
    try {
      // Update download count via API based on active tab
      let endpoint = `/api/policies/${item.id}/download`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${item.id}/download`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${item.id}/download`;
      }
      
      await fetch(endpoint, {
        method: 'POST',
      });

      // Simulate download
      const link = document.createElement('a');
      link.href = item.file_url || "#";
      link.download = `${lang === 'ar' ? item.title_ar : item.title_en}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state based on active tab
      const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
        setItems(items.map((p) =>
          p.id === item.id ? { ...p, downloads: p.downloads + 1 } : p
        ));
      };

      if (activeTab === 'policies') {
        updateState(policies, setPolicies);
      } else if (activeTab === 'standards') {
        updateState(standards, setStandards);
      } else if (activeTab === 'procedures') {
        updateState(procedures, setProcedures);
      }
    } catch (error) {
      console.error('Error downloading item:', error);
    }
  };

  const handleView = async (item: Policy) => {
    try {
      // Update view count via API based on active tab
      let endpoint = `/api/policies/${item.id}/view`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${item.id}/view`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${item.id}/view`;
      }
      
      await fetch(endpoint, {
        method: 'POST',
      });

      // Update local state based on active tab
      const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
        setItems(items.map((p) =>
          p.id === item.id ? { ...p, views: p.views + 1 } : p
        ));
      };

      if (activeTab === 'policies') {
        updateState(policies, setPolicies);
      } else if (activeTab === 'standards') {
        updateState(standards, setStandards);
      } else if (activeTab === 'procedures') {
        updateState(procedures, setProcedures);
      }
      
      // Open item in new tab
      window.open(item.file_url || "#", '_blank');
    } catch (error) {
      console.error('Error viewing item:', error);
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'policies':
        return policies;
      case 'standards':
        return standards;
      case 'procedures':
        return procedures;
      default:
        return policies;
    }
  };

  // Get current stats based on active tab
  const getCurrentStats = () => {
    const data = getCurrentData();
    return {
      total: data.length,
      downloads: data.reduce((acc: number, item: Policy) => acc + item.downloads, 0),
      views: data.reduce((acc: number, item: Policy) => acc + item.views, 0),
    };
  };

  const currentData = getCurrentData();
  const stats = getCurrentStats();

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ShieldCheckIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {t('policies.title')}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {t('policies.intro')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 content-animate">
          <div className={`flex rounded-lg p-1 ${colors.cardBg} border ${colors.borderPrimary}`}>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'policies'
                  ? `${colors.primaryBg} text-white shadow-lg`
                  : `${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {t('policies.policies_tab')}
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'standards'
                  ? `${colors.primaryBg} text-white shadow-lg`
                  : `${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {t('policies.standards_tab')}
            </button>
            <button
              onClick={() => setActiveTab('procedures')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'procedures'
                  ? `${colors.primaryBg} text-white shadow-lg`
                  : `${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {t('policies.procedures_tab')}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 content-animate">
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">
              {stats.total}
            </div>
                          <div className="text-slate-300 text-sm font-medium">
                {t('policies.total_items')}
              </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-blue-400 mb-3">
              {stats.downloads}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_downloads")}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-purple-400 mb-3">
              {stats.views}
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

        {/* Content based on active tab */}
        {!isLoading && currentData.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <div className="text-slate-400 text-lg">
              {t('policies.no_items')}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 content-animate">
          {currentData.map((item: Policy, index: number) => (
            <div
              key={item.id}
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
                      {lang === 'ar' ? item.title_ar : item.title_en}
                    </h3>
                    <div
                      className={`flex items-center text-sm text-slate-400 ${
                        lang === "ar"
                          ? "space-x-reverse space-x-3"
                          : "space-x-3"
                      }`}
                    >
                      <span>v{item.version}</span>
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
                {lang === 'ar' ? item.description_ar : item.description_en}
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
                    {new Date(item.updated_at).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  <span className="font-medium">
                    {lang === "ar" ? "الحجم" : "Size"}:
                  </span>{" "}
                  {item.file_size}
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
                      {item.downloads} {t("grc.downloads")}
                    </span>
                  </div>
                  <div
                    className={`flex items-center ${
                      lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                  >
                    <EyeIcon className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">
                      {item.views} {t("grc.views")}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center ${
                    lang === "ar" ? "space-x-reverse space-x-3" : "space-x-3"
                  }`}
                >
                  <button
                    onClick={() => handleView(item)}
                    className="btn-secondary text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-700"
                  >
                    <EyeIcon
                      className={`w-4 h-4 ${lang === "ar" ? "ml-2" : "mr-2"}`}
                    />
                    {lang === "ar" ? "عرض" : "View"}
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
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
            <ShieldCheckIcon className="w-7 h-7 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {lang === "ar" ? "ملاحظة مهمة" : "Important Notice"}
              </h3>
              <p className="text-slate-300 leading-relaxed text-base">
                {lang === "ar"
                  ? "جميع السياسات والمعايير والإجراءات المذكورة أعلاه إلزامية لجميع موظفي الشركة. يرجى قراءة وفهم هذه الوثائق والالتزام بها. في حالة وجود أي استفسارات، يرجى التواصل مع فريق الأمن السيبراني."
                  : "All policies, standards, and procedures listed above are mandatory for all company employees. Please read and understand these documents and comply with them. If you have any questions, please contact the cybersecurity team."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
