"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, useTheme } from "@/app/ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import { getRatingOptionLabel } from '@/lib/surveyTypes';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, DocumentTextIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Theme-specific color schemes
const themeColors = {
  default: {
    primary: 'text-green-400',
    primaryHover: 'text-green-300',
    primaryBg: 'bg-green-500',
    primaryBgHover: 'bg-green-400',
    cardBg: 'bg-slate-900',
    cardBgHover: 'bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    borderPrimary: 'border-slate-700',
    borderHover: 'border-green-500',
    inputBg: 'bg-slate-800',
    inputBorder: 'border-slate-600',
    inputPlaceholder: 'placeholder-slate-400',
    iconBg: 'bg-slate-800',
    glassBg: 'bg-slate-900/90',
    glassBorder: 'border-green-500/30',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-500/50',
    errorBg: 'bg-red-500/20',
    errorBorder: 'border-red-500/50',
    warningBg: 'bg-yellow-500/20',
    warningBorder: 'border-yellow-500/50',
    labelBg: 'bg-slate-800/50',
    labelText: 'text-slate-200',
    badgeBg: 'bg-green-500/20',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-500/30'
  },
  light: {
    primary: 'text-green-700',
    primaryHover: 'text-green-600',
    primaryBg: 'bg-green-600',
    primaryBgHover: 'bg-green-500',
    cardBg: 'bg-white',
    cardBgHover: 'bg-slate-50',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textTertiary: 'text-slate-500',
    borderPrimary: 'border-slate-200',
    borderHover: 'border-green-500',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
    inputPlaceholder: 'placeholder-slate-500',
    iconBg: 'bg-slate-100',
    glassBg: 'bg-white/95',
    glassBorder: 'border-green-500/30',
    successBg: 'bg-green-50',
    successBorder: 'border-green-200',
    errorBg: 'bg-red-50',
    errorBorder: 'border-red-200',
    warningBg: 'bg-yellow-50',
    warningBorder: 'border-yellow-200',
    labelBg: 'bg-slate-100',
    labelText: 'text-slate-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
    badgeBorder: 'border-green-200'
  },
  midnight: {
    primary: 'text-green-400',
    primaryHover: 'text-green-300',
    primaryBg: 'bg-green-500',
    primaryBgHover: 'bg-green-400',
    cardBg: 'bg-slate-800',
    cardBgHover: 'bg-slate-700',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    borderPrimary: 'border-slate-600',
    borderHover: 'border-green-500',
    inputBg: 'bg-slate-700',
    inputBorder: 'border-slate-500',
    inputPlaceholder: 'placeholder-slate-400',
    iconBg: 'bg-slate-700',
    glassBg: 'bg-slate-900/90',
    glassBorder: 'border-green-500/30',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-500/50',
    errorBg: 'bg-red-500/20',
    errorBorder: 'border-red-500/50',
    warningBg: 'bg-yellow-500/20',
    warningBorder: 'border-yellow-500/50',
    labelBg: 'bg-slate-700/50',
    labelText: 'text-slate-200',
    badgeBg: 'bg-green-500/20',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-500/30'
  },
  novel: {
    primary: 'text-green-700',
    primaryHover: 'text-green-600',
    primaryBg: 'bg-green-600',
    primaryBgHover: 'bg-green-500',
    cardBg: 'bg-white',
    cardBgHover: 'bg-yellow-50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textTertiary: 'text-gray-500',
    borderPrimary: 'border-yellow-200',
    borderHover: 'border-green-500',
    inputBg: 'bg-white',
    inputBorder: 'border-yellow-200',
    inputPlaceholder: 'placeholder-gray-500',
    iconBg: 'bg-yellow-100',
    glassBg: 'bg-white/95',
    glassBorder: 'border-green-500/30',
    successBg: 'bg-green-50',
    successBorder: 'border-green-200',
    errorBg: 'bg-red-50',
    errorBorder: 'border-red-200',
    warningBg: 'bg-yellow-50',
    warningBorder: 'border-yellow-200',
    labelBg: 'bg-yellow-50',
    labelText: 'text-gray-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
    badgeBorder: 'border-green-200'
  },
  cyber: {
    primary: 'text-green-400',
    primaryHover: 'text-green-300',
    primaryBg: 'bg-green-500',
    primaryBgHover: 'bg-green-400',
    cardBg: 'bg-zinc-900',
    cardBgHover: 'bg-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textTertiary: 'text-zinc-400',
    borderPrimary: 'border-zinc-700',
    borderHover: 'border-green-500',
    inputBg: 'bg-zinc-800',
    inputBorder: 'border-zinc-600',
    inputPlaceholder: 'placeholder-zinc-400',
    iconBg: 'bg-zinc-800',
    glassBg: 'bg-zinc-950/90',
    glassBorder: 'border-green-500/30',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-500/50',
    errorBg: 'bg-red-500/20',
    errorBorder: 'border-red-500/50',
    warningBg: 'bg-yellow-500/20',
    warningBorder: 'border-yellow-500/50',
    labelBg: 'bg-zinc-800/50',
    labelText: 'text-zinc-200',
    badgeBg: 'bg-green-500/20',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-500/30'
  }
};

// Loading Skeleton Component
const LoadingSkeleton = ({ colors }: { colors: any }) => (
  <div className={`w-full max-w-6xl p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border ${colors.cardBg} ${colors.borderPrimary}`}>
    <div className="animate-pulse">
      <div className={`h-10 ${colors.inputBg} rounded-lg mb-8 w-3/4 mx-auto`}></div>
      <div className={`${colors.cardBg} rounded-lg border ${colors.borderPrimary} overflow-hidden mb-8`}>
        <div className={`${colors.primaryBg} px-6 py-4`}>
          <div className="h-6 bg-white/20 rounded w-48"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className={`h-4 ${colors.inputBg} rounded w-20 mb-2`}></div>
              <div className={`h-12 ${colors.inputBg} rounded-lg`}></div>
            </div>
            <div>
              <div className={`h-4 ${colors.inputBg} rounded w-24 mb-2`}></div>
              <div className={`h-12 ${colors.inputBg} rounded-lg`}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${colors.cardBg} rounded-lg border ${colors.borderPrimary} overflow-hidden`}>
        <div className={`${colors.primaryBg} px-6 py-4`}>
          <div className="h-6 bg-white/20 rounded w-32"></div>
        </div>
        <div className="p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6 last:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className={`h-4 bg-slate-700 rounded w-24 mb-2`}></div>
                  <div className={`h-20 bg-slate-700 rounded-lg`}></div>
                </div>
                <div className="md:col-span-2">
                  <div className={`h-5 bg-slate-700 rounded w-3/4 mb-2`}></div>
                  <div className={`h-4 bg-slate-700 rounded w-1/2`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Success State Component
const SuccessState = ({ colors, lang }: { colors: any; lang: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`w-full max-w-2xl p-12 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border ${colors.cardBg} ${colors.borderPrimary} text-center`}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className={`w-20 h-20 ${colors.successBg} ${colors.successBorder} border-2 rounded-full flex items-center justify-center mx-auto mb-6`}
    >
      <CheckCircleIcon className="w-12 h-12 text-green-500" />
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`text-3xl font-bold mb-4 ${colors.textPrimary}`}
    >
      {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Successfully Submitted!'}
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`text-lg ${colors.textSecondary} mb-8`}
    >
      {lang === 'ar' 
        ? 'شكراً لك على مشاركة آرائك معنا. تم حفظ استجابتك بنجاح.' 
        : 'Thank you for sharing your feedback with us. Your response has been saved successfully.'
      }
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`${colors.successBg} ${colors.successBorder} border rounded-lg p-4`}
    >
      <p className={`text-sm ${colors.textSecondary}`}>
        {lang === 'ar' 
          ? 'سيتم مراجعة استجابتك من قبل فريقنا المختص.' 
          : 'Your response will be reviewed by our specialized team.'
        }
      </p>
    </motion.div>
  </motion.div>
);

// Error State Component
const ErrorState = ({ colors, error, lang }: { colors: any; error: string; lang: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`w-full max-w-2xl p-12 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border ${colors.cardBg} ${colors.borderPrimary} text-center`}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className={`w-20 h-20 ${colors.errorBg} ${colors.errorBorder} border-2 rounded-full flex items-center justify-center mx-auto mb-6`}
    >
      <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`text-3xl font-bold mb-4 ${colors.textPrimary}`}
    >
      {lang === 'ar' ? 'حدث خطأ' : 'An Error Occurred'}
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`text-lg ${colors.textSecondary} mb-8`}
    >
      {error}
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`${colors.errorBg} ${colors.errorBorder} border rounded-lg p-4`}
    >
      <p className={`text-sm ${colors.textSecondary}`}>
        {lang === 'ar' 
          ? 'يرجى التحقق من الرابط أو المحاولة مرة أخرى لاحقاً.' 
          : 'Please check the link or try again later.'
        }
      </p>
    </motion.div>
  </motion.div>
);

// Expired State Component
const ExpiredState = ({ colors, lang }: { colors: any; lang: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`w-full max-w-2xl p-12 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border ${colors.cardBg} ${colors.borderPrimary} text-center`}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className={`w-20 h-20 ${colors.warningBg} ${colors.warningBorder} border-2 rounded-full flex items-center justify-center mx-auto mb-6`}
    >
      <ClockIcon className="w-12 h-12 text-yellow-500" />
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`text-3xl font-bold mb-4 ${colors.textPrimary}`}
    >
      {lang === 'ar' ? 'انتهت صلاحية الرابط' : 'Link Expired'}
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`text-lg ${colors.textSecondary} mb-8`}
    >
      {lang === 'ar' 
        ? 'عذراً، انتهت صلاحية رابط الاستطلاع هذا. يرجى التواصل مع المسؤول للحصول على رابط جديد.' 
        : 'Sorry, this survey link has expired. Please contact the administrator for a new link.'
      }
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`${colors.warningBg} ${colors.warningBorder} border rounded-lg p-4`}
    >
      <p className={`text-sm ${colors.textSecondary}`}>
        {lang === 'ar' 
          ? 'روابط الاستطلاع صالحة لمدة 48 ساعة فقط.' 
          : 'Survey links are valid for 48 hours only.'
        }
      </p>
    </motion.div>
  </motion.div>
);

interface SurveyFormProps {
  survey: any;
  loading: boolean;
  expired: boolean;
  submitted: boolean;
  errors: { [key: string]: string };
  form: { name: string; department: string; [key: string]: any };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPermanent?: boolean;
}

export default function SurveyForm({
  survey,
  loading,
  expired,
  submitted,
  errors,
  form,
  onFormChange,
  onSubmit,
  isPermanent = false
}: SurveyFormProps) {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  const [formProgress, setFormProgress] = useState(0);

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;

  // Calculate form progress
  useEffect(() => {
    if (!survey) return;
    
    const requiredFields = ['name', 'department'];
    const requiredQuestions = survey.questions?.filter((q: any) => q.required) || [];
    const totalFields = requiredFields.length + requiredQuestions.length;
    
    let filledFields = 0;
    
    // Count filled required personal fields
    requiredFields.forEach(field => {
      if (form[field] && form[field].toString().trim() !== '') {
        filledFields++;
      }
    });
    
    // Count filled required questions (including comments)
    requiredQuestions.forEach((q: any) => {
      if (q.question_type === 'comments') {
        const yesNoValue = form[`${q.id}_yesno`];
        if (yesNoValue && yesNoValue.toString().trim() !== '') {
          filledFields++;
        }
      } else {
        const value = form[q.id];
        if (value && value.toString().trim() !== '') {
          filledFields++;
        }
      }
    });
    
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [form, survey]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.8 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } })
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: `${formProgress}%`, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  if (loading && !survey) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
        <LoadingSkeleton colors={colors} />
      </div>
    );
  }

  if (expired) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
        <ExpiredState colors={colors} lang={lang} />
      </div>
    );
  }

  if (errors.general) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
        <ErrorState colors={colors} error={errors.general} lang={lang} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
        <SuccessState colors={colors} lang={lang} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className={`absolute inset-0 z-0 pointer-events-none transition-all duration-500 ${
          theme === 'default' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' :
          theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100' :
          theme === 'midnight' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' :
          theme === 'novel' ? 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100' :
          theme === 'cyber' ? 'bg-gradient-to-br from-zinc-900 via-black to-zinc-900' :
          'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        }`}
      >
        <div 
          className={`absolute inset-0 transition-all duration-500 ${
            theme === 'default' ? 'bg-gradient-radial from-blue-500/20 via-transparent to-transparent' :
            theme === 'light' ? 'bg-gradient-radial from-blue-400/10 via-transparent to-transparent' :
            theme === 'midnight' ? 'bg-gradient-radial from-blue-500/20 via-transparent to-transparent' :
            theme === 'novel' ? 'bg-gradient-radial from-yellow-400/10 via-transparent to-transparent' :
            theme === 'cyber' ? 'bg-gradient-radial from-green-500/20 via-transparent to-transparent' :
            'bg-gradient-radial from-blue-500/20 via-transparent to-transparent'
          }`}
        />
      </motion.div>
      
      {/* Main Card with animation */}
      <AnimatePresence>
        <motion.div
          key="survey-card"
          className={`w-full max-w-6xl p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl border ${colors.cardBg} ${colors.borderPrimary}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Progress Bar */}
          <motion.div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${colors.textSecondary}`}>
                {lang === 'ar' ? 'تقدم الاستطلاع' : 'Survey Progress'}
              </span>
              <span className={`text-sm font-bold ${colors.primary} bg-white/10 px-2 py-1 rounded-md`}>
                {formProgress}%
              </span>
            </div>
            <div className={`w-full h-2 ${colors.inputBg} rounded-full overflow-hidden border ${colors.inputBorder}`}>
              <motion.div
                className={`h-full ${colors.primaryBg} rounded-full`}
                variants={progressVariants}
                initial="hidden"
                animate="visible"
              />
            </div>
          </motion.div>

          <motion.h2 
            className={`text-3xl font-extrabold text-center mb-8 ${colors.textPrimary} tracking-tight`} 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            {survey?.title?.[lang]}
          </motion.h2>
          
          {/* Permanent Link Badge */}
          {isPermanent && (
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.badgeBg} ${colors.badgeText} border ${colors.badgeBorder} shadow-sm`}>
                🔗 {lang === 'ar' ? 'رابط دائم' : 'Permanent Link'}
              </span>
            </motion.div>
          )}
          
          <form className="space-y-8" onSubmit={onSubmit}>
            {/* Personal Information Section */}
            <motion.div 
              variants={itemVariants} 
              custom={0} 
              initial="hidden" 
              animate="visible" 
              className={`${colors.cardBg} rounded-lg border ${colors.borderPrimary} overflow-hidden transition-colors duration-200`}
            >
              <div className={`${colors.primaryBg} px-6 py-4 flex items-center gap-3`}>
                <UserIcon className="w-6 h-6 text-white" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 text-sm font-semibold ${colors.textPrimary} flex items-center gap-2`} htmlFor="name">
                      <UserIcon className="w-4 h-4" />
                      {t("survey.name")} <span className="text-red-400 font-bold">*</span>
                    </label>
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 border border-red-600/50 text-red-300`}>
                        {lang === 'ar' ? 'مطلوب' : 'Required'}
                      </span>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${colors.inputPlaceholder} ${errors.name ? 'border-red-500 ring-red-500' : ''}`}
                      placeholder={t("survey.name")}
                      value={form.name}
                      onChange={onFormChange}
                      required
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationTriangleIcon className="w-3 h-3" />
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-semibold ${colors.textPrimary} flex items-center gap-2`} htmlFor="department">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      {t("survey.department")} <span className="text-red-400 font-bold">*</span>
                    </label>
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 border border-red-600/50 text-red-300`}>
                        {lang === 'ar' ? 'مطلوب' : 'Required'}
                      </span>
                    </div>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${colors.inputPlaceholder} ${errors.department ? 'border-red-500 ring-red-500' : ''}`}
                      placeholder={t("survey.department")}
                      value={form.department}
                      onChange={onFormChange}
                      required
                    />
                    {errors.department && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationTriangleIcon className="w-3 h-3" />
                        {errors.department}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Survey Questions Section */}
            {survey?.questions && survey.questions.length > 0 ? (
              <motion.div 
                variants={itemVariants} 
                custom={1} 
                initial="hidden" 
                animate="visible" 
                className={`${colors.cardBg} rounded-lg border ${colors.borderPrimary} overflow-hidden transition-colors duration-200`}
              >
                <div className={`${colors.primaryBg} px-6 py-4 flex items-center gap-3`}>
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'الأسئلة' : 'Questions'}
                  </h3>
                </div>
                
                {/* Questions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`${colors.cardBgHover}`}>
                        <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold text-white border-b ${colors.borderPrimary} w-1/3 ${colors.primaryBg} bg-opacity-95 shadow-sm`}>
                          {lang === 'ar' ? 'الاجوبة | Answer' : 'Answer | الاجوبة'}
                        </th>
                        <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold text-white border-b ${colors.borderPrimary} w-2/3 ${colors.primaryBg} bg-opacity-95 shadow-sm`}>
                          {lang === 'ar' ? 'الاسئلة | Question' : 'Question | الاسئلة'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {survey.questions.map((q: any, idx: number) => (
                        <motion.tr 
                          key={q.id} 
                          variants={itemVariants} 
                          custom={idx + 2} 
                          initial="hidden" 
                          animate="visible"
                          className={`border-b ${colors.borderPrimary} transition-colors duration-200`}
                        >
                          <td className="px-4 md:px-6 py-4 md:py-6 align-top">
                            {/* Answer Column */}
                            
                            {/* Text Question */}
                            {q.question_type === "text" && (
                              <div className="space-y-2">
                                <label className={`block text-sm font-medium ${colors.labelText} ${colors.labelBg} px-2 py-1 rounded-md`}>
                                  {lang === 'ar' ? 'اجابة مفتوحة:' : 'Open Answer:'}
                                </label>
                                <textarea
                                  id={q.id}
                                  name={q.id}
                                  className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${colors.inputPlaceholder} resize-none ${errors[q.id] ? 'border-red-500 ring-red-500' : ''}`}
                                  placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                                  value={form[q.id] || ""}
                                  onChange={onFormChange}
                                  rows={4}
                                  required={q.required}
                                />
                                {errors[q.id] && (
                                  <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm font-medium flex items-center gap-1"
                                  >
                                    <ExclamationTriangleIcon className="w-3 h-3" />
                                    {errors[q.id]}
                                  </motion.p>
                                )}
                              </div>
                            )}

                            {/* Rating Question */}
                            {q.question_type === "rating" && q.rating_scale && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-1 md:gap-2">
                                  {[5, 4, 3, 2, 1].map((value) => (
                                    <label key={value} className="flex flex-col items-center cursor-pointer group">
                                      <input
                                        type="radio"
                                        name={q.id}
                                        value={value}
                                        checked={form[q.id] === value.toString()}
                                        onChange={onFormChange}
                                        required={q.required}
                                        className="sr-only"
                                      />
                                      <motion.div 
                                        className={`w-10 h-10 rounded-md border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${form[q.id] === value.toString() ? `${colors.primaryBg} border-green-500 text-white shadow-lg scale-110` : `${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary}`}`}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        {value}
                                      </motion.div>
                                      <div className={`text-xs text-center mt-1 ${colors.textSecondary} leading-tight font-medium`}>
                                        {getRatingOptionLabel(q.rating_scale, value, lang)}
                                      </div>
                                    </label>
                                  ))}
                                </div>
                                <div className={`text-xs text-center mt-2 ${colors.textTertiary} font-medium`}>
                                  {lang === 'ar' ? 'ملاحظات العملاء' : 'Customer feedback'}
                                </div>
                                {errors[q.id] && (
                                  <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm font-medium text-center flex items-center justify-center gap-1"
                                  >
                                    <ExclamationTriangleIcon className="w-3 h-3" />
                                    {errors[q.id]}
                                  </motion.p>
                                )}
                              </div>
                            )}

                            {/* Comments Question */}
                            {q.question_type === "comments" && (
                              <div className="space-y-4">
                                <div>
                                  <label className={`block text-sm font-medium ${colors.labelText} ${colors.labelBg} px-2 py-1 rounded-md mb-2`}>
                                    {lang === 'ar' ? 'التعليقات | Comments' : 'Comments | التعليقات'}
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`${q.id}_yesno`}
                                        value="yes"
                                        checked={form[`${q.id}_yesno`] === "yes"}
                                        onChange={onFormChange}
                                        required={q.required}
                                        className={`w-4 h-4 text-green-600 ${colors.inputBg} ${colors.inputBorder} rounded focus:ring-green-500 focus:ring-2`}
                                      />
                                      <span className={`ml-2 text-sm font-medium ${colors.textPrimary}`}>
                                        {lang === 'ar' ? 'نعم' : 'Yes'}
                                      </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`${q.id}_yesno`}
                                        value="no"
                                        checked={form[`${q.id}_yesno`] === "no"}
                                        onChange={onFormChange}
                                        required={q.required}
                                        className={`w-4 h-4 text-green-600 ${colors.inputBg} ${colors.inputBorder} rounded focus:ring-green-500 focus:ring-2`}
                                      />
                                      <span className={`ml-2 text-sm font-medium ${colors.textPrimary}`}>
                                        {lang === 'ar' ? 'لا' : 'No'}
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className={`block text-sm font-medium ${colors.labelText} ${colors.labelBg} px-2 py-1 rounded-md mb-2`}>
                                    {lang === 'ar' ? 'اجابة مفتوحة:' : 'Open Answer:'}
                                  </label>
                                  <textarea
                                    name={`${q.id}_comment`}
                                    className={`w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${colors.inputPlaceholder} resize-none`}
                                    placeholder={lang === 'ar' ? 'أضف تعليقك هنا...' : 'Add your comment here...'}
                                    value={form[`${q.id}_comment`] || ""}
                                    onChange={onFormChange}
                                    rows={3}
                                  />
                                </div>
                                {errors[q.id] && (
                                  <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm font-medium flex items-center gap-1"
                                  >
                                    <ExclamationTriangleIcon className="w-3 h-3" />
                                    {errors[q.id]}
                                  </motion.p>
                                )}
                              </div>
                            )}
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 md:py-6 align-top">
                            {/* Question Column */}
                            <div className="space-y-2">
                              <h4 className={`text-base font-semibold ${colors.textPrimary} leading-relaxed`}>
                                {lang === 'ar' ? q.label_ar : q.label_en}
                                {q.required && <span className="text-red-400 ml-1 font-bold">*</span>}
                              </h4>
                              {q.required && (
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 border border-red-600/50 text-red-300`}>
                                    {lang === 'ar' ? 'مطلوب' : 'Required'}
                                  </span>
                                </div>
                              )}
                              {q.question_type === "rating" && (
                                <p className={`text-sm ${colors.textTertiary} font-medium`}>
                                  {lang === 'ar' ? 'يرجى اختيار مستوى واحد من الخيارات أدناه' : 'Please select one level from the options below'}
                                </p>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={itemVariants} 
                custom={1} 
                initial="hidden" 
                animate="visible" 
                className={`${colors.cardBg} rounded-lg border ${colors.borderPrimary} overflow-hidden`}
              >
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'تنبيه' : 'Notice'}
                  </h3>
                </div>
                <div className={`p-8 text-center ${colors.textTertiary}`}>
                  <p className="text-lg font-medium">
                    {lang === 'ar' ? 'لا توجد أسئلة في هذا الاستطلاع' : 'No questions in this survey'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submit Button Section */}
            <motion.div 
              variants={itemVariants} 
              custom={survey?.questions?.length + 2} 
              initial="hidden" 
              animate="visible" 
              className="flex justify-center"
            >
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 ${colors.primaryBg} text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 border-2 border-transparent`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {t("survey.submit")}
                  </>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${colors.errorBg} ${colors.errorBorder} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                    <span className={`text-sm font-medium ${colors.textPrimary}`}>
                      {lang === 'ar' ? 'يرجى تصحيح الأخطاء التالية:' : 'Please correct the following errors:'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 