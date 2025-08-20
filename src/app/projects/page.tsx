'use client';

import Navigation from '@/components/Navigation';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  InformationCircleIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useLang } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { useState, useMemo } from 'react';
import { useTheme } from '../ClientLayout';

// Types
interface TeamMember {
  en: string;
  ar: string;
}

interface Attachment {
  name: { en: string; ar: string };
  type: string;
  size: string;
}

interface Project {
  id: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  status: string;
  priority: string;
  progress: number;
  manager: { en: string; ar: string };
  team: TeamMember[];
  start: string;
  end: string;
  budget: number;
  spent: number;
  attachments: Attachment[];
  objectives: TeamMember[];
  risks: TeamMember[];
}

const projectsData = [
  {
    id: 1,
    name: {
      en: 'SOC Modernization',
      ar: 'تحديث مركز العمليات الأمنية'
    },
    description: {
      en: 'Upgrading the Security Operations Center with advanced monitoring and automation tools.',
      ar: 'تطوير مركز العمليات الأمنية بأدوات مراقبة وأتمتة متقدمة.'
    },
    status: 'active',
    priority: 'high',
    progress: 75,
    manager: { en: 'Ahmed Al-Salem', ar: 'أحمد السالم' },
    team: [
      { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' },
      { en: 'Mohammed Al-Harbi', ar: 'محمد الحربي' },
      { en: 'Fatimah Al-Dosari', ar: 'فاطمة الدوسري' }
    ],
    start: '2024-03-01',
    end: '2024-09-30',
    budget: 500000,
    spent: 375000,
    attachments: [
      { name: { en: 'Project Charter', ar: 'ميثاق المشروع' }, type: 'pdf', size: '2.3 MB' },
      { name: { en: 'Technical Specifications', ar: 'المواصفات التقنية' }, type: 'docx', size: '1.8 MB' },
      { name: { en: 'Budget Breakdown', ar: 'تفصيل الميزانية' }, type: 'xlsx', size: '950 KB' },
      { name: { en: 'Timeline Gantt', ar: 'جدول زمني' }, type: 'pdf', size: '3.1 MB' }
    ],
    objectives: [
      { en: 'Implement advanced SIEM system', ar: 'تطبيق نظام SIEM متقدم' },
      { en: 'Automate threat detection', ar: 'أتمتة اكتشاف التهديدات' },
      { en: 'Improve incident response time', ar: 'تحسين وقت الاستجابة للحوادث' },
      { en: 'Enhance security monitoring', ar: 'تحسين المراقبة الأمنية' }
    ],
    risks: [
      { en: 'Integration complexity', ar: 'تعقيد التكامل' },
      { en: 'Data migration challenges', ar: 'تحديات نقل البيانات' },
      { en: 'Staff training requirements', ar: 'متطلبات تدريب الموظفين' }
    ]
  },
  {
    id: 2,
    name: {
      en: 'Zero Trust Implementation',
      ar: 'تطبيق نموذج الثقة المعدومة'
    },
    description: {
      en: 'Implementing Zero Trust security model across all company systems Implementing Zero Trust security model across all company systems.Implementing Zero Trust security model across all company systems.Implementing Zero Trust security model across all company systems.Implementing Zero Trust security model across all company systems. Implementing Zero Trust security model across all company systems.',
      ar: 'تطبيق نموذج الثقة المعدومة على جميع أنظمة الشركة.'
    },
    status: 'planning',
    priority: 'high',
    progress: 15,
    manager: { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' },
    team: [
      { en: 'Ahmed Al-Salem', ar: 'أحمد السالم' },
      { en: 'Mohammed Al-Harbi', ar: 'محمد الحربي' }
    ],
    start: '2024-07-01',
    end: '2025-01-31',
    budget: 800000,
    spent: 120000,
    attachments: [
      { name: { en: 'Zero Trust Architecture', ar: 'هندسة الثقة المعدومة' }, type: 'pdf', size: '4.2 MB' },
      { name: { en: 'Implementation Plan', ar: 'خطة التنفيذ' }, type: 'docx', size: '2.1 MB' },
      { name: { en: 'Security Assessment', ar: 'التقييم الأمني' }, type: 'pdf', size: '1.5 MB' }
    ],
    objectives: [
      { en: 'Implement identity verification', ar: 'تطبيق التحقق من الهوية' },
      { en: 'Establish micro-segmentation', ar: 'إنشاء التجزئة الدقيقة' },
      { en: 'Deploy continuous monitoring', ar: 'نشر المراقبة المستمرة' },
      { en: 'Enhance access controls', ar: 'تحسين ضوابط الوصول' }
    ],
    risks: [
      { en: 'User adoption resistance', ar: 'مقاومة تبني المستخدمين' },
      { en: 'Legacy system compatibility', ar: 'توافق الأنظمة القديمة' },
      { en: 'Performance impact', ar: 'تأثير الأداء' }
    ]
  },
  {
    id: 3,
    name: {
      en: 'Employee Awareness Program',
      ar: 'برنامج توعية الموظفين'
    },
    description: {
      en: 'A company-wide training program to raise cybersecurity awareness.',
      ar: 'برنامج تدريبي شامل لرفع الوعي بالأمن السيبراني لدى الموظفين.'
    },
    status: 'completed',
    priority: 'medium',
    progress: 100,
    manager: { en: 'Mohammed Al-Harbi', ar: 'محمد الحربي' },
    team: [
      { en: 'Fatimah Al-Dosari', ar: 'فاطمة الدوسري' },
      { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' }
    ],
    start: '2023-10-01',
    end: '2024-02-28',
    budget: 250000,
    spent: 250000,
    attachments: [
      { name: { en: 'Training Curriculum', ar: 'المنهج التدريبي' }, type: 'pdf', size: '1.2 MB' },
      { name: { en: 'Assessment Results', ar: 'نتائج التقييم' }, type: 'xlsx', size: '850 KB' },
      { name: { en: 'Feedback Report', ar: 'تقرير التغذية الراجعة' }, type: 'docx', size: '650 KB' }
    ],
    objectives: [
      { en: 'Increase security awareness', ar: 'زيادة الوعي الأمني' },
      { en: 'Reduce phishing incidents', ar: 'تقليل حوادث التصيد' },
      { en: 'Improve password practices', ar: 'تحسين ممارسات كلمات المرور' },
      { en: 'Enhance incident reporting', ar: 'تحسين الإبلاغ عن الحوادث' }
    ],
    risks: [
      { en: 'Low engagement rates', ar: 'معدلات مشاركة منخفضة' },
      { en: 'Time constraints', ar: 'قيود الوقت' },
      { en: 'Content retention', ar: 'احتفاظ المحتوى' }
    ]
  },
  {
    id: 4,
    name: {
      en: 'Threat Intelligence Platform',
      ar: 'منصة استخبارات التهديدات'
    },
    description: {
      en: 'Deploying advanced threat intelligence platform for proactive security.',
      ar: 'نشر منصة استخبارات تهديدات متقدمة للأمان الاستباقي.'
    },
    status: 'active',
    priority: 'medium',
    progress: 45,
    manager: { en: 'Fatimah Al-Dosari', ar: 'فاطمة الدوسري' },
    team: [
      { en: 'Ahmed Al-Salem', ar: 'أحمد السالم' },
      { en: 'Sara Al-Qahtani', ar: 'سارة القحطاني' }
    ],
    start: '2024-04-15',
    end: '2024-12-31',
    budget: 600000,
    spent: 270000,
    attachments: [
      { name: { en: 'Platform Requirements', ar: 'متطلبات المنصة' }, type: 'pdf', size: '2.8 MB' },
      { name: { en: 'Vendor Comparison', ar: 'مقارنة الموردين' }, type: 'xlsx', size: '1.4 MB' },
      { name: { en: 'Integration Guide', ar: 'دليل التكامل' }, type: 'docx', size: '1.9 MB' },
      { name: { en: 'API Documentation', ar: 'وثائق API' }, type: 'pdf', size: '3.5 MB' }
    ],
    objectives: [
      { en: 'Deploy threat intelligence platform', ar: 'نشر منصة استخبارات التهديدات' },
      { en: 'Integrate with existing systems', ar: 'التكامل مع الأنظمة الموجودة' },
      { en: 'Establish automated alerts', ar: 'إنشاء تنبيهات آلية' },
      { en: 'Improve threat detection', ar: 'تحسين اكتشاف التهديدات' }
    ],
    risks: [
      { en: 'Data integration complexity', ar: 'تعقيد تكامل البيانات' },
      { en: 'Vendor lock-in', ar: 'الاعتماد على مورد واحد' },
      { en: 'False positive alerts', ar: 'تنبيهات إيجابية خاطئة' }
    ]
  }
];

const statusConfig = {
  active: { color: 'bg-green-600', icon: ChartBarIcon, text: { en: 'Active', ar: 'نشط' } },
  planning: { color: 'bg-yellow-600', icon: ClockIcon, text: { en: 'Planning', ar: 'قيد التخطيط' } },
  completed: { color: 'bg-slate-600', icon: ShieldCheckIcon, text: { en: 'Completed', ar: 'مكتمل' } }
};

const priorityConfig = {
  high: { color: 'bg-red-600', text: { en: 'High', ar: 'عالي' } },
  medium: { color: 'bg-yellow-600', text: { en: 'Medium', ar: 'متوسط' } },
  low: { color: 'bg-green-600', text: { en: 'Low', ar: 'منخفض' } }
};

export default function ProjectsPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const { theme } = useTheme();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // عدد أقل للعرض السريع
  
  // Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showFullTextModal, setShowFullTextModal] = useState(false);
  const [fullTextData, setFullTextData] = useState<{title: string, text: string} | null>(null);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Optimized filtering with debouncing
  const filteredProjects = useMemo(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    
    return projectsData.filter(project => {
      // Search filter with early return for better performance
      if (searchTerm !== '') {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = project.name[lang].toLowerCase().includes(searchLower);
        const descMatch = project.description[lang].toLowerCase().includes(searchLower);
        const managerMatch = project.manager[lang].toLowerCase().includes(searchLower);
        
        if (!nameMatch && !descMatch && !managerMatch) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && project.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && project.priority !== priorityFilter) {
        return false;
      }

      // Progress filter
      if (progressFilter !== 'all') {
        if (progressFilter === 'low' && project.progress >= 30) return false;
        if (progressFilter === 'medium' && (project.progress < 30 || project.progress >= 70)) return false;
        if (progressFilter === 'high' && (project.progress < 70 || project.progress === 100)) return false;
        if (progressFilter === 'completed' && project.progress !== 100) return false;
      }

      return true;
    });
  }, [searchTerm, statusFilter, priorityFilter, progressFilter, lang]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const stats = {
    total: projectsData.length,
    active: projectsData.filter(p => p.status === 'active').length,
    completed: projectsData.filter(p => p.status === 'completed').length,
    planning: projectsData.filter(p => p.status === 'planning').length,
    totalBudget: projectsData.reduce((acc, p) => acc + p.budget, 0),
    totalSpent: projectsData.reduce((acc, p) => acc + p.spent, 0)
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setProgressFilter('all');
    setCurrentPage(1);
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowFullOverview(false);
  };

  const openFullTextModal = (title: string, text: string) => {
    setFullTextData({ title, text });
    setShowFullTextModal(true);
  };

  const closeFullTextModal = () => {
    setShowFullTextModal(false);
    setFullTextData(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">{t('projects.title')}</h1>
          <p className="page-subtitle subtitle-animate">
            {t('projects.intro')}
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 content-animate">
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={lang === 'ar' ? 'البحث في المشاريع...' : 'Search projects...'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="planning">{lang === 'ar' ? 'قيد التخطيط' : 'Planning'}</option>
                  <option value="completed">{lang === 'ar' ? 'مكتمل' : 'Completed'}</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{lang === 'ar' ? 'جميع الأولويات' : 'All Priorities'}</option>
                  <option value="high">{lang === 'ar' ? 'عالي' : 'High'}</option>
                  <option value="medium">{lang === 'ar' ? 'متوسط' : 'Medium'}</option>
                  <option value="low">{lang === 'ar' ? 'منخفض' : 'Low'}</option>
                </select>

                {/* Progress Filter */}
                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{lang === 'ar' ? 'جميع التقدم' : 'All Progress'}</option>
                  <option value="low">{lang === 'ar' ? 'منخفض (< 30%)' : 'Low (< 30%)'}</option>
                  <option value="medium">{lang === 'ar' ? 'متوسط (30-70%)' : 'Medium (30-70%)'}</option>
                  <option value="high">{lang === 'ar' ? 'عالي (70-99%)' : 'High (70-99%)'}</option>
                  <option value="completed">{lang === 'ar' ? 'مكتمل (100%)' : 'Completed (100%)'}</option>
                </select>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white transition-colors duration-200"
                >
                  {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              </div>
            </div>

            {/* Results Count and Pagination Info */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-slate-400 text-sm">
                  {lang === 'ar' 
                    ? `عرض ${startIndex + 1}-${Math.min(endIndex, filteredProjects.length)} من ${filteredProjects.length} مشروع (صفحة ${currentPage} من ${totalPages})`
                    : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProjects.length)} of ${filteredProjects.length} projects (Page ${currentPage} of ${totalPages})`
                  }
                </p>
                
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">
                    {lang === 'ar' ? 'عرض' : 'Show'}:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={16}>16</option>
                  </select>
                  <span className="text-slate-400 text-sm">
                    {lang === 'ar' ? 'مشاريع' : 'projects'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-16 content-animate">
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">{stats.total}</div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</div>
          </div>
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-blue-400 mb-3">{stats.active}</div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'نشط' : 'Active'}</div>
          </div>
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-slate-400 mb-3">{stats.completed}</div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'مكتمل' : 'Completed'}</div>
          </div>
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-yellow-400 mb-3">{stats.planning}</div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'قيد التخطيط' : 'Planning'}</div>
          </div>
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-purple-400 mb-3">
              {Math.round((stats.totalSpent / stats.totalBudget) * 100)}%
            </div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'نسبة الإنفاق' : 'Budget Used'}</div>
          </div>
          <div className="card text-center p-6 stagger-animate">
            <div className="text-3xl font-bold text-orange-400 mb-3">
              {(stats.totalBudget / 1000).toFixed(0)}K
            </div>
            <div className="text-slate-300 text-sm font-medium">{lang === 'ar' ? 'الميزانية (ألف)' : 'Budget (K)'}</div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 content-animate">
            <div className="text-slate-400 text-xl mb-4">
              {lang === 'ar' ? 'لا توجد مشاريع تطابق معايير البحث' : 'No projects match your search criteria'}
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              {lang === 'ar' ? 'عرض جميع المشاريع' : 'Show All Projects'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 content-animate">
              {paginatedProjects.map((project, index) => {
                const statusInfo = statusConfig[project.status as keyof typeof statusConfig];
                const priorityInfo = priorityConfig[project.priority as keyof typeof priorityConfig];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={project.id} className="card-hover group p-8 stagger-animate" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                        <div className={`w-14 h-14 ${statusInfo.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <StatusIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{project.name[lang]}</h3>
                          <div className={`flex items-center text-sm text-slate-400 ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <span>{t('projects.manager')}: {project.manager[lang]}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        <span className={`px-3 py-1.5 ${priorityInfo.color} rounded-lg text-xs font-semibold text-white`}>
                          {priorityInfo.text[lang]}
                        </span>
                        <span className={`px-3 py-1.5 ${statusInfo.color} rounded-lg text-xs font-semibold text-white`}>
                          {statusInfo.text[lang]}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 mb-6 leading-relaxed text-base">
                      {project.description[lang].length > 150
                        ? project.description[lang].slice(0, 150) + '...'
                        : project.description[lang]}
                    </p>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-300 font-medium">{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span className="text-green-400 font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="mb-6">
                      <div className={`flex items-center mb-3 ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <UserGroupIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-300">{lang === 'ar' ? 'الفريق' : 'Team'}:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.team.slice(0, 2).map((member, index) => (
                          <span key={index} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm text-slate-300">
                            {member[lang].split(' ')[0]}
                          </span>
                        ))}
                        {project.team.length > 2 && (
                          <span className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm text-slate-400">
                            +{project.team.length - 2} {lang === 'ar' ? 'أكثر' : 'more'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dates and Budget */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className={`flex items-center text-sm text-slate-400 ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        <CalendarIcon className="w-5 h-5" />
                        <span className="foلبطnt-medium">
                          {new Date(project.start).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} - {new Date(project.end).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        <span className="font-medium">{lang === 'ar' ? 'الميزانية' : 'Budget'}:</span> {(project.budget / 1000).toFixed(0)}K
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-300 font-medium">{lang === 'ar' ? 'الإنفاق' : 'Spent'}</span>
                        <span className="text-orange-400 font-semibold">{(project.spent / 1000).toFixed(0)}K / {(project.budget / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => openProjectDetails(project)}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <EyeIcon className="w-5 h-5" />
                      <span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-20 content-animate">
                <div className="card p-4">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        currentPage === 1
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-600 hover:bg-slate-500 text-white'
                      }`}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                          page === currentPage
                            ? 'bg-green-600 text-white'
                            : page === '...'
                            ? 'text-slate-400 cursor-default'
                            : 'bg-slate-600 hover:bg-slate-500 text-white'
                        }`}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        currentPage === totalPages
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-600 hover:bg-slate-500 text-white'
                      }`}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Budget Overview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            {lang === 'ar' ? 'نظرة عامة على الميزانية' : 'Budget Overview'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-6">{lang === 'ar' ? 'إجمالي الميزانية' : 'Total Budget'}</h3>
              <div className="text-4xl font-bold text-green-400 mb-4">
                {(stats.totalBudget / 1000).toFixed(0)}K {lang === 'ar' ? 'ريال' : 'SAR'}
              </div>
              <div className="text-slate-400 text-base">{lang === 'ar' ? 'الميزانية المخصصة' : 'Allocated Budget'}</div>
            </div>
            <div className="card p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-6">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</h3>
              <div className="text-4xl font-bold text-orange-400 mb-4">
                {(stats.totalSpent / 1000).toFixed(0)}K {lang === 'ar' ? 'ريال' : 'SAR'}
              </div>
              <div className="text-slate-400 text-base">{lang === 'ar' ? 'المبلغ المنفق' : 'Amount Spent'}</div>
            </div>
            <div className="card p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-6">{lang === 'ar' ? 'المتبقي' : 'Remaining'}</h3>
              <div className="text-4xl font-bold text-cyan-400 mb-4">
                {((stats.totalBudget - stats.totalSpent) / 1000).toFixed(0)}K {lang === 'ar' ? 'ريال' : 'SAR'}
              </div>
              <div className="text-slate-400 text-base">{lang === 'ar' ? 'الميزانية المتبقية' : 'Remaining Budget'}</div>
            </div>
          </div>
        </div>

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div 
              className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl border-0 p-0
                ${theme === 'light' ? 'theme-light' : theme === 'novel' ? 'theme-novel' : theme === 'cyber' ? 'theme-cyber' : theme === 'midnight' ? 'theme-midnight' : ''}
                ${theme === 'midnight' ? 'bg-slate-900' : theme === 'light' || theme === 'novel' || theme === 'cyber' ? 'bg-transparent' : 'bg-slate-800'}`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${theme === 'light' || theme === 'novel' || theme === 'cyber' || theme === 'midnight' ? 'card-glass' : ''} p-8 flex flex-col md:flex-row items-center gap-6 border-b-0 rounded-b-none`}>
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-9 h-9 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gradient truncate">
                    {selectedProject.name[lang]}
                  </h2>
                  <p className="text-slate-400 text-base mb-2 truncate">
                    {selectedProject.description[lang].length > 150
                      ? selectedProject.description[lang].slice(0, 150) + '...'
                      : selectedProject.description[lang]}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-white card-hover hover-lift">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {lang === 'ar' ? 'من' : 'From'} {new Date(selectedProject.start).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-white card-hover hover-lift">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {lang === 'ar' ? 'إلى' : 'To'} {new Date(selectedProject.end).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="btn-icon ml-auto hover:bg-red-500/10 transition-colors"
                  aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <XMarkIcon className="w-7 h-7 text-slate-400" />
                </button>
              </div>

              {/* تفاصيل المشروع كبطاقات منفصلة */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
                {/* نظرة عامة */}
                <div className="card-hover hover-lift stagger-animate">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                    {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {showFullOverview || selectedProject.description[lang].length <= 150
                      ? selectedProject.description[lang]
                      : <>
                          {selectedProject.description[lang].slice(0, 150)}...
                          <button
                            className="text-blue-500 underline ml-2"
                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                            onClick={e => { e.stopPropagation(); openFullTextModal(selectedProject.name[lang], selectedProject.description[lang]); }}
                          >
                            {lang === 'ar' ? 'قراءة المزيد' : 'Read more'}
                          </button>
                        </>
                    }
                    {showFullOverview && selectedProject.description[lang].length > 150 && (
                      <button
                        className="text-blue-500 underline ml-2"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                        onClick={e => { e.stopPropagation(); setShowFullOverview(false); }}
                      >
                        {lang === 'ar' ? 'إخفاء' : 'Show less'}
                      </button>
                    )}
                  </p>
                </div>
                {/* الحالة والأولوية والتقدم */}
                <div className="card-hover hover-lift stagger-animate flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-slate-300">
                      {lang === 'ar' ? 'الحالة:' : 'Status:'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusConfig[selectedProject.status as keyof typeof statusConfig]?.color || 'bg-slate-700'} text-white ml-2`}>
                      {statusConfig[selectedProject.status as keyof typeof statusConfig]?.text[lang]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-slate-300">
                      {lang === 'ar' ? 'الأولوية:' : 'Priority:'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityConfig[selectedProject.priority as keyof typeof priorityConfig]?.color || 'bg-slate-700'} text-white ml-2`}>
                      {priorityConfig[selectedProject.priority as keyof typeof priorityConfig]?.text[lang]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-slate-300">
                      {lang === 'ar' ? 'التقدم:' : 'Progress:'}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${getProgressColor(selectedProject.progress)}`} style={{ width: `${selectedProject.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-green-400">{selectedProject.progress}%</span>
                    </div>
                  </div>
                </div>
                {/* فريق المشروع */}
                <div className="card-hover hover-lift stagger-animate col-span-1 md:col-span-2">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-400" />
                    {lang === 'ar' ? 'فريق المشروع' : 'Project Team'}
                  </h3>
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-slate-400">{lang === 'ar' ? 'مدير المشروع:' : 'Project Manager:'}</span>
                    <span className="text-slate-300 ml-2 font-bold">{selectedProject.manager[lang]}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-400">{lang === 'ar' ? 'أعضاء الفريق:' : 'Team Members:'}</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.team.map((member: TeamMember, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-blue-600/10 text-blue-400 text-xs rounded-full font-semibold">
                          {member[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* قسم المرفقات داخل modal التفاصيل: */}
                <div className="card-hover hover-lift stagger-animate col-span-1 md:col-span-2">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5 text-green-400" />
                    {lang === 'ar' ? 'المرفقات' : 'Attachments'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.attachments.map((att: Attachment, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                          <DocumentIcon className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="font-semibold text-slate-300 text-sm">{att.name[lang]}</div>
                            <div className="text-xs text-slate-400">{att.type.toUpperCase()} • {att.size}</div>
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-700 hover:text-white text-xs font-semibold rounded-lg transition-all duration-200 border border-green-500/30"
                          title={lang === 'ar' ? 'تحميل الملف' : 'Download File'}
                        >
                          {lang === 'ar' ? 'تحميل' : 'Download'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* الجدول الزمني */}
                <div className="card-hover hover-lift stagger-animate">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                    {lang === 'ar' ? 'الجدول الزمني' : 'Timeline'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">{lang === 'ar' ? 'تاريخ البداية:' : 'Start Date:'}</span>
                      <span className="text-slate-300 text-sm font-bold">{new Date(selectedProject.start).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">{lang === 'ar' ? 'تاريخ النهاية:' : 'End Date:'}</span>
                      <span className="text-slate-300 text-sm font-bold">{new Date(selectedProject.end).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                  </div>
                </div>
                {/* الميزانية */}
                <div className="card-hover hover-lift stagger-animate">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                    {lang === 'ar' ? 'الميزانية' : 'Budget'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">{lang === 'ar' ? 'الميزانية الكلية:' : 'Total Budget:'}</span>
                      <span className="text-slate-300 text-sm font-bold">{selectedProject.budget.toLocaleString()} ﷼</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">{lang === 'ar' ? 'المصروف:' : 'Spent:'}</span>
                      <span className="text-slate-300 text-sm font-bold">{selectedProject.spent.toLocaleString()} ﷼</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Text Modal */}
        {showFullTextModal && fullTextData && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={closeFullTextModal}
          >
            <div 
              className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border-0 p-0
                ${theme === 'light' ? 'theme-light' : theme === 'novel' ? 'theme-novel' : theme === 'cyber' ? 'theme-cyber' : theme === 'midnight' ? 'theme-midnight' : ''}
                ${theme === 'midnight' ? 'bg-slate-900' : theme === 'light' || theme === 'novel' || theme === 'cyber' ? 'bg-transparent' : 'bg-slate-800'}`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${theme === 'light' || theme === 'novel' || theme === 'cyber' || theme === 'midnight' ? 'card-glass' : ''} p-6 flex items-center justify-between border-b-0 rounded-b-none`}>
                <h3 className="text-xl font-bold text-gradient">
                  {fullTextData.title}
                </h3>
                <button
                  onClick={closeFullTextModal}
                  className="btn-icon hover:bg-red-500/10 transition-colors"
                  aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                  {fullTextData.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 