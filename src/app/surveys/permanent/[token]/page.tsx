"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang, useTheme } from "../../../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FontSwitcher from "@/components/FontSwitcher";
import SurveyForm from "@/components/SurveyForm";
import { use } from 'react';

export default function SurveyPermanentPage({ params }: { params: any }) {
  // Unwrap params if it's a Promise (Next.js 13+)
  const resolvedParams = typeof params.then === 'function' ? use(params) : params;
  const token = resolvedParams.token;
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation(lang);
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<any>(null);
  const [expired, setExpired] = useState(false);
  const [form, setForm] = useState<{ name: string; department: string; [key: string]: any }>({ name: "", department: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch survey data from API
  useEffect(() => {
    setLoading(true);
    setErrors({});
    fetch(`/api/surveys/permanent/validate?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.expired) {
          setExpired(true);
        } else if (data.valid && data.survey) {
          setSurvey(data.survey);
        } else {
          setErrors({ general: t("survey.expired") });
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrors({ general: t("survey.expired") });
      });
  }, [token]);

  // Validate form field
  const validateField = (name: string, value: any) => {
    if (!value || value.toString().trim() === '') {
      return name === 'name' || name === 'department' || survey?.questions?.find((q: any) => q.id.toString() === name)?.required
        ? (lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required')
        : '';
    }
    return '';
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors: { [key: string]: string } = {};
    
    // Validate name and department
    const nameError = validateField('name', form.name);
    const departmentError = validateField('department', form.department);
    if (nameError) newErrors.name = nameError;
    if (departmentError) newErrors.department = departmentError;
    
    // Validate required questions
    survey?.questions?.forEach((q: any) => {
      if (q.required) {
        if (q.question_type === 'comments') {
          // For comments, check if Yes/No is selected
          const yesNoValue = form[`${q.id}_yesno`];
          if (!yesNoValue || yesNoValue.toString().trim() === '') {
            newErrors[q.id] = lang === 'ar' ? 'يرجى اختيار نعم أو لا' : 'Please select Yes or No';
          }
        } else {
          // For other question types, check the main answer
          const value = form[q.id];
          const error = validateField(q.id.toString(), value);
          if (error) newErrors[q.id] = error;
        }
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const answers: Array<{ question_id: string; answer: string }> = [];
      
      // Process all form fields
      for (const [key, value] of Object.entries(form)) {
        if (key !== 'name' && key !== 'department' && value !== undefined && value !== '') {
          // Check if this is a comments question
          const question = survey?.questions?.find((q: any) => q.id.toString() === key);
          if (question && question.question_type === 'comments') {
            // For comments, combine Yes/No with additional comment
            const yesNoValue = form[`${key}_yesno`];
            const commentValue = form[`${key}_comment`] || '';
            const combinedAnswer = `${yesNoValue}${commentValue ? ` - ${commentValue}` : ''}`;
            answers.push({
              question_id: key,
              answer: combinedAnswer
            });
          } else if (!key.includes('_yesno') && !key.includes('_comment')) {
            // For regular questions, add as is
          answers.push({
            question_id: key,
            answer: value
          });
        }
      }
      }
      
      // Also process comments questions that might not have a main value
      survey?.questions?.forEach((q: any) => {
        if (q.question_type === 'comments') {
          const yesNoValue = form[`${q.id}_yesno`];
          const commentValue = form[`${q.id}_comment`] || '';
          if (yesNoValue) {
            const combinedAnswer = `${yesNoValue}${commentValue ? ` - ${commentValue}` : ''}`;
            // Check if this question is already in answers
            const existingAnswer = answers.find((a: any) => a.question_id.toString() === q.id.toString());
            if (!existingAnswer) {
              answers.push({
                question_id: q.id,
                answer: combinedAnswer
              });
            }
          }
        }
      });
      
      const requestData = {
        token: token,
        name: form.name,
        department: form.department,
        answers
      };
      
      const res = await fetch("/api/surveys/permanent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setErrors({ general: data.error || t("survey.expired") });
      } else {
        setSubmitted(true);
      }
    } catch (e) {
      setLoading(false);
      setErrors({ general: t("survey.expired") });
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative font-${theme} theme-${theme} gradient-bg transition-colors duration-500`} style={{ overflow: "hidden" }}>
      {/* Theme, Font & Language Switchers */}
      <div className="absolute top-6 right-8 z-50 flex gap-2 bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl border border-slate-700 shadow-2xl">
        <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} theme={theme} />
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        <FontSwitcher theme={theme} />
      </div>
      
      {/* Survey Form Component */}
      <SurveyForm
        survey={survey}
        loading={loading}
        expired={expired}
        submitted={submitted}
        errors={errors}
        form={form}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        isPermanent={true}
      />
    </div>
  );
} 