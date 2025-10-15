"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import {
  ShieldCheckIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useLang, useTheme } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import SOCShiftManagement from "./components/SOCShiftManagement";

export default function SOCPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  
  // Theme-aware styling
  const isSalam = theme === 'salam';
  
  // Tab state management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shift-management'>('dashboard');

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Consistent with GRC */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ShieldCheckIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">{t("soc.title")}</h1>
          <p className="page-subtitle subtitle-animate">
            {t("soc.intro")}
          </p>
        </div>

        {/* Tab Switcher - Consistent with GRC */}
        <div className="flex justify-center mb-8 content-animate">
          <div className={`flex rounded-lg p-1 ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? isSalam
                    ? 'bg-[#00F000] text-[#003931] shadow-lg'
                    : 'bg-green-500 text-white shadow-lg'
                  : isSalam
                    ? 'text-[#005147] hover:text-[#003931] hover:bg-[#EEFDEC]'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('soc.dashboard_tab')}
            </button>
            <button
              onClick={() => setActiveTab('shift-management')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'shift-management'
                  ? isSalam
                    ? 'bg-[#00F000] text-[#003931] shadow-lg'
                    : 'bg-green-500 text-white shadow-lg'
                  : isSalam
                    ? 'text-[#005147] hover:text-[#003931] hover:bg-[#EEFDEC]'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('soc.shifts_tab')}
            </button>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Card */}
            <div className={`p-8 mb-12 content-animate ${
              isSalam ? 'bg-white border border-[#003931] rounded-xl shadow-lg' : 'card'
            }`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl mb-4">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-3xl font-bold mb-4 ${
                  isSalam ? 'text-[#003931]' : 'text-white'
                }`}>
                  {t('soc.dashboard_content_title')}
                </h2>
                <p className={`text-lg ${
                  isSalam ? 'text-[#005147]' : 'text-slate-400'
                }`}>
                  {t('soc.dashboard_content_description')}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Incidents */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isSalam ? 'bg-white border border-[#003931]' : 'card'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <ShieldCheckIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      isSalam ? 'text-[#005147]' : 'text-slate-400'
                    }`}>
                      {lang === 'ar' ? 'الحوادث النشطة' : 'Active Incidents'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      0
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isSalam ? 'bg-white border border-[#003931]' : 'card'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      isSalam ? 'text-[#005147]' : 'text-slate-400'
                    }`}>
                      {lang === 'ar' ? 'أعضاء الفريق' : 'Team Members'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      14
                    </p>
                  </div>
                </div>
              </div>

              {/* Shift Coverage */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isSalam ? 'bg-white border border-[#003931]' : 'card'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      isSalam ? 'text-[#005147]' : 'text-slate-400'
                    }`}>
                      {lang === 'ar' ? 'تغطية المناوبات' : 'Shift Coverage'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      100%
                    </p>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className={`p-6 rounded-xl shadow-lg ${
                isSalam ? 'bg-white border border-[#003931]' : 'card'
              }`}>
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      isSalam ? 'text-[#005147]' : 'text-slate-400'
                    }`}>
                      {lang === 'ar' ? 'صحة النظام' : 'System Health'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-8 rounded-xl shadow-lg ${
              isSalam ? 'bg-white border border-[#003931]' : 'card'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                {lang === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('shift-management')}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid hover:scale-105 ${
                    isSalam 
                      ? 'border-[#003931] hover:bg-[#EEFDEC] hover:border-[#00F000]'
                      : 'border-slate-600 hover:bg-slate-800 hover:border-blue-500'
                  }`}
                >
                  <CalendarDaysIcon className={`w-8 h-8 mx-auto mb-2 ${
                    isSalam ? 'text-[#005147]' : 'text-slate-400'
                  }`} />
                  <p className={`font-medium ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'إدارة المناوبات' : 'Manage Shifts'}
                  </p>
                </button>
                
                <button
                  className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid hover:scale-105 ${
                    isSalam 
                      ? 'border-[#003931] hover:bg-[#EEFDEC] hover:border-[#00F000]'
                      : 'border-slate-600 hover:bg-slate-800 hover:border-blue-500'
                  }`}
                >
                  <ShieldCheckIcon className={`w-8 h-8 mx-auto mb-2 ${
                    isSalam ? 'text-[#005147]' : 'text-slate-400'
                  }`} />
                  <p className={`font-medium ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'مراقبة الحوادث' : 'Monitor Incidents'}
                  </p>
                </button>
                
                <button
                  className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid hover:scale-105 ${
                    isSalam 
                      ? 'border-[#003931] hover:bg-[#EEFDEC] hover:border-[#00F000]'
                      : 'border-slate-600 hover:bg-slate-800 hover:border-blue-500'
                  }`}
                >
                  <UserGroupIcon className={`w-8 h-8 mx-auto mb-2 ${
                    isSalam ? 'text-[#005147]' : 'text-slate-400'
                  }`} />
                  <p className={`font-medium ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'إدارة الفريق' : 'Manage Team'}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shift Management Tab Content */}
        {activeTab === 'shift-management' && (
          <SOCShiftManagement />
        )}
      </main>
    </div>
  );
}