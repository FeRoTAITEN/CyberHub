"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang, useTheme } from "../../ClientLayout";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import {
  Cog6ToothIcon,
  ClockIcon,
  CalendarIcon,
  UserPlusIcon,
  UserMinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
  pattern_code?: string | null;
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

export default function SOCShiftManagement() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isSalam = theme === 'salam';
  
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [message, setMessage] = useState<string>("");
  const [viewMode, setViewMode] = useState<'month'|'quarter'|'year'>('month');

  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApologyModal, setShowApologyModal] = useState(false);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [showPatternsModal, setShowPatternsModal] = useState(false);
  const [showClearOptionsModal, setShowClearOptionsModal] = useState(false);
  const [clearCustomRange, setClearCustomRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayDetails, setDayDetails] = useState<DayDetails | null>(null);
  const [dayModalDate, setDayModalDate] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);
  const [profileStaffId, setProfileStaffId] = useState<number | null>(null);
  const [profileStaffName, setProfileStaffName] = useState<string>("");
  const [profileViewMode, setProfileViewMode] = useState<'month'|'quarter'|'year'>('month');
  const [profileYear, setProfileYear] = useState<number>(year);
  const [profileMonth, setProfileMonth] = useState<number>(month);
  const [profileTab, setProfileTab] = useState<'overview'|'schedule'|'apologies'>('schedule');
  const [profileStaffInfo, setProfileStaffInfo] = useState<any>(null);
  const [profileApologies, setProfileApologies] = useState<Array<{ id:number; date:string; reason:string }>>([]);
  
  // Form states
  const [assignForm, setAssignForm] = useState<{ date: string; shift_id: number; employee_id: number }>({ date: '', shift_id: 0, employee_id: 0 });
  const [apologyForm, setApologyForm] = useState<{ date: string; employee_id: number; reason: string; shift_id?: number }>({ date: '', employee_id: 0, reason: '' });
  
  // Data states
  const [staffList, setStaffList] = useState<Employee[]>([]);
  const [patterns, setPatterns] = useState<Array<{ id:number; code:string; name:string; name_ar?:string }>>([]);
  const [selectedPatternCodes, setSelectedPatternCodes] = useState<string[]>([]);

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
      
      const results = await Promise.all(
        monthsToFetch.map(({ y, m }) => fetch(`/api/shifts?year=${y}&month=${m}`).then(r => r.json()))
      );
      const combined = results.flatMap(r => r.assignments || []);
      setAssignments(combined);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  }, [year, month, viewMode]);

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

  const loadPatterns = useCallback(async () => {
    try {
      const res = await fetch('/api/shifts/patterns');
      const json = await res.json();
      setPatterns(Array.isArray(json?.patterns) ? json.patterns : []);
    } catch (error) {
      console.error('Error loading patterns:', error);
      setPatterns([]);
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
    } catch (error) {
      console.error('Error loading day details:', error);
      setDayDetails({ assignments: [], apologies: [] });
    }
  };

  const openDayModal = async (date: Date) => {
    const dateStr = toLocalKey(date);
    setDayModalDate(dateStr);
    await loadDay(dateStr);
    setShowDayModal(true);
  };

  const openProfile = async (employeeId: number, label: string) => {
    setProfileStaffId(employeeId);
    setProfileStaffName(label);
    setProfileYear(year);
    setProfileMonth(month);
    setProfileTab('schedule');
    setShowProfile(true);
    
    // Load staff details and apologies
    try {
      const infoRes = await fetch(`/api/employees/${employeeId}`);
      const info = await infoRes.json();
      setProfileStaffInfo(info);
    } catch (error) {
      console.error('Error loading staff info:', error);
    }
    
    try {
      const apRes = await fetch(`/api/shifts/availability?employeeId=${employeeId}&year=${year}&month=${month}`);
      const apJson = await apRes.json();
      const aps = (apJson?.availability || []).map((a: any) => ({ id: a.id, date: a.date, reason: a.reason }));
      setProfileApologies(aps);
    } catch (error) {
      console.error('Error loading apologies:', error);
    }
  };

  const profileMonthLabel = useMemo(() => {
    return new Date(profileYear, profileMonth - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  }, [profileYear, profileMonth, lang]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    loadStaff();
    loadPatterns();
  }, [loadPatterns]);

  const calendar = useMemo(() => {
    const map = new Map<string, Map<number, Assignment[]>>();
    for (const a of assignments) {
      const dt = new Date(a.date as any);
      const d = toLocalKey(dt);
      if (!map.has(d)) map.set(d, new Map());
      const inner = map.get(d)!;
      if (!inner.has(a.shift.id)) inner.set(a.shift.id, []);
      inner.get(a.shift.id)!.push(a);
    }
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
    return all;
  };

  // Navigation functions
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

  // Management functions
  const onAutoSchedule = async (reqMode: 'month'|'quarter'|'year' = 'month') => {
    setLoading(true);
    setMessage("");
    try {
      const body: any = { year, month, mode: reqMode };
      if (selectedPatternCodes.length > 0) body.patterns = selectedPatternCodes;
      const res = await fetch(`/api/shifts/auto-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || (lang === 'ar' ? 'فشل جدولة المناوبات' : 'Failed to auto-schedule'));
      } else {
        setMessage(lang === 'ar' ? 'تمت الجدولة بنجاح' : 'Auto-scheduled successfully');
        await loadAssignments();
      }
    } catch (error) {
      console.error('Error in auto-scheduling:', error);
      setMessage(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error');
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
      }
    } finally { setLoading(false); }
  };

  const togglePattern = (code: string) => {
    setSelectedPatternCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const updateEmployeePattern = async (employeeId: number, patternCode: string | null) => {
    try {
      const res = await fetch('/api/employees/pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, patternCode })
      });
      
      if (res.ok) {
        // Update local state
        setStaffList(prev => prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, pattern_code: patternCode }
            : emp
        ));
        setMessage(lang === 'ar' ? 'تم تحديث النمط بنجاح' : 'Pattern updated successfully');
      } else {
        setMessage(lang === 'ar' ? 'فشل في تحديث النمط' : 'Failed to update pattern');
      }
    } catch (error) {
      console.error('Error updating pattern:', error);
      setMessage(lang === 'ar' ? 'حدث خطأ في تحديث النمط' : 'Error updating pattern');
    }
  };

  const deleteAssignment = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shifts/assignments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
        if (dayModalDate) await loadDay(dayModalDate);
        setMessage(lang === 'ar' ? 'تم حذف التعيين' : 'Assignment deleted');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setMessage(lang === 'ar' ? 'فشل في حذف التعيين' : 'Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const deleteApology = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shifts/availability?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAssignments();
        if (dayModalDate) await loadDay(dayModalDate);
        setMessage(lang === 'ar' ? 'تم حذف الاعتذار' : 'Apology deleted');
      }
    } catch (error) {
      console.error('Error deleting apology:', error);
      setMessage(lang === 'ar' ? 'فشل في حذف الاعتذار' : 'Failed to delete apology');
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Error clearing day assignments:', error);
      setMessage(lang === 'ar' ? 'فشل في حذف تعيينات اليوم' : 'Failed to clear day assignments');
    } finally {
      setLoading(false);
    }
  };

  // Clear schedule functions
  const clearSchedule = async (mode: 'month' | 'quarter' | 'year' | 'custom') => {
    const confirmMessage = mode === 'month' 
      ? (lang === 'ar' ? 'حذف جميع تعيينات الشهر؟' : 'Clear all assignments for this month?')
      : mode === 'quarter'
      ? (lang === 'ar' ? 'حذف جميع تعيينات الربع؟' : 'Clear all assignments for this quarter?')
      : mode === 'year'
      ? (lang === 'ar' ? 'حذف جميع تعيينات السنة؟' : 'Clear all assignments for this year?')
      : (lang === 'ar' ? 'حذف جميع التعيينات في الفترة المحددة؟' : 'Clear all assignments in the specified range?');

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    setMessage("");
    try {
      const body: any = { year, month };
      
      if (mode === 'quarter') {
        const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
        body.startMonth = startMonth;
        body.endMonth = startMonth + 2;
      } else if (mode === 'year') {
        body.startMonth = 1;
        body.endMonth = 12;
      } else if (mode === 'custom') {
        if (!clearCustomRange.start || !clearCustomRange.end) {
          setMessage(lang === 'ar' ? 'يرجى تحديد الفترة المخصصة' : 'Please specify custom range');
          return;
        }
        body.startDate = clearCustomRange.start;
        body.endDate = clearCustomRange.end;
      }

      const res = await fetch('/api/shifts/clear-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || (lang === 'ar' ? 'فشل في حذف التعيينات' : 'Failed to clear assignments'));
      } else {
        setMessage(lang === 'ar' ? 'تم حذف التعيينات بنجاح' : 'Assignments cleared successfully');
        await loadAssignments();
        setShowClearOptionsModal(false);
      }
    } catch (error) {
      console.error('Error clearing schedule:', error);
      setMessage(lang === 'ar' ? 'حدث خطأ في حذف التعيينات' : 'Error clearing assignments');
    } finally {
      setLoading(false);
    }
  };

  // Profile navigation functions
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
      } else {
        setProfileMonth(prevStart);
        setMonth(prevStart);
      }
    } else {
      setProfileYear(y => y - 1);
      setYear(y => y - 1);
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
      } else {
        setProfileMonth(nextStart);
        setMonth(nextStart);
      }
    } else {
      setProfileYear(y => y + 1);
      setYear(y => y + 1);
    }
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

  // Shift row component with improved styling
  const shiftRow = (label: string, color: 'green' | 'sky' | 'amber' | 'violet', count: number) => {
    const alert = count < 2;
    const base = 'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200';
    const okCls = color === 'green'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300'
      : color === 'sky'
      ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-700 dark:text-sky-300'
      : color === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
      : 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-700 dark:text-violet-300';
    const alertCls = 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300';
    
    return (
      <div className={`${base} ${alert ? alertCls : okCls}`}>
        <span className="truncate">{label}</span>
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
          alert 
            ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200' 
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {count}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Enhanced Header with Management Buttons */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isSalam ? 'bg-white border border-[#003931]' : 'card'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSalam ? 'bg-[#00F000]' : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                {lang === 'ar' ? 'إدارة المناوبات' : 'Shift Management'}
              </h2>
              <p className={`${
                isSalam ? 'text-[#005147]' : 'text-slate-400'
              }`}>
                {monthLabel}
              </p>
            </div>
          </div>
          
          {/* Management Buttons */}
          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isSalam 
                  ? 'bg-white border border-[#003931] text-[#003931]' 
                  : 'bg-slate-800 border border-slate-600 text-gray-300'
              }`}
            >
              <option value="month">{lang === 'ar' ? 'شهر' : 'Month'}</option>
              <option value="quarter">{lang === 'ar' ? 'ربع' : 'Quarter'}</option>
              <option value="year">{lang === 'ar' ? 'سنة' : 'Year'}</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className={`p-2 rounded-lg transition-colors ${
                  isSalam 
                    ? 'bg-[#EEFDEC] hover:bg-[#E0F5DC] text-[#003931]' 
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                }`}
                title={lang === 'ar' ? 'السابق' : 'Previous'}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className={`p-2 rounded-lg transition-colors ${
                  isSalam 
                    ? 'bg-[#EEFDEC] hover:bg-[#E0F5DC] text-[#003931]' 
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                }`}
                title={lang === 'ar' ? 'التالي' : 'Next'}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => { setShowAssignModal(true); setAssignForm({ date: `${year}-${String(month).padStart(2,'0')}-01`, shift_id: 0, employee_id: 0 }); }}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSalam 
                ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <UserPlusIcon className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'تعيين موظف' : 'Assign Staff'}
          </button>
          
          <button
            onClick={() => { setShowApologyModal(true); setApologyForm({ date: `${year}-${String(month).padStart(2,'0')}-01`, employee_id: 0, reason: '', shift_id: undefined }); }}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSalam 
                ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <UserMinusIcon className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'سجل اعتذار' : 'Log Apology'}
          </button>
          
          <button
            onClick={() => setShowAutoScheduleModal(true)}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : isSalam 
                  ? 'bg-[#4ECDC4] text-white hover:bg-[#45B7B8]' 
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <ClockIcon className="w-4 h-4 mr-2" />
            {loading ? (lang === 'ar' ? 'جاري...' : 'Scheduling...') : (lang === 'ar' ? 'جدولة تلقائية' : 'Auto-Schedule')}
          </button>
          
          <button
            onClick={() => setShowPatternsModal(true)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSalam 
                ? 'bg-[#A8E6CF] text-[#003931] hover:bg-[#96E0C4]' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Cog6ToothIcon className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'إدارة الأنماط' : 'Manage Patterns'}
          </button>
          
          <button
            onClick={() => setShowClearOptionsModal(true)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSalam 
                ? 'bg-[#FFB74D] text-white hover:bg-[#FFA726]' 
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'حذف الجدولة' : 'Clear Schedule'}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            isSalam ? 'bg-[#EEFDEC] border border-[#00F000] text-[#003931]' : 'bg-slate-800 border border-slate-700 text-slate-300'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className={`ml-3 ${
            isSalam ? 'text-[#005147]' : 'text-slate-400'
          }`}>
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </span>
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && (
        <div className="overflow-x-auto">
          <div className={`flex gap-6 snap-x snap-mandatory ${viewMode === 'month' ? 'justify-center' : ''}`}>
            {(() => {
              const monthsToRender: Array<{ y: number; m: number }> = [];
              if (viewMode === 'month') monthsToRender.push({ y: year, m: month });
              else if (viewMode === 'quarter') {
                const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
                for (let i = 0; i < 3; i++) monthsToRender.push({ y: year, m: startMonth + i });
              } else {
                for (let m = 1; m <= 12; m++) monthsToRender.push({ y: year, m });
              }
              
              return monthsToRender.map(({ y, m }) => {
                const { weeks, isInCurrentMonth } = buildWeeks(y, m);
                const label = new Date(y, m - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
                return (
                  <div key={`${y}-${m}`} className={`min-w-[900px] snap-start rounded-2xl overflow-hidden shadow-sm ${
                    isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
                  }`}>
                    {/* Month Header */}
                    <div className={`px-6 py-4 ${
                      isSalam ? 'bg-[#00F000]' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      <h3 className="text-lg font-semibold text-white">{label}</h3>
                    </div>
                    
                    {/* Weekday Headers */}
                    <div className={`grid grid-cols-7 ${
                      isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-800'
                    }`}>
                      {weekdayLabels.map((w, idx) => (
                        <div key={idx} className={`px-4 py-3 text-center text-sm font-medium border-r ${
                          isSalam 
                            ? 'text-[#003931] border-[#00F000]' 
                            : 'text-gray-300 border-slate-700'
                        } last:border-r-0`}>
                          {w}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className={`divide-y ${
                      isSalam ? 'divide-[#00F000]' : 'divide-slate-700'
                    }`}>
                      {weeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7">
                          {week.map((date, di) => {
                            const isCurrent = isInCurrentMonth(date);
                            const dateNum = date.getDate();
                            const isToday = date.toDateString() === new Date().toDateString();
                            
                            if (!isCurrent && (viewMode === 'month' || viewMode === 'quarter')) {
                              return (
                                <div key={di} className={`min-h-[140px] border-r p-3 ${
                                  isSalam 
                                    ? 'bg-[#F8FDF8] border-[#00F000]' 
                                    : 'bg-slate-800/50 border-slate-700'
                                }`} />
                              );
                            }
                            
                            const morning = getShiftItems(date, s => (s.name.toLowerCase() === 'morning' || s.name_ar === 'صباح'));
                            const dayShift = getShiftItems(date, s => (s.name.toLowerCase() === 'day' || s.name_ar === 'نهار'));
                            const night = getShiftItems(date, s => (s.name.toLowerCase() === 'night' || s.name_ar === 'ليل'));
                            const lateMorning = getShiftItems(date, s => (s.name.toLowerCase() === 'late morning' || s.name_ar === 'صباح متأخر'));
                            
                            return (
                              <div key={di} onClick={() => openDayModal(date)} className={`min-h-[140px] border-r p-3 transition-colors hover:bg-opacity-50 cursor-pointer ${
                                isSalam 
                                  ? 'bg-white hover:bg-[#EEFDEC] border-[#00F000]' 
                                  : 'bg-slate-900 hover:bg-slate-800/50 border-slate-700'
                              } last:border-r-0`}>
                                {/* Date Number */}
                                <div className={`text-sm font-semibold mb-3 ${
                                  isToday 
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : isCurrent 
                                      ? (isSalam ? 'text-[#003931]' : 'text-white')
                                      : (isSalam ? 'text-[#005147]' : 'text-gray-500')
                                }`}>
                                  {dateNum}
                                </div>
                                
                                {/* Shift Rows */}
                                <div className="flex flex-col gap-2">
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
              });
            })()}
          </div>
        </div>
      )}

      {/* Employees Section */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isSalam ? 'bg-white border border-[#003931]' : 'card'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            isSalam ? 'text-[#003931]' : 'text-white'
          }`}>
            {lang === 'ar' ? 'الموظفين' : 'Employees'}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isSalam 
              ? 'bg-[#00F000] text-[#003931]' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          }`}>
            {staffList.length} {lang === 'ar' ? 'موظف' : 'staff'}
          </span>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {staffList
            .slice()
            .sort((a, b) => (lang === 'ar' ? (a.name_ar || a.name).localeCompare(b.name_ar || b.name) : a.name.localeCompare(b.name)))
            .map((person) => {
              const counts = countsByEmployeeId.get(person.id) || { morning: 0, lateMorning: 0, day: 0, night: 0, total: 0 };
              const label = lang === 'ar' ? (person.name_ar || person.name) : person.name;
              
              return (
                <div
                  key={person.id}
                  className={`group rounded-xl p-4 transition-colors border ${
                    isSalam 
                      ? 'bg-[#F8FDF8] hover:bg-[#EEFDEC] border-[#00F000]' 
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  {/* Employee Info */}
                  <div className="mb-4">
                    <div className={`text-xs mb-1 ${
                      isSalam ? 'text-[#005147]' : 'text-gray-400'
                    }`}>ID: {person.id}</div>
                    <button
                      onClick={() => openProfile(person.id, label)}
                      className={`font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline cursor-pointer ${
                        isSalam ? 'text-[#003931]' : 'text-white'
                      }`}
                    >
                      {label}
                    </button>
                    {person.job_title && (
                      <p className={`text-sm mt-1 ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>{person.job_title}</p>
                    )}
                  </div>
                  
                  {/* Total Shifts */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm ${
                      isSalam ? 'text-[#005147]' : 'text-gray-400'
                    }`}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className={`text-lg font-bold ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>{counts.total}</span>
                  </div>
                  
                  {/* Shift Breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isSalam 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-emerald-900/20 text-emerald-300'
                    }`}>
                      <span className="text-xs">{lang === 'ar' ? 'صباح' : 'Morning'}</span>
                      <span className={`text-sm font-bold ${
                        isSalam ? 'text-emerald-600' : 'text-emerald-400'
                      }`}>{counts.morning}</span>
                    </div>
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isSalam 
                        ? 'bg-sky-50 text-sky-700' 
                        : 'bg-sky-900/20 text-sky-300'
                    }`}>
                      <span className="text-xs">{lang === 'ar' ? 'صباح متأخر' : 'Late Morning'}</span>
                      <span className={`text-sm font-bold ${
                        isSalam ? 'text-sky-600' : 'text-sky-400'
                      }`}>{counts.lateMorning}</span>
                    </div>
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isSalam 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-amber-900/20 text-amber-300'
                    }`}>
                      <span className="text-xs">{lang === 'ar' ? 'نهار' : 'Day'}</span>
                      <span className={`text-sm font-bold ${
                        isSalam ? 'text-amber-600' : 'text-amber-400'
                      }`}>{counts.day}</span>
                    </div>
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isSalam 
                        ? 'bg-violet-50 text-violet-700' 
                        : 'bg-violet-900/20 text-violet-300'
                    }`}>
                      <span className="text-xs">{lang === 'ar' ? 'ليل' : 'Night'}</span>
                      <span className={`text-sm font-bold ${
                        isSalam ? 'text-violet-600' : 'text-violet-400'
                      }`}>{counts.night}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-4 ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                {lang === 'ar' ? 'تعيين موظف' : 'Assign Staff'}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className={`p-2 rounded-lg ${
                  isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                }`}
              >
                <FiX className={`w-5 h-5 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-400'
                }`} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={assignForm.date}
                  onChange={e => setAssignForm(f => ({ ...f, date: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'المناوبة' : 'Shift'}
                </label>
                <select
                  value={assignForm.shift_id}
                  onChange={e => setAssignForm(f => ({ ...f, shift_id: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                >
                  <option value={0}>--</option>
                  <option value={1}>{lang === 'ar' ? 'صباح' : 'Morning'}</option>
                  <option value={2}>{lang === 'ar' ? 'نهار' : 'Day'}</option>
                  <option value={3}>{lang === 'ar' ? 'ليل' : 'Night'}</option>
                  <option value={4}>{lang === 'ar' ? 'صباح متأخر' : 'Late Morning'}</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الموظف' : 'Staff'}
                </label>
                <select
                  value={assignForm.employee_id}
                  onChange={e => setAssignForm(f => ({ ...f, employee_id: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                >
                  <option value={0}>--</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'ar' ? (s.name_ar || s.name) : s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isSalam 
                    ? 'bg-gray-100 text-[#003931] hover:bg-gray-200' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={submitAssign}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isSalam 
                    ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {lang === 'ar' ? 'تعيين' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apology Modal */}
      {showApologyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-4 ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                {lang === 'ar' ? 'سجل اعتذار' : 'Log Apology'}
              </h3>
              <button
                onClick={() => setShowApologyModal(false)}
                className={`p-2 rounded-lg ${
                  isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                }`}
              >
                <FiX className={`w-5 h-5 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-400'
                }`} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={apologyForm.date}
                  onChange={e => setApologyForm(f => ({ ...f, date: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الموظف' : 'Staff'}
                </label>
                <select
                  value={apologyForm.employee_id}
                  onChange={e => setApologyForm(f => ({ ...f, employee_id: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                >
                  <option value={0}>--</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'ar' ? (s.name_ar || s.name) : s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'السبب' : 'Reason'}
                </label>
                <input
                  type="text"
                  value={apologyForm.reason}
                  onChange={e => setApologyForm(f => ({ ...f, reason: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSalam 
                      ? 'bg-white border-[#003931] text-[#003931]' 
                      : 'bg-slate-800 border-slate-600 text-white'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApologyModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isSalam 
                    ? 'bg-gray-100 text-[#003931] hover:bg-gray-200' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={submitApology}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isSalam 
                    ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Schedule Modal */}
      {showAutoScheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-4 ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                {lang === 'ar' ? 'جدولة تلقائية' : 'Auto-Schedule'}
              </h3>
              <button
                onClick={() => setShowAutoScheduleModal(false)}
                className={`p-2 rounded-lg ${
                  isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                }`}
              >
                <FiX className={`w-5 h-5 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-400'
                }`} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'النطاق' : 'Range'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onAutoSchedule('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isSalam 
                        ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {lang === 'ar' ? 'شهر' : 'Month'}
                  </button>
                  <button
                    onClick={() => onAutoSchedule('quarter')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isSalam 
                        ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {lang === 'ar' ? 'ربع' : 'Quarter'}
                  </button>
                  <button
                    onClick={() => onAutoSchedule('year')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isSalam 
                        ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {lang === 'ar' ? 'سنة' : 'Year'}
                  </button>
                </div>
              </div>
              
              {patterns.length > 0 && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isSalam ? 'text-[#003931]' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'الأنماط (اختياري)' : 'Patterns (optional)'}
                  </label>
                  <div className="flex flex-col gap-2">
                    {patterns.map(p => (
                      <label key={p.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPatternCodes.includes(p.code)}
                          onChange={() => togglePattern(p.code)}
                          className="mr-2"
                        />
                        <span className={`text-sm ${
                          isSalam ? 'text-[#003931]' : 'text-gray-300'
                        }`}>
                          {lang === 'ar' ? (p.name_ar || p.name) : p.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Patterns Modal */}
      {showPatternsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isSalam ? 'border-[#00F000]' : 'border-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'إدارة أنماط المناوبات' : 'Shift Patterns Management'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isSalam ? 'text-[#005147]' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? 'تخصيص وتعديل أنماط المناوبات للموظفين' : 'Customize and modify shift patterns for employees'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPatternsModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                  }`}
                >
                  <FiX className={`w-6 h-6 ${
                    isSalam ? 'text-[#003931]' : 'text-gray-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patterns List */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'الأنماط المتاحة' : 'Available Patterns'}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {patterns.map(p => {
                      const employeesInPattern = staffList.filter(s => s.pattern_code === p.code);
                      return (
                        <div key={p.id} className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          isSalam 
                            ? 'bg-[#F8FDF8] border-[#00F000] hover:bg-[#EEFDEC]' 
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className={`font-semibold ${
                                isSalam ? 'text-[#003931]' : 'text-white'
                              }`}>
                                {lang === 'ar' ? (p.name_ar || p.name) : p.name}
                              </h5>
                              <p className={`text-sm ${
                                isSalam ? 'text-[#005147]' : 'text-gray-400'
                              }`}>
                                {lang === 'ar' ? 'كود النمط' : 'Pattern Code'}: {p.code}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isSalam 
                                ? 'bg-[#00F000] text-[#003931]' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {employeesInPattern.length} {lang === 'ar' ? 'موظف' : 'employees'}
                            </div>
                          </div>
                          
                          {/* Employees in this pattern */}
                          <div className="mt-3">
                            <p className={`text-xs font-medium mb-2 ${
                              isSalam ? 'text-[#005147]' : 'text-gray-400'
                            }`}>
                              {lang === 'ar' ? 'الموظفين في هذا النمط' : 'Employees in this pattern'}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {employeesInPattern.length === 0 ? (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  isSalam 
                                    ? 'bg-gray-100 text-gray-500' 
                                    : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {lang === 'ar' ? 'لا يوجد موظفين' : 'No employees'}
                                </span>
                              ) : (
                                employeesInPattern.map(emp => (
                                  <span key={emp.id} className={`text-xs px-2 py-1 rounded ${
                                    isSalam 
                                      ? 'bg-[#E0F5DC] text-[#003931]' 
                                      : 'bg-slate-700 text-slate-300'
                                  }`}>
                                    {lang === 'ar' ? (emp.name_ar || emp.name) : emp.name}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Employee Assignment */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'تخصيص الأنماط' : 'Assign Patterns'}
                  </h4>
                  
                  {/* Pattern Selection */}
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-300'
                    }`}>
                      {lang === 'ar' ? 'اختر النمط' : 'Select Pattern'}
                    </label>
                    <select
                      value={selectedPatternCodes[0] || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedPatternCodes([e.target.value]);
                        } else {
                          setSelectedPatternCodes([]);
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSalam 
                          ? 'bg-white border-[#003931] text-[#003931]' 
                          : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    >
                      <option value="">{lang === 'ar' ? '-- اختر النمط --' : '-- Select Pattern --'}</option>
                      {patterns.map(p => (
                        <option key={p.id} value={p.code}>
                          {lang === 'ar' ? (p.name_ar || p.name) : p.name} ({p.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Employee List */}
                  <div className="flex flex-col gap-3">
                    <h5 className={`text-sm font-medium ${
                      isSalam ? 'text-[#003931]' : 'text-gray-300'
                    }`}>
                      {lang === 'ar' ? 'الموظفين' : 'Employees'}
                    </h5>
                    <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                      {staffList.map(emp => (
                        <div key={emp.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                          emp.pattern_code === selectedPatternCodes[0]
                            ? isSalam 
                              ? 'bg-[#E0F5DC] border-[#00F000]' 
                              : 'bg-blue-900/20 border-blue-600'
                            : isSalam 
                              ? 'bg-[#F8FDF8] border-[#00F000] hover:bg-[#EEFDEC]' 
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${
                                isSalam ? 'text-[#003931]' : 'text-white'
                              }`}>
                                {lang === 'ar' ? (emp.name_ar || emp.name) : emp.name}
                              </p>
                              <p className={`text-xs ${
                                isSalam ? 'text-[#005147]' : 'text-gray-400'
                              }`}>
                                ID: {emp.id} {emp.job_title && `• ${emp.job_title}`}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {emp.pattern_code && (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  isSalam 
                                    ? 'bg-[#00F000] text-[#003931]' 
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                }`}>
                                  {emp.pattern_code}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  if (!selectedPatternCodes[0]) {
                                    setMessage(lang === 'ar' ? 'يرجى اختيار نمط أولاً' : 'Please select a pattern first');
                                    return;
                                  }
                                  // Toggle pattern assignment
                                  const newPattern = emp.pattern_code === selectedPatternCodes[0] ? null : selectedPatternCodes[0];
                                  updateEmployeePattern(emp.id, newPattern);
                                }}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  emp.pattern_code === selectedPatternCodes[0]
                                    ? isSalam 
                                      ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                                      : 'bg-red-600 text-white hover:bg-red-700'
                                    : isSalam 
                                      ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {emp.pattern_code === selectedPatternCodes[0] 
                                  ? (lang === 'ar' ? 'إزالة' : 'Remove')
                                  : (lang === 'ar' ? 'تعيين' : 'Assign')
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className={`mt-6 p-4 rounded-lg ${
                    isSalam ? 'bg-[#F8FDF8] border border-[#00F000]' : 'bg-slate-800 border border-slate-700'
                  }`}>
                    <h5 className={`text-sm font-medium mb-2 ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      {lang === 'ar' ? 'ملخص التوزيع' : 'Distribution Summary'}
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {patterns.map(p => {
                        const count = staffList.filter(s => s.pattern_code === p.code).length;
                        return (
                          <div key={p.id} className="flex justify-between">
                            <span className={isSalam ? 'text-[#005147]' : 'text-gray-400'}>
                              {p.code}:
                            </span>
                            <span className={isSalam ? 'text-[#003931]' : 'text-white'}>
                              {count} {lang === 'ar' ? 'موظف' : 'employees'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${
              isSalam ? 'border-[#00F000]' : 'border-slate-700'
            }`}>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPatternsModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSalam 
                      ? 'bg-gray-100 text-[#003931] hover:bg-gray-200' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    // Save pattern assignments
                    console.log('Saving pattern assignments...');
                    setShowPatternsModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSalam 
                      ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {showDayModal && dayDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isSalam ? 'border-[#00F000]' : 'border-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'تفاصيل اليوم' : 'Day Details'} — {dayModalDate}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isSalam ? 'text-[#005147]' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? 'إدارة المناوبات والاعتذارات لهذا اليوم' : 'Manage shifts and apologies for this day'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => clearDayAssignments(dayModalDate)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      isSalam 
                        ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    {lang === 'ar' ? 'حذف اليوم' : 'Clear Day'}
                  </button>
                  <button
                    onClick={() => { setShowAssignModal(true); setAssignForm({ date: dayModalDate, shift_id: 0, employee_id: 0 }); }}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      isSalam 
                        ? 'bg-[#00F000] text-[#003931] hover:bg-[#00E000]' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    {lang === 'ar' ? 'تعيين' : 'Assign'}
                  </button>
                  <button
                    onClick={() => { setShowApologyModal(true); setApologyForm({ date: dayModalDate, employee_id: 0, reason: '', shift_id: undefined }); }}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      isSalam 
                        ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <UserMinusIcon className="w-4 h-4 mr-2" />
                    {lang === 'ar' ? 'اعتذار' : 'Apology'}
                  </button>
                  <button
                    onClick={() => setShowDayModal(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                    }`}
                  >
                    <FiX className={`w-6 h-6 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-400'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shifts */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'المناوبات' : 'Shifts'}
                  </h4>
                  <div className="flex flex-col gap-4">
                    {(['morning','lateMorning','day','night'] as const).map((key) => {
                      const title = key === 'morning' ? (lang === 'ar' ? 'صباح' : 'Morning') 
                        : key === 'lateMorning' ? (lang === 'ar' ? 'صباح متأخر' : 'Late Morning')
                        : key === 'day' ? (lang === 'ar' ? 'نهار' : 'Day') 
                        : (lang === 'ar' ? 'ليل' : 'Night');
                      
                      const items = dayDetails.assignments.filter(a => {
                        const n = a.shift.name.toLowerCase();
                        const ar = a.shift.name_ar;
                        return (key === 'morning' && (n === 'morning' || ar === 'صباح')) 
                          || (key === 'lateMorning' && (n === 'late morning' || ar === 'صباح متأخر')) 
                          || (key === 'day' && (n === 'day' || ar === 'نهار')) 
                          || (key === 'night' && (n === 'night' || ar === 'ليل'));
                      });
                      
                      return (
                        <div key={key} className={`p-4 rounded-lg border ${
                          isSalam 
                            ? 'bg-[#F8FDF8] border-[#00F000]' 
                            : 'bg-slate-800 border-slate-700'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className={`font-semibold ${
                              isSalam ? 'text-[#003931]' : 'text-white'
                            }`}>
                              {title}
                            </h5>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isSalam 
                                ? 'bg-[#00F000] text-[#003931]' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {items.length} {lang === 'ar' ? 'موظف' : 'staff'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            {items.length === 0 ? (
                              <span className={`text-sm ${
                                isSalam ? 'text-[#005147]' : 'text-gray-400'
                              }`}>
                                {lang === 'ar' ? 'لا يوجد موظفين' : 'No employees assigned'}
                              </span>
                            ) : (
                              items.map((a, idx) => {
                                const label = lang === 'ar' ? (a.employee.name_ar || a.employee.name) : a.employee.name;
                                return (
                                  <div key={idx} className={`flex items-center justify-between p-2 rounded border ${
                                    isSalam 
                                      ? 'bg-white border-[#00F000]' 
                                      : 'bg-slate-700 border-slate-600'
                                  }`}>
                                    <span className={`font-medium ${
                                      isSalam ? 'text-[#003931]' : 'text-white'
                                    }`}>
                                      <button
                                        onClick={() => openProfile(a.employee.id, label)}
                                        className="hover:underline cursor-pointer"
                                      >
                                        {label}
                                      </button>
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {a.status !== 'assigned' && (
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          isSalam 
                                            ? 'bg-yellow-100 text-yellow-600' 
                                            : 'bg-yellow-900/30 text-yellow-400'
                                        }`}>
                                          {a.status}
                                        </span>
                                      )}
                                      <button 
                                        onClick={() => deleteAssignment(a.id!)}
                                        className={`p-1 rounded transition-colors ${
                                          isSalam 
                                            ? 'text-red-600 hover:bg-red-100' 
                                            : 'text-red-400 hover:bg-red-900/30'
                                        }`}
                                        title={lang === 'ar' ? 'حذف التعيين' : 'Delete assignment'}
                                      >
                                        <FiX className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Apologies */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'الاعتذارات' : 'Apologies'}
                  </h4>
                  <div className={`p-4 rounded-lg border ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000]' 
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <div className="flex flex-col gap-3">
                      {dayDetails.apologies.length === 0 ? (
                        <span className={`text-sm ${
                          isSalam ? 'text-[#005147]' : 'text-gray-400'
                        }`}>
                          {lang === 'ar' ? 'لا يوجد اعتذارات' : 'No apologies'}
                        </span>
                      ) : (
                        dayDetails.apologies.map((ap, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded border ${
                            isSalam 
                              ? 'bg-white border-[#00F000]' 
                              : 'bg-slate-700 border-slate-600'
                          }`}>
                            <div>
                              <p className={`font-medium ${
                                isSalam ? 'text-[#003931]' : 'text-white'
                              }`}>
                                {lang === 'ar' ? (ap.employee.name_ar || ap.employee.name) : ap.employee.name}
                              </p>
                              {ap.reason && (
                                <p className={`text-sm mt-1 ${
                                  isSalam ? 'text-[#005147]' : 'text-gray-400'
                                }`}>
                                  {ap.reason}
                                </p>
                              )}
                            </div>
                            <button 
                              onClick={() => deleteApology(ap.id)}
                              className={`p-1 rounded transition-colors ${
                                isSalam 
                                  ? 'text-red-600 hover:bg-red-100' 
                                  : 'text-red-400 hover:bg-red-900/30'
                              }`}
                              title={lang === 'ar' ? 'حذف الاعتذار' : 'Delete apology'}
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {showProfile && profileStaffId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
          <div className={`rounded-xl shadow-xl w-[980px] max-h-[85vh] overflow-auto flex flex-col gap-4 ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-950 border border-slate-800'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isSalam ? 'border-[#00F000]' : 'border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCalendar className={`w-6 h-6 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'ملف الموظف' : 'Employee Profile'} — {profileStaffName} ({profileMonthLabel})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevProfile}
                    className={`p-2 rounded-lg transition-colors ${
                      isSalam 
                        ? 'bg-[#EEFDEC] hover:bg-[#E0F5DC] text-[#003931]' 
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    }`}
                    title={lang === 'ar' ? 'السابق' : 'Previous'}
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <select
                    value={profileViewMode}
                    onChange={(e) => setProfileViewMode(e.target.value as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isSalam 
                        ? 'bg-white border border-[#003931] text-[#003931]' 
                        : 'bg-slate-800 border border-slate-600 text-gray-300'
                    }`}
                  >
                    <option value="month">{lang === 'ar' ? 'شهر' : 'Month'}</option>
                    <option value="quarter">{lang === 'ar' ? 'ربع' : 'Quarter'}</option>
                    <option value="year">{lang === 'ar' ? 'سنة' : 'Year'}</option>
                  </select>
                  <button
                    onClick={handleNextProfile}
                    className={`p-2 rounded-lg transition-colors ${
                      isSalam 
                        ? 'bg-[#EEFDEC] hover:bg-[#E0F5DC] text-[#003931]' 
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    }`}
                    title={lang === 'ar' ? 'التالي' : 'Next'}
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowProfile(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                    }`}
                  >
                    <FiX className={`w-5 h-5 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-400'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={`px-6 pb-4 border-b ${
              isSalam ? 'border-[#00F000]' : 'border-slate-800'
            }`}>
              <div className="flex gap-2">
                {[
                  { key: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
                  { key: 'schedule', label: lang === 'ar' ? 'الجدول' : 'Schedule' },
                  { key: 'apologies', label: lang === 'ar' ? 'الاعتذارات' : 'Apologies' }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setProfileTab(t.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profileTab === t.key
                        ? isSalam 
                          ? 'bg-[#00F000] text-[#003931]' 
                          : 'bg-slate-800 border border-slate-600 text-white'
                        : isSalam 
                          ? 'bg-[#F8FDF8] border border-[#00F000] text-[#003931] hover:bg-[#EEFDEC]' 
                          : 'bg-slate-900 border border-slate-800 text-gray-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {profileTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg border ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000]' 
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      {lang === 'ar' ? 'معلومات الموظف' : 'Employee Information'}
                    </h4>
                    {!profileStaffInfo ? (
                      <div className={`text-sm ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>
                        {lang === 'ar' ? 'جار التحميل...' : 'Loading...'}
                      </div>
                    ) : (
                      <div className={`text-sm flex flex-col gap-2 ${
                        isSalam ? 'text-[#003931]' : 'text-gray-300'
                      }`}>
                        <div>
                          <span className="font-medium">{lang === 'ar' ? 'الاسم' : 'Name'}: </span>
                          {lang === 'ar' ? (profileStaffInfo.name_ar || profileStaffInfo.name) : profileStaffInfo.name}
                        </div>
                        {profileStaffInfo.job_title && (
                          <div>
                            <span className="font-medium">{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}: </span>
                            {lang === 'ar' ? (profileStaffInfo.job_title_ar || profileStaffInfo.job_title) : profileStaffInfo.job_title}
                          </div>
                        )}
                        {profileStaffInfo.email && (
                          <div>
                            <span className="font-medium">Email: </span>
                            {profileStaffInfo.email}
                          </div>
                        )}
                        {profileStaffInfo.phone && (
                          <div>
                            <span className="font-medium">{lang === 'ar' ? 'الهاتف' : 'Phone'}: </span>
                            {profileStaffInfo.phone}
                          </div>
                        )}
                        {profileStaffInfo.department && (
                          <div>
                            <span className="font-medium">{lang === 'ar' ? 'القسم' : 'Department'}: </span>
                            {profileStaffInfo.department.name}
                          </div>
                        )}
                        {profileStaffInfo.pattern_code && (
                          <div>
                            <span className="font-medium">{lang === 'ar' ? 'نمط المناوبة' : 'Shift Pattern'}: </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isSalam 
                                ? 'bg-[#00F000] text-[#003931]' 
                                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            }`}>
                              {profileStaffInfo.pattern_code}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000]' 
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isSalam ? 'text-[#003931]' : 'text-white'
                    }`}>
                      {lang === 'ar' ? 'الاعتذارات (الشهر)' : 'Apologies (Month)'}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {profileApologies.length === 0 ? (
                        <span className={`text-sm ${
                          isSalam ? 'text-[#005147]' : 'text-gray-400'
                        }`}>
                          {lang === 'ar' ? 'لا يوجد اعتذارات' : 'No apologies'}
                        </span>
                      ) : (
                        profileApologies.map((ap, i) => (
                          <div key={i} className={`p-2 rounded border ${
                            isSalam 
                              ? 'bg-white border-[#00F000]' 
                              : 'bg-slate-700 border-slate-600'
                          }`}>
                            <div className={`text-sm ${
                              isSalam ? 'text-[#003931]' : 'text-white'
                            }`}>
                              {ap.date.slice(0,10)}
                            </div>
                            <div className={`text-xs ${
                              isSalam ? 'text-[#005147]' : 'text-gray-400'
                            }`}>
                              {ap.reason}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
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
                  <div className="overflow-x-auto">
                    <div className={`flex gap-6 snap-x snap-mandatory ${profileViewMode === 'month' ? 'justify-center' : ''}`}>
                      {monthsToRender.map(({ y, m }) => {
                        const { weeks } = buildWeeks(y, m);
                        const label = new Date(y, m - 1, 1).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
                        return (
                          <div key={`${y}-${m}`} className={`min-w-[700px] snap-start rounded-xl overflow-hidden shadow-sm ${
                            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
                          }`}>
                            {/* Month Header */}
                            <div className={`px-4 py-3 ${
                              isSalam ? 'bg-[#00F000]' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}>
                              <h4 className="text-lg font-semibold text-white">{label}</h4>
                            </div>
                            
                            {/* Weekday Headers */}
                            <div className={`grid grid-cols-7 ${
                              isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-800'
                            }`}>
                              {weekdayLabels.map((w, idx) => (
                                <div key={idx} className={`px-3 py-2 text-center text-sm font-medium border-r ${
                                  isSalam 
                                    ? 'text-[#003931] border-[#00F000]' 
                                    : 'text-gray-300 border-slate-700'
                                } last:border-r-0`}>
                                  {w}
                                </div>
                              ))}
                            </div>
                            
                            {/* Calendar Days */}
                            <div className={`divide-y ${
                              isSalam ? 'divide-[#00F000]' : 'divide-slate-700'
                            }`}>
                              {weeks.map((week, wi) => (
                                <div key={wi} className="grid grid-cols-7">
                                  {week.map((date, di) => {
                                    const dateNum = date.getDate();
                                    const assigned = getStaffShiftForDate(date, profileStaffId);
                                    
                                    const cellRow = (active: boolean, label: string, color: string) => (
                                      <div className={`flex items-center justify-between rounded border px-2 py-1 text-[11px] ${
                                        active ? color : (isSalam ? 'bg-gray-100 border-gray-300 text-gray-500' : 'bg-slate-900/30 border-slate-700 text-slate-400')
                                      }`}>
                                        <span>{label}</span>
                                        {active && <span className={`inline-flex items-center rounded-full px-2 py-0.5 border text-[10px] ${
                                          isSalam ? 'border-gray-600 bg-gray-200' : 'border-slate-600 bg-slate-900/40'
                                        }`}>✓</span>}
                                      </div>
                                    );
                                    
                                    return (
                                      <div key={di} className={`min-h-[110px] border-r p-2 ${
                                        isSalam 
                                          ? 'bg-white border-[#00F000]' 
                                          : 'bg-slate-900 border-slate-700'
                                      } last:border-r-0`}>
                                        <div className={`text-xs font-semibold mb-2 ${
                                          isSalam ? 'text-[#003931]' : 'text-white'
                                        }`}>
                                          {dateNum}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          {cellRow(assigned === 'morning', (lang === 'ar' ? 'صباح' : 'Morning'), isSalam ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-900/20 border-emerald-700 text-emerald-300')}
                                          {cellRow(assigned === 'lateMorning', (lang === 'ar' ? 'صباح متأخر' : 'Late Morning'), isSalam ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-sky-900/20 border-sky-700 text-sky-300')}
                                          {cellRow(assigned === 'day', (lang === 'ar' ? 'نهار' : 'Day'), isSalam ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-amber-900/20 border-amber-700 text-amber-300')}
                                          {cellRow(assigned === 'night', (lang === 'ar' ? 'ليل' : 'Night'), isSalam ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-violet-900/20 border-violet-700 text-violet-300')}
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
                <div className={`p-4 rounded-lg border ${
                  isSalam 
                    ? 'bg-[#F8FDF8] border-[#00F000]' 
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'الاعتذارات' : 'Apologies'}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {profileApologies.length === 0 ? (
                      <div className={`text-sm ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>
                        {lang === 'ar' ? 'لا يوجد اعتذارات' : 'No apologies'}
                      </div>
                    ) : (
                      profileApologies.map((ap, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded border ${
                          isSalam 
                            ? 'bg-white border-[#00F000]' 
                            : 'bg-slate-700 border-slate-600'
                        }`}>
                          <div>
                            <span className={`font-medium ${
                              isSalam ? 'text-[#003931]' : 'text-white'
                            }`}>
                              {ap.date.slice(0,10)}
                            </span>
                            <p className={`text-sm mt-1 ${
                              isSalam ? 'text-[#005147]' : 'text-gray-400'
                            }`}>
                              {ap.reason}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear Options Modal */}
      {showClearOptionsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-md w-full ${
            isSalam ? 'bg-white border border-[#003931]' : 'bg-slate-900 border border-slate-700'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${
              isSalam ? 'border-[#00F000]' : 'border-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'خيارات حذف الجدولة' : 'Clear Schedule Options'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isSalam ? 'text-[#005147]' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? 'اختر الفترة المراد حذف تعييناتها' : 'Choose the period to clear assignments for'}
                  </p>
                </div>
                <button
                  onClick={() => setShowClearOptionsModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-800'
                  }`}
                >
                  <FiX className={`w-6 h-6 ${
                    isSalam ? 'text-[#003931]' : 'text-gray-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Month Option */}
                <button
                  onClick={() => clearSchedule('month')}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000] hover:bg-[#EEFDEC]' 
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${
                        isSalam ? 'text-[#003931]' : 'text-white'
                      }`}>
                        {lang === 'ar' ? 'حذف الشهر' : 'Clear Month'}
                      </h4>
                      <p className={`text-sm ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>
                        {monthLabel}
                      </p>
                    </div>
                    <CalendarIcon className={`w-6 h-6 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-400'
                    }`} />
                  </div>
                </button>

                {/* Quarter Option */}
                <button
                  onClick={() => clearSchedule('quarter')}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000] hover:bg-[#EEFDEC]' 
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${
                        isSalam ? 'text-[#003931]' : 'text-white'
                      }`}>
                        {lang === 'ar' ? 'حذف الربع' : 'Clear Quarter'}
                      </h4>
                      <p className={`text-sm ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>
                        {lang === 'ar' ? 'الربع الحالي' : 'Current Quarter'}
                      </p>
                    </div>
                    <CalendarIcon className={`w-6 h-6 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-400'
                    }`} />
                  </div>
                </button>

                {/* Year Option */}
                <button
                  onClick={() => clearSchedule('year')}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                    isSalam 
                      ? 'bg-[#F8FDF8] border-[#00F000] hover:bg-[#EEFDEC]' 
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${
                        isSalam ? 'text-[#003931]' : 'text-white'
                      }`}>
                        {lang === 'ar' ? 'حذف السنة' : 'Clear Year'}
                      </h4>
                      <p className={`text-sm ${
                        isSalam ? 'text-[#005147]' : 'text-gray-400'
                      }`}>
                        {year}
                      </p>
                    </div>
                    <CalendarIcon className={`w-6 h-6 ${
                      isSalam ? 'text-[#003931]' : 'text-gray-400'
                    }`} />
                  </div>
                </button>

                {/* Custom Range Option */}
                <div className={`p-4 rounded-lg border ${
                  isSalam 
                    ? 'bg-[#F8FDF8] border-[#00F000]' 
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <h4 className={`font-semibold mb-3 ${
                    isSalam ? 'text-[#003931]' : 'text-white'
                  }`}>
                    {lang === 'ar' ? 'فترة مخصصة' : 'Custom Range'}
                  </h4>
                  
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isSalam ? 'text-[#003931]' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                      </label>
                      <input
                        type="date"
                        value={clearCustomRange.start}
                        onChange={(e) => setClearCustomRange(prev => ({ ...prev, start: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isSalam 
                            ? 'bg-white border-[#003931] text-[#003931]' 
                            : 'bg-slate-800 border-slate-600 text-white'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isSalam ? 'text-[#003931]' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                      </label>
                      <input
                        type="date"
                        value={clearCustomRange.end}
                        onChange={(e) => setClearCustomRange(prev => ({ ...prev, end: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isSalam 
                            ? 'bg-white border-[#003931] text-[#003931]' 
                            : 'bg-slate-800 border-slate-600 text-white'
                        }`}
                      />
                    </div>
                    
                    <button
                      onClick={() => clearSchedule('custom')}
                      disabled={!clearCustomRange.start || !clearCustomRange.end}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        !clearCustomRange.start || !clearCustomRange.end
                          ? isSalam 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : isSalam 
                            ? 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {lang === 'ar' ? 'حذف الفترة المخصصة' : 'Clear Custom Range'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${
              isSalam ? 'border-[#00F000]' : 'border-slate-700'
            }`}>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearOptionsModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSalam 
                      ? 'bg-gray-100 text-[#003931] hover:bg-gray-200' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}