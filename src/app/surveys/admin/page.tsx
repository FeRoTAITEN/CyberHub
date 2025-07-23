"use client";

import { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme } from '../../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { Dialog } from '@headlessui/react';
import { saveAs } from 'file-saver';
import { useRef } from 'react';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RATING_SCALES, QUESTION_TYPES, getRatingScaleById } from '@/lib/surveyTypes';

export default function SurveyAdminPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'survey' | 'response', id: number, surveyId?: number, title?: string } | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [form, setForm] = useState({ 
    title_en: '', 
    title_ar: '', 
    questions: [{ 
      label_en: '', 
      label_ar: '', 
      type: 'text', 
      required: false,
      rating_scale: '',
      rating_options: [] as any
    }] 
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [newInvite, setNewInvite] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // State for show more invites per survey
  const [showMoreInvites, setShowMoreInvites] = useState<{ [surveyId: number]: boolean }>({});
  // State for copied invite link
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);
  // State for response search and date filter per survey
  const [responseSearch, setResponseSearch] = useState<{ [surveyId: number]: string }>({});
  const [responseDateRange, setResponseDateRange] = useState<{ [surveyId: number]: { from: string; to: string } }>({});

  // Infinite scroll state for invites per survey
  const INVITES_PAGE_SIZE = 10;
  const [inviteScroll, setInviteScroll] = useState<{ [surveyId: number]: { active: number; inactive: number } }>({});

  // Infinite scroll state for responses per survey
  const RESPONSES_PAGE_SIZE = 10;
  const [responsesPage, setResponsesPage] = useState<{ [surveyId: number]: number }>({});

  // 1. Add state for editing all questions of a survey
  const [editSurvey, setEditSurvey] = useState<any>(null);
  const [editForm, setEditForm] = useState({ 
    title_en: '', 
    title_ar: '', 
    questions: [{ 
      label_en: '', 
      label_ar: '', 
      type: 'text', 
      required: false,
      rating_scale: '',
      rating_options: [] as any
    }] 
  });


  // Helper to get paginated invites
  function getPaginatedInvites(invites: any[], type: 'active' | 'inactive', surveyId: number) {
    const page = inviteScroll[surveyId]?.[type] || 1;
    const start = 0;
    const end = page * INVITES_PAGE_SIZE;
    return invites.slice(start, end);
  }

  // Handle scroll for infinite loading
  function handleInviteScroll(e: React.UIEvent<HTMLDivElement>, surveyId: number, type: 'active' | 'inactive', total: number) {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setInviteScroll(prev => ({
        ...prev,
        [surveyId]: {
          ...prev[surveyId],
          [type]: Math.min((prev[surveyId]?.[type] || 1) + 1, Math.ceil(total / INVITES_PAGE_SIZE))
        }
      }));
    }
  }

  // Filter responses by search and date
  function getFilteredResponses(survey: any) {
    let responses = Array.isArray(survey.responses) ? survey.responses : [];
    const search = responseSearch[survey.id]?.toLowerCase() || '';
    const dateRange = responseDateRange[survey.id] || { from: '', to: '' };
    if (search) {
      responses = responses.filter((resp: any) =>
        resp.responder_name.toLowerCase().includes(search) ||
        resp.responder_department.toLowerCase().includes(search)
      );
    }
    if (dateRange.from) {
      responses = responses.filter((resp: any) => new Date(resp.submitted_at) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      responses = responses.filter((resp: any) => new Date(resp.submitted_at) <= new Date(dateRange.to));
    }
    return responses;
  }

  // Export filtered responses to CSV
  function exportFilteredResponsesToCSV(survey: any) {
    const responses = getFilteredResponses(survey);
    if (!responses.length) return;
    
    // Prepare CSV header with both English and Arabic labels
    const questionLabels = survey.questions.map((q: any) => `${q.label_en} | ${q.label_ar}`);
    const header = ['# | رقم', 'Responder Name | اسم المستجيب', 'Department | القسم', 'Submitted At | تاريخ التقديم', ...questionLabels];
    
    const rows = responses.map((resp: any, index: number) => {
      const answersMap: Record<string, string> = {};
      resp.answers.forEach((ans: any) => {
        const q = survey.questions.find((q: any) => q.id === ans.question_id);
        if (q) answersMap[q.label_en] = ans.answer;
      });
      return [
        index + 1, // Index starting from 1
        resp.responder_name,
        resp.responder_department,
        new Date(resp.submitted_at).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        ...survey.questions.map((q: any) => answersMap[q.label_en] || '')
      ];
    });
    
    // Convert to CSV string
    const csv = [header, ...rows].map((row: any[]) => 
      row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Add BOM for proper Arabic support
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csv;
    
    // Download file with proper encoding
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
    const fileName = `${survey.title_en || 'survey'}-${survey.title_ar || 'استطلاع'}-responses.csv`;
    saveAs(blob, fileName);
  }

  // Theme card styles for survey admin, matching dashboard
  const themeCardStyles = {
    default: {
      card: 'bg-[#0a1826] border border-slate-600',
      title: 'text-green-400',
      subtitle: 'text-slate-400',
      icon: 'text-blue-400',
    },
    light: {
      card: 'bg-white border border-slate-200',
      title: 'text-blue-700',
      subtitle: 'text-slate-400',
      icon: 'text-blue-400',
    },
    midnight: {
      card: 'bg-slate-900 border border-slate-700',
      title: 'text-white',
      subtitle: 'text-slate-400',
      icon: 'text-blue-300',
    },
    novel: {
      card: 'bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-300',
      title: 'text-slate-900',
      subtitle: 'text-slate-500',
      icon: 'text-blue-700',
    },
    cyber: {
      card: 'bg-gradient-to-br from-[#0f172a] to-[#0a1826] border border-green-500/30 shadow-[0_0_24px_#39ff14cc]',
      title: 'text-green-400',
      subtitle: 'text-slate-400',
      icon: 'text-cyan-300',
    },
  };
  const styles = themeCardStyles[theme] || themeCardStyles.default;

  // Fetch surveys from API
  useEffect(() => {
    async function fetchSurveys() {
      setLoading(true);
      const res = await fetch('/api/surveys');
      const data = await res.json();
      setSurveys(data.surveys || []);
      setLoading(false);
    }
    fetchSurveys();
  }, []);

  // Stats
  const stats = [
    { label: 'Total Surveys', value: surveys.length, icon: <ChartBarIcon className="w-6 h-6 text-green-400" /> },
    { label: 'Total Invites', value: surveys.reduce((sum, s) => sum + (s.invites?.length || 0), 0), icon: <LinkIcon className="w-6 h-6 text-blue-400" /> },
    { label: 'Active Invites', value: surveys.reduce((sum, s) => sum + (s.invites?.filter((i: any) => !i.used && new Date(i.expires_at) > new Date()).length || 0), 0), icon: <CheckCircleIcon className="w-6 h-6 text-green-500" /> },
    { label: 'Expired Invites', value: surveys.reduce((sum, s) => sum + (s.invites?.filter((i: any) => new Date(i.expires_at) < new Date()).length || 0), 0), icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-400" /> }
  ];

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => s.title_en.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [surveys, searchTerm]);

  // Add new survey
  async function handleAddSurvey() {
    setError('');
    if (!form.title_en || !form.title_ar || form.questions.some(q => !q.label_en || !q.label_ar)) {
      setError('Please fill all fields.');
      return;
    }
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
      setShowAdd(false);
      setForm({ 
        title_en: '', 
        title_ar: '', 
        questions: [{ 
          label_en: '', 
          label_ar: '', 
          type: 'text', 
          required: false,
          rating_scale: '',
          rating_options: [] as any
        }] 
      });
      setSurveys([{ ...data.survey, invites: [], responses: [] }, ...surveys]);
    } else {
      setError(data.error || 'Error');
    }
  }

  async function handleDeleteSurvey(id: number) {
    const survey = surveys.find(s => s.id === id);
    setDeleteTarget({ 
      type: 'survey', 
      id, 
      title: survey?.title_en || survey?.title_ar || 'this survey' 
    });
    setShowDeleteConfirm(true);
  }

  async function handleDeleteResponse(surveyId: number, responseId: number) {
    setDeleteTarget({ 
      type: 'response', 
      id: responseId, 
      surveyId,
      title: 'this response'
    });
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    
    try {
      if (deleteTarget.type === 'survey') {
        await fetch('/api/surveys', { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ id: deleteTarget.id }) 
        });
        setSurveys(surveys => surveys.filter(s => s.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'response') {
        await fetch('/api/surveys', { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ id: deleteTarget.surveyId, responseId: deleteTarget.id }) 
        });
        setSurveys(surveys => surveys.map(s => s.id === deleteTarget.surveyId ? {
          ...s,
          responses: s.responses.filter((r: any) => r.id !== deleteTarget.id)
        } : s));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
    
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  }

  // Open invite modal
  function openInvite(survey: any) {
    setSelectedSurvey(survey);
    setShowInvite(true);
    setNewInvite(null);
  }

  // Create invite
  async function handleCreateInvite() {
    setInviteLoading(true);
    setNewInvite(null);
    const res = await fetch('/api/surveys/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ survey_id: selectedSurvey.id, invited_by: 1 })
    });
    const data = await res.json();
    if (data.success) {
      setNewInvite(data.invite.token);
      setSurveys(surveys.map(s => s.id === selectedSurvey.id ? { ...s, invites: Array.isArray(s.invites) ? [...s.invites, data.invite] : [data.invite] } : s));
    } else {
      setError(data.error || 'Error generating invite.');
    }
    setInviteLoading(false);
  }

  // Delete invite
  async function handleDeleteInvite(surveyId: number, inviteId: number) {
    await fetch('/api/surveys/invite', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inviteId })
    });
    setSurveys(surveys.map(s => s.id === surveyId ? { ...s, invites: Array.isArray(s.invites) ? s.invites.filter((i: any) => i.id !== inviteId) : [] } : s));
  }

  // Export responses to CSV
  function exportResponsesToCSV(survey: any) {
    if (!Array.isArray(survey.responses) || survey.responses.length === 0) return;
    
    // Prepare CSV header with both English and Arabic labels
    const questionLabels = survey.questions.map((q: any) => `${q.label_en} | ${q.label_ar}`);
    const header = ['# | رقم', 'Responder Name | اسم المستجيب', 'Department | القسم', 'Submitted At | تاريخ التقديم', ...questionLabels];
    
    // Prepare CSV rows
    const rows = survey.responses.map((resp: any, index: number) => {
      const answersMap: Record<string, string> = {};
      resp.answers.forEach((ans: any) => {
        const q = survey.questions.find((q: any) => q.id === ans.question_id);
        if (q) answersMap[q.label_en] = ans.answer;
      });
      return [
        index + 1, // Index starting from 1
        resp.responder_name,
        resp.responder_department,
        new Date(resp.submitted_at).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        ...survey.questions.map((q: any) => answersMap[q.label_en] || '')
      ];
    });
    
    // Convert to CSV string
    const csv = [header, ...rows].map((row: any[]) => 
      row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Add BOM for proper Arabic support
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csv;
    
    // Download file with proper encoding
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
    const fileName = `${survey.title_en || 'survey'}-${survey.title_ar || 'استطلاع'}-responses.csv`;
    saveAs(blob, fileName);
  }

  // Copy invite link to clipboard
  function handleCopyInviteLink(token: string) {
    const link = `${window.location.origin}/surveys/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedInvite(token);
    setTimeout(() => setCopiedInvite(null), 2000);
  }

  function handleOpenInviteLink(token: string) {
    const link = `${window.location.origin}/surveys/${token}`;
    window.open(link, '_blank');
  }

  async function handleGeneratePermanentLink(surveyId: number) {
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: surveyId })
      });
      const data = await res.json();
      if (data.success) {
        // Update the survey in state with permanent token
        setSurveys(surveys => surveys.map(s => s.id === surveyId ? {
          ...s,
          permanent_token: data.permanent_token
        } : s));
        // Copy the permanent link to clipboard
        navigator.clipboard.writeText(data.permanent_link);
        setCopiedInvite('permanent');
        setTimeout(() => setCopiedInvite(null), 2000);
      }
    } catch (e) {
      console.error('Failed to generate permanent link:', e);
    }
  }

  async function handleRemovePermanentLink(surveyId: number) {
    try {
      const res = await fetch('/api/surveys/permanent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: surveyId })
      });
      const data = await res.json();
      if (data.success) {
        // Update the survey in state to remove permanent token
        setSurveys(surveys => surveys.map(s => s.id === surveyId ? {
          ...s,
          permanent_token: null
        } : s));
      }
    } catch (e) {
      console.error('Failed to remove permanent link:', e);
    }
  }

  // Add question
  function addQuestion() {
    setForm(prev => ({
      ...prev,
              questions: [...prev.questions, {
          label_en: '',
          label_ar: '',
          type: 'text',
          required: false,
          rating_scale: '',
          rating_options: [] as any
        }]
    }));
  }

  // Remove question
  function removeQuestion(index: number) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  }

  // Update question
  function updateQuestion(index: number, field: string, value: any) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  }

  // Helper to format date for RTL
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    if (lang === 'ar') {
      options.month = 'numeric';
      options.day = 'numeric';
      options.hour = 'numeric';
      options.minute = 'numeric';
      options.hour12 = true;
    }
    return date.toLocaleDateString(lang, options);
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">Survey Management</h1>
          <p className="page-subtitle subtitle-animate">Create, manage, and invite users to surveys.</p>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-col gap-6 mb-6 content-animate">
          <div className="card p-6">
            <h2 className="heading-2 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Survey Statistics</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3 bg-slate-800 rounded-lg stat-card">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-green-400 mb-1">{stat.value}</div>
                  <div className="text-slate-300 text-xs mb-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Add Survey */}
          <div className="card p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-green-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-4 pr-4 py-3 flex-1"
              />
            </div>
            <button className="btn-primary flex items-center gap-1 px-4 py-2 rounded-lg font-semibold" onClick={() => setShowAdd(true)}>
              <PlusIcon className="w-5 h-5" /> Add Survey
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 content-animate">
          <p className="text-slate-300">Found {filteredSurveys.length} surveys</p>
        </div>

        {/* Survey Cards and Responses Side by Side - Dashboard Style */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-lg">Loading surveys...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 content-animate">
            {filteredSurveys.map((survey, idx) => {
              // Split invites for this survey
              const allInvites = Array.isArray(survey.invites) ? survey.invites : [];
              const activeInvites = allInvites.filter((invite: any) => !invite.used && new Date(invite.expires_at) > new Date());
              const inactiveInvites = allInvites.filter((invite: any) => invite.used || new Date(invite.expires_at) <= new Date());
              // Infinite scroll for responses
              const page = responsesPage[survey.id] || 1;
              function handleResponsesScroll(e: React.UIEvent<HTMLDivElement>) {
                const el = e.currentTarget;
                const filtered = getFilteredResponses(survey);
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
                  setResponsesPage(prev => ({
                    ...prev,
                    [survey.id]: Math.min((prev[survey.id] || 1) + 1, Math.ceil(filtered.length / RESPONSES_PAGE_SIZE))
                  }));
                }
              }
              const filteredResponses = getFilteredResponses(survey);
              const paginatedResponses = filteredResponses.slice(0, page * RESPONSES_PAGE_SIZE);
              return (
                <React.Fragment key={survey.id}>
                  {/* Survey Card - Dashboard Style */}
                  <div className={`card-hover p-8 rounded-xl flex flex-col gap-4 ${styles.card}`} style={{ animationDelay: `${0.1 * (idx + 1)}s` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <ChartBarIcon className={`w-7 h-7 ${styles.icon}`} />
                      <h2 className={`text-xl font-bold ${styles.title}`}>{survey.title_en}</h2>
                    </div>
                    <div className={`text-sm mb-2 ${styles.subtitle} flex flex-wrap items-center gap-4`}>
                      {t('survey.questions_count') + ': ' + (survey.questions?.length || 0)}
                      <span className="text-xs text-green-600">
                        {t('survey.active_invites') + ': ' + activeInvites.length}
                      </span>
                      <span className="text-xs text-red-500">
                        {t('survey.inactive_invites') + ': ' + inactiveInvites.length}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button className="btn-primary flex items-center gap-1 px-3 py-1 text-xs" onClick={() => openInvite(survey)}>
                        <LinkIcon className="w-4 h-4" /> {t('survey.new_invite')}
                      </button>
                      <button className="btn-secondary flex items-center gap-1 px-3 py-1 text-xs" onClick={() => { setEditSurvey(survey); setEditForm({ title_en: survey.title_en, title_ar: survey.title_ar, questions: survey.questions.map((q: any) => ({ label_en: q.label_en, label_ar: q.label_ar, type: q.type, required: q.required, rating_scale: q.rating_scale || '', rating_options: q.rating_options || [] })) }); }}>
                        {t('survey.edit')}
                      </button>
                      <button className="btn-danger flex items-center gap-1 px-3 py-1 text-xs" onClick={() => handleDeleteSurvey(survey.id)}>
                        <TrashIcon className="w-4 h-4" /> {t('survey.delete')}
                      </button>
                    </div>
                    
                    {/* Permanent Link Section */}
                    <div className="mb-4">
                      <div className="font-semibold mb-2 text-purple-600">🔗 Permanent Link</div>
                      {survey.permanent_token ? (
                        <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-mono text-sm">
                          <span className="truncate max-w-[200px]">
                            {`${window.location.origin}/surveys/permanent/${survey.permanent_token}`}
                          </span>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => window.open(`/surveys/permanent/${survey.permanent_token}`, '_blank')}
                            title="Open permanent link"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/surveys/permanent/${survey.permanent_token}`);
                              setCopiedInvite('permanent');
                              setTimeout(() => setCopiedInvite(null), 2000);
                            }}
                            title="Copy permanent link"
                          >
                            {copiedInvite === 'permanent' ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemovePermanentLink(survey.id)}
                            title="Remove permanent link"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          {copiedInvite === 'permanent' && <span className="text-xs ml-1 text-green-700">Copied!</span>}
                        </div>
                      ) : (
                        <button
                          className="btn-primary flex items-center gap-1 px-3 py-1 text-xs"
                          onClick={() => handleGeneratePermanentLink(survey.id)}
                        >
                          <LinkIcon className="w-4 h-4" /> Generate Permanent Link
                        </button>
                      )}
                    </div>
                    {/* Invites Section - Dashboard Style */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="font-semibold mb-1 text-green-600">Active Invites</div>
                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-green-200 rounded-lg p-2 bg-green-50 dark:bg-green-900/20">
                          {getPaginatedInvites(activeInvites, 'active', survey.id).length === 0 && <span className="text-slate-400 text-sm">No active invites.</span>}
                          {getPaginatedInvites(activeInvites, 'active', survey.id).map((invite: any) => (
                            <div key={invite.id} className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              <span className="truncate max-w-[120px]">{invite.token}</span>
                              <span>Active</span>
                              <span className="text-xs text-slate-500">{new Date(invite.expires_at).toLocaleString()}</span>
                              <button className="ml-1 text-blue-600 hover:text-blue-900" onClick={() => handleOpenInviteLink(invite.token)} title="Open link">
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </button>
                              <button className="ml-1 text-green-600 hover:text-green-900" onClick={() => handleCopyInviteLink(invite.token)} title="Copy link">
                                {copiedInvite === invite.token ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                              </button>
                              <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteInvite(survey.id, invite.id)} title="Delete invite">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              {copiedInvite === invite.token && <span className="text-xs ml-1 text-green-700">Copied!</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold mb-1 text-slate-500">Inactive Invites</div>
                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 dark:bg-slate-800/40">
                          {getPaginatedInvites(inactiveInvites, 'inactive', survey.id).length === 0 && <span className="text-slate-400 text-sm">No inactive invites.</span>}
                          {getPaginatedInvites(inactiveInvites, 'inactive', survey.id).map((invite: any) => (
                            <div key={invite.id} className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono ${invite.used ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                              <span className="truncate max-w-[120px]">{invite.token}</span>
                              <span>{invite.used ? 'Used' : 'Expired'}</span>
                              <span className="text-xs text-slate-500">{invite.used ? new Date(invite.used_at).toLocaleString() : new Date(invite.expires_at).toLocaleString()}</span>
                              <button className="ml-1 text-blue-600 hover:text-blue-900" onClick={() => handleOpenInviteLink(invite.token)} title="Open link">
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </button>
                              <button className="ml-1 text-green-600 hover:text-green-900" onClick={() => handleCopyInviteLink(invite.token)} title="Copy link">
                                {copiedInvite === invite.token ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                              </button>
                              <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteInvite(survey.id, invite.id)} title="Delete invite">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                              {copiedInvite === invite.token && <span className="text-xs ml-1 text-green-700">Copied!</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Responses Card - Dashboard Style */}
                  <div className={`card-hover p-8 rounded-xl flex flex-col gap-4 border-2 border-blue-400/30 shadow-xl max-w-3xl mx-auto w-full ${styles.card}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <ClipboardIcon className={`w-7 h-7 ${styles.icon}`} />
                      <div className={`font-semibold text-lg ${styles.title}`}>{t('survey.responses_for')}: <span className="font-bold">{survey.title_en}</span></div>
                      <span className="text-xs text-slate-500">({filteredResponses.length} / {Array.isArray(survey.responses) ? survey.responses.length : 0})</span>
                    </div>
                    {/* Only render filter/search/export controls if paginatedResponses.length > 0 */}
                    {paginatedResponses.length > 0 ? (
                      <>
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                          <div className="flex flex-col">
                            <label className="font-semibold text-sm mb-1" htmlFor={`start-date-${survey.id}`}>
                              {t('survey.start_date')}
                            </label>
                            <DatePicker
                              id={`start-date-${survey.id}`}
                              selected={responseDateRange[survey.id]?.from ? new Date(responseDateRange[survey.id].from) : null}
                              onChange={date => setResponseDateRange({ ...responseDateRange, [survey.id]: { ...(responseDateRange[survey.id] || {}), from: date ? date.toISOString().slice(0, 10) : '' } })}
                              dateFormat="yyyy-MM-dd"
                              className="input-field pr-8"
                              placeholderText="yyyy-mm-dd"
                              calendarClassName={lang === 'ar' ? 'rtl' : ''}
                              popperPlacement={lang === 'ar' ? 'bottom-end' : 'bottom-start'}
                              isClearable
                              showPopperArrow={false}
                              wrapperClassName="w-full"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="font-semibold text-sm mb-1" htmlFor={`end-date-${survey.id}`}>
                              {t('survey.end_date')}
                            </label>
                            <DatePicker
                              id={`end-date-${survey.id}`}
                              selected={responseDateRange[survey.id]?.to ? new Date(responseDateRange[survey.id].to) : null}
                              onChange={date => setResponseDateRange({ ...responseDateRange, [survey.id]: { ...(responseDateRange[survey.id] || {}), to: date ? date.toISOString().slice(0, 10) : '' } })}
                              dateFormat="yyyy-MM-dd"
                              className="input-field pr-8"
                              placeholderText="yyyy-mm-dd"
                              calendarClassName={lang === 'ar' ? 'rtl' : ''}
                              popperPlacement={lang === 'ar' ? 'bottom-end' : 'bottom-start'}
                              isClearable
                              showPopperArrow={false}
                              wrapperClassName="w-full"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">{t('survey.date_filter_hint')}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <input
                            type="text"
                            className="input-field text-xs px-2 py-1 w-40"
                            placeholder="Search name or department..."
                            value={responseSearch[survey.id] || ''}
                            onChange={e => setResponseSearch({ ...responseSearch, [survey.id]: e.target.value })}
                          />
                          <button
                            className="ml-2 px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => exportFilteredResponsesToCSV(survey)}
                            title="Export filtered responses to CSV"
                          >
                            Export CSV
                          </button>
                        </div>
                        <div className={`flex flex-col gap-4 max-h-80 overflow-y-auto ${lang === 'ar' ? 'pl-2' : 'pr-2'}`} onScroll={handleResponsesScroll}>
                          {paginatedResponses.length > 0 ? (
                            paginatedResponses.map((resp: any) => (
                              <div key={resp.id} className="bg-slate-900/60 border border-white/20 rounded-lg shadow p-4 mb-4">
                                <div className="flex flex-wrap justify-between items-center mb-2 text-xs text-slate-400">
                                  <span className="font-bold text-slate-200">{resp.responder_name}</span>
                                  <span>{resp.responder_department}</span>
                                  <span>{formatDate(resp.submitted_at)}</span>
                                  <button
                                    onClick={() => handleDeleteResponse(survey.id, resp.id)}
                                    className="text-red-400 hover:text-red-200 transition-colors"
                                    title="Delete Response"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {resp.answers?.map((ans: any) => (
                                    <div key={ans.question_id} className="flex flex-col md:flex-row md:items-center gap-1 border-b border-slate-700/40 pb-1 last:border-b-0">
                                      <span className="font-semibold text-white">{ans.question_label || 'Question'}:</span>
                                      <span className="text-white/90">
                                        {ans.processed_answer || ans.answer || 'No answer'}
                                        {ans.processed_answer && ans.processed_answer.includes(',') && (
                                          <span className="text-xs text-slate-400 ml-1">(Comments)</span>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                  {/* Show questions that don't have answers */}
                                  {survey.questions?.filter((q: any) => !resp.answers?.some((a: any) => a.question_id === q.id)).map((q: any) => (
                                    <div key={q.id} className="flex flex-col md:flex-row md:items-center gap-1 border-b border-slate-700/40 pb-1 last:border-b-0">
                                      <span className="font-semibold text-white">{q.label_en || 'Question'}:</span>
                                      <span className="text-white/90 text-slate-400 italic">No answer</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2"><path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-2-7h4m-2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              <span className="text-lg font-medium">{t('survey.no_responses')}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2"><path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-2-7h4m-2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="text-lg font-medium">{t('survey.no_responses')}</span>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Add Survey Modal */}
        <Dialog open={showAdd} onClose={() => setShowAdd(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold mb-4 text-blue-900 dark:text-white">
                {lang === 'ar' ? 'إضافة استطلاع جديد' : 'Add New Survey'}
              </Dialog.Title>
              <div className="space-y-4">
                {/* Survey Title - English */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'عنوان الاستطلاع (إنجليزي)' : 'Survey Title (English)'}
                  </label>
                  <input
                    className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                    value={form.title_en}
                    onChange={e => setForm({ ...form, title_en: e.target.value })}
                  />
                </div>
                
                {/* Survey Title - Arabic */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'عنوان الاستطلاع (عربي)' : 'Survey Title (Arabic)'}
                  </label>
                  <input
                    className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
                    value={form.title_ar}
                    onChange={e => setForm({ ...form, title_ar: e.target.value })}
                  />
                </div>

                {/* Questions Section */}
                <div>
                  <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'الأسئلة' : 'Questions'}
                  </div>
                  {form.questions.map((question, idx) => (
                    <div key={idx} className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Question Text - English */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'السؤال (إنجليزي)' : 'Question (English)'}
                          </label>
                          <input
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالإنجليزية' : 'Enter question in English'}
                            value={question.label_en}
                            onChange={e => updateQuestion(idx, 'label_en', e.target.value)}
                          />
                        </div>
                        
                        {/* Question Text - Arabic */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'}
                          </label>
                          <input
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالعربية' : 'Enter question in Arabic'}
                            value={question.label_ar}
                            onChange={e => updateQuestion(idx, 'label_ar', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Question Type Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'نوع السؤال' : 'Question Type'}
                          </label>
                          <select
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
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
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                              {lang === 'ar' ? 'مقياس التقييم' : 'Rating Scale'}
                            </label>
                            <select
                              className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                              value={question.rating_scale}
                              onChange={e => {
                                const scale = getRatingScaleById(e.target.value);
                                updateQuestion(idx, 'rating_scale', e.target.value);
                                updateQuestion(idx, 'rating_options', scale?.options || []);
                              }}
                            >
                              <option value="">{lang === 'ar' ? 'اختر المقياس' : 'Select Scale'}</option>
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
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`required-${idx}`} className="ml-2 text-sm text-slate-700 dark:text-slate-200">
                          {lang === 'ar' ? 'سؤال مطلوب' : 'Required Question'}
                        </label>
                      </div>

                      {/* Remove Question Button */}
                      <button
                        type="button"
                        className="btn-danger px-3 py-1 rounded-lg text-xs"
                        onClick={() => removeQuestion(idx)}
                        disabled={form.questions.length === 1}
                      >
                        {lang === 'ar' ? 'حذف السؤال' : 'Remove Question'}
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Question Button */}
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                    onClick={addQuestion}
                  >
                    + {lang === 'ar' ? 'إضافة سؤال' : 'Add Question'}
                  </button>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 rounded-lg"
                    onClick={() => setShowAdd(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 rounded-lg"
                    onClick={handleAddSurvey}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        {/* Invite Modal */}
        <Dialog open={showInvite} onClose={() => setShowInvite(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-10">
              <Dialog.Title className="text-xl font-bold mb-4 text-blue-900 dark:text-white">{t('survey.new_invite')}</Dialog.Title>
              <div className="space-y-4">
                <div className="text-slate-700 dark:text-slate-200 text-sm mb-2">{t('survey.invite_hint')}</div>
                {newInvite && (
                  <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-mono text-center">
                    <a
                      href={`/surveys/${newInvite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-green-900"
                    >
                      {window?.location?.origin ? `${window.location.origin}/surveys/${newInvite}` : `/surveys/${newInvite}`}
                    </a>
                    <button
                      className="ml-1 text-blue-600 hover:text-blue-900"
                      onClick={() => handleOpenInviteLink(newInvite)}
                      title="Open link"
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="ml-1 text-green-600 hover:text-green-900"
                      onClick={() => handleCopyInviteLink(newInvite)}
                      title="Copy link"
                    >
                      {copiedInvite === newInvite ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                    </button>
                    {copiedInvite === newInvite && <span className="text-xs ml-1 text-green-700">Copied!</span>}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 rounded-lg"
                    onClick={() => setShowInvite(false)}
                  >
                    {t('survey.close')}
                  </button>
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 rounded-lg"
                    onClick={handleCreateInvite}
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? t('survey.generating') : t('survey.generate_invite')}
                  </button>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>
            </div>
          </div>
        </Dialog>

        {/* Edit Survey Modal */}
        <Dialog open={!!editSurvey} onClose={() => setEditSurvey(null)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold mb-4 text-blue-900 dark:text-white">
                {lang === 'ar' ? 'تعديل الاستطلاع' : 'Edit Survey'}
              </Dialog.Title>
              <div className="space-y-4">
                {/* Survey Title - English */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'عنوان الاستطلاع (إنجليزي)' : 'Survey Title (English)'}
                  </label>
                  <input
                    className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                    value={editForm.title_en}
                    onChange={e => setEditForm({ ...editForm, title_en: e.target.value })}
                  />
                </div>
                
                {/* Survey Title - Arabic */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'عنوان الاستطلاع (عربي)' : 'Survey Title (Arabic)'}
                  </label>
                  <input
                    className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                    placeholder={lang === 'ar' ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
                    value={editForm.title_ar}
                    onChange={e => setEditForm({ ...editForm, title_ar: e.target.value })}
                  />
                </div>

                {/* Questions Section */}
                <div>
                  <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'الأسئلة' : 'Questions'}
                  </div>
                  {editForm.questions.map((question, idx) => (
                    <div key={idx} className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Question Text - English */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'السؤال (إنجليزي)' : 'Question (English)'}
                          </label>
                          <input
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالإنجليزية' : 'Enter question in English'}
                            value={question.label_en}
                            onChange={e => setEditForm(prev => ({ ...prev, questions: prev.questions.map((q, i) => i === idx ? { ...q, label_en: e.target.value } : q) }))}
                          />
                        </div>
                        
                        {/* Question Text - Arabic */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'}
                          </label>
                          <input
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                            placeholder={lang === 'ar' ? 'أدخل السؤال بالعربية' : 'Enter question in Arabic'}
                            value={question.label_ar}
                            onChange={e => setEditForm(prev => ({ ...prev, questions: prev.questions.map((q, i) => i === idx ? { ...q, label_ar: e.target.value } : q) }))}
                          />
                        </div>
                      </div>

                      {/* Question Type Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                            {lang === 'ar' ? 'نوع السؤال' : 'Question Type'}
                          </label>
                          <select
                            className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                            value={question.type}
                            onChange={e => {
                              const scale = getRatingScaleById(e.target.value);
                              setEditForm(prev => ({ 
                                ...prev, 
                                questions: prev.questions.map((q, i) => i === idx ? { 
                                  ...q, 
                                  type: e.target.value,
                                  rating_scale: e.target.value === 'rating' ? (q.rating_scale || '') : '',
                                  rating_options: e.target.value === 'rating' ? (scale?.options || []) : []
                                } : q) 
                              }));
                            }}
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
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                              {lang === 'ar' ? 'مقياس التقييم' : 'Rating Scale'}
                            </label>
                            <select
                              className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                              value={question.rating_scale}
                              onChange={e => {
                                const scale = getRatingScaleById(e.target.value);
                                setEditForm(prev => ({ 
                                  ...prev, 
                                  questions: prev.questions.map((q, i) => i === idx ? { 
                                    ...q, 
                                    rating_scale: e.target.value,
                                    rating_options: scale?.options || []
                                  } : q) 
                                }));
                              }}
                            >
                              <option value="">{lang === 'ar' ? 'اختر المقياس' : 'Select Scale'}</option>
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
                          onChange={e => setEditForm(prev => ({ ...prev, questions: prev.questions.map((q, i) => i === idx ? { ...q, required: e.target.checked } : q) }))}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`edit-required-${idx}`} className="ml-2 text-sm text-slate-700 dark:text-slate-200">
                          {lang === 'ar' ? 'سؤال مطلوب' : 'Required Question'}
                        </label>
                      </div>

                      {/* Remove Question Button */}
                      <button
                        type="button"
                        className="btn-danger px-3 py-1 rounded-lg text-xs"
                        onClick={() => setEditForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }))}
                        disabled={editForm.questions.length === 1}
                      >
                        {lang === 'ar' ? 'حذف السؤال' : 'Remove Question'}
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Question Button */}
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                    onClick={() => setEditForm(prev => ({ 
                      ...prev, 
                      questions: [...prev.questions, { 
                        label_en: '', 
                        label_ar: '', 
                        type: 'text', 
                        required: false, 
                        rating_scale: '', 
                        rating_options: [] 
                      }] 
                    }))}
                  >
                    + {lang === 'ar' ? 'إضافة سؤال' : 'Add Question'}
                  </button>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 rounded-lg"
                    onClick={() => setEditSurvey(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 rounded-lg"
                    onClick={async () => {
                      if (!editSurvey) return;
                      await fetch('/api/surveys', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id: editSurvey.id,
                          title_en: editForm.title_en,
                          title_ar: editForm.title_ar,
                          questions: editForm.questions.map(q => ({
                            label_en: q.label_en,
                            label_ar: q.label_ar,
                            type: q.type,
                            required: q.required,
                            rating_scale: q.rating_scale || null,
                            rating_options: q.rating_options || []
                          }))
                        })
                      });
                      setSurveys(surveys => surveys.map(s => s.id === editSurvey.id ? {
                        ...s,
                        title_en: editForm.title_en,
                        title_ar: editForm.title_ar,
                        questions: editForm.questions.map((q: any, i: number) => ({
                          ...s.questions[i],
                          label_en: q.label_en,
                          label_ar: q.label_ar,
                          type: q.type,
                          required: q.required,
                          rating_scale: q.rating_scale || null,
                          rating_options: q.rating_options || []
                        }))
                      } : s));
                      setEditSurvey(null);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog 
          open={showDeleteConfirm} 
          onClose={() => setShowDeleteConfirm(false)} 
          className="fixed z-50 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              aria-hidden="true" 
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8 z-10 border border-red-200 dark:border-red-800">
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <Dialog.Title className="text-2xl font-bold mb-4 text-center text-red-900 dark:text-red-100">
                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
              </Dialog.Title>
              
              <div className="space-y-6">
                <p className="text-slate-700 dark:text-slate-200 text-center leading-relaxed whitespace-pre-line">
                  {deleteTarget?.type === 'survey' ? (
                    lang === 'ar' 
                      ? `هل أنت متأكد من حذف الاستطلاع "${deleteTarget.title}"؟\n\nهذا الإجراء سيحذف الاستطلاع وجميع الردود المرتبطة به نهائياً.`
                      : `Are you sure you want to delete the survey "${deleteTarget.title}"?\n\nThis action will permanently delete the survey and all associated responses.`
                  ) : (
                    lang === 'ar'
                      ? 'هل أنت متأكد من حذف هذا الرد؟\n\nهذا الإجراء لا يمكن التراجع عنه.'
                      : 'Are you sure you want to delete this response?\n\nThis action cannot be undone.'
                  )}
                </p>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                    onClick={confirmDelete}
                  >
                    {lang === 'ar' ? 'حذف نهائي' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Help Section */}
        <div className="mt-12 content-animate">
          <div className="card border-green-500/30 p-8">
            <div className="flex items-start space-x-4">
              <ChartBarIcon className="w-7 h-7 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Need help managing surveys?</h3>
                <p className="text-slate-300 leading-relaxed text-base mb-4">
                  Contact the cybersecurity team for assistance with surveys, invites, or any related issues.
                </p>
                <button className="btn-primary">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 