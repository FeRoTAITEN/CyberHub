"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Unused import
import { useLang, useTheme } from "../../../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FontSwitcher from "@/components/FontSwitcher";
import SurveyForm from "@/components/SurveyForm";
import { use } from 'react';

export default function SurveyPermanentPage({ params }: { params: Promise<{ token: string }> }) {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const { theme, setTheme } = useTheme();
  const [survey, setSurvey] = useState<{
    id: number;
    title_en: string;
    title_ar: string;
    questions: Array<{
      id: number;
      question_type: string;
      label_en: string;
      label_ar: string;
      required: boolean;
      order: number;
      rating_options?: Record<string, unknown>;
      rating_scale?: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired] = useState(false);
  const [form, setForm] = useState<{ name: string; department: string; [key: string]: string }>({ name: "", department: "" });

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Get token from params
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const expiredText = t("survey.expired");

  // Fetch survey data from API
  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/surveys/permanent/validate?token=${token}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (isCancelled) return;
        setLoading(false);
        if (data.valid && data.survey) {
          setSurvey(data.survey);
        } else {
          setError(expiredText);
        }
      })
      .catch(() => {
        if (isCancelled) return;
        setLoading(false);
        setError(expiredText);
      });
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [token, lang, expiredText]);

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error && error.includes(name)) {
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!form.name.trim()) newErrors.name = t("survey.name_required");
    if (!form.department.trim()) newErrors.department = t("survey.department_required");

    survey?.questions?.forEach((q) => {
      if (q.required) {
        const value = form[q.id];
        if (!value || value === '') {
          newErrors[q.id] = t("survey.question_required");
        }
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setError(JSON.stringify(newErrors));
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const answers: Array<{ question_id: string; answer: string }> = [];
      
      for (const [key, value] of Object.entries(form)) {
        if (key !== 'name' && key !== 'department' && value !== undefined && value !== '') {
          const question = survey?.questions?.find((q) => q.id.toString() === key);
          if (question && question.question_type === 'comments') {
            const yesNoValue = form[`${key}_yesno`];
            const commentValue = form[`${key}_comment`] || '';
            const combinedAnswer = `${yesNoValue}${commentValue ? ` - ${commentValue}` : ''}`;
            answers.push({ question_id: key, answer: combinedAnswer });
          } else if (!key.includes('_yesno') && !key.includes('_comment')) {
            answers.push({ question_id: key, answer: value });
        }
      }
      }
      
      survey?.questions?.forEach((q: any) => {
        if (q.question_type === 'comments') {
          const yesNoValue = form[`${q.id}_yesno`];
          const commentValue = form[`${q.id}_comment`] || '';
          if (yesNoValue) {
            const combinedAnswer = `${yesNoValue}${commentValue ? ` - ${commentValue}` : ''}`;
            const existingAnswer = answers.find((a: any) => a.question_id.toString() === q.id.toString());
            if (!existingAnswer) {
              answers.push({ question_id: q.id, answer: combinedAnswer });
            }
          }
        }
      });
      
      const requestData = { survey_id: survey?.id, responder_name: form.name, responder_department: form.department, answers };
      const res = await fetch("/api/surveys/permanent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setError(data.error || expiredText);
      } else {
        setSubmitted(true);
      }
    } catch {
      setLoading(false);
      setError(expiredText);
    }
  };

  const errorsObj = React.useMemo(() => {
    if (!error) return {} as Record<string, string>;
    try {
      return JSON.parse(error);
    } catch {
      return { general: error } as Record<string, string>;
    }
  }, [error]);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
      {/* Theme, Font & Language Switchers */}
      <div className="absolute top-6 right-8 z-50 flex gap-2 bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl border border-slate-700 shadow-2xl">
        <LanguageSwitcher currentLanguage={lang} onLanguageChange={() => {}} theme={theme} />
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        <FontSwitcher theme={theme} />
      </div>
      
      {/* Survey Form Component */}
      <SurveyForm
        survey={survey}
        loading={loading}
        expired={expired}
        submitted={submitted}
        errors={errorsObj}
        form={form}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isPermanent={true}
      />
    </div>
  );
} 