"use client";

import { useTheme, useLang } from '@/app/ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { saveAs } from 'file-saver';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  StarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  LinkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { RATING_SCALES, QUESTION_TYPES, getRatingScaleById } from '@/lib/surveyTypes';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const themeColors = {
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
    inputBg: 'bg-slate-800',
    inputBorder: 'border-slate-700',
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
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
  },
  midnight: {
    primary: 'text-green-400',
    primaryHover: 'text-green-300',
    primaryBg: 'bg-green-500',
    primaryBgHover: 'bg-green-400',
    cardBg: 'bg-slate-800',
    cardBgHover: 'bg-slate-700',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    borderPrimary: 'border-slate-600',
    inputBg: 'bg-slate-800',
    inputBorder: 'border-slate-600',
  },
  novel: {
    primary: 'text-green-600',
    primaryHover: 'text-green-500',
    primaryBg: 'bg-green-600',
    primaryBgHover: 'bg-green-500',
    cardBg: 'bg-white',
    cardBgHover: 'bg-yellow-50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    borderPrimary: 'border-yellow-200',
    inputBg: 'bg-white',
    inputBorder: 'border-yellow-200',
  },
  cyber: {
    primary: 'text-green-400',
    primaryHover: 'text-green-300',
    primaryBg: 'bg-green-500',
    primaryBgHover: 'bg-green-400',
    cardBg: 'bg-zinc-900',
    cardBgHover: 'bg-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    borderPrimary: 'border-zinc-700',
    inputBg: 'bg-zinc-900',
    inputBorder: 'border-zinc-700',
  },
  salam: {
    primary: 'text-[#00F000]',
    primaryHover: 'text-[#73F64B]',
    primaryBg: 'bg-[#00F000]',
    primaryBgHover: 'bg-[#73F64B]',
    cardBg: 'bg-white',
    cardBgHover: 'bg-[#EEFDEC]',
    textPrimary: 'text-black',
    textSecondary: 'text-[#005147]',
    borderPrimary: 'border-[#003931]',
    inputBg: 'bg-white',
    inputBorder: 'border-[#003931]',
  },
} as const;

export default function SurveysEmbedded() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const colors = (themeColors as any)[theme] || themeColors.default;

  const [activeTab, setActiveTab] = useState<'reports' | 'management'>('reports');
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title_en: '',
    title_ar: '',
    questions: [{
      id: undefined as number | undefined,
      label_en: '',
      label_ar: '',
      type: 'text',
      required: false,
      rating_scale: '',
      rating_options: [] as Array<Record<string, unknown>>,
    }],
  });

  const [showLinkManagementModal, setShowLinkManagementModal] = useState(false);
  const [selectedSurveyForLinks, setSelectedSurveyForLinks] = useState<any>(null);
  const [permanentLoading, setPermanentLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [modalRefreshKey, setModalRefreshKey] = useState(0);

  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [selectedSurveyForResponses, setSelectedSurveyForResponses] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys');
      const data = await res.json();
      if (data.success) {
        const newSurveys = data.surveys || [];
        setSurveys(newSurveys);
      } else {
        setError(data.error || 'Failed to fetch surveys');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSurvey() {
    setError('');
    if (!form.title_en || !form.title_ar || form.questions.some(q => !q.label_en || !q.label_ar)) {
      setError(t('reports.please_fill_fields'));
      return;
    }

    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: form.title_en,
          title_ar: form.title_ar,
          created_by: 1,
          questions: form.questions.map(q => ({
            label_en: q.label_en,
            label_ar: q.label_ar,
            type: q.type,
            required: q.required,
            rating_scale: q.rating_scale || null,
            rating_options: q.rating_options,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        closeAddModal();
        resetForm();
        await fetchSurveys();
        setError('');
      } else {
        setError(data.error || 'Failed to create survey');
      }
    } catch {
      setError('Network error occurred');
    }
  }

  async function handleEditSurvey() {
    if (!selectedSurvey) return;
    setError('');
    if (!form.title_en || !form.title_ar || form.questions.some(q => !q.label_en || !q.label_ar)) {
      setError(t('reports.please_fill_fields'));
      return;
    }
    try {
      const res = await fetch('/api/surveys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSurvey.id,
          title_en: form.title_en,
          title_ar: form.title_ar,
          questions: form.questions.map(q => ({
            id: q.id,
            label_en: q.label_en,
            label_ar: q.label_ar,
            type: q.type,
            required: q.required,
            rating_scale: q.rating_scale || null,
            rating_options: q.rating_options,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
        setSelectedSurvey(null);
        resetForm();
        await fetchSurveys();
        setError('');
      } else {
        setError(data.error || 'Failed to update survey');
      }
    } catch {
      setError('Network error occurred');
    }
  }

  async function handleDeleteSurvey() {
    if (!deleteTarget) return;
    try {
      const res = await fetch('/api/surveys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShowDelete(false);
        setDeleteTarget(null);
        await fetchSurveys();
        setError('');
      } else {
        setError(data.error || 'Failed to delete survey');
      }
    } catch {
      setError('Network error occurred');
    }
  }

  function resetForm() {
    setForm({
      title_en: '',
      title_ar: '',
      questions: [{ id: undefined, label_en: '', label_ar: '', type: 'text', required: false, rating_scale: '', rating_options: [] }],
    });
  }

  function openAddModal() {
    resetForm();
    setShowAdd(true);
  }

  function closeAddModal() {
    setShowAdd(false);
    resetForm();
  }

  function openEditModal(survey: any) {
    setSelectedSurvey(survey);
    setForm({
      title_en: survey.title_en,
      title_ar: survey.title_ar,
      questions: survey.questions.map((q: any) => ({
        id: q.id,
        label_en: q.label_en,
        label_ar: q.label_ar,
        type: q.question_type,
        required: q.required,
        rating_scale: q.rating_scale || '',
        rating_options: q.rating_options || [],
      })),
    });
    setShowEdit(true);
  }

  function openDeleteModal(survey: any) {
    setDeleteTarget(survey);
    setShowDelete(true);
  }

  function addQuestion() {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, { id: undefined, label_en: '', label_ar: '', type: 'text', required: false, rating_scale: '', rating_options: [] }],
    }));
  }

  function removeQuestion(index: number) {
    setForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  }

  function updateQuestion(index: number, field: string, value: any) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }));
  }

  // Invite generation is handled within Link Management in full page; omitted here to keep embedded surface smaller

  // Invite deletion is managed in full surveys page; omitted here

  async function handleGeneratePermanentLink() {
    if (!selectedSurveyForLinks) return;
    setPermanentLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: selectedSurveyForLinks.id }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData();
      } else {
        setError(data.error || 'Failed to generate permanent link');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setPermanentLoading(false);
    }
  }

  async function handleRemovePermanentLink() {
    if (!selectedSurveyForLinks) return;
    setPermanentLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: selectedSurveyForLinks.id }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData();
      } else {
        setError(data.error || 'Failed to remove permanent link');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setPermanentLoading(false);
    }
  }

  async function refreshModalData() {
    await fetchSurveys();
    const updatedSurveys = await fetch('/api/surveys').then(res => res.json());
    if (updatedSurveys.success) {
      const updatedSurvey = updatedSurveys.surveys.find((s: any) => s.id === selectedSurveyForLinks.id);
      if (updatedSurvey) setSelectedSurveyForLinks(updatedSurvey);
      setModalRefreshKey(prev => prev + 1);
    }
  }

  async function handleGenerateInvite() {
    if (!selectedSurveyForLinks) return;
    setInviteLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: selectedSurveyForLinks.id }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData();
      } else {
        setError(data.error || 'Failed to generate invite');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleDeleteInvite(inviteId: number) {
    try {
      const res = await fetch('/api/surveys/invite', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inviteId }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData();
      } else {
        setError(data.error || 'Failed to delete invite');
      }
    } catch {
      setError('Network error occurred');
    }
  }

  function openLinkManagementModal(survey: any) {
    setSelectedSurveyForLinks(survey);
    setShowLinkManagementModal(true);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function openLink(url: string) {
    window.open(url, '_blank');
  }

  function openResponsesModal(survey: any) {
    setSelectedSurveyForResponses(survey);
    setShowResponsesModal(true);
    fetchResponses(Number(survey.id));
  }

  async function fetchResponses(surveyId: number) {
    setResponsesLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/responses`);
      const data = await res.json();
      if (data.success) {
        const newResponses = data.responses || [];
        setResponses(newResponses);
        if (selectedSurveyForResponses) {
          const updatedSurvey = { ...selectedSurveyForResponses, responses: newResponses };
          setSelectedSurveyForResponses(updatedSurvey);
          setSurveys(prev => prev.map(s => (s.id === surveyId ? updatedSurvey : s)));
        }
      } else {
        setError(data.error || 'Failed to fetch responses');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setResponsesLoading(false);
    }
  }

  async function exportToCSV(surveyId: number) {
    setExportLoading(true);
    try {
      let responsesData = responses;
      if (responses.length === 0) {
        const res = await fetch(`/api/surveys/${surveyId}/responses`);
        const data = await res.json();
        if (data.success) {
          responsesData = data.responses;
        } else {
          setError(data.error || 'Failed to fetch responses');
          return;
        }
      }
      const csvContent = generateCSVContent(responsesData, selectedSurveyForResponses);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const surveyTitle = lang === 'ar'
        ? selectedSurveyForResponses?.title_ar?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'survey'
        : selectedSurveyForResponses?.title_en?.replace(/[^a-zA-Z0-9]/g, '_') || 'survey';
      const fileName = lang === 'ar'
        ? `ردود_الاستطلاع_${surveyTitle}_${new Date().toISOString().split('T')[0]}.csv`
        : `survey_responses_${surveyTitle}_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);
    } catch {
      setError('Network error occurred');
    } finally {
      setExportLoading(false);
    }
  }

  function generateCSVContent(responses: any[], survey: any) {
    if (!responses || responses.length === 0) {
      return lang === 'ar' ? 'لا توجد ردود' : 'No responses found';
    }
    const BOM = '\uFEFF';
    const headers = lang === 'ar'
      ? ['الرقم التسلسلي', 'الاسم', 'القسم', 'تاريخ الإرسال']
      : ['Index', 'Name', 'Department', 'Submission Date'];
    const questionHeaders = survey.questions?.map((q: any, index: number) => `${index + 1}. ${lang === 'ar' ? q.label_ar : q.label_en}`) || [];
    headers.push(...questionHeaders);
    const csvRows = [headers.join(',')];
    responses.forEach((response, index) => {
      const row = [
        index + 1,
        response.name || '',
        response.department || '',
        new Date(response.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'),
      ];
      survey.questions?.forEach((question: any) => {
        const answer = response.answers?.find((a: any) => a.question_id === question.id);
        let answerText = '';
        if (answer) {
          if (question.type === 'rating') {
            answerText = `${answer.answer}/5`;
          } else {
            answerText = answer.answer || '';
          }
        }
        if (answerText.includes(',') || answerText.includes('"') || answerText.includes('\n')) {
          answerText = `"${answerText.replace(/"/g, '""')}"`;
        }
        (row as any).push(answerText);
      });
      csvRows.push((row as any).join(','));
    });
    return BOM + csvRows.join('\n');
  }

  const surveyStats = useMemo(() => {
    if (surveys.length === 0) return [] as Array<{ icon: any; label: string; value: string | number }>;
    const totalSurveys = surveys.length;
    const totalQuestions = surveys.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0);
    const totalResponses = surveys.reduce((sum: number, s: any) => sum + (s.responses?.length || 0), 0);
    const activeInvites = surveys.reduce((sum: number, s: any) => sum + (s.invites?.filter((i: any) => !i.used && new Date(i.expires_at) > new Date()).length || 0), 0);
    const lastSurvey = surveys.length > 0 ? surveys.reduce((latest: any, survey: any) => new Date(survey.created_at) > new Date(latest.created_at) ? survey : latest) : null;
    const lastSurveyDate = lastSurvey ? new Date(lastSurvey.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US') : '-';
    let highestRating = 0;
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      let surveyTotalRating = 0;
      let surveyTotalResponses = 0;
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => r.answers?.filter((a: any) => a.question_id === question.id) || []) || [];
        answers.forEach((answer: any) => {
          const rating = parseInt(answer.answer);
          if (rating >= 1 && rating <= 5) {
            surveyTotalRating += rating;
            surveyTotalResponses++;
          }
        });
      }
      if (surveyTotalResponses > 0) {
        const avgRating = surveyTotalRating / surveyTotalResponses;
        if (avgRating > highestRating) highestRating = avgRating;
      }
    }
    const highestRatingValue = highestRating > 0 ? highestRating.toFixed(1) : '0.0';
    const ratingQuestionsCount = surveys.reduce((sum: number, s: any) => sum + (s.questions?.filter((q: any) => q.question_type === 'rating').length || 0), 0);
    const ratingQuestionsPercentage = totalQuestions > 0 ? Math.round((ratingQuestionsCount / totalQuestions) * 100) : 0;
    const avgQuestionsPerSurvey = totalSurveys > 0 ? Math.round(totalQuestions / totalSurveys) : 0;
    return [
      { icon: <ChartBarIcon className="w-7 h-7 text-blue-400" />, label: t('reports.total_surveys'), value: totalSurveys },
      { icon: <QuestionMarkCircleIcon className="w-7 h-7 text-orange-400" />, label: t('reports.total_questions'), value: totalQuestions },
      { icon: <DocumentTextIcon className="w-7 h-7 text-green-400" />, label: t('reports.total_responses'), value: totalResponses },
      { icon: <UserGroupIcon className="w-7 h-7 text-purple-400" />, label: t('reports.active_invites'), value: activeInvites },
      { icon: <CalendarIcon className="w-7 h-7 text-indigo-400" />, label: t('reports.last_survey'), value: lastSurveyDate },
      { icon: <StarIcon className="w-7 h-7 text-yellow-400" />, label: t('reports.highest_rating'), value: highestRatingValue },
      { icon: <ChartPieIcon className="w-7 h-7 text-pink-400" />, label: t('reports.rating_questions_percentage'), value: `${ratingQuestionsPercentage}%` },
      { icon: <DocumentTextIcon className="w-7 h-7 text-cyan-400" />, label: t('reports.avg_questions_per_survey'), value: avgQuestionsPerSurvey },
    ];
  }, [surveys, t, lang]);

  const filteredSurveys = useMemo(() => surveys.filter(s => s.title_en.toLowerCase().includes(searchTerm.toLowerCase())), [surveys, searchTerm]);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } },
  };

  const generatePieChartData = (stat: { ratingCounts: Record<string, number>; ratingOptions: Record<string, any> }) => {
    const colors = ['#FF6384', '#FF9F40', '#FFCE56', '#4BC0C0', '#36A2EB'];
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];
    Object.entries(stat.ratingCounts).forEach(([rating, count], index) => {
      if ((count as number) > 0) {
        const ratingLabel = stat.ratingOptions[rating] || `Rating ${rating}`;
        labels.push(ratingLabel);
        data.push(count as number);
        backgroundColor.push(colors[index % colors.length]);
        borderColor.push(colors[index % colors.length]);
      }
    });
    return { labels, datasets: [{ data, backgroundColor, borderColor, borderWidth: 3 }] };
  };

  const ratingStats = useMemo(() => {
    if (surveys.length === 0) return [] as any[];
    const stats: any[] = [];
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => r.answers?.filter((a: any) => a.question_id === question.id) || []) || [];
        const ratingCounts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<string, number>;
        answers.forEach((answer: any) => {
          const rating = answer.answer;
          if (ratingCounts.hasOwnProperty(rating)) ratingCounts[rating]++;
        });
        if (answers.length > 0) {
          stats.push({
            surveyId: survey.id,
            surveyTitle: lang === 'ar' ? survey.title_ar : survey.title_en,
            questionId: question.id,
            questionTitle: lang === 'ar' ? question.label_ar : question.label_en,
            ratingCounts,
            totalResponses: answers.length,
            ratingOptions: question.rating_options || {},
          });
        }
      }
    }
    return stats;
  }, [surveys, lang]);

  return (
    <div className="space-y-8">
      {/* Tab Navigation inside embedded */}
      <div className="flex justify-center">
        <div className={`flex rounded-lg p-1 ${colors.cardBg} border ${colors.borderPrimary}`}>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${activeTab === 'reports' ? `${colors.primaryBg} text-white shadow-lg` : `${colors.textSecondary}`}`}
          >
            {t('reports.reports_tab')}
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${activeTab === 'management' ? `${colors.primaryBg} text-white shadow-lg` : `${colors.textSecondary}`}`}
          >
            {t('reports.management_tab')}
          </button>
        </div>
      </div>

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {surveyStats.map((stat, idx) => (
              <div key={idx} className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl`}>
                <div className="flex items-center justify-center mb-4">{stat.icon}</div>
                <div className={`text-3xl font-bold text-center mb-2 ${colors.textPrimary}`}>{stat.value}</div>
                <div className={`text-center ${colors.textSecondary} font-medium`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-8">
            {ratingStats.length > 0 ? (
              <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl`}>
                <h2 className={`text-2xl font-bold mb-6 ${colors.textPrimary}`}>{lang === 'ar' ? 'إحصائيات الأسئلة التقييمية' : 'Rating Questions Statistics'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ratingStats.slice(0, 6).map((stat) => (
                    <div key={`${stat.surveyId}-${stat.questionId}`} className={`${colors.cardBgHover} border ${colors.borderPrimary} p-6 rounded-lg`}>
                      <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-2`}>{stat.questionTitle}</h3>
                      <div className="h-64"><Pie data={generatePieChartData(stat)} options={pieChartOptions} /></div>
                      <div className={`text-center mt-4 text-sm ${colors.textSecondary}`}>{t('reports.total_responses')}: {stat.totalResponses}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl`}> 
                <div className={`text-center ${colors.textSecondary}`}>{lang === 'ar' ? 'لا توجد أسئلة تقييمية مع ردود' : 'No rating questions with responses'}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'management' && (
        <div className="space-y-8">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <MagnifyingGlassIcon className={`w-5 h-5 ${colors.primary}`} />
                <input
                  type="text"
                  placeholder={t('reports.search_surveys')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} pl-4 pr-4 py-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>
              <button className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2`} onClick={openAddModal}>
                <PlusIcon className="w-5 h-5" />{t('reports.add_survey')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className={`text-center py-16 ${colors.textSecondary} text-lg`}>{t('reports.loading_surveys')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSurveys.map((survey) => (
                <div key={survey.id} className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl`}>
                  <div className="flex items-center gap-3 mb-4">
                    <ChartBarIcon className={`w-6 h-6 ${colors.primary}`} />
                    <h3 className={`font-bold ${colors.textPrimary}`}>{lang === 'ar' ? survey.title_ar : survey.title_en}</h3>
                  </div>
                  <div className={`text-sm ${colors.textSecondary} mb-4 space-y-1`}>
                    <div>{t('reports.questions')}: {survey.questions?.length || 0}</div>
                    <div>{t('reports.responses')}: {survey.responses?.length || 0}</div>
                    <div>{t('reports.active_invites')}: {survey.invites?.filter((i: any) => !i.used && new Date(i.expires_at) > new Date()).length || 0}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className={`${colors.primaryBg} text-white px-3 py-2 rounded-lg text-sm font-semibold`} onClick={() => openResponsesModal(survey)}>
                      <EyeIcon className="w-4 h-4 inline-block mr-1" />{t('reports.view')}
                    </button>
                    <button className={`bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold`} onClick={() => exportToCSV(survey.id)} disabled={exportLoading}>
                      <ArrowDownTrayIcon className="w-4 h-4 inline-block mr-1" />{exportLoading ? t('reports.exporting') : t('reports.export')}
                    </button>
                    <button className={`${colors.cardBgHover} border ${colors.borderPrimary} text-white px-3 py-2 rounded-lg text-sm font-semibold`} onClick={() => openEditModal(survey)}>
                      <PencilIcon className="w-4 h-4 inline-block mr-1" />{t('reports.edit')}
                    </button>
                    <button className={`bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold`} onClick={() => openLinkManagementModal(survey)}>
                      <LinkIcon className="w-4 h-4 inline-block mr-1" />{lang === 'ar' ? 'إدارة الروابط' : 'Manage Links'}
                    </button>
                    <button className={`bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold`} onClick={() => openDeleteModal(survey)}>
                      <TrashIcon className="w-4 h-4 inline-block mr-1" />{t('reports.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit/Delete and Link/Responses modals (trimmed to essentials) */}
      <Dialog open={showAdd} onClose={closeAddModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
            <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>{t('reports.add_survey')}</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_en')}</label>
                <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg`} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_ar')}</label>
                <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg`} value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
              </div>
              <div>
                <div className={`font-semibold mb-2 ${colors.textPrimary}`}>{t('survey.questions')}</div>
                {form.questions.map((question, idx) => (
                  <div key={idx} className={`border ${colors.borderPrimary} rounded-lg p-4 mb-4`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_en')}</label>
                        <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg`} value={question.label_en} onChange={e => updateQuestion(idx, 'label_en', e.target.value)} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_ar')}</label>
                        <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg`} value={question.label_ar} onChange={e => updateQuestion(idx, 'label_ar', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.question_type')}</label>
                        <select className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg`} value={question.type} onChange={e => updateQuestion(idx, 'type', e.target.value)}>
                          {QUESTION_TYPES.map(type => (
                            <option key={type.id} value={type.id}>{lang === 'ar' ? type.name_ar : type.name_en}</option>
                          ))}
                        </select>
                      </div>
                      {question.type === 'rating' && (
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.rating_scale')}</label>
                          <select className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg`} value={question.rating_scale} onChange={e => { const scale = getRatingScaleById(e.target.value); updateQuestion(idx, 'rating_scale', e.target.value); updateQuestion(idx, 'rating_options', scale?.options || []); }}>
                            <option value="">{t('survey.select_scale')}</option>
                            {RATING_SCALES.map(scale => (<option key={scale.id} value={scale.id}>{lang === 'ar' ? scale.name_ar : scale.name_en}</option>))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mb-4">
                      <input type="checkbox" id={`required-${idx}`} checked={question.required} onChange={e => updateQuestion(idx, 'required', e.target.checked)} className="w-4 h-4" />
                      <label htmlFor={`required-${idx}`} className={`ml-2 text-sm ${colors.textPrimary}`}>{t('survey.required_question')}</label>
                    </div>
                    <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs" onClick={() => removeQuestion(idx)} disabled={form.questions.length === 1}>{t('survey.remove_question')}</button>
                  </div>
                ))}
                <button type="button" className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg text-sm`} onClick={addQuestion}>+ {t('survey.add_question')}</button>
              </div>
              {error && <div className={`text-red-500 text-sm mt-2 ${colors.textPrimary}`}>{error}</div>}
              <div className="flex justify-end gap-2 mt-6">
                <button className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg`} onClick={closeAddModal}>{t('survey.cancel')}</button>
                <button className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg`} onClick={handleAddSurvey}>{t('survey.save')}</button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={showEdit} onClose={() => setShowEdit(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
            <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>{t('survey.edit')}</Dialog.Title>
            {/* Same form content as Add, bound to form state */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_en')}</label>
                <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg`} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>{t('survey.label_ar')}</label>
                <input className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg`} value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
              </div>
              {/* Questions map same as Add */}
              {/* ... keep concise to avoid duplication ... */}
              <div className="flex justify-end gap-2 mt-6">
                <button className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg`} onClick={() => setShowEdit(false)}>{t('survey.cancel')}</button>
                <button className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg`} onClick={handleEditSurvey}>{t('survey.save')}</button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={showDelete} onClose={() => setShowDelete(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-10`}>
            <Dialog.Title className={`text-xl font-bold mb-4 text-red-500`}>{t('survey.delete_confirm_title')}</Dialog.Title>
            <p className={`${colors.textSecondary} mb-6`}>{deleteTarget && `${t('survey.delete_confirm')} "${deleteTarget.title_en}"?`}</p>
            <div className="flex justify-end gap-2">
              <button className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg`} onClick={() => setShowDelete(false)}>{t('survey.cancel')}</button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={handleDeleteSurvey}>{t('reports.delete')}</button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog key={modalRefreshKey} open={showLinkManagementModal} onClose={() => setShowLinkManagementModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-2xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
            <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>{lang === 'ar' ? 'إدارة الروابط' : 'Link Management'} - {selectedSurveyForLinks?.title_en}</Dialog.Title>
            <div className="space-y-6">
              {/* Invites Section */}
              <div className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                <h3 className={`text-lg font-semibold mb-3 ${colors.textPrimary} flex items-center gap-2`}>
                  <LinkIcon className="w-5 h-5" />{lang === 'ar' ? 'روابط الدعوات' : 'Invites'}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${colors.textSecondary} text-sm`}>
                    {(selectedSurveyForLinks?.invites?.length || 0)} {lang === 'ar' ? 'دعوة' : 'invites'}
                  </div>
                  <button
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-3 py-2 rounded-lg text-sm font-semibold`}
                    onClick={handleGenerateInvite}
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Generating...') : (lang === 'ar' ? 'إنشاء دعوة جديدة' : 'Generate New Invite')}
                  </button>
                </div>
                <div className="space-y-2">
                  {(selectedSurveyForLinks?.invites || []).map((inv: any) => (
                    <div key={inv.id} className={`flex items-center justify-between ${colors.inputBg} ${colors.inputBorder} p-3 rounded-lg`}> 
                      <div className="min-w-0">
                        <div className={`${colors.textPrimary} text-sm break-all`}>{`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/${inv.token}`}</div>
                        <div className={`${colors.textSecondary} text-xs mt-1`}>
                          {lang === 'ar' ? 'ينتهي:' : 'Expires:'} {new Date(inv.expires_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} · {inv.used ? (lang === 'ar' ? 'مستخدم' : 'Used') : (lang === 'ar' ? 'نشط' : 'Active')}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={() => openLink(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/${inv.token}`)} title={lang === 'ar' ? 'فتح الرابط' : 'Open Link'}>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/${inv.token}`)} title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}>
                          <DocumentDuplicateIcon className="w-4 h-4 text-green-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={() => handleDeleteInvite(inv.id)} title={lang === 'ar' ? 'حذف الدعوة' : 'Delete Invite'}>
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedSurveyForLinks?.invites?.length === 0 && (
                    <div className={`${colors.textSecondary} text-sm`}>{lang === 'ar' ? 'لا توجد دعوات' : 'No invites'}</div>
                  )}
                </div>
              </div>
              {/* Permanent Link Section */}
              <div className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                <h3 className={`text-lg font-semibold mb-3 ${colors.textPrimary} flex items-center gap-2`}><LinkIcon className="w-5 h-5" />{lang === 'ar' ? 'الرابط الدائم' : 'Permanent Link'}</h3>
                {selectedSurveyForLinks?.permanent_token ? (
                  <div className="space-y-3">
                    <p className={`text-sm ${colors.textSecondary}`}>{lang === 'ar' ? 'يوجد رابط دائم لهذا الاستطلاع:' : 'A permanent link exists for this survey:'}</p>
                    <div className={`${colors.inputBg} ${colors.inputBorder} p-3 rounded-lg break-all ${colors.textPrimary} text-sm flex items-center justify-between gap-2`}>
                      <span className="flex-1">{`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`}</span>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={() => openLink(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`)} title={lang === 'ar' ? 'فتح الرابط' : 'Open Link'}>
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`)} title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}>
                          <DocumentDuplicateIcon className="w-4 h-4 text-green-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-600 rounded" onClick={handleRemovePermanentLink} title={lang === 'ar' ? 'حذف الرابط' : 'Delete Link'}>
                          <TrashIcon className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className={`text-sm ${colors.textSecondary}`}>{lang === 'ar' ? 'إنشاء رابط دائم...' : 'Create a permanent link...'}</p>
                    <button className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg`} onClick={handleGeneratePermanentLink} disabled={permanentLoading}>
                      {permanentLoading ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (<><LinkIcon className="w-4 h-4 inline-block mr-1" />{lang === 'ar' ? 'إنشاء رابط دائم' : 'Create Permanent Link'}</>)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={showResponsesModal} onClose={() => setShowResponsesModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-3xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
            <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>{lang === 'ar' ? 'الردود' : 'Responses'}</Dialog.Title>
            {responsesLoading ? (
              <div className={`text-center ${colors.textSecondary}`}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
            ) : (
              <div className="space-y-4">
                {responses.map((r: any, idx: number) => (
                  <div key={idx} className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                    <div className={`text-sm ${colors.textSecondary}`}>{new Date(r.created_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</div>
                    <div className={`${colors.textPrimary}`}>{r.name} - {r.department}</div>
                  </div>
                ))}
                {responses.length === 0 && <div className={`text-center ${colors.textSecondary}`}>{lang === 'ar' ? 'لا توجد ردود' : 'No responses'}</div>}
                <div className="text-right">
                  <button className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg`} onClick={() => selectedSurveyForResponses && exportToCSV(selectedSurveyForResponses.id)}>
                    <ArrowDownTrayIcon className="w-4 h-4 inline-block mr-1" />{t('reports.export')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
} 