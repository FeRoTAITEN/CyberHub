'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useLang, useTheme, useFont } from '@/app/ClientLayout';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FontSwitcher from '@/components/FontSwitcher';
import { Dialog } from '@headlessui/react';



// Types for shift management system
interface Shift {
  id: number;
  name: string;
  name_ar: string;
  start_time: string;
  end_time: string;
  min_members: number;
  max_members: number;
  type: 'morning' | 'evening' | 'night';
}

interface Employee {
  id: number;
  name: string;
  name_ar: string;
  email: string;
  job_title: string;
  job_title_ar: string;
  department: {
    name: string;
  };
  gender: 'male' | 'female';
  is_active: boolean;
}

interface ShiftAssignment {
  id: number;
  date: string;
  shift_id: number;
  employee_id: number;
  status: string;
  employee: Employee;
  shift: Shift;
}

// Removed unused interface



// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Theme colors
const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'light':
      return {
        bg: 'bg-gradient-to-br from-blue-50 via-white to-blue-100',
        cardBg: 'bg-white',
        cardBgHover: 'hover:bg-gray-50',
        borderPrimary: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textTertiary: 'text-gray-500',
        primaryBg: 'bg-blue-600',
        primaryBgHover: 'hover:bg-blue-700',
        successBg: 'bg-green-50',
        successBorder: 'border-green-200',
        errorBg: 'bg-red-50',
        errorBorder: 'border-red-200',
        warningBg: 'bg-yellow-50',
        warningBorder: 'border-yellow-200',
        inputBg: 'bg-white',
        inputBorder: 'border-gray-300',
        inputPlaceholder: 'placeholder-gray-400',
        glassBg: 'bg-white/80',
        glassBorder: 'border-white/20',
        labelText: 'text-gray-700',
        labelBg: 'bg-gray-100'
      };
    case 'midnight':
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        cardBg: 'bg-slate-800',
        cardBgHover: 'hover:bg-slate-700',
        borderPrimary: 'border-slate-600',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textTertiary: 'text-slate-400',
        primaryBg: 'bg-blue-600',
        primaryBgHover: 'hover:bg-blue-700',
        successBg: 'bg-green-900/20',
        successBorder: 'border-green-500/20',
        errorBg: 'bg-red-900/20',
        errorBorder: 'border-red-500/20',
        warningBg: 'bg-yellow-900/20',
        warningBorder: 'border-yellow-500/20',
        inputBg: 'bg-slate-700',
        inputBorder: 'border-slate-600',
        inputPlaceholder: 'placeholder-slate-400',
        glassBg: 'bg-slate-800/80',
        glassBorder: 'border-slate-600/20',
        labelText: 'text-slate-300',
        labelBg: 'bg-slate-700'
      };
    case 'novel':
      return {
        bg: 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100',
        cardBg: 'bg-white',
        cardBgHover: 'hover:bg-yellow-50',
        borderPrimary: 'border-yellow-200',
        textPrimary: 'text-yellow-900',
        textSecondary: 'text-yellow-700',
        textTertiary: 'text-yellow-600',
        primaryBg: 'bg-yellow-600',
        primaryBgHover: 'hover:bg-yellow-700',
        successBg: 'bg-green-50',
        successBorder: 'border-green-200',
        errorBg: 'bg-red-50',
        errorBorder: 'border-red-200',
        warningBg: 'bg-yellow-50',
        warningBorder: 'border-yellow-200',
        inputBg: 'bg-white',
        inputBorder: 'border-yellow-300',
        inputPlaceholder: 'placeholder-yellow-400',
        glassBg: 'bg-white/80',
        glassBorder: 'border-yellow-200/20',
        labelText: 'text-yellow-700',
        labelBg: 'bg-yellow-100'
      };
    case 'cyber':
      return {
        bg: 'bg-gradient-to-br from-zinc-900 via-black to-zinc-900',
        cardBg: 'bg-zinc-800',
        cardBgHover: 'hover:bg-zinc-700',
        borderPrimary: 'border-zinc-600',
        textPrimary: 'text-zinc-100',
        textSecondary: 'text-zinc-300',
        textTertiary: 'text-zinc-400',
        primaryBg: 'bg-green-600',
        primaryBgHover: 'hover:bg-green-700',
        successBg: 'bg-green-900/20',
        successBorder: 'border-green-500/20',
        errorBg: 'bg-red-900/20',
        errorBorder: 'border-red-500/20',
        warningBg: 'bg-yellow-900/20',
        warningBorder: 'border-yellow-500/20',
        inputBg: 'bg-zinc-700',
        inputBorder: 'border-zinc-600',
        inputPlaceholder: 'placeholder-zinc-400',
        glassBg: 'bg-zinc-800/80',
        glassBorder: 'border-zinc-600/20',
        labelText: 'text-zinc-300',
        labelBg: 'bg-zinc-700'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        cardBg: 'bg-slate-800',
        cardBgHover: 'hover:bg-slate-700',
        borderPrimary: 'border-slate-600',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textTertiary: 'text-slate-400',
        primaryBg: 'bg-blue-600',
        primaryBgHover: 'hover:bg-blue-700',
        successBg: 'bg-green-900/20',
        successBorder: 'border-green-500/20',
        errorBg: 'bg-red-900/20',
        errorBorder: 'border-red-500/20',
        warningBg: 'bg-yellow-900/20',
        warningBorder: 'border-yellow-500/20',
        inputBg: 'bg-slate-700',
        inputBorder: 'border-slate-600',
        inputPlaceholder: 'placeholder-slate-400',
        glassBg: 'bg-slate-800/80',
        glassBorder: 'border-slate-600/20',
        labelText: 'text-slate-300',
        labelBg: 'bg-slate-700'
      };
  }
};

// Utility functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getShiftColor = (shiftType: string) => {
  switch (shiftType) {
    case 'morning':
      return 'bg-blue-500';
    case 'evening':
      return 'bg-orange-500';
    case 'night':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getShiftIcon = (shiftType: string) => {
  switch (shiftType) {
    case 'morning':
      return <ClockIcon className="w-4 h-4" />;
    case 'evening':
      return <ClockIcon className="w-4 h-4" />;
    case 'night':
      return <ClockIcon className="w-4 h-4" />;
    default:
      return <ClockIcon className="w-4 h-4" />;
  }
};

// Constants for shift management requirements 

// Modal Components
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  data,
  colors,
  lang 
}: {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  } | null;
  colors: Record<string, string>;
  lang: string;
}) => {
  if (!data) return null;

  const getTypeColors = () => {
    switch (data.type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const typeColors = getTypeColors();

  const handleConfirm = () => {
    data.onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`mx-auto max-w-md rounded-2xl ${colors.cardBg} border ${colors.borderPrimary} shadow-xl`}>
          <div className={`p-6 ${typeColors.bg} border ${typeColors.border} rounded-2xl`}>
            <div className="flex items-center gap-3 mb-4">
              {data.type === 'danger' ? (
                <ShieldCheckIcon className="w-8 h-8 text-red-600" />
              ) : data.type === 'warning' ? (
                <ShieldCheckIcon className="w-8 h-8 text-yellow-600" />
              ) : (
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              )}
              <Dialog.Title className={`text-xl font-bold ${typeColors.text}`}>
                {data.title}
              </Dialog.Title>
            </div>
            
            <Dialog.Description className={`mb-6 ${typeColors.text}`}>
              {data.message}
            </Dialog.Description>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
              >
                {data.cancelText || (lang === 'ar' ? 'إلغاء' : 'Cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white ${typeColors.button} transition-colors`}
              >
                {data.confirmText || (lang === 'ar' ? 'تأكيد' : 'Confirm')}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// Assignment Modal
const AssignmentModal = ({ 
  isOpen, 
  onClose, 
  shifts, 
  employees, 
  selectedDate, 
  onAssign,
  colors,
  lang 
}: {
  isOpen: boolean;
  onClose: () => void;
  shifts: Shift[];
  employees: Employee[];
  selectedDate: string | null;
  onAssign: (data: { date: string; shift_id: number; employee_id: number }) => void;
  colors: Record<string, string>;
  lang: string;
}) => {
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredEmployees = () => {
    if (!Array.isArray(employees)) return [];
    return employees.filter(emp => 
      emp.is_active && 
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       emp.name_ar.includes(searchTerm))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedShift && selectedEmployee) {
      onAssign({
        date: selectedDate,
        shift_id: selectedShift,
        employee_id: selectedEmployee
      });
      onClose();
    }
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`mx-auto max-w-2xl w-full rounded-2xl ${colors.cardBg} border ${colors.borderPrimary} shadow-xl`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Dialog.Title className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {lang === 'ar' ? 'تعيين موظف لمناوبة' : 'Assign Employee to Shift'}
                </Dialog.Title>
                <p className={`text-sm ${colors.textSecondary} mt-1`}>
                  {lang === 'ar' ? 'اختر المناوبة والموظف للتعيين' : 'Select shift and employee for assignment'}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
              >
                <ShieldCheckIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Display */}
              {selectedDate && (
                <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                  <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-2`}>
                    {lang === 'ar' ? 'التاريخ المحدد:' : 'Selected Date:'}
                  </h3>
                  <p className={`text-lg ${colors.textSecondary}`}>
                    {new Date(selectedDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Shift Selection */}
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>
                  {lang === 'ar' ? 'اختيار المناوبة' : 'Select Shift'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                        selectedShift === shift.id
                          ? `${colors.primaryBg} text-white border-blue-600`
                          : `${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} hover:${colors.cardBgHover}`
                      }`}
                      onClick={() => setSelectedShift(shift.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedShift === shift.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {getShiftIcon(shift.type)}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'ar' ? shift.name_ar : shift.name}
                          </div>
                          <div className="text-sm opacity-75">
                            {shift.start_time} - {shift.end_time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Selection */}
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>
                  {lang === 'ar' ? 'اختيار الموظف' : 'Select Employee'}
                </h3>
                
                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'البحث في الموظفين...' : 'Search employees...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputBorder} border rounded-lg ${colors.textPrimary} placeholder-${colors.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Employee List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmployee === employee.id
                          ? `${colors.primaryBg} text-white border-blue-600`
                          : `${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} hover:${colors.cardBgHover}`
                      }`}
                      onClick={() => setSelectedEmployee(employee.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedEmployee === employee.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'ar' ? employee.name_ar : employee.name}
                          </div>
                          <div className="text-sm opacity-75">
                            {employee.department.name}
                          </div>
                          <div className="text-xs opacity-60">
                            {employee.gender === 'male' ? (lang === 'ar' ? 'ذكر' : 'Male') : (lang === 'ar' ? 'أنثى' : 'Female')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!selectedShift || !selectedEmployee}
                  className={`px-6 py-2 rounded-lg ${colors.primaryBg} text-white hover:${colors.primaryBgHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {lang === 'ar' ? 'تعيين' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// Availability Modal
const AvailabilityModal = ({ 
  isOpen, 
  onClose, 
  employees, 
  selectedDate, 
  onSetAvailability,
  colors,
  lang 
}: {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  selectedDate: string | null;
  onSetAvailability: (data: { employee_id: number; date: string; reason: string; reason_ar: string; notes: string }) => void;
  colors: Record<string, string>;
  lang: string;
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredEmployees = () => {
    if (!Array.isArray(employees)) return [];
    return employees.filter(emp => 
      emp.is_active && 
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       emp.name_ar.includes(searchTerm))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedEmployee && reason) {
      onSetAvailability({
        employee_id: selectedEmployee,
        date: selectedDate,
        reason: reason,
        reason_ar: reason, // For simplicity, using same text
        notes: notes
      });
      onClose();
    }
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`mx-auto max-w-2xl w-full rounded-2xl ${colors.cardBg} border ${colors.borderPrimary} shadow-xl`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Dialog.Title className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {lang === 'ar' ? 'تحديد عدم توفر موظف' : 'Set Employee Unavailable'}
                </Dialog.Title>
                <p className={`text-sm ${colors.textSecondary} mt-1`}>
                  {lang === 'ar' ? 'تحديد موظف كمعتذر ليوم معين' : 'Mark employee as unavailable for specific day'}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
              >
                <ShieldCheckIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Display */}
              {selectedDate && (
                <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                  <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-2`}>
                    {lang === 'ar' ? 'التاريخ المحدد:' : 'Selected Date:'}
                  </h3>
                  <p className={`text-lg ${colors.textSecondary}`}>
                    {new Date(selectedDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Employee Selection */}
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>
                  {lang === 'ar' ? 'اختيار الموظف' : 'Select Employee'}
                </h3>
                
                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'البحث في الموظفين...' : 'Search employees...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputBorder} border rounded-lg ${colors.textPrimary} placeholder-${colors.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Employee List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmployee === employee.id
                          ? `${colors.primaryBg} text-white border-blue-600`
                          : `${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} hover:${colors.cardBgHover}`
                      }`}
                      onClick={() => setSelectedEmployee(employee.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedEmployee === employee.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'ar' ? employee.name_ar : employee.name}
                          </div>
                          <div className="text-sm opacity-75">
                            {employee.department.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>
                  {lang === 'ar' ? 'سبب الاعتذار' : 'Reason for Unavailability'}
                </h3>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'أدخل سبب الاعتذار...' : 'Enter reason for unavailability...'}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputBorder} border rounded-lg ${colors.textPrimary} placeholder-${colors.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              {/* Notes */}
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-4`}>
                  {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                </h3>
                <textarea
                  placeholder={lang === 'ar' ? 'أدخل ملاحظات إضافية...' : 'Enter additional notes...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputBorder} border rounded-lg ${colors.textPrimary} placeholder-${colors.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!selectedEmployee || !reason}
                  className={`px-6 py-2 rounded-lg ${colors.primaryBg} text-white hover:${colors.primaryBgHover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {lang === 'ar' ? 'تحديد عدم توفر' : 'Set Unavailable'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 



// Main Component
export default function ShiftManagementPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { font } = useFont();
  const colors = getThemeColors(theme);
  // Translation hook - not used in this component but kept for consistency

  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  } | null>(null);

  // Utility functions
  const getAssignmentsForDate = (date: string) => {
    if (!Array.isArray(assignments)) return [];
    return assignments.filter(assignment => assignment.date === date);
  };



  const getFilteredEmployees = () => {
    if (!Array.isArray(employees)) return [];
    return employees.filter(emp => 
      emp.is_active && 
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (emp.name_ar && emp.name_ar.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // API functions
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const employeesResponse = await fetch('/api/employees');
      const employeesData = await employeesResponse.json();
      setEmployees(Array.isArray(employeesData) ? employeesData : []);

      // Fetch shifts
      const shiftsResponse = await fetch('/api/shifts');
      const shiftsData = await shiftsResponse.json();
      setShifts(Array.isArray(shiftsData) ? shiftsData : []);

      // Fetch assignments
      const assignmentsResponse = await fetch('/api/shifts/assignments');
      const assignmentsData = await assignmentsResponse.json();
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);

      // Fetch availability - removed unused state

    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignEmployee = async (data: { date: string; shift_id: number; employee_id: number }) => {
    try {
      const response = await fetch('/api/shifts/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم تعيين الموظف بنجاح' : 'Employee assigned successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في تعيين الموظف' : 'Error assigning employee' });
      }
    } catch {
      setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في تعيين الموظف' : 'Error assigning employee' });
    }
  };

  const handleSetAvailability = async (data: { employee_id: number; date: string; reason: string; reason_ar: string; notes: string }) => {
    try {
      const response = await fetch('/api/shifts/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم تحديد عدم التوفر بنجاح' : 'Unavailability set successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في تحديد عدم التوفر' : 'Error setting unavailability' });
      }
    } catch {
      setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في تحديد عدم التوفر' : 'Error setting unavailability' });
    }
  };

  const handleAutoSchedule = async () => {
    try {
      const response = await fetch('/api/shifts/auto-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم الجدولة التلقائية بنجاح' : 'Auto-scheduling completed successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في الجدولة التلقائية' : 'Error in auto-scheduling' });
      }
    } catch {
      setMessage({ type: 'error', text: lang === 'ar' ? 'خطأ في الجدولة التلقائية' : 'Error in auto-scheduling' });
    }
  };



  const showConfirmation = (data: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => {
    setConfirmData(data);
    setShowConfirmModal(true);
  };



  // Calculate statistics
  const calculateMinEmployees = () => {
    const minPerShift = 3;
    
    // Women cannot work night shift
    const womenEmployees = Array.isArray(employees) ? employees.filter(emp => emp.gender === 'female' && emp.is_active) : [];
    const menEmployees = Array.isArray(employees) ? employees.filter(emp => emp.gender === 'male' && emp.is_active) : [];
    
    // Night shift needs only men (min 3)
    const nightShiftMin = Math.max(minPerShift, 3);
    
    // Morning and evening can have both men and women
    const otherShiftsMin = minPerShift * 2; // morning + evening
    
    // Total minimum = night shift (men only) + other shifts (mixed)
    const totalMin = nightShiftMin + otherShiftsMin;
    
    return {
      totalMin,
      nightShiftMin,
      otherShiftsMin,
      availableMen: menEmployees.length,
      availableWomen: womenEmployees.length,
      totalAvailable: employees.filter(emp => emp.is_active).length
    };
  };

  const getEmployeeStatsForCurrentMonth = (employeeId: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const monthAssignments = Array.isArray(assignments) ? assignments.filter(assignment => {
      const assignmentDate = new Date(assignment.date);
      return assignment.employee_id === employeeId &&
             assignmentDate.getFullYear() === year &&
             assignmentDate.getMonth() + 1 === month;
    }) : [];

    const morningShifts = monthAssignments.filter(a => a.shift.type === 'morning').length;
    const eveningShifts = monthAssignments.filter(a => a.shift.type === 'evening').length;
    const nightShifts = monthAssignments.filter(a => a.shift.type === 'night').length;
    const totalShifts = monthAssignments.length;

    return {
      morning: morningShifts,
      noon: nightShifts, // تغيير من night إلى noon
      evening: eveningShifts,
      total: totalShifts,
      workingDays: totalShifts
    };
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className={`min-h-screen ${colors.bg} ${colors.textPrimary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 text-lg ${colors.textSecondary}`}>
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const minEmployeesData = calculateMinEmployees();
  const filteredEmployees = getFilteredEmployees();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.textPrimary}`} style={{ fontFamily: font }}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${colors.cardBg} border-b ${colors.borderPrimary} backdrop-blur-md shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${colors.primaryBg} text-white`}>
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {lang === 'ar' ? 'إدارة المناوبات' : 'Shift Management'}
                </h1>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {lang === 'ar' ? 'إدارة وتنظيم مناوبات الموظفين' : 'Manage and organize employee shifts'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher onLanguageChange={() => {}} currentLanguage={lang} />
              <ThemeSwitcher onThemeChange={() => {}} currentTheme={theme} />
              <FontSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Message System */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg ${
              message.type === 'success' ? `${colors.successBg} ${colors.successBorder} border` :
              message.type === 'error' ? `${colors.errorBg} ${colors.errorBorder} border` :
              `${colors.warningBg} ${colors.warningBorder} border`
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              ) : message.type === 'error' ? (
                <ShieldCheckIcon className="w-5 h-5 text-red-600" />
              ) : (
                <ShieldCheckIcon className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-medium ${
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {message.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* System Overview */}
          <motion.div variants={itemVariants} className={`${colors.cardBg} border ${colors.borderPrimary} rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${colors.textPrimary}`}>
                {lang === 'ar' ? 'نظرة عامة على النظام' : 'System Overview'}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => showConfirmation({
                    title: lang === 'ar' ? 'تأكيد الجدولة التلقائية' : 'Confirm Auto-Scheduling',
                    message: lang === 'ar' ? 'هل أنت متأكد من تشغيل الجدولة التلقائية لهذا الشهر؟' : 'Are you sure you want to run auto-scheduling for this month?',
                    onConfirm: handleAutoSchedule,
                    type: 'info'
                  })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.primaryBg} text-white hover:${colors.primaryBgHover} transition-colors`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  {lang === 'ar' ? 'جدولة تلقائية' : 'Auto Schedule'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <div className="flex items-center gap-3 mb-2">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  <h3 className={`font-semibold ${colors.textPrimary}`}>
                    {lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
                  </h3>
                </div>
                <p className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {minEmployeesData.totalAvailable}
                </p>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {lang === 'ar' ? 'موظف نشط' : 'Active employees'}
                </p>
              </div>

              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="w-6 h-6 text-green-600" />
                  <h3 className={`font-semibold ${colors.textPrimary}`}>
                    {lang === 'ar' ? 'الموظفون الذكور' : 'Male Employees'}
                  </h3>
                </div>
                <p className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {minEmployeesData.availableMen}
                </p>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {lang === 'ar' ? 'يمكن العمل في جميع الفترات' : 'Can work all shifts'}
                </p>
              </div>

              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="w-6 h-6 text-pink-600" />
                  <h3 className={`font-semibold ${colors.textPrimary}`}>
                    {lang === 'ar' ? 'الموظفات الإناث' : 'Female Employees'}
                  </h3>
                </div>
                <p className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {minEmployeesData.availableWomen}
                </p>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {lang === 'ar' ? 'فترات الصباح والمساء فقط' : 'Morning & evening shifts only'}
                </p>
              </div>

              <div className={`p-4 ${colors.inputBg} border ${colors.inputBorder} rounded-xl`}>
                <div className="flex items-center gap-3 mb-2">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  <h3 className={`font-semibold ${colors.textPrimary}`}>
                    {lang === 'ar' ? 'الحد الأدنى المطلوب' : 'Minimum Required'}
                  </h3>
                </div>
                <p className={`text-2xl font-bold ${colors.textPrimary}`}>
                  {minEmployeesData.totalMin}
                </p>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {lang === 'ar' ? 'لضمان تغطية كاملة' : 'For full coverage'}
                </p>
              </div>
            </div>

            {/* Requirements Status */}
            <div className="mt-6 p-4 border rounded-xl">
              <h3 className={`font-semibold ${colors.textPrimary} mb-3`}>
                {lang === 'ar' ? 'متطلبات النظام' : 'System Requirements'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${minEmployeesData.totalAvailable >= minEmployeesData.totalMin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={colors.textSecondary}>
                    {lang === 'ar' ? 'الحد الأدنى للموظفين:' : 'Minimum employees:'} {minEmployeesData.totalAvailable}/{minEmployeesData.totalMin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${minEmployeesData.availableMen >= minEmployeesData.nightShiftMin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={colors.textSecondary}>
                    {lang === 'ar' ? 'الذكور للمناوبة الليلية:' : 'Males for night shift:'} {minEmployeesData.availableMen}/{minEmployeesData.nightShiftMin}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monthly Calendar */}
          <motion.div variants={itemVariants} className={`${colors.cardBg} border ${colors.borderPrimary} rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${colors.textPrimary}`}>
                {lang === 'ar' ? 'التقويم الشهري' : 'Monthly Calendar'}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={goToPreviousMonth}
                  className={`p-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className={`px-4 py-2 rounded-lg ${colors.primaryBg} text-white hover:${colors.primaryBgHover} transition-colors`}
                >
                  {lang === 'ar' ? 'اليوم' : 'Today'}
                </button>
                <button
                  onClick={goToNextMonth}
                  className={`p-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className={`text-lg font-semibold ${colors.textPrimary}`}>
                {currentDate.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </h3>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className={`p-3 text-center font-semibold ${colors.textSecondary} ${colors.labelBg} rounded-lg`}>
                  {lang === 'ar' ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][index] : day}
                </div>
              ))}

              {/* Empty cells for first week */}
              {Array.from({ length: firstDayOfMonth }, (_, index) => (
                <div key={`empty-${index}`} className="p-3"></div>
              ))}

              {/* Calendar Days */}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateString = formatDate(date);
                const dayAssignments = getAssignmentsForDate(dateString);

                const morningCount = dayAssignments.filter(a => a.shift.type === 'morning').length;
                const eveningCount = dayAssignments.filter(a => a.shift.type === 'evening').length;
                const nightCount = dayAssignments.filter(a => a.shift.type === 'night').length;

                const isToday = date.toDateString() === new Date().toDateString();
                const hasWarning = morningCount < 3 || eveningCount < 3 || nightCount < 3;

                return (
                  <div
                    key={day}
                    className={`p-3 border ${colors.borderPrimary} rounded-lg cursor-pointer hover:${colors.cardBgHover} transition-colors ${
                      isToday ? `${colors.primaryBg} text-white` : ''
                    }`}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <div className="text-sm font-semibold mb-2">{day}</div>
                    
                    {/* Shift Indicators */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getShiftColor('morning')} ${morningCount < 3 ? 'animate-pulse' : ''}`}></div>
                        <span className="text-xs">{morningCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getShiftColor('evening')} ${eveningCount < 3 ? 'animate-pulse' : ''}`}></div>
                        <span className="text-xs">{eveningCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getShiftColor('night')} ${nightCount < 3 ? 'animate-pulse' : ''}`}></div>
                        <span className="text-xs">{nightCount}</span>
                      </div>
                    </div>

                    {/* Warning Indicator */}
                    {hasWarning && (
                      <div className="mt-1">
                        <ShieldCheckIcon className="w-3 h-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            {selectedDate && (
              <div className="mt-6 p-4 border rounded-xl">
                <h4 className={`font-semibold ${colors.textPrimary} mb-3`}>
                  {lang === 'ar' ? 'إجراءات سريعة لـ' : 'Quick Actions for'} {new Date(selectedDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.primaryBg} text-white hover:${colors.primaryBgHover} transition-colors`}
                  >
                    <ShieldCheckIcon className="w-4 h-4" />
                    {lang === 'ar' ? 'تعيين موظف' : 'Assign Employee'}
                  </button>
                  <button
                    onClick={() => setShowAvailabilityModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                  >
                    <ShieldCheckIcon className="w-4 h-4" />
                    {lang === 'ar' ? 'تحديد عدم توفر' : 'Set Unavailable'}
                  </button>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.inputBg} ${colors.inputBorder} border ${colors.textPrimary} hover:${colors.cardBgHover} transition-colors`}
                  >
                    <ShieldCheckIcon className="w-4 h-4" />
                    {lang === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Employees List */}
          <motion.div variants={itemVariants} className={`${colors.cardBg} border ${colors.borderPrimary} rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${colors.textPrimary}`}>
                {lang === 'ar' ? 'قائمة الموظفين' : 'Employees List'}
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShieldCheckIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'البحث في الموظفين...' : 'Search employees...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 ${colors.inputBg} ${colors.inputBorder} border rounded-lg ${colors.textPrimary} placeholder-${colors.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => {
                const stats = getEmployeeStatsForCurrentMonth(employee.id);
                return (
                                    <div
                    key={employee.id}
                    className={`p-4 border ${colors.borderPrimary} rounded-xl hover:${colors.cardBgHover} transition-colors cursor-pointer`}
                    onClick={() => {
                      // Show employee details modal
                      showConfirmation({
                        title: lang === 'ar' ? 'تفاصيل الموظف' : 'Employee Details',
                        message: `${lang === 'ar' ? 'اسم الموظف:' : 'Employee:'} ${lang === 'ar' ? employee.name_ar : employee.name}`,
                        onConfirm: () => {},
                        type: 'info'
                      });
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        employee.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                      }`}>
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${colors.textPrimary}`}>
                          {lang === 'ar' ? employee.name_ar : employee.name}
                        </h3>
                        <p className={`text-sm ${colors.textSecondary}`}>
                          {employee.department.name}
                        </p>
                        <p className={`text-xs ${colors.textTertiary}`}>
                          {employee.gender === 'male' ? (lang === 'ar' ? 'ذكر' : 'Male') : (lang === 'ar' ? 'أنثى' : 'Female')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${colors.textSecondary}`}>
                          {lang === 'ar' ? 'إجمالي المناوبات:' : 'Total Shifts:'}
                        </span>
                        <span className={`font-semibold ${colors.textPrimary}`}>{stats.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${colors.textSecondary}`}>
                          {lang === 'ar' ? 'أيام العمل:' : 'Working Days:'}
                        </span>
                        <span className={`font-semibold ${colors.textPrimary}`}>{stats.workingDays}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className={`w-2 h-2 rounded-full ${getShiftColor('morning')} mx-auto mb-1`}></div>
                          <span className={colors.textSecondary}>{stats.morning}</span>
                        </div>
                        <div className="text-center">
                          <div className={`w-2 h-2 rounded-full ${getShiftColor('evening')} mx-auto mb-1`}></div>
                          <span className={colors.textSecondary}>{stats.evening}</span>
                        </div>
                        <div className="text-center">
                                          <div className={`w-2 h-2 rounded-full ${getShiftColor('night')} mx-auto mb-1`}></div>
                <span className={colors.textSecondary}>{stats.noon}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        shifts={shifts}
        employees={employees}
        selectedDate={selectedDate}
        onAssign={handleAssignEmployee}
        colors={colors}
        lang={lang}
      />

      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        employees={employees}
        selectedDate={selectedDate}
        onSetAvailability={handleSetAvailability}
        colors={colors}
        lang={lang}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        data={confirmData}
        colors={colors}
        lang={lang}
      />


    </div>
  );
} 