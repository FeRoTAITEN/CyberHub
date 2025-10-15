"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "../../ClientLayout";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiTrash2, FiUserX, FiUserPlus, FiX } from "react-icons/fi";
import autoStyles from "../AutoScheduleModal.module.css";
import uiStyles from "../ShiftsUI.module.css";

type Shift = { id: number; name: string; name_ar: string };

type Assignment = {
  id?: number;
  date: string;
  shift: Shift;
  employee: { id: number; name: string; name_ar?: string };
  shift_id: number;
  employee_id: number;
  status: string;
};

type Employee = { 
  id: number; 
  name: string; 
  name_ar?: string;
  email: string;
  phone?: string;
  job_title?: string;
  job_title_ar?: string;
  department?: {
    id: number;
    name: string;
    description?: string;
  };
  pattern_code?: string;
};

type DayDetails = {
  assignments: Assignment[];
  apologies: Array<{ id: number; date: string; employee: Employee; reason: string; reason_ar?: string }>;
};

function toLocalKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function ShiftsAdminShell() {
  const { lang } = useLang();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [message, setMessage] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'month'|'quarter'|'year'>('month');

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApologyModal, setShowApologyModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayDetails, setDayDetails] = useState<DayDetails | null>(null);
  const [dayModalDate, setDayModalDate] = useState<string>("");
  const [staffList, setStaffList] = useState<Employee[]>([]);
  const [assignForm, setAssignForm] = useState<{ date: string; shift_id: number; employee_id: number }>({ date: '', shift_id: 0, employee_id: 0 });
  const [apologyForm, setApologyForm] = useState<{ date: string; employee_id: number; reason: string; shift_id?: number }>({ date: '', employee_id: 0, reason: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [profileStaffId, setProfileStaffId] = useState<number | null>(null);
  const [profileStaffName, setProfileStaffName] = useState<string>("");

  // Clear dropdown state
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearMode, setClearMode] = useState<'month'|'quarter'|'year'>('month');
  const [profileViewMode, setProfileViewMode] = useState<'month'|'quarter'|'year'>('month');
  const [profileYear, setProfileYear] = useState<number>(year);
  const [profileMonth, setProfileMonth] = useState<number>(month);
  const profileMonthLabel = useMemo(() => {
    return new Date(profileYear, profileMonth - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  }, [profileYear, profileMonth, lang]);
  const [profileTab, setProfileTab] = useState<'overview'|'schedule'|'apologies'>('schedule');
  const [profileStaffInfo, setProfileStaffInfo] = useState<any>(null);
  const [profileApologies, setProfileApologies] = useState<Array<{ id:number; date:string; reason:string }>>([]);

  const monthLabel = useMemo(() => {
    return new Date(year, month - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  }, [year, month, lang]);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const monthsToFetch: Array<{ y: number; m: number }> = [];
      if (viewMode === 'month') {
        monthsToFetch.push({ y: year, m: month });
      } else if (viewMode === 'quarter') {
        const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
        for (let i = 0; i < 3; i++) monthsToFetch.push({ y: year, m: startMonth + i });
      } else {
        for (let m = 1; m <= 12; m++) monthsToFetch.push({ y: year, m });
      }
      console.log('Fetching assignments for months:', monthsToFetch);
      const results = await Promise.all(
        monthsToFetch.map(({ y, m }) => fetch(`/api/shifts?year=${y}&month=${m}`).then(r => r.json()))
      );
      const combined = results.flatMap(r => r.assignments || []);
      console.log('Loaded assignments:', combined.length);
      setAssignments(combined);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  }, [year, month, viewMode]);

  // Load assignments for an arbitrary base (used by profile modal)
  const loadAssignmentsFor = useCallback(async (baseYear: number, baseMonth: number, mode: 'month'|'quarter'|'year') => {
    setLoading(true);
    try {
      const monthsToFetch: Array<{ y: number; m: number }> = [];
      if (mode === 'month') {
        monthsToFetch.push({ y: baseYear, m: baseMonth });
      } else if (mode === 'quarter') {
        const startMonth = Math.floor((baseMonth - 1) / 3) * 3 + 1;
        for (let i = 0; i < 3; i++) monthsToFetch.push({ y: baseYear, m: startMonth + i });
      } else {
        for (let m = 1; m <= 12; m++) monthsToFetch.push({ y: baseYear, m });
      }
      const results = await Promise.all(
        monthsToFetch.map(({ y, m }) => fetch(`/api/shifts?year=${y}&month=${m}`).then(r => r.json()))
      );
      const combined = results.flatMap(r => r.assignments || []);
      setAssignments(combined);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDay = async (date: string) => {
    try {
      const res = await fetch(`/api/shifts/day?date=${date}`);
      const json = await res.json();
      const safe = {
        assignments: Array.isArray(json?.assignments) ? json.assignments : [],
        apologies: Array.isArray(json?.apologies) ? json.apologies : []
      } as DayDetails;
      setDayDetails(safe);
    } catch {
      // Keep silent; modal will show empty state
    }
  };

  const loadStaff = async () => {
    try {
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success) {
        const data = json.data.map((employee: any) => ({ 
          id: employee.id, 
          name: employee.name, 
          name_ar: employee.name_ar,
          email: employee.email,
          phone: employee.phone,
          job_title: employee.job_title,
          job_title_ar: employee.job_title_ar,
          department: employee.department,
          pattern_code: employee.pattern_code,
        }));
        setStaffList(data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  useEffect(() => {
    loadAssignments();
    setSelectedStaffId(null);
  }, [loadAssignments]);

  useEffect(() => {
    loadStaff();
  }, []);

  const [showPatternsModal, setShowPatternsModal] = useState(false);
  const [patterns, setPatterns] = useState<Array<{ id:number; code:string; name:string; name_ar?:string }>>([]);
  const [selectedPatternCodes, setSelectedPatternCodes] = useState<string[]>([]);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [autoMode, setAutoMode] = useState<'month'|'quarter'|'year'|'custom'>('month');
  const [customRange, setCustomRange] = useState<{ start:string; end:string }>({ start: '', end: '' });
  const [manageSearchTerm, setManageSearchTerm] = useState<string>('');
  const [manageInitialIds, setManageInitialIds] = useState<number[]>([]);
  const [manageSaving, setManageSaving] = useState<boolean>(false);

  const loadPatterns = useCallback(async () => {
    try {
      console.log('Loading patterns...');
      const res = await fetch('/api/shifts/patterns');
      const json = await res.json();
      console.log('Patterns response:', json);
      const patternsArray = Array.isArray(json?.patterns) ? json.patterns : [];
      console.log('Setting patterns:', patternsArray);
      setPatterns(patternsArray);
    } catch (error) {
      console.error('Error loading patterns:', error);
      setPatterns([]);
    }
  }, []);

  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  const togglePattern = (code: string) => {
    console.log('Toggling pattern:', code);
    setSelectedPatternCodes(prev => {
      const next = prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code];
      console.log('Selected patterns:', next);
      return next;
    });
  };

  const onAutoSchedule = async (reqMode: 'month'|'quarter'|'year' = 'month') => {
    console.log('onAutoSchedule called with reqMode:', reqMode);
    setLoading(true);
    setMessage("");
    try {
      const body: any = { year, month, mode: reqMode };
      console.log('Sending auto-schedule request:', body);
      if (selectedPatternCodes.length > 0) {
        body.patterns = selectedPatternCodes;
        console.log('Auto-scheduling with patterns:', selectedPatternCodes);
      }
      const res = await fetch(`/api/shifts/auto-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      console.log('Auto-schedule response:', json);
      if (!res.ok) {
        setMessage(json.error || (lang === 'ar' ? 'فشل جدولة المناوبات' : 'Failed to auto-schedule'));
      } else {
        setMessage(lang === 'ar' ? 'تمت الجدولة بنجاح' : 'Auto-scheduled successfully');
        await loadAssignments();
        if (showDayModal && dayModalDate) await loadDay(dayModalDate);
      }
    } catch (error) {
      console.error('Error in auto-scheduling:', error);
      setMessage(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const onAutoScheduleCustom = async () => {
    if (!customRange.start || !customRange.end) return;
    if (new Date(customRange.end) < new Date(customRange.start)) {
      setMessage(lang === 'ar' ? 'نطاق التواريخ غير صالح' : 'Invalid date range');
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const body: any = { start_date: customRange.start, end_date: customRange.end };
      if (selectedPatternCodes.length > 0) body.patterns = selectedPatternCodes;
      const res = await fetch(`/api/shifts/auto-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || (lang === 'ar' ? 'فشل الجدولة للنطاق' : 'Failed to auto-schedule for range'));
      } else {
        setMessage(lang === 'ar' ? 'تمت الجدولة للنطاق' : 'Auto-scheduled for range');
        await loadAssignments();
        if (showDayModal && dayModalDate) await loadDay(dayModalDate);
        setShowAutoScheduleModal(false);
      }
    } catch {
      setMessage(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const onClear = async (mode: 'month'|'quarter'|'year' = 'month') => {
    const msg = lang === 'ar'
      ? (mode === 'month' ? 'هل تريد حذف الجدولة لهذا الشهر؟' : mode === 'quarter' ? 'هل تريد حذف الجدولة لهذا الربع؟' : 'هل تريد حذف الجدولة لهذه السنة؟')
      : (mode === 'month' ? 'Clear schedule for this month?' : mode === 'quarter' ? 'Clear schedule for this quarter?' : 'Clear schedule for this year?');
    if (!confirm(msg)) return;
    setLoading(true);
    try {
      const payload: any = { year, month };
      if (mode !== 'month') payload.mode = mode;
      const res = await fetch('/api/shifts/clear-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await loadAssignments();
        setMessage(lang === 'ar' ? 'تم حذف الجدولة' : 'Schedule cleared');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAssign = async () => {
    if (!assignForm.date || !assignForm.shift_id || !assignForm.employee_id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shifts/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm)
      });
      if (res.ok) {
        setShowAssignModal(false);
        await loadAssignments();
        if (dayModalDate) { await loadDay(dayModalDate); }
      }
    } finally { setLoading(false); }
  };

  const submitApology = async () => {
    if (!apologyForm.date || !apologyForm.employee_id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shifts/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...apologyForm })
      });
      if (res.ok) {
        setShowApologyModal(false);
        await loadAssignments();
        if (dayModalDate) { await loadDay(dayModalDate); }
      }
    } finally { setLoading(false); }
  };

  const calendar = useMemo(() => {
    const map = new Map<string, Map<number, Assignment[]>>();
    console.log('Building calendar from assignments:', assignments.length);
    for (const a of assignments) {
      const dt = new Date(a.date as any);
      const d = toLocalKey(dt);
      console.log('Assignment:', { date: a.date, dt, d, shift: a.shift.name, employee: a.employee.name });
      if (!map.has(d)) map.set(d, new Map());
      const inner = map.get(d)!;
      if (!inner.has(a.shift.id)) inner.set(a.shift.id, []);
      inner.get(a.shift.id)!.push(a);
    }
    console.log('Calendar map:', Array.from(map.entries()).map(([date, shifts]) => ({
      date,
      shifts: Array.from(shifts.entries()).map(([id, assignments]) => ({
        id,
        count: assignments.length
      }))
    })));
    return map;
  }, [assignments]);

  const staffSummaries = useMemo(() => {
    type Summary = {
      employee_id: number;
      name: string;
      name_ar?: string;
      morning: number;
      lateMorning: number;
      day: number;
      night: number;
      total: number;
    };
    const map = new Map<number, Summary>();
    const isMorning = (s: Shift) => s.name.toLowerCase() === 'morning' || s.name_ar === 'صباح';
    const isLateMorning = (s: Shift) => s.name.toLowerCase() === 'late morning' || s.name_ar === 'صباح متأخر';
    const isDay = (s: Shift) => s.name.toLowerCase() === 'day' || s.name_ar === 'نهار';
    const isNight = (s: Shift) => s.name.toLowerCase() === 'night' || s.name_ar === 'ليل';

    for (const a of assignments) {
      const key = a.employee_id;
      if (!map.has(key)) {
        map.set(key, {
          employee_id: key,
          name: a.employee.name,
          name_ar: a.employee.name_ar,
          morning: 0,
          lateMorning: 0,
          day: 0,
          night: 0,
          total: 0
        });
      }
      const s = map.get(key)!;
      if (isMorning(a.shift)) s.morning += 1;
      else if (isLateMorning(a.shift)) s.lateMorning += 1;
      else if (isDay(a.shift)) s.day += 1;
      else if (isNight(a.shift)) s.night += 1;
      s.total += 1;
    }

    const arr = Array.from(map.values());
    arr.sort((a, b) => (lang === 'ar' ? (a.name_ar || a.name).localeCompare(b.name_ar || b.name) : a.name.localeCompare(b.name)));
    return arr;
  }, [assignments, lang]);

  const countsByEmployeeId = useMemo(() => {
    const m = new Map<number, { morning: number; lateMorning: number; day: number; night: number; total: number }>();
    for (const s of staffSummaries) {
      m.set(s.employee_id, { morning: s.morning, lateMorning: s.lateMorning, day: s.day, night: s.night, total: s.total });
    }
    return m;
  }, [staffSummaries]);

  const weekStartsOn = lang === 'ar' ? 0 : 0;
  const buildWeeks = (y: number, m: number) => {
    const firstOfMonth = new Date(y, m - 1, 1);
    const lastOfMonth = new Date(y, m, 0);
    const start = new Date(firstOfMonth);
    const offsetStart = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
    start.setDate(firstOfMonth.getDate() - offsetStart);
    const end = new Date(lastOfMonth);
    const offsetEnd = (weekStartsOn + 6 - lastOfMonth.getDay() + 7) % 7;
    end.setDate(lastOfMonth.getDate() + offsetEnd);
    const days: Date[] = [];
    for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      days.push(new Date(d));
    }
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    const isInCurrentMonth = (d: Date) => d.getMonth() === (m - 1);
    return { weeks, isInCurrentMonth };
  };

  const weekdayLabels = useMemo(() => (
    lang === 'ar'
      ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  ), [lang]);

  const getShiftItems = (date: Date, predicate: (s: Shift) => boolean) => {
    const dateStr = toLocalKey(date);
    const map = calendar.get(dateStr);
    if (!map) return [] as Assignment[];
    const all = Array.from(map.entries()).flatMap(([, arr]) => arr).filter(a => predicate(a.shift));
    if (selectedStaffId) {
      return all.filter(a => a.employee_id === selectedStaffId);
    }
    return all;
  };

  const openDayModal = async (date: Date) => {
    const dateStr = toLocalKey(date);
    setDayModalDate(dateStr);
    await loadDay(dateStr);
    setShowDayModal(true);
  };

  const getStaffShiftForDate = (date: Date, staffId: number) => {
    const dateStr = toLocalKey(date);
    const map = calendar.get(dateStr);
    if (!map) return 'none' as const;
    const all = Array.from(map.entries()).flatMap(([, arr]) => arr).filter(a => a.employee_id === staffId);
    if (all.length === 0) return 'none' as const;
    const a = all[0];
    const n = a.shift.name.toLowerCase();
    const ar = a.shift.name_ar;
    if (n === 'morning' || ar === 'صباح') return 'morning' as const;
    if (n === 'late morning' || ar === 'صباح متأخر') return 'lateMorning' as const;
    if (n === 'day' || ar === 'نهار') return 'day' as const;
    if (n === 'night' || ar === 'ليل') return 'night' as const;
    return 'none' as const;
  };

  // Prev/Next navigation honoring viewMode
  const moveByMonths = (delta: number) => {
    let newYear = year;
    let newMonth = month + delta;
    while (newMonth < 1) { newMonth += 12; newYear -= 1; }
    while (newMonth > 12) { newMonth -= 12; newYear += 1; }
    setYear(newYear);
    setMonth(newMonth);
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
      moveByMonths(-1);
    } else if (viewMode === 'quarter') {
      const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
      const prevStart = startMonth - 3;
      if (prevStart < 1) {
        setYear(y => y - 1);
        setMonth(prevStart + 12);
      } else {
        setMonth(prevStart);
      }
    } else {
      setYear(y => y - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      moveByMonths(1);
    } else if (viewMode === 'quarter') {
      const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
      const nextStart = startMonth + 3;
      if (nextStart > 12) {
        setYear(y => y + 1);
        setMonth(nextStart - 12);
      } else {
        setMonth(nextStart);
      }
    } else {
      setYear(y => y + 1);
    }
  };

  const openProfile = (employeeId: number, label: string) => {
    setProfileStaffId(employeeId);
    setProfileStaffName(label);
    setProfileYear(year);
    setProfileMonth(month);
    setProfileTab('schedule');
    setShowProfile(true);
    // Ensure assignments for this month are loaded
    void loadAssignmentsFor(year, month, profileViewMode);
    // Load staff details and apologies
    void (async () => {
      try {
        const infoRes = await fetch(`/api/employees/${employeeId}`);
        const info = await infoRes.json();
        setProfileStaffInfo(info);
      } catch {}
      try {
        const apRes = await fetch(`/api/shifts/availability?employeeId=${employeeId}&year=${year}&month=${month}`);
        const apJson = await apRes.json();
        const aps = (apJson?.availability || []).map((a: any) => ({ id: a.id, date: a.date, reason: a.reason }));
        setProfileApologies(aps);
      } catch {}
    })();
  };

  // Profile prev/next navigation honoring profileViewMode
  const moveProfileByMonths = (delta: number) => {
    let newYear = profileYear;
    let newMonth = profileMonth + delta;
    while (newMonth < 1) { newMonth += 12; newYear -= 1; }
    while (newMonth > 12) { newMonth -= 12; newYear += 1; }
    setProfileYear(newYear);
    setProfileMonth(newMonth);
    // Keep underlying data in sync
    setYear(newYear);
    setMonth(newMonth);
    void loadAssignmentsFor(newYear, newMonth, profileViewMode);
  };

  const handlePrevProfile = () => {
    if (profileViewMode === 'month') {
      moveProfileByMonths(-1);
    } else if (profileViewMode === 'quarter') {
      const startMonth = Math.floor((profileMonth - 1) / 3) * 3 + 1;
      const prevStart = startMonth - 3;
      if (prevStart < 1) {
        setProfileYear(y => y - 1);
        setProfileMonth(prevStart + 12);
        setYear(profileYear - 1);
        setMonth(prevStart + 12);
        void loadAssignmentsFor(profileYear - 1, prevStart + 12, profileViewMode);
      } else {
        setProfileMonth(prevStart);
        setMonth(prevStart);
        void loadAssignmentsFor(profileYear, prevStart, profileViewMode);
      }
    } else {
      setProfileYear(y => y - 1);
      setYear(y => y - 1);
      void loadAssignmentsFor(profileYear - 1, profileMonth, profileViewMode);
    }
  };

  const handleNextProfile = () => {
    if (profileViewMode === 'month') {
      moveProfileByMonths(1);
    } else if (profileViewMode === 'quarter') {
      const startMonth = Math.floor((profileMonth - 1) / 3) * 3 + 1;
      const nextStart = startMonth + 3;
      if (nextStart > 12) {
        setProfileYear(y => y + 1);
        setProfileMonth(nextStart - 12);
        setYear(profileYear + 1);
        setMonth(nextStart - 12);
        void loadAssignmentsFor(profileYear + 1, nextStart - 12, profileViewMode);
      } else {
        setProfileMonth(nextStart);
        setMonth(nextStart);
        void loadAssignmentsFor(profileYear, nextStart, profileViewMode);
      }
    } else {
      setProfileYear(y => y + 1);
      setYear(y => y + 1);
      void loadAssignmentsFor(profileYear + 1, profileMonth, profileViewMode);
    }
  };

  // Colors per shift row with alert when count < 2
  const shiftRow = (label: string, color: 'green' | 'sky' | 'amber' | 'violet', count: number) => {
    const alert = count < 2;
    const base = 'flex items-center justify-between rounded border px-2 py-1 text-xs';
    const okCls = color === 'green'
      ? 'bg-green-900/10 border-green-800 text-green-300'
      : color === 'sky'
      ? 'bg-sky-900/10 border-sky-800 text-sky-300'
      : color === 'amber'
      ? 'bg-amber-900/10 border-amber-800 text-amber-300'
      : 'bg-violet-900/10 border-violet-800 text-violet-300';
    const alertCls = 'bg-rose-900/20 border-rose-700 text-rose-300';
    return (
      <div className={`${base} ${alert ? alertCls : okCls}`}>
        <span>{label}</span>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 border text-[10px] ${alert ? 'border-rose-600 bg-rose-900/40' : 'border-slate-600 bg-slate-900/40'}`}>{count}</span>
      </div>
    );
  };

  const deleteApology = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shifts/availability?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
        if (dayModalDate) await loadDay(dayModalDate);
      }
    } finally { setLoading(false); }
  };

  const clearDayAssignments = async (dateStr: string) => {
    if (!confirm(lang === 'ar' ? 'حذف تعيينات هذا اليوم؟' : 'Clear assignments for this day?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/shifts/day?date=${dateStr}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
        await loadDay(dateStr);
        setMessage(lang === 'ar' ? 'تم حذف تعيينات اليوم' : 'Day assignments cleared');
      }
    } finally { setLoading(false); }
  };

  const deleteAssignment = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shifts/assignments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
        if (dayModalDate) await loadDay(dayModalDate);
      }
    } finally { setLoading(false); }
  };

  const [managePatternCode, setManagePatternCode] = useState<string>('alpha');
  const [manageSelectedStaffIds, setManageSelectedStaffIds] = useState<number[]>([]);

  const openManagePattern = (code: string) => {
    setManagePatternCode(code);
    const ids = staffList
      .filter(s => (s.pattern_code ?? '') === code)
      .map(s => s.id);
    setManageSelectedStaffIds(ids);
    setManageInitialIds(ids);
    setManageSearchTerm('');
    setShowPatternsModal(true);
  };

  const toggleManageStaff = async (id: number) => {
    const staff = staffList.find(s => s.id === id);
    const currentPattern = staff?.pattern_code;
    const targetPattern = managePatternCode;

    // If staff is already in a different pattern, show confirmation
    if (currentPattern && currentPattern !== targetPattern) {
      if (!confirm(
        lang === 'ar' 
          ? `هذا الموظف مسجل في نمط "${currentPattern}". هل تريد تغيير النمط؟`
          : `This employee is already in pattern "${currentPattern}". Change pattern?`
      )) {
        return;
      }
    }

    setManageSelectedStaffIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };


  const filteredManageStaff = useMemo(() => {
    const term = manageSearchTerm.trim().toLowerCase();
    if (!term) return staffList;
    return staffList.filter(s => {
      const name = `${s.name} ${s.name_ar || ''}`.toLowerCase();
      return name.includes(term) || String(s.id).includes(term);
    });
  }, [staffList, manageSearchTerm]);

  const hasUnsavedChanges = useMemo(() => {
    const sortedA = [...manageInitialIds].sort((a, b) => a - b);
    const sortedB = [...manageSelectedStaffIds].sort((a, b) => a - b);
    if (sortedA.length !== sortedB.length) return true;
    for (let i = 0; i < sortedA.length; i += 1) {
      if (sortedA[i] !== sortedB[i]) return true;
    }
    return false;
  }, [manageInitialIds, manageSelectedStaffIds]);

  const saveManagePattern = async () => {
    if (!hasUnsavedChanges) {
      setShowPatternsModal(false);
      return;
    }
    try {
      setManageSaving(true);
      await fetch('/api/shifts/patterns/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern_code: managePatternCode, employee_ids: manageSelectedStaffIds })
      });
      await loadAssignments();
      await loadEmployees();
      await loadStaff();
      setShowPatternsModal(false);
    } catch (error) {
      console.error('Error saving pattern assignments:', error);
    } finally {
      setManageSaving(false);
    }
  };

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  const loadEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success) {
        const data = json.data.map((employee: any) => ({ 
          id: employee.id, 
          name: employee.name, 
          name_ar: employee.name_ar,
          email: employee.email,
          phone: employee.phone,
          job_title: employee.job_title,
          job_title_ar: employee.job_title_ar,
          department: employee.department,
          pattern_code: employee.pattern_code,
        }));
        setEmployeeList(data);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Toolbar */}
      <div className={uiStyles.toolbar}>
        <div className={uiStyles.toolbarLeft}>
          <div className={uiStyles.toolbarIcon}>
            <FiCalendar />
          </div>
          <div className={uiStyles.toolbarHeading}>
            <span className={uiStyles.toolbarSubtitle}>{lang === 'ar' ? 'لوحة التحكم' : 'Control Panel'}</span>
            <span className={uiStyles.toolbarTitle}>{lang === 'ar' ? 'إدارة المناوبات' : 'Shift Management'} — {monthLabel}</span>
          </div>
        </div>
        <div className={uiStyles.toolbarActions}>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className={uiStyles.viewSelect}
          >
            <option value="month">{lang === 'ar' ? 'شهر' : 'Month'}</option>
            <option value="quarter">{lang === 'ar' ? 'ربع' : 'Quarter'}</option>
            <option value="year">{lang === 'ar' ? 'سنة' : 'Year'}</option>
          </select>
          {selectedStaffId && (
            <button
              onClick={() => setSelectedStaffId(null)}
              className={`${uiStyles.button} ${uiStyles.buttonGhost}`}
              title={lang === 'ar' ? 'إلغاء التحديد' : 'Clear Filter'}
            >
              <FiX />
            </button>
          )}
          <button
            onClick={() => { setShowAssignModal(true); setAssignForm({ date: `${year}-${String(month).padStart(2,'0')}-01`, shift_id: 0, employee_id: 0 }); }}
            className={`${uiStyles.button} ${uiStyles.buttonSecondary}`}
          >
            <FiUserPlus /> {lang === 'ar' ? 'تعيين' : 'Assign'}
          </button>
          <button
            onClick={() => { setShowApologyModal(true); setApologyForm({ date: `${year}-${String(month).padStart(2,'0')}-01`, employee_id: 0, reason: '', shift_id: undefined }); }}
            className={`${uiStyles.button} ${uiStyles.buttonSecondary}`}
          >
            <FiUserX /> {lang === 'ar' ? 'اعتذار' : 'Apology'}
          </button>
          <button
            onClick={() => { setClearMode('month'); setShowClearModal(true); }}
            className={`${uiStyles.button} ${uiStyles.buttonDanger}`}
          >
            <FiTrash2 /> {lang === 'ar' ? 'حذف' : 'Clear'}
          </button>
          <span className={uiStyles.toolbarDivider} />
          <button
            onClick={handlePrev}
            className={`${uiStyles.button} ${uiStyles.buttonGhost} ${uiStyles.buttonIcon}`}
            title={lang === 'ar' ? 'السابق' : 'Prev'}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className={`${uiStyles.button} ${uiStyles.buttonGhost} ${uiStyles.buttonIcon}`}
            title={lang === 'ar' ? 'التالي' : 'Next'}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => {
              setAutoMode('month');
              setCustomRange({ start: `${year}-${String(month).padStart(2,'0')}-01`, end: `${year}-${String(month).padStart(2,'0')}-28` });
              setShowAutoScheduleModal(true);
            }}
            disabled={loading}
            className={`${uiStyles.button} ${uiStyles.buttonPrimary} ${uiStyles.buttonLg}`}
          >
            <FiPlus /> {loading ? (lang === 'ar' ? 'جاري...' : 'Scheduling...') : (lang === 'ar' ? 'جدولة تلقائية' : 'Auto-Schedule')}
          </button>
          <button
            onClick={() => { void loadPatterns(); setShowPatternsModal(true); }}
            className={`${uiStyles.button} ${uiStyles.buttonSecondary}`}
          >
            {lang === 'ar' ? 'الأنماط' : 'Patterns'}
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded bg-slate-900 border border-slate-800 p-3 text-sm">
          {message}
        </div>
      )}

      {/* Calendar grids (month/quarter/year) */}
      {(() => {
        const monthsToRender: Array<{ y: number; m: number }> = [];
        if (viewMode === 'month') monthsToRender.push({ y: year, m: month });
        else if (viewMode === 'quarter') {
          const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
          for (let i = 0; i < 3; i++) monthsToRender.push({ y: year, m: startMonth + i });
        } else {
          for (let m = 1; m <= 12; m++) monthsToRender.push({ y: year, m });
        }
        return (
          <div className="overflow-x-auto pb-2">
            <div className={`flex gap-6 snap-x snap-mandatory ${viewMode === 'month' ? 'justify-center' : ''}`}>
              {monthsToRender.map(({ y, m }) => {
                const { weeks, isInCurrentMonth } = buildWeeks(y, m);
                const label = new Date(y, m - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
                return (
                  <div key={`${y}-${m}`} className="min-w-[860px] snap-start border border-slate-800 rounded overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-900/70 text-sm text-slate-300">{label}</div>
                    <div className="grid grid-cols-7 bg-slate-900/70 text-xs">
                      {weekdayLabels.map((w, idx) => (
                        <div key={idx} className="px-3 py-2 border-b border-slate-800 text-slate-300">{w}</div>
                      ))}
                    </div>
                    <div className="divide-y divide-slate-800">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7">
                          {week.map((date, di) => {
                            const isCurrent = isInCurrentMonth(date);
                            const dateNum = date.getDate();
                            if (!isCurrent && (viewMode === 'month' || viewMode === 'quarter')) {
                              return (
                                <div key={di} className="min-h-[120px] border-r border-slate-800 p-2 bg-transparent pointer-events-none" />
                              );
                            }
                            const morning = getShiftItems(date, s => (s.name.toLowerCase() === 'morning' || s.name_ar === 'صباح'));
                            const dayShift = getShiftItems(date, s => (s.name.toLowerCase() === 'day' || s.name_ar === 'نهار'));
                            const night = getShiftItems(date, s => (s.name.toLowerCase() === 'night' || s.name_ar === 'ليل'));
                            const lateMorning = getShiftItems(date, s => (s.name.toLowerCase() === 'late morning' || s.name_ar === 'صباح متأخر'));
                            return (
                              <div key={di} onClick={() => openDayModal(date)} className={`cursor-pointer min-h-[120px] border-r border-slate-800 p-2 transition-colors ${!isCurrent ? 'bg-slate-950/30 text-slate-500 hover:bg-slate-900/40' : 'bg-slate-950 hover:bg-slate-900'}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-xs font-semibold text-slate-300">{dateNum}</div>
                                </div>
                                <div className="space-y-1">
                                  {shiftRow(lang === 'ar' ? 'صباح' : 'Morning', 'green', morning.length)}
                                  {shiftRow(lang === 'ar' ? 'صباح متأخر' : 'Late Morning', 'sky', lateMorning.length)}
                                  {shiftRow(lang === 'ar' ? 'نهار' : 'Day', 'amber', dayShift.length)}
                                  {shiftRow(lang === 'ar' ? 'ليل' : 'Night', 'violet', night.length)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}


      {/* Assign Modal */}
      {showAssignModal && (
        <div className={uiStyles.modalBackdrop}>
          <div className={`${uiStyles.modalCard} ${uiStyles.modalCardSmall}`}>
            <div className={uiStyles.modalHeader}>
              <div className={uiStyles.modalHeaderLead}>
                <div className={uiStyles.modalHeaderIcon}><FiUserPlus /></div>
                <div>
                  <div className={uiStyles.modalSubtitle}>{lang === 'ar' ? 'إجراء سريع' : 'Quick Action'}</div>
                  <div className={uiStyles.modalTitle}>{lang === 'ar' ? 'تعيين موظف' : 'Assign Staff'}</div>
                </div>
              </div>
              <button onClick={() => setShowAssignModal(false)} className={uiStyles.modalClose}><FiX /></button>
            </div>
            <div className={`${uiStyles.modalBody} ${uiStyles.fieldStack}`}>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'التاريخ' : 'Date'}</span>
                <input type="date" className={uiStyles.fieldControl} value={assignForm.date} onChange={e => setAssignForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'المناوبة' : 'Shift'}</span>
                <select className={uiStyles.fieldControl} value={assignForm.shift_id} onChange={e => setAssignForm(f => ({ ...f, shift_id: parseInt(e.target.value) }))}>
                  <option value={0}>--</option>
                  <option value={1}>{lang === 'ar' ? 'صباح' : 'Morning'}</option>
                  <option value={2}>{lang === 'ar' ? 'نهار' : 'Day'}</option>
                  <option value={3}>{lang === 'ar' ? 'ليل' : 'Night'}</option>
                  <option value={4}>{lang === 'ar' ? 'صباح متأخر' : 'Late Morning'}</option>
                </select>
              </label>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'الموظف' : 'Staff'}</span>
                <select className={uiStyles.fieldControl} value={assignForm.employee_id} onChange={e => setAssignForm(f => ({ ...f, employee_id: parseInt(e.target.value) }))}>
                  <option value={0}>--</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'ar' ? (s.name_ar || s.name) : s.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={uiStyles.modalFooter}>
              <button onClick={() => setShowAssignModal(false)} className={`${uiStyles.button} ${uiStyles.buttonGhost}`}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={submitAssign} className={`${uiStyles.button} ${uiStyles.buttonPrimary}`}>{lang === 'ar' ? 'تعيين' : 'Assign'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Apology Modal */}
      {showApologyModal && (
        <div className={uiStyles.modalBackdrop}>
          <div className={`${uiStyles.modalCard} ${uiStyles.modalCardSmall}`}>
            <div className={uiStyles.modalHeader}>
              <div className={uiStyles.modalHeaderLead}>
                <div className={uiStyles.modalHeaderIcon}><FiUserX /></div>
                <div>
                  <div className={uiStyles.modalSubtitle}>{lang === 'ar' ? 'توافر الموظفين' : 'Staff Availability'}</div>
                  <div className={uiStyles.modalTitle}>{lang === 'ar' ? 'سجل اعتذار' : 'Log Apology'}</div>
                </div>
              </div>
              <button onClick={() => setShowApologyModal(false)} className={uiStyles.modalClose}><FiX /></button>
            </div>
            <div className={`${uiStyles.modalBody} ${uiStyles.fieldStack}`}>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'التاريخ' : 'Date'}</span>
                <input type="date" className={uiStyles.fieldControl} value={apologyForm.date} onChange={e => setApologyForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'الموظف' : 'Staff'}</span>
                <select className={uiStyles.fieldControl} value={apologyForm.employee_id} onChange={e => setApologyForm(f => ({ ...f, employee_id: parseInt(e.target.value) }))}>
                  <option value={0}>--</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'ar' ? (s.name_ar || s.name) : s.name}</option>
                  ))}
                </select>
              </label>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'الفترة (اختياري)' : 'Shift (optional)'}</span>
                <select className={uiStyles.fieldControl} value={apologyForm.shift_id || 0} onChange={e => setApologyForm(f => ({ ...f, shift_id: parseInt(e.target.value) || undefined }))}>
                  <option value={0}>--</option>
                  <option value={1}>{lang === 'ar' ? 'صباح' : 'Morning'}</option>
                  <option value={2}>{lang === 'ar' ? 'نهار' : 'Day'}</option>
                  <option value={3}>{lang === 'ar' ? 'ليل' : 'Night'}</option>
                  <option value={4}>{lang === 'ar' ? 'صباح متأخر' : 'Late Morning'}</option>
                </select>
              </label>
              <label className={uiStyles.fieldGroup}>
                <span className={uiStyles.fieldLabel}>{lang === 'ar' ? 'السبب' : 'Reason'}</span>
                <input type="text" className={uiStyles.fieldControl} value={apologyForm.reason} onChange={e => setApologyForm(f => ({ ...f, reason: e.target.value }))} />
              </label>
            </div>
            <div className={uiStyles.modalFooter}>
              <button onClick={() => setShowApologyModal(false)} className={`${uiStyles.button} ${uiStyles.buttonGhost}`}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={submitApology} className={`${uiStyles.button} ${uiStyles.buttonPrimary}`}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {showDayModal && dayDetails && (
        <div className={uiStyles.modalBackdrop}>
          <div className={`${uiStyles.modalCard} ${uiStyles.modalCardLarge}`} style={{ maxHeight: '80vh', overflow: 'hidden' }}>
            <div className={uiStyles.modalHeader}>
              <div className={uiStyles.modalHeaderLead}>
                <div className={uiStyles.modalHeaderIcon}><FiCalendar /></div>
                <div>
                  <div className={uiStyles.modalSubtitle}>{lang === 'ar' ? 'إدارة اليوم' : 'Day Management'}</div>
                  <div className={uiStyles.modalTitle}>{lang === 'ar' ? 'تفاصيل اليوم' : 'Day Details'} — {dayModalDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => clearDayAssignments(dayModalDate)} className={`${uiStyles.button} ${uiStyles.buttonDanger}`}>
                  <FiTrash2 /> {lang === 'ar' ? 'حذف اليوم' : 'Clear Day'}
                </button>
                <button onClick={() => { setShowAssignModal(true); setAssignForm({ date: dayModalDate, shift_id: 0, employee_id: 0 }); }} className={`${uiStyles.button} ${uiStyles.buttonSecondary}`}>
                  <FiUserPlus /> {lang === 'ar' ? 'تعيين' : 'Assign'}
                </button>
                <button onClick={() => { setShowApologyModal(true); setApologyForm({ date: dayModalDate, employee_id: 0, reason: '', shift_id: undefined }); }} className={`${uiStyles.button} ${uiStyles.buttonSecondary}`}>
                  <FiUserX /> {lang === 'ar' ? 'اعتذار' : 'Apology'}
                </button>
                <button onClick={() => setShowDayModal(false)} className={`${uiStyles.button} ${uiStyles.buttonGhost}`}><FiX /></button>
              </div>
            </div>

            <div className={uiStyles.modalBody} style={{ overflow: 'auto', maxHeight: 'calc(80vh - 160px)' }}>
              {(['morning','lateMorning','day','night'] as const).map((key) => {
                const title = key === 'morning' ? (lang === 'ar' ? 'صباح' : 'Morning') : key === 'day' ? (lang === 'ar' ? 'نهار' : 'Day') : (lang === 'ar' ? 'ليل' : 'Night');
                const items = dayDetails.assignments.filter(a => {
                  const n = a.shift.name.toLowerCase();
                  const ar = a.shift.name_ar;
                  return (key === 'morning' && (n === 'morning' || ar === 'صباح')) || (key === 'lateMorning' && (n === 'late morning' || ar === 'صباح متأخر')) || (key === 'day' && (n === 'day' || ar === 'نهار')) || (key === 'night' && (n === 'night' || ar === 'ليل'));
                });
                return (
                  <div key={key} className="border border-slate-800 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold">{key==='lateMorning' ? (lang === 'ar' ? 'صباح متأخر' : 'Late Morning') : title}</div>
                      <div className="text-[11px] text-slate-400">{items.length} {lang === 'ar' ? 'موظف' : 'staff'}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.length === 0 && <span className="text-slate-400 text-xs">{lang === 'ar' ? 'لا يوجد' : 'None'}</span>}
                      {items.map((a, idx) => {
                        const label = lang === 'ar' ? (a.employee.name_ar || a.employee.name) : a.employee.name;
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-sm"
                          >
                            <button
                            onClick={() => openProfile(a.employee.id, label)}
                              className="hover:underline"
                          >
                            {label}
                            </button>
                            {a.status !== 'assigned' && (
                              <span className="text-[10px] text-yellow-400">{a.status}</span>
                            )}
                            <button onClick={() => deleteAssignment(a.id!)} className="ml-1 text-rose-300 hover:text-rose-200" title={lang === 'ar' ? 'حذف التعيين' : 'Delete assignment'}>
                              <FiX />
                          </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="border border-slate-800 rounded p-3">
                <div className="text-sm font-semibold mb-2">{lang === 'ar' ? 'الاعتذارات' : 'Apologies'}</div>
                <div className="flex flex-wrap gap-2">
                  {dayDetails.apologies.length === 0 && <span className="text-slate-400 text-xs">{lang === 'ar' ? 'لا يوجد' : 'None'}</span>}
                  {dayDetails.apologies.map((ap, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-sm">
                      {lang === 'ar' ? (ap.employee.name_ar || ap.employee.name) : ap.employee.name}
                      {ap.reason && <span className="text-[10px] text-slate-400">— {ap.reason}</span>}
                      <button onClick={() => deleteApology(ap.id)} className="ml-1 text-rose-300 hover:text-rose-200" title={lang === 'ar' ? 'حذف الاعتذار' : 'Delete apology'}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {showProfile && profileStaffId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
          <div className="bg-slate-950 border border-slate-800 rounded p-4 w-[980px] max-h-[85vh] overflow-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold flex items-center gap-2">
                <FiCalendar /> {lang === 'ar' ? 'ملف الموظف' : 'Employee Profile'} — {profileStaffName} ({profileMonthLabel})
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevProfile} className="px-2 py-1 rounded border border-slate-700 hover:bg-slate-900" title={lang === 'ar' ? 'السابق' : 'Prev'}>
                  <FiChevronLeft />
                </button>
                <select value={profileViewMode} onChange={(e) => setProfileViewMode(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1">
                  <option value="month">{lang === 'ar' ? 'شهر' : 'Month'}</option>
                  <option value="quarter">{lang === 'ar' ? 'ربع' : 'Quarter'}</option>
                  <option value="year">{lang === 'ar' ? 'سنة' : 'Year'}</option>
                </select>
                <button onClick={handleNextProfile} className="px-2 py-1 rounded border border-slate-700 hover:bg-slate-900" title={lang === 'ar' ? 'التالي' : 'Next'}>
                  <FiChevronRight />
                </button>
                <button onClick={() => setShowProfile(false)} className="px-3 py-1 rounded border border-slate-700"><FiX /></button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { key: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
                { key: 'schedule', label: lang === 'ar' ? 'الجدول' : 'Schedule' },
                { key: 'apologies', label: lang === 'ar' ? 'الاعتذارات' : 'Apologies' }
              ].map(t => (
                <button key={t.key} onClick={() => setProfileTab(t.key as any)} className={`px-3 py-1 rounded border text-sm ${profileTab === t.key ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'}`}>{t.label}</button>
              ))}
            </div>

            {/* Overview */}
            {profileTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-800 rounded p-3">
                  <div className="text-sm font-semibold mb-2">{lang === 'ar' ? 'معلومات الموظف' : 'Staff Info'}</div>
                  {!profileStaffInfo ? (
                    <div className="text-slate-400 text-sm">{lang === 'ar' ? 'جار التحميل...' : 'Loading...'}</div>
                  ) : (
                    <div className="text-sm text-slate-300 space-y-1">
                      <div>{lang === 'ar' ? 'الاسم' : 'Name'}: {lang === 'ar' ? (profileStaffInfo.name_ar || profileStaffInfo.name) : profileStaffInfo.name}</div>
                      {profileStaffInfo.job_title && <div>{lang === 'ar' ? 'المسمى' : 'Title'}: {lang === 'ar' ? (profileStaffInfo.job_title_ar || profileStaffInfo.job_title) : profileStaffInfo.job_title}</div>}
                      {profileStaffInfo.email && <div>Email: {profileStaffInfo.email}</div>}
                      {profileStaffInfo.phone && <div>{lang === 'ar' ? 'الجوال' : 'Phone'}: {profileStaffInfo.phone}</div>}
                    </div>
                  )}
                </div>
                <div className="border border-slate-800 rounded p-3">
                  <div className="text-sm font-semibold mb-2">{lang === 'ar' ? 'الاعتذارات (الشهر)' : 'Apologies (Month)'}</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {profileApologies.length === 0 && <span className="text-slate-400 text-xs">{lang === 'ar' ? 'لا يوجد' : 'None'}</span>}
                    {profileApologies.map((ap, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-sm">
                        {ap.date.slice(0,10)} — {ap.reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule */}
            {profileTab === 'schedule' && (() => {
              const monthsToRender: Array<{ y: number; m: number }> = [];
              if (profileViewMode === 'month') monthsToRender.push({ y: profileYear, m: profileMonth });
              else if (profileViewMode === 'quarter') {
                const startMonth = Math.floor((profileMonth - 1) / 3) * 3 + 1;
                for (let i = 0; i < 3; i++) monthsToRender.push({ y: profileYear, m: startMonth + i });
              } else {
                for (let m = 1; m <= 12; m++) monthsToRender.push({ y: profileYear, m });
              }
              return (
                <div className="overflow-x-auto pb-2">
                  <div className={`flex gap-6 snap-x snap-mandatory ${profileViewMode === 'month' ? 'justify-center' : ''}`}>
                    {monthsToRender.map(({ y, m }) => {
                      const { weeks, isInCurrentMonth } = buildWeeks(y, m);
                      const label = new Date(y, m - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
                      return (
                        <div key={`${y}-${m}`} className="min-w-[700px] snap-start border border-slate-800 rounded overflow-hidden shadow-sm">
                          <div className="px-3 py-2 bg-slate-900/70 text-sm text-slate-300">{label}</div>
                          <div className="grid grid-cols-7 bg-slate-900/70 text-xs">
                            {weekdayLabels.map((w, idx) => (
                              <div key={idx} className="px-3 py-2 border-b border-slate-800 text-slate-300">{w}</div>
                            ))}
                          </div>
                          <div className="divide-y divide-slate-800">
                            {weeks.map((week, wi) => (
                              <div key={wi} className="grid grid-cols-7">
                                {week.map((date, di) => {
                                  const isCurrent = isInCurrentMonth(date);
                                  const dateNum = date.getDate();
                                  const assigned = getStaffShiftForDate(date, profileStaffId);
                                  const cellRow = (active: boolean, label: string, color: string) => (
                                    <div className={`flex items-center justify-between rounded border px-2 py-0.5 text-[11px] ${active ? color : 'bg-slate-900/30 border-slate-700 text-slate-400'}`}>
                                      <span>{label}</span>
                                      {active && <span className="inline-flex items-center rounded-full px-2 py-0.5 border border-slate-600 bg-slate-900/40">✓</span>}
                                    </div>
                                  );
                                  return (
                                    <div key={di} className={`min-h-[110px] border-r border-slate-800 p-2 ${!isCurrent ? 'bg-slate-950/30 text-slate-500' : 'bg-slate-950'}`}>
                                      <div className="text-xs font-semibold text-slate-300 mb-1">{dateNum}</div>
                                      <div className="space-y-1">
                                        {cellRow(assigned === 'morning', (lang === 'ar' ? 'صباح' : 'Morning'), 'bg-green-900/10 border-green-800 text-green-300')}
                                        {cellRow(assigned === 'lateMorning', (lang === 'ar' ? 'صباح متأخر' : 'Late Morning'), 'bg-sky-900/10 border-sky-800 text-sky-300')}
                                        {cellRow(assigned === 'day', (lang === 'ar' ? 'نهار' : 'Day'), 'bg-amber-900/10 border-amber-800 text-amber-300')}
                                        {cellRow(assigned === 'night', (lang === 'ar' ? 'ليل' : 'Night'), 'bg-violet-900/10 border-violet-800 text-violet-300')}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Apologies Tab */}
            {profileTab === 'apologies' && (
              <div className="border border-slate-800 rounded p-3">
                <div className="text-sm font-semibold mb-2">{lang === 'ar' ? 'الاعتذارات' : 'Apologies'}</div>
                <div className="space-y-2 text-sm">
                  {profileApologies.length === 0 && <div className="text-slate-400">{lang === 'ar' ? 'لا يوجد' : 'None'}</div>}
                  {profileApologies.map((ap, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded px-2 py-1">
                      <span className="text-slate-300">{ap.date.slice(0,10)}</span>
                      <span className="text-slate-400">{ap.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patterns Manage Modal */}
      {showPatternsModal && (
        <div className={uiStyles.modalBackdrop}>
          <div className={`${uiStyles.modalCard} ${uiStyles.modalCardLarge}`} style={{ maxHeight: '80vh', overflow: 'hidden' }}>
            <div className={uiStyles.modalHeader}>
              <div className={uiStyles.modalHeaderLead}>
                <div className={uiStyles.modalHeaderIcon}><FiCalendar /></div>
                <div>
                  <div className={uiStyles.modalSubtitle}>{lang === 'ar' ? 'تخصيص الأنماط' : 'Pattern Assignment'}</div>
                  <div className={uiStyles.modalTitle}>{lang === 'ar' ? 'إدارة الأنماط' : 'Manage Patterns'}</div>
                </div>
                <span className={`${uiStyles.button} ${uiStyles.buttonGhost}`} style={{ pointerEvents: 'none', marginLeft: '12px' }}>
                  {patterns.find(p => p.code === managePatternCode)?.[lang === 'ar' ? 'name_ar' : 'name'] ?? managePatternCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="text-xs text-amber-400">
                    {lang === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved changes'}
                  </span>
                )}
                <button onClick={() => setShowPatternsModal(false)} className={uiStyles.modalClose}><FiX /></button>
              </div>
            </div>

      <div className={uiStyles.modalBody} style={{ paddingBottom: 0, overflow: 'hidden', flex: '1 1 auto' }}>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 h-full">
                <div className="border-r border-slate-800 flex flex-col min-h-0">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2">
                    <input
                      type="text"
                      value={manageSearchTerm}
                      onChange={(e) => setManageSearchTerm(e.target.value)}
                      className={uiStyles.fieldControl}
                      placeholder={lang === 'ar' ? 'ابحث باسم الموظف...' : 'Search employees...'}
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => setManageSelectedStaffIds(filteredManageStaff.map(s => s.id))}
                      className={`${uiStyles.button} ${uiStyles.buttonGhost}`}
                    >
                      {lang === 'ar' ? 'تحديد الكل' : 'Select All'}
                    </button>
                    <button
                      onClick={() => setManageSelectedStaffIds([])}
                      className={`${uiStyles.button} ${uiStyles.buttonGhost}`}
                    >
                      {lang === 'ar' ? 'إلغاء الكل' : 'Clear All'}
                    </button>
                  </div>

                  <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                    <span>
                      {lang === 'ar'
                        ? `المحددون: ${manageSelectedStaffIds.length}`
                        : `Selected: ${manageSelectedStaffIds.length}`}
                    </span>
                    <span>
                      {lang === 'ar'
                        ? `النتائج: ${filteredManageStaff.length}`
                        : `Results: ${filteredManageStaff.length}`}
                    </span>
                  </div>

                  <div className="flex-1 overflow-auto min-h-0" style={{ maxHeight: '300px' }}>
                    {filteredManageStaff.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-slate-500 text-center">
                        {lang === 'ar' ? 'لا يوجد موظفون بهذا البحث' : 'No employees match your search'}
                      </div>
                    ) : (
                      <div className="px-4 py-2">
                        <div className="space-y-2 max-w-[520px] mx-auto">
                          {filteredManageStaff.map((s) => {
                            const isSelected = manageSelectedStaffIds.includes(s.id);
                            const inOtherPattern = Boolean(s.pattern_code && s.pattern_code !== managePatternCode);
                            const patternLabel = s.pattern_code ? s.pattern_code.toUpperCase() : null;
                            return (
                              <label key={s.id} className={`flex items-center justify-between gap-3 px-3 py-2 rounded border border-slate-800 hover:bg-slate-900/60 transition ${isSelected ? 'bg-slate-900/70' : 'bg-slate-950'}`}>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    className="accent-green-600"
                                    checked={isSelected}
                                    onChange={() => toggleManageStaff(s.id)}
                                  />
                                  <div>
                                    <div className="font-medium text-slate-100">
                                      {lang === 'ar' ? (s.name_ar || s.name) : s.name}
                                    </div>
                                    <div className="text-xs text-slate-400">ID: {s.id}</div>
                                  </div>
                                </div>
                                {inOtherPattern && patternLabel && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-600 text-amber-300 bg-amber-900/20 text-xs">
                                    {patternLabel}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col h-full min-h-0">
                  <div className="border-b border-slate-800 px-4 py-3 bg-slate-900/40">
                    <div className="text-sm font-semibold text-slate-200 mb-2">
                      {lang === 'ar' ? 'الأنماط' : 'Patterns'}
                    </div>
                    <div className="space-y-2">
                      {patterns.map(p => {
                        const isActive = managePatternCode === p.code;
                        return (
                          <button
                            key={p.id}
                            onClick={() => openManagePattern(p.code)}
                            className={`w-full text-left px-3 py-2 rounded border transition ${isActive ? 'border-green-700 bg-green-900/20' : 'border-slate-800 bg-slate-900 hover:bg-slate-800/60'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-100">{lang === 'ar' ? (p.name_ar || p.name) : p.name}</span>
                              {isActive ? (
                                <span className="text-xs text-green-300">{lang === 'ar' ? 'محدد' : 'Active'}</span>
                              ) : (
                                <span className="text-xs text-slate-500">{lang === 'ar' ? 'تحديد' : 'Select'}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-800 px-4 py-3 bg-slate-900/70 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {hasUnsavedChanges
                        ? (lang === 'ar' ? 'هناك تغييرات غير محفوظة' : 'Unsaved changes pending')
                        : (lang === 'ar' ? 'لا توجد تغييرات' : 'No changes')}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setManageSelectedStaffIds(manageInitialIds); setManageSearchTerm(''); }}
                        className={`${uiStyles.button} ${uiStyles.buttonGhost}`}
                        disabled={!hasUnsavedChanges}
                      >
                        {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
                      </button>
                      <button
                        onClick={saveManagePattern}
                        disabled={manageSaving || !hasUnsavedChanges}
                        className={`${uiStyles.button} ${uiStyles.buttonPrimary}`}
                      >
                        {manageSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Schedule Modal */}
      {showAutoScheduleModal && (
        <div className={autoStyles.modalBackdrop}>
          <div className={autoStyles.modalWrapper}>
            <div className={autoStyles.modalHeader}>
              <div>
                <div className={autoStyles.headerMeta}>
                  <FiCalendar />
                  <span>{lang === 'ar' ? 'مساعد الجدولة' : 'Scheduling Assistant'}</span>
                </div>
                <h3 className={autoStyles.headerTitle}>
                  {lang === 'ar' ? 'اختر نطاق الجدولة' : 'Choose Scheduling Range'}
                </h3>
              </div>
              <button onClick={() => setShowAutoScheduleModal(false)} className={autoStyles.closeButton}><FiX /></button>
            </div>

            <div className={autoStyles.modalBody}>
              <div className={autoStyles.modeGrid}>
                {([
                  { key: 'month', label: lang === 'ar' ? 'الشهر الحالي' : 'Current Month', description: lang === 'ar' ? 'جدولة الشهر المحدد' : 'Schedule the selected month' },
                  { key: 'quarter', label: lang === 'ar' ? 'الربع' : 'Quarter', description: lang === 'ar' ? 'جدولة الربع الحالي' : 'Schedule the active quarter' },
                  { key: 'year', label: lang === 'ar' ? 'السنة' : 'Year', description: lang === 'ar' ? 'جدولة السنة كاملة' : 'Schedule the full year' },
                  { key: 'custom', label: lang === 'ar' ? 'نطاق مخصص' : 'Custom Range', description: lang === 'ar' ? 'حدد تواريخ مخصصة' : 'Choose your own dates' }
                ] as const).map(option => (
                  <button
                    key={option.key}
                    onClick={() => setAutoMode(option.key)}
                    className={`${autoStyles.modeCard} ${autoMode === option.key ? autoStyles.modeCardActive : ''}`}
                  >
                    <div className={autoStyles.modeTop}>
                      <span className={autoStyles.modeLabel}>{option.label}</span>
                    </div>
                    <span className={autoStyles.modeDescription}>{option.description}</span>
                  </button>
                ))}
              </div>

              {autoMode === 'custom' && (
                <div className={autoStyles.customRangeCard}>
                  <div className={autoStyles.sectionTitle}>{lang === 'ar' ? 'النطاق المخصص' : 'Custom Range'}</div>
                  <div className={autoStyles.dateGrid}>
                    <label className={autoStyles.dateField}>
                      <span>{lang === 'ar' ? 'من تاريخ' : 'Start Date'}</span>
                      <input type="date" value={customRange.start} onChange={e => setCustomRange(r => ({ ...r, start: e.target.value }))} />
                    </label>
                    <label className={autoStyles.dateField}>
                      <span>{lang === 'ar' ? 'إلى تاريخ' : 'End Date'}</span>
                      <input type="date" value={customRange.end} onChange={e => setCustomRange(r => ({ ...r, end: e.target.value }))} />
                    </label>
                  </div>
                </div>
              )}

              <div className={autoStyles.patternsCard}>
                <div className={autoStyles.patternsHeader}>
                  <span>{lang === 'ar' ? 'الأنماط المستهدفة' : 'Target Patterns'}</span>
                  <span>{selectedPatternCodes.length} {lang === 'ar' ? 'محدد' : 'selected'}</span>
                </div>
                <div className={autoStyles.patternsList}>
                  {patterns.length === 0 && (
                    <div className={autoStyles.emptyState}>{lang === 'ar' ? 'لا توجد أنماط' : 'No patterns available'}</div>
                  )}
                  {patterns.map(p => (
                    <label key={p.id} className={autoStyles.patternRow}>
                      <input type="checkbox" className={autoStyles.patternCheckbox} checked={selectedPatternCodes.includes(p.code)} onChange={() => togglePattern(p.code)} />
                      <span>{lang === 'ar' ? (p.name_ar || p.name) : p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={autoStyles.modalFooter}>
              <div className={autoStyles.footerHint}>
                {lang === 'ar'
                  ? 'اختر الفترة والأنماط، ثم اضغط جدولة للمتابعة.'
                  : 'Select the timeframe and patterns, then launch auto scheduling.'}
              </div>
              <div className={autoStyles.footerActions}>
                <button onClick={() => setShowAutoScheduleModal(false)} className={autoStyles.cancelButton}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    console.log('Auto-schedule button clicked, autoMode:', autoMode);
                    if (autoMode === 'custom') {
                      onAutoScheduleCustom();
                    } else {
                      void onAutoSchedule(autoMode);
                      setShowAutoScheduleModal(false);
                    }
                  }}
                  disabled={loading || (autoMode === 'custom' && (!customRange.start || !customRange.end))}
                  className={`${autoStyles.primaryButton} ${loading || (autoMode === 'custom' && (!customRange.start || !customRange.end)) ? autoStyles.primaryButtonDisabled : ''}`}
                >
                  {loading ? (lang === 'ar' ? 'جاري الجدولة...' : 'Scheduling...') : (lang === 'ar' ? 'بدء الجدولة' : 'Start Scheduling')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Schedule Modal */}
      {showClearModal && (
        <div className={uiStyles.modalBackdrop}>
          <div className={`${uiStyles.modalCard} ${uiStyles.modalCardSmall}`}>
            <div className={uiStyles.modalHeader}>
              <div className={uiStyles.modalHeaderLead}>
                <div className={uiStyles.modalHeaderIcon}><FiTrash2 /></div>
                <div>
                  <div className={uiStyles.modalSubtitle}>{lang === 'ar' ? 'إدارة الجداول' : 'Schedule Maintenance'}</div>
                  <div className={uiStyles.modalTitle}>{lang === 'ar' ? 'حذف الجدولة' : 'Clear Schedule'}</div>
                </div>
              </div>
              <button onClick={() => setShowClearModal(false)} className={uiStyles.modalClose}><FiX /></button>
            </div>

            <div className={uiStyles.modalBody}>
              <div className="flex flex-col gap-3">
                {([
                  { key: 'month', title: lang === 'ar' ? 'الشهر الحالي' : 'Current Month', description: lang === 'ar' ? 'حذف جدولة الشهر المحدد مع الحفاظ على بقية السنة.' : 'Remove assignments for the selected month only.' },
                  { key: 'quarter', title: lang === 'ar' ? 'الربع الحالي' : 'Current Quarter', description: lang === 'ar' ? 'حذف الجدولة للربع الحالي (3 أشهر).' : 'Clear the three-month quarter that includes the current month.' },
                  { key: 'year', title: lang === 'ar' ? 'السنة الحالية' : 'Current Year', description: lang === 'ar' ? 'حذف جميع الجداول للسنة المختارة.' : 'Remove all assignments for the active year.' }
                ] as const).map(option => (
                  <button
                    key={option.key}
                    onClick={() => setClearMode(option.key)}
                    className={`${uiStyles.button} ${uiStyles.buttonGhost}` + ` ${clearMode === option.key ? 'border-green-500/60 bg-green-500/10 text-green-100' : ''}`}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '14px 16px' }}
                  >
                    <span className="text-sm font-semibold">{option.title}</span>
                    <span className="mt-1 text-xs text-slate-400 leading-relaxed">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={uiStyles.modalFooter}>
              <button onClick={() => setShowClearModal(false)} className={`${uiStyles.button} ${uiStyles.buttonGhost}`}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button
                onClick={() => {
                  setShowClearModal(false);
                  onClear(clearMode);
                }}
                className={`${uiStyles.button} ${uiStyles.buttonDanger}`}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employees section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">{lang === 'ar' ? 'جميع الموظفين' : 'All Employees'}</h2>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{staffList.length} {lang === 'ar' ? 'موظف' : 'staff'}</span>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employeeList
            .slice()
            .sort((a, b) => (lang === 'ar' ? (a.name_ar || a.name).localeCompare(b.name_ar || b.name) : a.name.localeCompare(b.name)))
            .map((person) => {
              const counts = countsByEmployeeId.get(person.id) || { morning: 0, lateMorning: 0, day: 0, night: 0, total: 0 };
              const label = lang === 'ar' ? (person.name_ar || person.name) : person.name;
              return (
                <div
                  key={person.id}
                  className="group rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 hover:border-slate-600 hover:bg-slate-900/80 transition cursor-pointer shadow-[0px_18px_32px_rgba(8,47,73,0.18)]"
                  onClick={() => openProfile(person.id, label)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-500">ID: {person.id}</div>
                      <div className="mt-1 text-lg font-semibold text-slate-100 group-hover:text-white">{label}</div>
                      {person.job_title && (
                        <div className="text-xs text-slate-400 mt-1">{person.job_title}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-sm font-semibold text-slate-200">{counts.total}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <span className="inline-flex items-center justify-between rounded-lg border border-green-700/50 bg-green-900/20 px-3 py-2 text-green-200">
                      {lang === 'ar' ? 'صباح' : 'Morning'}
                      <b>{counts.morning}</b>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-lg border border-sky-700/50 bg-sky-900/20 px-3 py-2 text-sky-200">
                      {lang === 'ar' ? 'صباح متأخر' : 'Late Morning'}
                      <b>{counts.lateMorning}</b>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-lg border border-amber-700/50 bg-amber-900/20 px-3 py-2 text-amber-200">
                      {lang === 'ar' ? 'نهار' : 'Day'}
                      <b>{counts.day}</b>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-lg border border-violet-700/50 bg-violet-900/20 px-3 py-2 text-violet-200">
                      {lang === 'ar' ? 'ليل' : 'Night'}
                      <b>{counts.night}</b>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
