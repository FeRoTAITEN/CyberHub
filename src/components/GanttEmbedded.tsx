'use client';

import { useLang } from '@/app/ClientLayout';
import { useTheme } from '@/app/ClientLayout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface GanttRow {
  id: number;
  name: { en: string; ar: string };
  progress: number;
  startDate: Date; // for positioning (fallback chain)
  endDate: Date;
  baselineStart?: Date;
  baselineEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  color: string;
  status: 'active' | 'completed' | 'delayed' | 'planning';
  phaseName?: string;
}

type ApiPhase = {
  id: number;
  name: string;
  status: string;
  baseline_start: string | null;
  baseline_finish: string | null;
  actual_start: string | null;
  actual_finish: string | null;
  order: number;
};

type ApiProject = {
  id: number;
  name: string;
  progress: number;
  status: string;
  baseline_start: string | null;
  baseline_finish: string | null;
  actual_start: string | null;
  actual_finish: string | null;
  phases: ApiPhase[];
};

export default function GanttEmbedded() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const locale = lang === 'ar' ? 'ar-u-ca-gregory' : 'en-US';

  const labels = useMemo(() => (
    lang === 'ar'
      ? { view: 'العرض', week: 'أسبوع', month: 'شهر', quarter: 'ربع', year: 'سنة', projects: 'المشاريع', today: 'اليوم', prev: 'السابق', next: 'التالي' }
      : { view: 'View', week: 'Week', month: 'Month', quarter: 'Quarter', year: 'Year', projects: 'Projects', today: 'Today', prev: 'Previous', next: 'Next' }
  ), [lang]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [rows, setRows] = useState<GanttRow[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [phaseModalData, setPhaseModalData] = useState<{
    projectName: string;
    phaseName?: string;
    baselineStart?: Date;
    baselineEnd?: Date;
    actualStart?: Date;
    actualEnd?: Date;
  } | null>(null);

  const themeColors = {
    default: { bg: 'bg-slate-900', card: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-300', textMuted: 'text-slate-400', accent: 'text-green-400', todayLine: 'bg-red-500', bar: '#10B981', baselineBar: '#64748B' },
    light:   { bg: 'bg-gray-50',  card: 'bg-white',   border: 'border-gray-200', text: 'text-gray-900', textMuted: 'text-gray-600', accent: 'text-green-600', todayLine: 'bg-red-500', bar: '#16A34A', baselineBar: '#6B7280' },
    midnight:{ bg: 'bg-slate-800',card: 'bg-slate-700',border: 'border-slate-600', text: 'text-slate-200', textMuted: 'text-slate-400', accent: 'text-cyan-400', todayLine: 'bg-red-500', bar: '#06B6D4', baselineBar: '#94A3B8' },
    novel:   { bg: 'bg-gray-800', card: 'bg-gray-700', border: 'border-gray-600', text: 'text-gray-200', textMuted: 'text-gray-400', accent: 'text-yellow-400', todayLine: 'bg-red-500', bar: '#F59E0B', baselineBar: '#A3A3A3' },
    cyber:   { bg: 'bg-zinc-900', card: 'bg-zinc-800', border: 'border-zinc-700', text: 'text-zinc-200', textMuted: 'text-zinc-400', accent: 'text-green-400', todayLine: 'bg-red-500', bar: '#22C55E', baselineBar: '#9CA3AF' },
    salam:   { bg: 'bg-white',    card: 'bg-[#EEFDEC]',border: 'border-[#003931]', text: 'text-[#003931]', textMuted: 'text-[#005147]', accent: 'text-[#00F000]', todayLine: 'bg-red-500', bar: '#00F000', baselineBar: '#8EA3A1' }
  } as const;

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;

  const getCurrentWeekDates = () => {
    const today = new Date(currentDate);
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
    startOfCurrentWeek.setHours(0,0,0,0);
    const firstWeekStart = new Date(startOfCurrentWeek);
    firstWeekStart.setDate(firstWeekStart.getDate() - 8 * 7);
    const weeks: Date[] = [];
    for (let i = 0; i < 17; i++) {
      const d = new Date(firstWeekStart);
      d.setDate(firstWeekStart.getDate() + i * 7);
      weeks.push(d);
    }
    return weeks;
  };

  const getCurrentMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthDates: Date[] = [];
    for (let day = 1; day <= daysInMonth; day++) monthDates.push(new Date(year, month, day));
    return monthDates;
  };

  const getCurrentYearDates = () => {
    const year = currentDate.getFullYear();
    const dates: Date[] = [];
    for (let month = 0; month < 12; month++) dates.push(new Date(year, month, 1));
    return dates;
  };

  const getDisplayDates = () => {
    switch (viewMode) {
      case 'week': return getCurrentWeekDates();
      case 'month': return getCurrentMonthDates();
      case 'quarter': {
        const quarterDates: Date[] = [];
        const startMonth = Math.floor(currentDate.getMonth() / 3) * 3;
        for (let m = 0; m < 3; m++) {
          const y = currentDate.getFullYear();
          const cm = startMonth + m;
          const dim = new Date(y, cm + 1, 0).getDate();
          for (let d = 1; d <= dim; d++) quarterDates.push(new Date(y, cm, d));
        }
        return quarterDates;
      }
      case 'year': return getCurrentYearDates();
      default: return getCurrentMonthDates();
    }
  };

  const displayDates = getDisplayDates();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to load projects');
        const data: ApiProject[] = await res.json();
        const mapped: GanttRow[] = [];
        data.forEach((p) => {
          const activePhase = p.phases?.find(ph => ph.status === 'active');
          if (!activePhase) return;
          const baselineStart = activePhase.baseline_start ? new Date(activePhase.baseline_start) : (p.baseline_start ? new Date(p.baseline_start) : undefined);
          const baselineEnd = activePhase.baseline_finish ? new Date(activePhase.baseline_finish) : (p.baseline_finish ? new Date(p.baseline_finish) : undefined);
          const actualStart = activePhase.actual_start ? new Date(activePhase.actual_start) : (p.actual_start ? new Date(p.actual_start) : undefined);
          const actualEnd = activePhase.actual_finish ? new Date(activePhase.actual_finish) : (p.actual_finish ? new Date(p.actual_finish) : undefined);
          const fallbackStart = actualStart || baselineStart || new Date();
          const fallbackEnd = actualEnd || baselineEnd || new Date(fallbackStart.getTime() + 24*60*60*1000);
          mapped.push({
            id: p.id,
            name: { en: p.name, ar: p.name },
            progress: p.progress ?? 0,
            startDate: fallbackStart,
            endDate: fallbackEnd,
            baselineStart,
            baselineEnd,
            actualStart,
            actualEnd,
            color: colors.bar,
            status: 'active',
            phaseName: activePhase.name,
          });
        });
        setRows(mapped);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [theme, colors.bar]);

  const getProjectBarStyle = (project: GanttRow) => {
    const columnWidth = viewMode === 'year' ? 80 : viewMode === 'week' ? 144 : 64;
    if (viewMode === 'year') {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const year = currentDate.getFullYear();
      const startMonth = projectStart.getFullYear() === year ? projectStart.getMonth() : 0;
      const endMonth = projectEnd.getFullYear() === year ? projectEnd.getMonth() + 1 : 12;
      const left = startMonth * columnWidth;
      const width = (endMonth - startMonth) * columnWidth;
      return { left: `${left}px`, width: `${width}px`, backgroundColor: project.color } as React.CSSProperties;
    } else {
      if (viewMode === 'week') {
        const projectStart = new Date(project.startDate); projectStart.setHours(0,0,0,0);
        const projectEnd = new Date(project.endDate); projectEnd.setHours(0,0,0,0);
        const getWeekStart = (d: Date) => { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(0,0,0,0); return x; };
        const startWeek = getWeekStart(projectStart);
        const endWeek = getWeekStart(projectEnd);
        const viewStart = new Date(displayDates[0]); viewStart.setHours(0,0,0,0);
        const weeksFromViewStart = Math.max(0, Math.floor((startWeek.getTime() - viewStart.getTime()) / (7*24*60*60*1000)));
        const weeksSpan = Math.max(1, Math.floor((endWeek.getTime() - startWeek.getTime()) / (7*24*60*60*1000)) + 1);
        const left = weeksFromViewStart * columnWidth;
        const width = weeksSpan * columnWidth;
        return { left: `${left}px`, width: `${width}px`, backgroundColor: project.color } as React.CSSProperties;
      }
      const startIndex = displayDates.findIndex(date => { const dt = new Date(date); dt.setHours(0,0,0,0); const pStart = new Date(project.startDate); pStart.setHours(0,0,0,0); return dt.getTime() >= pStart.getTime(); });
      const endIndex = displayDates.findIndex(date => { const dt = new Date(date); dt.setHours(0,0,0,0); const pEnd = new Date(project.endDate); pEnd.setHours(0,0,0,0); return dt.getTime() > pEnd.getTime(); });
      const actualStartIndex = startIndex === -1 ? 0 : startIndex;
      const actualEndIndex = endIndex === -1 ? displayDates.length : endIndex;
      const offset = actualStartIndex * columnWidth;
      const width = (actualEndIndex - actualStartIndex) * columnWidth;
      return { left: `${offset}px`, width: `${width}px`, backgroundColor: project.color } as React.CSSProperties;
    }
  };

  // helper to compute style from raw dates
  const getBarStyleFromDates = (start: Date, end: Date) => {
    const temp: GanttRow = {
      id: -1,
      name: { en: '', ar: '' },
      progress: 0,
      startDate: start,
      endDate: end,
      color: colors.bar,
      status: 'active'
    };
    return getProjectBarStyle(temp);
  };

  const todayPosition = (() => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (viewMode === 'year') {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const viewYear = currentDate.getFullYear();
      if (currentYear !== viewYear) return null;
      const columnWidth = 80; return `${(currentMonth * columnWidth) + (columnWidth / 2)}px`;
    } else if (viewMode === 'week') {
      const weekIndex = displayDates.findIndex(weekStart => { const start = new Date(weekStart); start.setHours(0,0,0,0); const end = new Date(start); end.setDate(start.getDate() + 6); return today >= start && today <= end; });
      if (weekIndex === -1) return null;
      const columnWidth = 144; return `${(weekIndex * columnWidth) + (columnWidth / 2)}px`;
    } else {
      const idx = displayDates.findIndex(date => { const dt = new Date(date); dt.setHours(0,0,0,0); return dt.getTime() === today.getTime(); });
      if (idx === -1) return null;
      const columnWidth = 64; return `${(idx * columnWidth) + (columnWidth / 2)}px`;
    }
  })();

  useEffect(() => {
    if (timelineRef.current && todayPosition) {
      const position = parseInt(todayPosition);
      timelineRef.current.scrollLeft = position - timelineRef.current.clientWidth / 2;
    }
  }, [viewMode, currentDate, todayPosition]);

  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    if (format === 'long') return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  };

  const openModal = (row: GanttRow) => {
    setPhaseModalData({
      projectName: lang === 'ar' ? row.name.ar : row.name.en,
      phaseName: row.phaseName,
      baselineStart: row.baselineStart,
      baselineEnd: row.baselineEnd,
      actualStart: row.actualStart,
      actualEnd: row.actualEnd,
    });
    setShowPhaseModal(true);
  };

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.card}`}>
      {/* Controls */}
      <div className="p-4 border-b" style={{ borderColor: 'inherit' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`${colors.textMuted} text-sm`}>{labels.view}</span>
            <div className={`flex rounded-lg border ${colors.border} overflow-hidden`}>
              {[
                { key: 'week', label: labels.week },
                { key: 'month', label: labels.month },
                { key: 'quarter', label: labels.quarter },
                { key: 'year', label: labels.year }
              ].map((mode) => (
                <button key={mode.key} onClick={() => setViewMode(mode.key as any)} className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === mode.key ? `${colors.accent} bg-opacity-20` : `${colors.textMuted} hover:${colors.text}`}`}>{mode.label}</button>
              ))}
            </div>
          </div>
          {viewMode !== 'week' && (
            <div className="flex items-center gap-2">
              <button aria-label={labels.prev} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - (viewMode==='quarter'?3: viewMode==='year'?12:1))))} className={`p-2 rounded-lg border ${colors.border} ${colors.textMuted} hover:${colors.text}`}><ChevronLeftIcon className="w-5 h-5" /></button>
              <span className={`${colors.text} font-medium min-w-[120px] text-center`}>{formatDate(currentDate, 'long')}</span>
              <button aria-label={labels.next} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + (viewMode==='quarter'?3: viewMode==='year'?12:1))))} className={`p-2 rounded-lg border ${colors.border} ${colors.textMuted} hover:${colors.text}`}><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
          )}
          <button aria-label={labels.today} onClick={() => setCurrentDate(new Date())} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.accent} bg-opacity-20 border border-current hover:bg-opacity-30`}>
            <CalendarIcon className="w-4 h-4" /><span className="text-sm font-medium">{labels.today}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div dir="ltr" className={`overflow-x-hidden overflow-y-auto max-h-[600px] flex items-start min-h-[480px]`}>
        {/* Left column */}
        <div className={`w-80 flex-shrink-0 ${colors.card} border-r ${colors.border} sticky left-0 z-10`}>
          <div className={`p-4 border-b ${colors.border}`} style={{ height: '80px' }}>
            <h3 className={`${colors.text} font-semibold mb-4`}>{labels.projects}</h3>
          </div>
          {rows.map((row) => (
            <div key={row.id} className={`h-20 border-b ${colors.border} ${colors.text} flex flex-col justify-center p-4`}>
              <div className="font-medium mb-2">{lang==='ar'? row.name.ar : row.name.en}</div>
              <div className="flex items-center gap-2 text-sm">
                <ChartBarIcon className="w-4 h-4" />
                <span className={colors.textMuted}>{formatDate(row.startDate)} - {formatDate(row.endDate)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className={`flex overflow-x-auto overflow-y-hidden flex-1 min-h-full`} ref={timelineRef}>
          <div className="flex-1 min-w-max min-h-full relative">
            {/* Header */}
            <div className={`flex border-b ${colors.border} h-20`}>
              {displayDates.map((date, i) => {
                const isFirstDayOfMonth = date.getDate() === 1;
                const shouldShow = viewMode === 'year' ? isFirstDayOfMonth : true;
                if (!shouldShow) return null;
                const today = new Date(); today.setHours(0,0,0,0);
                const currentDate = new Date(date); currentDate.setHours(0,0,0,0);
                const isToday = currentDate.getTime() === today.getTime();
                return (
                  <div key={i} className={`${viewMode==='year'?'w-20 min-w-20': viewMode==='week'?'w-36 min-w-36':'w-16 min-w-16'} p-4 text-center border-r ${colors.border} ${isToday? colors.accent: colors.textMuted} text-xs relative flex flex-col justify-center items-center`}>
                    <div className={`font-medium ${isToday ? 'font-bold' : ''}`}>
                      {viewMode==='year' ? date.toLocaleDateString(locale, { month: 'short' }) : viewMode==='week' ? (()=>{ const end=new Date(date); end.setDate(end.getDate()+6); return `${date.toLocaleDateString(locale,{day:'2-digit',month:'short'})} - ${end.toLocaleDateString(locale,{day:'2-digit',month:'short'})}`; })() : date.getDate()}
                    </div>
                    <div className={`text-xs ${isToday ? 'opacity-100' : 'opacity-70'}`}>
                      {viewMode==='year' ? date.toLocaleDateString(locale,{month:'short'}) : viewMode==='week' ? '' : date.toLocaleDateString(locale,{month:'short'})}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="flex flex-col min-h-[calc(100%-80px)]">
              {rows.map((row, rowIndex) => (
                <div key={row.id} className={`relative h-20 border-b ${colors.border} flex items-center justify-center overflow-hidden`} style={{ backgroundColor: rowIndex % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                  {/* Today line */}
                  {todayPosition && (
                    <div className="absolute top-0 bottom-0 w-px z-20 pointer-events-none" style={{ left: todayPosition as any, transform: 'translateX(-50%)' }}>
                      <div className={`w-full h-full ${colors.todayLine} opacity-90`} />
                    </div>
                  )}

                  {/* Grid columns */}
                  {displayDates.map((date, index) => {
                    const isFirstDayOfMonth = date.getDate() === 1;
                    const shouldShow = viewMode === 'year' ? isFirstDayOfMonth : true;
                    if (!shouldShow) return null;
                    const today = new Date(); today.setHours(0,0,0,0);
                    const start = new Date(date); start.setHours(0,0,0,0);
                    let isTodayMarker = false;
                    if (viewMode === 'year') isTodayMarker = start.getFullYear() === today.getFullYear() && start.getMonth() === today.getMonth();
                    else if (viewMode === 'week') { const end = new Date(start); end.setDate(start.getDate()+6); isTodayMarker = today >= start && today <= end; }
                    else isTodayMarker = start.getTime() === today.getTime();
                    return (<div key={index} className={`${viewMode==='year'?'w-20 min-w-20': viewMode==='week'?'w-36 min-w-36':'w-16 min-w-16'} border-r ${colors.border} absolute ${isTodayMarker ? 'bg-red-50 dark:bg-red-900/20' : ''}`} style={{ left: `${index * (viewMode==='year'?80: viewMode==='week'?144:64)}px`, height: '80px' }} />);
                  })}

                  {/* Baseline bar */}
                  {row.baselineStart && row.baselineEnd && (
                    <div className="absolute left-0 cursor-pointer" style={{ ...(getBarStyleFromDates(row.baselineStart, row.baselineEnd) as any), height: '22px', top: '30%' }} onClick={() => openModal(row)}>
                      <div className="h-full rounded" style={{ backgroundColor: colors.baselineBar }} />
                    </div>
                  )}

                  {/* Actual bar */}
                  <div className="absolute left-0 cursor-pointer" style={{ ...(row.actualStart && row.actualEnd ? (getBarStyleFromDates(row.actualStart, row.actualEnd) as any) : (getProjectBarStyle(row) as any)), height: '22px', top: '60%' }} onClick={() => openModal(row)}>
                    <div className="h-full rounded" style={{ backgroundColor: colors.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Modal */}
      {showPhaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.card} border ${colors.border} rounded-xl shadow-2xl w-full max-w-md`}>
            <div className={`p-6 border-b ${colors.border}`}>
              <h3 className={`${colors.text} text-xl font-semibold`}>{lang==='ar'?'تفاصيل المرحلة':'Phase Details'}</h3>
              <p className={`${colors.textMuted} text-sm mt-1`}>{phaseModalData?.phaseName ?? (lang==='ar'?'مرحلة نشطة':'Active Phase')} — {phaseModalData?.projectName}</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between"><span className={colors.textMuted}>{lang==='ar'?'Baseline البداية':'Baseline Start'}</span><span className={colors.text}>{phaseModalData?.baselineStart ? formatDate(phaseModalData.baselineStart, 'long') : '-'}</span></div>
              <div className="flex items-center justify-between"><span className={colors.textMuted}>{lang==='ar'?'Baseline النهاية':'Baseline Finish'}</span><span className={colors.text}>{phaseModalData?.baselineEnd ? formatDate(phaseModalData.baselineEnd, 'long') : '-'}</span></div>
              <div className="flex items-center justify-between"><span className={colors.textMuted}>{lang==='ar'?'Actual البداية':'Actual Start'}</span><span className={colors.text}>{phaseModalData?.actualStart ? formatDate(phaseModalData.actualStart, 'long') : '-'}</span></div>
              <div className="flex items-center justify-between"><span className={colors.textMuted}>{lang==='ar'?'Actual النهاية':'Actual Finish'}</span><span className={colors.text}>{phaseModalData?.actualEnd ? formatDate(phaseModalData.actualEnd, 'long') : '-'}</span></div>
            </div>
            <div className={`p-4 border-t ${colors.border} flex justify-end`}>
              <button onClick={() => setShowPhaseModal(false)} className={`px-4 py-2 rounded-lg ${colors.accent} bg-opacity-20 border border-current hover:bg-opacity-30`}>
                {lang==='ar'?'إغلاق':'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 