"use client";

import Navigation from '@/components/Navigation';
import { useTheme, useLang } from '../../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  StarIcon,
  ChartPieIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { saveAs } from 'file-saver';
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
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import { RATING_SCALES, QUESTION_TYPES, getRatingScaleById } from '@/lib/surveyTypes';

// Theme-specific color schemes
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
    borderHover: 'border-green-500',
    inputBg: 'bg-slate-800',
    inputBorder: 'border-slate-700',
    iconBg: 'bg-slate-800',
    glassBg: 'bg-slate-900/80',
    glassBorder: 'border-green-500/20'
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
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
    iconBg: 'bg-slate-200',
    glassBg: 'bg-white/80',
    glassBorder: 'border-green-500/20'
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
    borderHover: 'border-green-500',
    inputBg: 'bg-slate-800',
    inputBorder: 'border-slate-600',
    iconBg: 'bg-slate-800',
    glassBg: 'bg-slate-900/80',
    glassBorder: 'border-green-500/20'
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
    borderHover: 'border-green-500',
    inputBg: 'bg-white',
    inputBorder: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
    glassBg: 'bg-white/80',
    glassBorder: 'border-green-500/20'
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
    borderHover: 'border-green-500',
    inputBg: 'bg-zinc-900',
    inputBorder: 'border-zinc-700',
    iconBg: 'bg-zinc-800',
    glassBg: 'bg-zinc-950/80',
    glassBorder: 'border-green-500/20'
  }
};

export default function SurveyReportPage() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;


  // State management
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
      rating_options: [] as any
    }] 
  });

  // Link management
  const [showLinkManagementModal, setShowLinkManagementModal] = useState(false);
  const [selectedSurveyForLinks, setSelectedSurveyForLinks] = useState<any>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [permanentLoading, setPermanentLoading] = useState(false);
  const [modalRefreshKey, setModalRefreshKey] = useState(0); // For forcing modal refresh

  // Responses management
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [selectedSurveyForResponses, setSelectedSurveyForResponses] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch surveys
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
        setSurveys(data.surveys || []);
      } else {
        setError(data.error || 'Failed to fetch surveys');
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Add new survey
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
            rating_options: q.rating_options
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        closeAddModal();
        fetchSurveys(); // Refresh the list
      } else {
        setError(data.error || 'Failed to create survey');
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      setError('Network error occurred');
    }
  }

  // Edit survey
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
          questions: form.questions.map((q, idx) => ({
            id: q.id, // Include existing question ID if editing
            label_en: q.label_en,
            label_ar: q.label_ar,
            type: q.type,
            required: q.required,
            rating_scale: q.rating_scale || null,
            rating_options: q.rating_options
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
        setSelectedSurvey(null);
        fetchSurveys(); // Refresh the list
      } else {
        setError(data.error || 'Failed to update survey');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setError('Network error occurred');
    }
  }

  // Delete survey
  async function handleDeleteSurvey() {
    if (!deleteTarget) return;
    
    try {
      const res = await fetch('/api/surveys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id })
      });
      const data = await res.json();
      if (data.success) {
        setShowDelete(false);
        setDeleteTarget(null);
        fetchSurveys(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete survey');
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      setError('Network error occurred');
    }
  }

  // Reset form to default state
  function resetForm() {
    setForm({ 
      title_en: '', 
      title_ar: '', 
      questions: [{ 
        id: undefined as number | undefined,
        label_en: '', 
        label_ar: '', 
        type: 'text', 
        required: false,
        rating_scale: '',
        rating_options: [] as any
      }] 
    });
  }

  // Open add survey modal
  function openAddModal() {
    resetForm(); // Reset form to clean state
    setShowAdd(true);
  }

  // Close add survey modal
  function closeAddModal() {
    setShowAdd(false);
    resetForm(); // Reset form when closing
  }

  // Open edit modal
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
        rating_options: q.rating_options || []
      }))
    });
    setShowEdit(true);
  }

  // Open delete confirmation
  function openDeleteModal(survey: any) {
    setDeleteTarget(survey);
    setShowDelete(true);
  }

  // Add question to form
  function addQuestion() {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: undefined,
        label_en: '',
        label_ar: '',
        type: 'text',
        required: false,
        rating_scale: '',
        rating_options: [] as any
      }]
    }));
  }

  // Remove question from form
  function removeQuestion(index: number) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  }

  // Update question in form
  function updateQuestion(index: number, field: string, value: any) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  }

  // Handle invite generation
  async function handleGenerateInvite() {
    setInviteLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: selectedSurveyForLinks.id
        })
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData(); // Refresh modal data
      } else {
        setError(data.error || 'Failed to generate invite');
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      setError('Network error occurred');
    } finally {
      setInviteLoading(false);
    }
  }

  // Handle invite deletion
  async function handleDeleteInvite(inviteId: number) {
    try {
      const res = await fetch('/api/surveys/invite', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inviteId })
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData(); // Refresh modal data
      } else {
        setError(data.error || 'Failed to delete invite');
      }
    } catch (error) {
      console.error('Error deleting invite:', error);
      setError('Network error occurred');
    }
  }

  // Handle permanent link generation
  async function handleGeneratePermanentLink() {
    setPermanentLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: selectedSurveyForLinks.id
        })
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData(); // Refresh modal data
      } else {
        setError(data.error || 'Failed to generate permanent link');
      }
    } catch (error) {
      console.error('Error generating permanent link:', error);
      setError('Network error occurred');
    } finally {
      setPermanentLoading(false);
    }
  }

  // Handle permanent link removal
  async function handleRemovePermanentLink() {
    setPermanentLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: selectedSurveyForLinks.id
        })
      });
      const data = await res.json();
      if (data.success) {
        await refreshModalData(); // Refresh modal data
      } else {
        setError(data.error || 'Failed to remove permanent link');
      }
    } catch (error) {
      console.error('Error removing permanent link:', error);
      setError('Network error occurred');
    } finally {
      setPermanentLoading(false);
    }
  }

  // Helper function to refresh modal data
  async function refreshModalData() {
    await fetchSurveys();
    const updatedSurveys = await fetch('/api/surveys').then(res => res.json());
    if (updatedSurveys.success) {
      const updatedSurvey = updatedSurveys.surveys.find((s: any) => s.id === selectedSurveyForLinks.id);
      if (updatedSurvey) {
        setSelectedSurveyForLinks(updatedSurvey);
      }
    }
    setModalRefreshKey(prev => prev + 1);
  }

  // Open link management modal
  function openLinkManagementModal(survey: any) {
    setSelectedSurveyForLinks(survey);
    setShowLinkManagementModal(true);
  }

  // Copy link to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here if needed
      console.log('Link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }

  // Open link in new tab
  function openLink(url: string) {
    window.open(url, '_blank');
  }

  // Open responses modal
  function openResponsesModal(survey: any) {
    setSelectedSurveyForResponses(survey);
    setShowResponsesModal(true);
    fetchResponses(survey.id);
  }

  // Fetch responses for a survey
  async function fetchResponses(surveyId: number) {
    setResponsesLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/responses`);
      const data = await res.json();
      if (data.success) {
        setResponses(data.responses || []);
      } else {
        setError(data.error || 'Failed to fetch responses');
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError('Network error occurred');
    } finally {
      setResponsesLoading(false);
    }
  }

  // Export responses to CSV
  async function exportToCSV(surveyId: number) {
    setExportLoading(true);
    try {
      // Use local responses data if available, otherwise fetch from API
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
      
      // Create CSV content
      const csvContent = generateCSVContent(responsesData, selectedSurveyForResponses);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Generate filename based on language
      const surveyTitle = lang === 'ar' 
        ? selectedSurveyForResponses?.title_ar?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || 'survey'
        : selectedSurveyForResponses?.title_en?.replace(/[^a-zA-Z0-9]/g, '_') || 'survey';
      
      const fileName = lang === 'ar'
        ? `ردود_الاستطلاع_${surveyTitle}_${new Date().toISOString().split('T')[0]}.csv`
        : `survey_responses_${surveyTitle}_${new Date().toISOString().split('T')[0]}.csv`;
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error exporting responses:', error);
      setError('Network error occurred');
    } finally {
      setExportLoading(false);
    }
  }

  // Generate CSV content with proper formatting and index
  function generateCSVContent(responses: any[], survey: any) {
    if (!responses || responses.length === 0) {
      return lang === 'ar' ? 'لا توجد ردود' : 'No responses found';
    }

    // Add BOM for Arabic text support in Excel
    const BOM = '\uFEFF';
    
    // Headers based on current language
    const headers = lang === 'ar' 
      ? ['الرقم التسلسلي', 'الاسم', 'القسم', 'تاريخ الإرسال']
      : ['Index', 'Name', 'Department', 'Submission Date'];
    
    const questionHeaders = survey.questions?.map((q: any, index: number) => 
      `${index + 1}. ${lang === 'ar' ? q.label_ar : q.label_en}`
    ) || [];
    
    headers.push(...questionHeaders);

    const csvRows = [headers.join(',')];

    responses.forEach((response, index) => {
      const row = [
        index + 1, // Index
        response.name || '',
        response.department || '',
        new Date(response.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')
      ];

      // Add answers for each question
      survey.questions?.forEach((question: any) => {
        const answer = response.answers?.find((a: any) => a.question_id === question.id);
        let answerText = '';
        
        if (answer) {
          if (question.type === 'rating') {
            answerText = `${answer.answer}/5`;
          } else if (question.type === 'comments') {
            const yesNo = response.answers?.find((a: any) => a.question_id === question.id && a.answer.includes('_yesno'))?.answer || '';
            const comment = response.answers?.find((a: any) => a.question_id === question.id && a.answer.includes('_comment'))?.answer || '';
            
            // Translate Yes/No for Arabic
            let translatedYesNo = yesNo;
            if (lang === 'ar') {
              if (yesNo === 'Yes') translatedYesNo = 'نعم';
              else if (yesNo === 'No') translatedYesNo = 'لا';
            }
            
            answerText = `${translatedYesNo}${comment ? ` - ${comment}` : ''}`;
          } else {
            answerText = answer.answer || '';
          }
        }
        
        // Escape commas and quotes in CSV
        if (answerText.includes(',') || answerText.includes('"') || answerText.includes('\n')) {
          answerText = `"${answerText.replace(/"/g, '""')}"`;
        }
        
        row.push(answerText);
      });

      csvRows.push(row.join(','));
    });

    return BOM + csvRows.join('\n');
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const totalQuestions = surveys.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
    const totalResponses = surveys.reduce((sum, s) => sum + (s.responses?.length || 0), 0);
    const totalInvites = surveys.reduce((sum, s) => sum + (s.invites?.length || 0), 0);
    const activeInvites = surveys.reduce((sum, s) => sum + (s.invites?.filter((i: any) => !i.used && new Date(i.expires_at) > new Date()).length || 0), 0);
    
    // Last survey created
    const lastSurvey = surveys.length > 0 ? surveys.reduce((latest, survey) => 
      new Date(survey.created_at) > new Date(latest.created_at) ? survey : latest
    ) : null;
    const lastSurveyDate = lastSurvey ? new Date(lastSurvey.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US') : '-';
    
    // Highest rating survey
    let highestRating = 0;
    let highestRatingSurvey = null;
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      let surveyTotalRating = 0;
      let surveyTotalResponses = 0;
      
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => 
          r.answers?.filter((a: any) => a.question_id === question.id) || []
        ) || [];
        
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
        if (avgRating > highestRating) {
          highestRating = avgRating;
          highestRatingSurvey = survey;
        }
      }
    }
    const highestRatingValue = highestRating > 0 ? highestRating.toFixed(1) : '0.0';
    
    // Rating questions percentage
    const ratingQuestions = surveys.reduce((sum, s) => 
      sum + (s.questions?.filter((q: any) => q.question_type === 'rating').length || 0), 0
    );
    const ratingQuestionsPercentage = totalQuestions > 0 ? Math.round((ratingQuestions / totalQuestions) * 100) : 0;
    
    // Average questions per survey
    const avgQuestionsPerSurvey = totalSurveys > 0 ? Math.round(totalQuestions / totalSurveys) : 0;
    
    // Rating distribution
    let lowRatings = 0; // 1-2
    let mediumRatings = 0; // 3
    let highRatings = 0; // 4-5
    
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => 
          r.answers?.filter((a: any) => a.question_id === question.id) || []
        ) || [];
        
        answers.forEach((answer: any) => {
          const rating = parseInt(answer.answer);
          if (rating >= 1 && rating <= 2) lowRatings++;
          else if (rating === 3) mediumRatings++;
          else if (rating >= 4 && rating <= 5) highRatings++;
        });
      }
    }
    
    return [
      { 
        icon: <ChartBarIcon className="w-7 h-7 text-blue-400" />, 
        label: t('reports.total_surveys'), 
        value: totalSurveys 
      },
      { 
        icon: <QuestionMarkCircleIcon className="w-7 h-7 text-orange-400" />, 
        label: t('reports.total_questions'), 
        value: totalQuestions 
      },
      { 
        icon: <ClipboardDocumentCheckIcon className="w-7 h-7 text-green-400" />, 
        label: t('reports.total_responses'), 
        value: totalResponses 
      },
      { 
        icon: <UserGroupIcon className="w-7 h-7 text-purple-400" />, 
        label: t('reports.active_invites'), 
        value: activeInvites 
      },
      { 
        icon: <CalendarIcon className="w-7 h-7 text-indigo-400" />, 
        label: t('reports.last_survey'), 
        value: lastSurveyDate 
      },
      { 
        icon: <StarIcon className="w-7 h-7 text-yellow-400" />, 
        label: t('reports.highest_rating'), 
        value: highestRatingValue 
      },
      { 
        icon: <ChartPieIcon className="w-7 h-7 text-pink-400" />, 
        label: t('reports.rating_questions_percentage'), 
        value: `${ratingQuestionsPercentage}%` 
      },
      { 
        icon: <DocumentTextIcon className="w-7 h-7 text-cyan-400" />, 
        label: t('reports.avg_questions_per_survey'), 
        value: avgQuestionsPerSurvey 
      },
      { 
        icon: <ChartBarIcon className="w-7 h-7 text-purple-400" />, 
        label: t('reports.rating_distribution'), 
        value: `${lowRatings} | ${mediumRatings} | ${highRatings}` 
      },
    ];
  }, [surveys, t, lang]);

  // Calculate rating statistics for pie charts
  const ratingStats = useMemo(() => {
    const stats = [];
    
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => 
          r.answers?.filter((a: any) => a.question_id === question.id) || []
        ) || [];
        
        // Count ratings (1-5)
        const ratingCounts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        answers.forEach((answer: any) => {
          const rating = answer.answer;
          if (ratingCounts.hasOwnProperty(rating)) {
            ratingCounts[rating as keyof typeof ratingCounts]++;
          }
        });
        
        // Only include questions with responses
        if (answers.length > 0) {
          stats.push({
            surveyId: survey.id,
            surveyTitle: lang === 'ar' ? survey.title_ar : survey.title_en,
            questionId: question.id,
            questionTitle: lang === 'ar' ? question.label_ar : question.label_en,
            ratingCounts,
            totalResponses: answers.length,
            ratingOptions: question.rating_options || {}
          });
        }
      }
    }
    
    return stats;
  }, [surveys, lang]);

  // Calculate average rating from all rating questions
  const averageRating = useMemo(() => {
    let totalRating = 0;
    let totalResponses = 0;
    
    for (const survey of surveys) {
      const ratingQuestions = survey.questions?.filter((q: any) => q.question_type === 'rating') || [];
      
      for (const question of ratingQuestions) {
        const answers = survey.responses?.flatMap((r: any) => 
          r.answers?.filter((a: any) => a.question_id === question.id) || []
        ) || [];
        
        answers.forEach((answer: any) => {
          const rating = parseInt(answer.answer);
          if (rating >= 1 && rating <= 5) {
            totalRating += rating;
            totalResponses++;
          }
        });
      }
    }
    
    // Return average rating from 1-5 scale
    return totalResponses > 0 ? (totalRating / totalResponses).toFixed(1) : '0.0';
  }, [surveys]);
  
  const participationRate = surveys.length > 0 ? Math.round((surveys.reduce((sum, s) => sum + (s.invites?.filter((i: any) => i.used).length || 0), 0) / surveys.reduce((sum, s) => sum + (s.invites?.length || 0), 0)) * 100) : 0;

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => s.title_en.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [surveys, searchTerm]);

  // Generate pie chart data for rating questions
  const generatePieChartData = (ratingStats: any) => {
    const colors = [
      '#FF6384', // Red - Very Dissatisfied/Not Encouraged
      '#FF9F40', // Orange - Dissatisfied/Somewhat
      '#FFCE56', // Yellow - Neutral/Moderately
      '#4BC0C0', // Teal - Satisfied/Good
      '#36A2EB'  // Blue - Very Satisfied/Excellent
    ];

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];

    Object.entries(ratingStats.ratingCounts).forEach(([rating, count], index) => {
      if ((count as number) > 0) {
        const ratingLabel = ratingStats.ratingOptions[rating] || `Rating ${rating}`;
        labels.push(ratingLabel);
        data.push(count as number);
        backgroundColor.push(colors[index % colors.length]);
        borderColor.push(colors[index % colors.length]);
      }
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderColor,
        borderWidth: 3,
        hoverBorderWidth: 6,
        hoverOffset: 15,
        hoverBackgroundColor: backgroundColor.map(color => {
          // Make hover colors slightly lighter
          return color.replace(')', ', 0.8)').replace('rgb', 'rgba');
        })
      }]
    };
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: theme === 'light' ? '#1e293b' : '#f1f5f9',
          font: {
            size: 11
          },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0, 0, 0, 0.98)',
        titleColor: theme === 'light' ? '#1e293b' : '#f1f5f9',
        bodyColor: theme === 'light' ? '#1e293b' : '#f1f5f9',
        borderColor: theme === 'light' ? '#e2e8f0' : '#475569',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context: any) {
            return context[0].label || '';
          },
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `${lang === 'ar' ? 'العدد:' : 'Count:'} ${value}`,
              `${lang === 'ar' ? 'النسبة:' : 'Percentage:'} ${percentage}%`,
              `${lang === 'ar' ? 'من إجمالي:' : 'Out of total:'} ${total}`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header content-animate">
          <div className="page-header-icon icon-animate">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {t('reports.title')}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {t('reports.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 content-animate">
          <div className={`flex rounded-lg p-1 ${colors.cardBg} border ${colors.borderPrimary}`}>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'reports'
                  ? `${colors.primaryBg} text-white shadow-lg`
                  : `${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {t('reports.reports_tab')}
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'management'
                  ? `${colors.primaryBg} text-white shadow-lg`
                  : `${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {t('reports.management_tab')}
            </button>
          </div>
        </div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 content-animate">
            {/* Statistics Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className="flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold text-center mb-2 ${colors.textPrimary}`}>
                    {stat.value}
                  </div>
                  <div className={`text-center ${colors.textSecondary}`}>
                    {stat.label}
                  </div>
                </div>
              ))}

              {/* Participation Rates Chart */}
              <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg`}>
                <h2 className={`text-lg font-bold mb-4 text-center ${colors.textPrimary}`}>
                  {t('reports.participation_rates')}
                </h2>
                <div className="flex flex-col gap-6 justify-center items-center">
                  {/* Average Rating */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-3 flex items-center justify-center">
                      <div className={`text-3xl font-bold ${colors.primary}`}>
                        {averageRating}
                    </div>
                    </div>
                    <div className={`text-sm font-bold ${colors.primary}`}>
                      {t('reports.average_rating')}
                    </div>
                  </div>
                  
                  {/* Participation Rate */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-3">
                      <CircularProgressbar
                        value={participationRate}
                        text={`${participationRate}%`}
                        styles={buildStyles({
                          pathColor: '#00e0ff',
                          textColor: '#00e0ff',
                          trailColor: theme === 'light' ? '#e2e8f0' : '#1e293b',
                          backgroundColor: theme === 'light' ? '#f8fafc' : '#0f172a',
                        })}
                      />
                    </div>
                    <div className="text-sm font-bold text-cyan-400">
                      {t('reports.participation_rate')}
                    </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Rating Questions Pie Charts */}
              {ratingStats.length > 0 ? (
                <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg`}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-500 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.textPrimary}`}>
                        {lang === 'ar' ? 'إحصائيات الأسئلة التقييمية' : 'Rating Questions Statistics'}
                      </h2>
                      <p className={`text-sm ${colors.textSecondary} text-center mt-1`}>
                        {lang === 'ar' ? 'توزيع الردود على الأسئلة التقييمية' : 'Distribution of responses to rating questions'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ratingStats.slice(0, 4).map((stat, index) => (
                      <div key={`${stat.surveyId}-${stat.questionId}`} className={`${colors.cardBgHover} border ${colors.borderPrimary} p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                        <div className="flex items-center justify-center mb-4">
                          <div className={`w-4 h-4 rounded-full mr-3 ${index % 4 === 0 ? 'bg-gradient-to-r from-red-400 to-pink-400' : index % 4 === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : index % 4 === 2 ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-purple-400 to-violet-400'} shadow-lg`}></div>
                          <h3 className={`text-lg font-semibold ${colors.textPrimary} text-center`}>
                            {stat.questionTitle}
                          </h3>
                        </div>
                        <p className={`text-sm ${colors.textSecondary} text-center mb-4 px-2 italic flex items-center justify-center gap-1`}>
                          <span>📋</span>
                          <span className="max-w-xs truncate" title={stat.surveyTitle}>{stat.surveyTitle}</span>
                        </p>
                        <div className="h-64 relative group">
                          <Pie data={generatePieChartData(stat)} options={pieChartOptions} />
                        </div>
                        <div className={`text-center mt-4 text-sm ${colors.textSecondary} flex flex-col items-center gap-2`}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                            <span>{t('reports.total_responses')}: <span className="font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{stat.totalResponses}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            <span>{t('reports.average_rating')}: <span className="font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                              {(() => {
                                const total = Object.values(stat.ratingCounts).reduce((sum: number, count: any) => sum + (count as number), 0);
                                const weightedSum = Object.entries(stat.ratingCounts).reduce((sum: number, [rating, count]) => sum + (parseInt(rating) * (count as number)), 0);
                                return total > 0 ? (weightedSum / total).toFixed(1) : '0.0';
                              })()}
                            </span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ratingStats.length > 4 && (
                    <div className={`text-center mt-6 ${colors.textSecondary}`}>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span>📈</span>
                        <span>{lang === 'ar' ? `و ${ratingStats.length - 4} أسئلة تقييمية أخرى` : `And ${ratingStats.length - 4} more rating questions`}</span>
                        <span className="text-xs opacity-75">({lang === 'ar' ? 'عرض أول 4 فقط' : 'Showing first 4 only'})</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg`}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.textPrimary}`}>
                        {lang === 'ar' ? 'إحصائيات الأسئلة التقييمية' : 'Rating Questions Statistics'}
                      </h2>
                      <p className={`text-sm ${colors.textSecondary} text-center mt-1`}>
                        {lang === 'ar' ? 'توزيع الردود على الأسئلة التقييمية' : 'Distribution of responses to rating questions'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-center ${colors.textSecondary} py-8`}>
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-lg mb-2">{lang === 'ar' ? 'لا توجد أسئلة تقييمية مع ردود لعرضها' : 'No rating questions with responses to display'}</p>
                    <p className="text-sm opacity-75">{lang === 'ar' ? 'ستظهر الرسوم البيانية هنا عندما تكون هناك ردود على الأسئلة التقييمية' : 'Charts will appear here when there are responses to rating questions'}</p>
                  </div>
                </div>
              )}



              {/* Survey Performance Overview */}
              <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg`}>
                <h3 className={`text-xl font-bold mb-6 ${colors.textPrimary}`}>
                  {t('reports.survey_performance')}
                </h3>
                <div className="space-y-4">
                  {filteredSurveys.slice(0, 5).map((survey, idx) => (
                    <div key={survey.id} className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className={`font-semibold ${colors.textPrimary}`}>
                            {lang === 'ar' ? survey.title_ar : survey.title_en}
                          </h4>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            {survey.responses?.length || 0} {t('reports.responses')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${colors.primary}`}>
                            {survey.questions?.length || 0}
                          </div>
                          <div className={`text-xs ${colors.textSecondary}`}>
                            {t('reports.questions')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Management Tab */}
        {activeTab === 'management' && (
          <div className="space-y-8 content-animate">
            {/* Search and Add Section */}
            <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg`}>
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
                <button 
                  className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2`}
                  onClick={openAddModal}
                >
                  <PlusIcon className="w-5 h-5" />
                  {t('reports.add_survey')}
                </button>
              </div>
            </div>

            {/* Surveys Grid */}
            {loading ? (
              <div className={`text-center py-16 ${colors.textSecondary} text-lg`}>
                {t('reports.loading_surveys')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurveys.map((survey, idx) => (
                  <div key={survey.id} className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-4">
                      <ChartBarIcon className={`w-6 h-6 ${colors.primary}`} />
                      <h3 className={`font-bold ${colors.textPrimary}`}>
                        {lang === 'ar' ? survey.title_ar : survey.title_en}
                      </h3>
                    </div>
                    
                    <div className={`text-sm ${colors.textSecondary} mb-4 space-y-1`}>
                      <div>{t('reports.questions')}: {survey.questions?.length || 0}</div>
                      <div>{t('reports.responses')}: {survey.responses?.length || 0}</div>
                      <div>{t('reports.active_invites')}: {survey.invites?.filter((i: any) => !i.used && new Date(i.expires_at) > new Date()).length || 0}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1`}
                        onClick={() => openResponsesModal(survey)}
                      >
                        <EyeIcon className="w-4 h-4" />
                        {t('reports.view')}
                      </button>
                      <button 
                        className={`bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1`}
                        onClick={() => exportToCSV(survey.id)}
                        disabled={exportLoading}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        {exportLoading ? t('reports.exporting') : t('reports.export')}
                      </button>
                      <button 
                        className={`${colors.cardBgHover} border ${colors.borderPrimary} text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1`}
                        onClick={() => openEditModal(survey)}
                      >
                        <PencilIcon className="w-4 h-4" />
                        {t('reports.edit')}
                      </button>
                      <button 
                        className={`bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1`}
                        onClick={() => openLinkManagementModal(survey)}
                      >
                        <LinkIcon className="w-4 h-4" />
                        {lang === 'ar' ? 'إدارة الروابط' : 'Manage Links'}
                      </button>
                      <button 
                        className={`bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1`}
                        onClick={() => openDeleteModal(survey)}
                      >
                        <TrashIcon className="w-4 h-4" />
                        {t('reports.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredSurveys.length === 0 && (
              <div className={`text-center py-16 ${colors.textSecondary}`}>
                <div className="text-6xl mb-4">📊</div>
                <h3 className={`text-xl font-bold mb-2 ${colors.textPrimary}`}>
                  {t('reports.no_surveys_found')}
                </h3>
                <p className={`mb-6 ${colors.textSecondary}`}>
                  {t('reports.no_surveys_desc')}
                </p>
                <button 
                  className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200`}
                  onClick={openAddModal}
                >
                  {t('reports.create_first_survey')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Survey Modal */}
        <Dialog open={showAdd} onClose={closeAddModal} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
              <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>
                {t('reports.add_survey')}
              </Dialog.Title>
              
              <div className="space-y-4">
                {/* Survey Title - English */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                    {t('survey.label_en')}
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                    value={form.title_en}
                    onChange={e => setForm({ ...form, title_en: e.target.value })}
                  />
                </div>
                
                {/* Survey Title - Arabic */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                    {t('survey.label_ar')}
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
                    value={form.title_ar}
                    onChange={e => setForm({ ...form, title_ar: e.target.value })}
                  />
                </div>

                {/* Questions Section */}
                <div>
                  <div className={`font-semibold mb-2 ${colors.textPrimary}`}>
                    {t('survey.questions')}
                  </div>
                  {form.questions.map((question, idx) => (
                    <div key={idx} className={`border ${colors.borderPrimary} rounded-lg p-4 mb-4`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Question Text - English */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.label_en')}
                          </label>
                          <input
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالإنجليزية' : 'Enter question in English'}
                            value={question.label_en}
                            onChange={e => updateQuestion(idx, 'label_en', e.target.value)}
                          />
                        </div>
                        
                        {/* Question Text - Arabic */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.label_ar')}
                          </label>
                          <input
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالعربية' : 'Enter question in Arabic'}
                            value={question.label_ar}
                            onChange={e => updateQuestion(idx, 'label_ar', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Question Type Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.question_type')}
                          </label>
                          <select
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            value={question.type}
                            onChange={e => updateQuestion(idx, 'type', e.target.value)}
                          >
                            {QUESTION_TYPES.map(type => (
                              <option key={type.id} value={type.id}>
                                {lang === 'ar' ? type.name_ar : type.name_en}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rating Scale Selection (if type is rating) */}
                        {question.type === 'rating' && (
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                              {t('survey.rating_scale')}
                            </label>
                            <select
                              className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                              value={question.rating_scale}
                              onChange={e => {
                                const scale = getRatingScaleById(e.target.value);
                                updateQuestion(idx, 'rating_scale', e.target.value);
                                updateQuestion(idx, 'rating_options', scale?.options || []);
                              }}
                            >
                              <option value="">{t('survey.select_scale')}</option>
                              {RATING_SCALES.map(scale => (
                                <option key={scale.id} value={scale.id}>
                                  {lang === 'ar' ? scale.name_ar : scale.name_en}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Required Checkbox */}
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id={`required-${idx}`}
                          checked={question.required}
                          onChange={e => updateQuestion(idx, 'required', e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor={`required-${idx}`} className={`ml-2 text-sm ${colors.textPrimary}`}>
                          {t('survey.required_question')}
                        </label>
                      </div>

                      {/* Remove Question Button */}
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-200"
                        onClick={() => removeQuestion(idx)}
                        disabled={form.questions.length === 1}
                      >
                        {t('survey.remove_question')}
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Question Button */}
                  <button
                    type="button"
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg text-sm transition-all duration-200`}
                    onClick={addQuestion}
                  >
                    + {t('survey.add_question')}
                  </button>
                </div>

                {error && <div className={`text-red-500 text-sm mt-2 ${colors.textPrimary}`}>{error}</div>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={closeAddModal}
                  >
                    {t('survey.cancel')}
                  </button>
                  <button
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={handleAddSurvey}
                  >
                    {t('survey.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Edit Survey Modal */}
        <Dialog open={showEdit} onClose={() => setShowEdit(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
              <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>
                {t('survey.edit')}
              </Dialog.Title>
              
              <div className="space-y-4">
                {/* Survey Title - English */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                    {t('survey.label_en')}
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                    value={form.title_en}
                    onChange={e => setForm({ ...form, title_en: e.target.value })}
                  />
                </div>
                
                {/* Survey Title - Arabic */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                    {t('survey.label_ar')}
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
                    value={form.title_ar}
                    onChange={e => setForm({ ...form, title_ar: e.target.value })}
                  />
                </div>

                {/* Questions Section */}
                <div>
                  <div className={`font-semibold mb-2 ${colors.textPrimary}`}>
                    {t('survey.questions')}
                  </div>
                  {form.questions.map((question, idx) => (
                    <div key={idx} className={`border ${colors.borderPrimary} rounded-lg p-4 mb-4`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Question Text - English */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.label_en')}
                          </label>
                          <input
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالإنجليزية' : 'Enter question in English'}
                            value={question.label_en}
                            onChange={e => updateQuestion(idx, 'label_en', e.target.value)}
                          />
                        </div>
                        
                        {/* Question Text - Arabic */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.label_ar')}
                          </label>
                          <input
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالعربية' : 'Enter question in Arabic'}
                            value={question.label_ar}
                            onChange={e => updateQuestion(idx, 'label_ar', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Question Type Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                            {t('survey.question_type')}
                          </label>
                          <select
                            className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                            value={question.type}
                            onChange={e => updateQuestion(idx, 'type', e.target.value)}
                          >
                            {QUESTION_TYPES.map(type => (
                              <option key={type.id} value={type.id}>
                                {lang === 'ar' ? type.name_ar : type.name_en}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rating Scale Selection (if type is rating) */}
                        {question.type === 'rating' && (
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${colors.textPrimary}`}>
                              {t('survey.rating_scale')}
                            </label>
                            <select
                              className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                              value={question.rating_scale}
                              onChange={e => {
                                const scale = getRatingScaleById(e.target.value);
                                updateQuestion(idx, 'rating_scale', e.target.value);
                                updateQuestion(idx, 'rating_options', scale?.options || []);
                              }}
                            >
                              <option value="">{t('survey.select_scale')}</option>
                              {RATING_SCALES.map(scale => (
                                <option key={scale.id} value={scale.id}>
                                  {lang === 'ar' ? scale.name_ar : scale.name_en}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Required Checkbox */}
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id={`edit-required-${idx}`}
                          checked={question.required}
                          onChange={e => updateQuestion(idx, 'required', e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor={`edit-required-${idx}`} className={`ml-2 text-sm ${colors.textPrimary}`}>
                          {t('survey.required_question')}
                        </label>
                      </div>

                      {/* Remove Question Button */}
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-200"
                        onClick={() => removeQuestion(idx)}
                        disabled={form.questions.length === 1}
                      >
                        {t('survey.remove_question')}
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Question Button */}
                  <button
                    type="button"
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg text-sm transition-all duration-200`}
                    onClick={addQuestion}
                  >
                    + {t('survey.add_question')}
                  </button>
                </div>

                {error && <div className={`text-red-500 text-sm mt-2 ${colors.textPrimary}`}>{error}</div>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={() => setShowEdit(false)}
                  >
                    {t('survey.cancel')}
                  </button>
                  <button
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={handleEditSurvey}
                  >
                    {t('survey.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDelete} onClose={() => setShowDelete(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-10`}>
              <Dialog.Title className={`text-xl font-bold mb-4 text-red-500`}>
                {t('survey.delete_confirm_title')}
              </Dialog.Title>
              <p className={`mb-6 ${colors.textSecondary}`}>
                {deleteTarget && `${t('survey.delete_confirm')} "${deleteTarget.title_en}"?`}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                  onClick={() => setShowDelete(false)}
                >
                  {t('survey.cancel')}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  onClick={handleDeleteSurvey}
                >
                  {t('reports.delete')}
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Link Management Modal */}
        <Dialog key={modalRefreshKey} open={showLinkManagementModal} onClose={() => setShowLinkManagementModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-2xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
              <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>
                {lang === 'ar' ? 'إدارة الروابط' : 'Link Management'} - {selectedSurveyForLinks?.title_en}
              </Dialog.Title>
              
              <div className="space-y-6">
                {/* Permanent Link Section */}
                <div className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                  <h3 className={`text-lg font-semibold mb-3 ${colors.textPrimary} flex items-center gap-2`}>
                    <LinkIcon className="w-5 h-5" />
                    {lang === 'ar' ? 'الرابط الدائم' : 'Permanent Link'}
                  </h3>
                  
                                     {selectedSurveyForLinks?.permanent_token ? (
                     <div className="space-y-3">
                       <p className={`text-sm ${colors.textSecondary}`}>
                         {lang === 'ar' ? 'يوجد رابط دائم لهذا الاستطلاع:' : 'A permanent link exists for this survey:'}
                       </p>
                       <div className={`${colors.inputBg} ${colors.inputBorder} p-3 rounded-lg break-all ${colors.textPrimary} text-sm flex items-center justify-between gap-2`}>
                         <span className="flex-1">
                           {`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`}
                         </span>
                         <div className="flex gap-1">
                  <button
                             className="p-1 hover:bg-slate-600 rounded transition-colors"
                             onClick={() => openLink(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`)}
                             title={lang === 'ar' ? 'فتح الرابط' : 'Open Link'}
                  >
                             <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-400" />
                  </button>
                           <button
                             className="p-1 hover:bg-slate-600 rounded transition-colors"
                             onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${selectedSurveyForLinks.permanent_token}`)}
                             title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                           >
                             <DocumentDuplicateIcon className="w-4 h-4 text-green-400" />
                           </button>
                           <button
                             className="p-1 hover:bg-slate-600 rounded transition-colors"
                             onClick={handleRemovePermanentLink}
                             title={lang === 'ar' ? 'حذف الرابط' : 'Delete Link'}
                           >
                             <TrashIcon className="w-4 h-4 text-red-400" />
                           </button>
                         </div>
                       </div>
                     </div>
                  ) : (
                    <div className="space-y-3">
                      <p className={`text-sm ${colors.textSecondary}`}>
                        {lang === 'ar' ? 'إنشاء رابط دائم يمكن لأي شخص استخدامه للوصول إلى هذا الاستطلاع دون الحاجة إلى دعوة.' : 'Create a permanent link that anyone can use to access this survey without needing an invite.'}
                      </p>
                      <button
                        className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2`}
                        onClick={handleGeneratePermanentLink}
                        disabled={permanentLoading}
                      >
                        {permanentLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-4 h-4" />
                            {lang === 'ar' ? 'إنشاء رابط دائم' : 'Create Permanent Link'}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Invites Section */}
                <div className={`${colors.cardBgHover} border ${colors.borderPrimary} p-4 rounded-lg`}>
                  <h3 className={`text-lg font-semibold mb-3 ${colors.textPrimary} flex items-center gap-2`}>
                    <UserPlusIcon className="w-5 h-5" />
                    {lang === 'ar' ? 'الدعوات' : 'Invites'}
                  </h3>
                  
                                     {/* Generate New Invite */}
                   <div className="space-y-3 mb-4">
                  <button
                    className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2`}
                    onClick={handleGenerateInvite}
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           {lang === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-4 h-4" />
                           {lang === 'ar' ? 'إنشاء دعوة جديدة' : 'Generate New Invite'}
                      </>
                    )}
                  </button>
                </div>

                  {/* Existing Invites */}
                  <div className="space-y-2">
                    <h4 className={`text-md font-medium ${colors.textPrimary}`}>
                      {lang === 'ar' ? 'الدعوات الموجودة:' : 'Existing Invites:'}
                    </h4>
                    {selectedSurveyForLinks?.invites && selectedSurveyForLinks.invites.length > 0 ? (
                      <div className="space-y-2">
                                                 {selectedSurveyForLinks.invites.map((invite: any) => (
                           <div key={invite.id} className={`${colors.inputBg} ${colors.inputBorder} p-3 rounded-lg`}>
                             <div className="flex justify-between items-start gap-2">
                               <div className="flex-1">
                                 <div className={`text-sm ${colors.textPrimary} break-all`}>
                                   {lang === 'ar' ? 'الرابط:' : 'Link:'} {invite.token}
              </div>
                                 <div className={`text-xs ${colors.textSecondary}`}>
                                   {lang === 'ar' ? 'دعا بواسطة:' : 'Invited by:'} {invite.invited_by}
                                 </div>
                                 <div className={`text-xs ${colors.textSecondary}`}>
                                   {lang === 'ar' ? 'الحالة:' : 'Status:'} 
                                   <span className={`ml-1 ${invite.used ? 'text-red-400' : new Date(invite.expires_at) > new Date() ? 'text-green-400' : 'text-yellow-400'}`}>
                                     {invite.used ? (lang === 'ar' ? 'مستخدم' : 'Used') : 
                                      new Date(invite.expires_at) > new Date() ? (lang === 'ar' ? 'نشط' : 'Active') : 
                                      (lang === 'ar' ? 'منتهي' : 'Expired')}
                                   </span>
                                 </div>
                               </div>
                               <div className="flex gap-1">
                                 <button
                                   className="p-1 hover:bg-slate-600 rounded transition-colors"
                                   onClick={() => openLink(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/${invite.token}`)}
                                   title={lang === 'ar' ? 'فتح الرابط' : 'Open Link'}
                                 >
                                   <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-400" />
                                 </button>
                                 <button
                                   className="p-1 hover:bg-slate-600 rounded transition-colors"
                                   onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/${invite.token}`)}
                                   title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                                 >
                                   <DocumentDuplicateIcon className="w-4 h-4 text-green-400" />
                                 </button>
                                 <button
                                   className="p-1 hover:bg-slate-600 rounded transition-colors"
                                   onClick={() => handleDeleteInvite(invite.id)}
                                   title={lang === 'ar' ? 'حذف الرابط' : 'Delete Link'}
                                 >
                                   <TrashIcon className="w-4 h-4 text-red-400" />
                                 </button>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${colors.textSecondary}`}>
                        {lang === 'ar' ? 'لا توجد دعوات لهذا الاستطلاع.' : 'No invites for this survey.'}
                      </p>
                    )}
                  </div>
                </div>

                {error && <div className={`text-red-500 text-sm ${colors.textPrimary}`}>{error}</div>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={() => setShowLinkManagementModal(false)}
                  >
                    {t('survey.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Responses Modal */}
        <Dialog open={showResponsesModal} onClose={() => setShowResponsesModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-6xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
              <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>
                {t('reports.survey_responses')} - {selectedSurveyForResponses?.title_en}
              </Dialog.Title>
              
              <div className="space-y-4">
                {responsesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`ml-3 ${colors.textPrimary}`}>
                      {t('reports.loading_responses')}
                    </span>
                    </div>
                ) : responses.length === 0 ? (
                  <div className={`text-center py-8 ${colors.textSecondary}`}>
                    <div className="text-4xl mb-2">📝</div>
                    <p>{t('reports.no_responses_survey')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className={`text-sm ${colors.textSecondary}`}>
                        {t('reports.total_responses_count')}: {responses.length}
                      </div>
                      <button
                        className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
                        onClick={() => exportToCSV(selectedSurveyForResponses.id)}
                        disabled={exportLoading}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        {exportLoading ? t('reports.exporting') : t('reports.export_csv')}
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`${colors.cardBgHover} border-b ${colors.borderPrimary}`}>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${colors.textPrimary} ${colors.primaryBg} bg-opacity-95`}>
                              #
                            </th>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${colors.textPrimary} ${colors.primaryBg} bg-opacity-95`}>
                              {t('reports.name')}
                            </th>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${colors.textPrimary} ${colors.primaryBg} bg-opacity-95`}>
                              {t('reports.department')}
                            </th>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${colors.textPrimary} ${colors.primaryBg} bg-opacity-95`}>
                              {t('reports.date')}
                            </th>
                            {selectedSurveyForResponses?.questions?.map((question: any, index: number) => (
                              <th key={question.id} className={`px-4 py-3 text-left text-sm font-semibold ${colors.textPrimary} ${colors.primaryBg} bg-opacity-95`}>
                                {index + 1}. {lang === 'ar' ? question.label_ar : question.label_en}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {responses.map((response, index) => (
                            <tr key={response.id} className={`border-b ${colors.borderPrimary} hover:${colors.cardBgHover} transition-colors`}>
                              <td className={`px-4 py-3 text-sm ${colors.textPrimary} font-medium`}>
                                {index + 1}
                              </td>
                              <td className={`px-4 py-3 text-sm ${colors.textPrimary}`}>
                                {response.name || '-'}
                              </td>
                              <td className={`px-4 py-3 text-sm ${colors.textPrimary}`}>
                                {response.department || '-'}
                              </td>
                              <td className={`px-4 py-3 text-sm ${colors.textSecondary}`}>
                                {new Date(response.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                              </td>
                              {selectedSurveyForResponses?.questions?.map((question: any) => {
                                const answer = response.answers?.find((a: any) => a.question_id === question.id);
                                let answerText = '-';
                                
                                if (answer) {
                                  if (question.type === 'rating') {
                                    answerText = `${answer.answer}/5`;
                                  } else if (question.type === 'comments') {
                                    const yesNo = response.answers?.find((a: any) => a.question_id === question.id && a.answer.includes('_yesno'))?.answer || '';
                                    const comment = response.answers?.find((a: any) => a.question_id === question.id && a.answer.includes('_comment'))?.answer || '';
                                    
                                    // Translate Yes/No for Arabic display
                                    let translatedYesNo = yesNo;
                                    if (lang === 'ar') {
                                      if (yesNo === 'Yes') translatedYesNo = 'نعم';
                                      else if (yesNo === 'No') translatedYesNo = 'لا';
                                    }
                                    
                                    answerText = `${translatedYesNo}${comment ? ` - ${comment}` : ''}`;
                                  } else {
                                    answerText = answer.answer || '-';
                                  }
                                }
                                
                                return (
                                  <td key={question.id} className={`px-4 py-3 text-sm ${colors.textPrimary} max-w-xs truncate`} title={answerText}>
                                    {answerText}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {error && <div className={`text-red-500 text-sm mt-4 ${colors.textPrimary}`}>{error}</div>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={() => setShowResponsesModal(false)}
                  >
                    {t('survey.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
} 