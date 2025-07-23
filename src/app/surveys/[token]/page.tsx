"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang, useTheme } from "../../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FontSwitcher from "@/components/FontSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { use } from 'react';
import { getRatingOptionLabel } from '@/lib/surveyTypes';

export default function SurveyPublicPage({ params }: { params: any }) {
  // Unwrap params if it's a Promise (Next.js 13+)
  const resolvedParams = typeof params.then === 'function' ? use(params) : params;
  const token = resolvedParams.token;
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<any>(null);
  const [expired, setExpired] = useState(false);
  const [form, setForm] = useState<{ name: string; department: string; [key: string]: any }>({ name: "", department: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch survey data from API
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/surveys/validate?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.expired) {
          setExpired(true);
        } else if (data.valid && data.survey) {
          setSurvey(data.survey);
        } else {
          setError(t("survey.expired"));
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(t("survey.expired"));
      });
  }, [token]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const answers = [];
      
      // Process all form fields
      for (const [key, value] of Object.entries(form)) {
        if (key !== 'name' && key !== 'department' && value !== undefined && value !== '') {
          answers.push({
            question_id: key,
            answer: value
          });
        }
      }
      
      const requestData = {
        token: token,
        name: form.name,
        department: form.department,
        answers
      };
      
      const res = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setError(data.error || t("survey.expired"));
      } else {
        setSubmitted(true);
      }
    } catch (e) {
      setLoading(false);
      setError(t("survey.expired"));
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.8 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } })
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t("loading")}</div>;
  }
  if (expired) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">{t("survey.expired")}</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">{error}</div>;
  }
  if (submitted) {
    return <div className="min-h-screen flex items-center justify-center text-green-600 text-xl font-bold">{t("survey.thank_you")}</div>;
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative theme-${theme} font-${theme} transition-colors duration-500`} style={{
      background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
      overflow: "hidden"
    }}>
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 30%, #00c6fb 0%, transparent 60%), radial-gradient(circle at 80% 70%, #005bea 0%, transparent 60%)"
        }}
      />
      {/* Theme & Font Switchers */}
      <div className="absolute top-6 right-8 z-20 flex gap-2">
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        <FontSwitcher theme={theme} />
      </div>
      {/* Main Card with animation */}
      <AnimatePresence>
        <motion.div
          key="survey-card"
          className="w-full max-w-6xl p-8 rounded-3xl shadow-2xl card-glass relative z-10 backdrop-blur-xl border border-white/20"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.h2 className="text-3xl font-extrabold text-center mb-8 text-blue-900 dark:text-white tracking-tight" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {survey?.title?.[lang]}
          </motion.h2>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <motion.div variants={itemVariants} custom={0} initial="hidden" animate="visible" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="name">
                      {t("survey.name")} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder={t("survey.name")}
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="department">
                      {t("survey.department")} *
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder={t("survey.department")}
                      value={form.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Survey Questions Section */}
            {survey?.questions && survey.questions.length > 0 ? (
              <motion.div variants={itemVariants} custom={1} initial="hidden" animate="visible" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'الأسئلة' : 'Questions'}
                  </h3>
                </div>
                
                {/* Questions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 w-1/3">
                          {lang === 'ar' ? 'الاجوبة | Answer' : 'Answer | الاجوبة'}
                        </th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 w-2/3">
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
                          className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="px-4 md:px-6 py-4 md:py-6 align-top">
                            {/* Answer Column */}
                            
                            {/* Text Question */}
                            {q.question_type === "text" && (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                                  {lang === 'ar' ? 'اجابة مفتوحة:' : 'Open Answer:'}
                                </label>
                                <textarea
                                  id={q.id}
                                  name={q.id}
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                                  placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                                  value={form[q.id] || ""}
                                  onChange={handleChange}
                                  rows={4}
                                  required={q.required}
                                />
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
                                        onChange={handleChange}
                                        required={q.required}
                                        className="sr-only"
                                      />
                                      <div className={`w-10 h-10 rounded-md border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                        form[q.id] === value.toString()
                                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
                                      }`}>
                                        {value}
                                      </div>
                                      <div className="text-xs text-center mt-1 text-slate-600 dark:text-slate-400 leading-tight">
                                        {getRatingOptionLabel(q.rating_scale, value, lang)}
                                      </div>
                                    </label>
                                  ))}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                                  {lang === 'ar' ? 'ملاحظات العملاء' : 'Customer feedback'}
                                </div>
                              </div>
                            )}

                            {/* Comments Question */}
                            {q.question_type === "comments" && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    {lang === 'ar' ? 'التعليقات | Comments' : 'Comments | التعليقات'}
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`${q.id}_yesno`}
                                        value="yes"
                                        checked={form[`${q.id}_yesno`] === "yes"}
                                        onChange={handleChange}
                                        required={q.required}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                        {lang === 'ar' ? 'نعم' : 'Yes'}
                                      </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`${q.id}_yesno`}
                                        value="no"
                                        checked={form[`${q.id}_yesno`] === "no"}
                                        onChange={handleChange}
                                        required={q.required}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                        {lang === 'ar' ? 'لا' : 'No'}
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    {lang === 'ar' ? 'اجابة مفتوحة:' : 'Open Answer:'}
                                  </label>
                                  <textarea
                                    name={`${q.id}_comment`}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                                    placeholder={lang === 'ar' ? 'أضف تعليقك هنا...' : 'Add your comment here...'}
                                    value={form[`${q.id}_comment`] || ""}
                                    onChange={handleChange}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 md:py-6 align-top">
                            {/* Question Column */}
                            <div className="space-y-2">
                              <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                                {lang === 'ar' ? q.label_ar : q.label_en}
                                {q.required && <span className="text-red-500 ml-1">*</span>}
                              </h4>
                              {q.question_type === "rating" && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
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
              <motion.div variants={itemVariants} custom={1} initial="hidden" animate="visible" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'تنبيه' : 'Notice'}
                  </h3>
                </div>
                <div className="p-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {lang === 'ar' ? 'لا توجد أسئلة في هذا الاستطلاع' : 'No questions in this survey'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submit Button Section */}
            <motion.div variants={itemVariants} custom={survey?.questions?.length + 2} initial="hidden" animate="visible" className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {t("survey.submit")}
                  </div>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 