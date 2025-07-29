"use client";

import { useTheme, useLang } from '../../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import { UserIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

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

// Initial example admin data
type Admin = {
  id: number;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  email: string;
  permissions: string[];
};

const initialAdmins: Admin[] = [
  { 
    id: 1, 
    name: { en: 'Sarah Al-Qahtani', ar: 'سارة القحطاني' }, 
    role: { en: 'Survey Admin', ar: 'مشرفة الاستبيانات' },
    email: 'sarah.alqahtani@company.com',
    permissions: ['create', 'edit', 'delete', 'view_reports']
  },
  { 
    id: 2, 
    name: { en: 'Mohammed Al-Salem', ar: 'محمد السالم' }, 
    role: { en: 'Data Analyst', ar: 'محلل بيانات' },
    email: 'mohammed.alsalem@company.com',
    permissions: ['view_reports', 'export_data']
  },
];

export default function ReportAdminSection() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState({ 
    name_en: '', 
    name_ar: '', 
    role_en: '', 
    role_ar: '',
    email: '',
    permissions: [] as string[]
  });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Available permissions
  const availablePermissions = [
    { id: 'create', label: { en: 'Create Surveys', ar: 'إنشاء استطلاعات' } },
    { id: 'edit', label: { en: 'Edit Surveys', ar: 'تعديل الاستطلاعات' } },
    { id: 'delete', label: { en: 'Delete Surveys', ar: 'حذف الاستطلاعات' } },
    { id: 'view_reports', label: { en: 'View Reports', ar: 'عرض التقارير' } },
    { id: 'export_data', label: { en: 'Export Data', ar: 'تصدير البيانات' } },
    { id: 'manage_users', label: { en: 'Manage Users', ar: 'إدارة المستخدمين' } },
  ];

  // Open modal for add or edit
  const openModal = (admin: Admin | null = null) => {
    setEditAdmin(admin);
    if (admin) {
      setForm({
        name_en: admin.name.en,
        name_ar: admin.name.ar,
        role_en: admin.role.en,
        role_ar: admin.role.ar,
        email: admin.email,
        permissions: admin.permissions,
      });
    } else {
      setForm({ 
        name_en: '', 
        name_ar: '', 
        role_en: '', 
        role_ar: '',
        email: '',
        permissions: []
      });
    }
    setShowModal(true);
  };

  // Save admin (add or edit)
  const handleSave = () => {
    if (!form.name_en || !form.name_ar || !form.role_en || !form.role_ar || !form.email) {
      alert(t('reports.please_fill_fields'));
      return;
    }

    if (editAdmin) {
      setAdmins(admins.map(a => a.id === editAdmin.id ? {
        ...a,
        name: { en: form.name_en, ar: form.name_ar },
        role: { en: form.role_en, ar: form.role_ar },
        email: form.email,
        permissions: form.permissions,
      } : a));
    } else {
      const newId = admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1;
      setAdmins([
        ...admins,
        {
          id: newId,
          name: { en: form.name_en, ar: form.name_ar },
          role: { en: form.role_en, ar: form.role_ar },
          email: form.email,
          permissions: form.permissions,
        },
      ]);
    }
    setShowModal(false);
    setEditAdmin(null);
  };

  // Toggle permission
  const togglePermission = (permissionId: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Open delete confirmation
  const openDelete = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = () => {
    setAdmins(admins.filter(a => a.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <div className={`flex flex-col gap-6`} dir={dir}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${colors.textPrimary}`}>
          {t('reports.admin_management')}
        </h3>
        <button 
          className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2`} 
          onClick={() => openModal()}
        >
          <PlusIcon className="w-5 h-5" /> 
          {t('reports.add_new_admin')}
        </button>
      </div>
      
      <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admins.map((admin) => (
            <div key={admin.id} className={`${colors.cardBgHover} border ${colors.borderPrimary} rounded-lg p-4 transition-all duration-200`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`${colors.iconBg} rounded-full p-2`}>
                  <UserIcon className={`w-6 h-6 ${colors.primary}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-base ${colors.textPrimary}`}>{admin.name[lang]}</div>
                  <div className={`text-sm ${colors.textSecondary}`}>{admin.role[lang]}</div>
                  <div className={`text-xs ${colors.textSecondary} mt-1`}>{admin.email}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className={`text-xs font-semibold ${colors.textSecondary} mb-1`}>
                  {t('reports.permissions')}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {admin.permissions.map(permission => (
                    <span key={permission} className={`text-xs px-2 py-1 rounded-full ${colors.primaryBg} text-white`}>
                      {availablePermissions.find(p => p.id === permission)?.label[lang] || permission}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-3 py-1 rounded-lg text-xs transition-all duration-200 flex items-center gap-1`} 
                  onClick={() => openModal(admin)}
                >
                  <PencilIcon className="w-3 h-3" /> 
                  {t('reports.edit')}
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-200 flex items-center gap-1" 
                  onClick={() => openDelete(admin.id)}
                >
                  <TrashIcon className="w-3 h-3" /> 
                  {t('reports.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-2xl w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto`}>
            <Dialog.Title className={`text-xl font-bold mb-4 ${colors.textPrimary} flex items-center gap-2`}>
              {editAdmin ? t('reports.edit_admin') : t('reports.add_admin')}
              <button className="ml-auto text-slate-400 hover:text-red-500" onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </Dialog.Title>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1 text-sm font-medium ${colors.textPrimary}`}>
                    {t('reports.name_en')} *
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    value={form.name_en}
                    onChange={e => setForm({ ...form, name_en: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${colors.textPrimary}`}>
                    {t('reports.name_ar')} *
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    value={form.name_ar}
                    onChange={e => setForm({ ...form, name_ar: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1 text-sm font-medium ${colors.textPrimary}`}>
                    {t('reports.role_en')} *
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    value={form.role_en}
                    onChange={e => setForm({ ...form, role_en: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${colors.textPrimary}`}>
                    {t('reports.role_ar')} *
                  </label>
                  <input
                    className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    value={form.role_ar}
                    onChange={e => setForm({ ...form, role_ar: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block mb-1 text-sm font-medium ${colors.textPrimary}`}>
                  {t('reports.email')} *
                </label>
                <input
                  type="email"
                  className={`${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${colors.textPrimary}`}>
                  {t('reports.permissions')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className={`text-sm ${colors.textSecondary}`}>
                        {permission.label[lang]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className={`${colors.cardBgHover} border ${colors.borderPrimary} ${colors.textPrimary} px-4 py-2 rounded-lg transition-all duration-200`}
                  onClick={() => setShowModal(false)}
                >
                  {t('survey.cancel')}
                </button>
                <button
                  className={`${colors.primaryBg} hover:${colors.primaryBgHover} text-white px-4 py-2 rounded-lg transition-all duration-200`}
                  onClick={handleSave}
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
          <div className={`relative ${colors.cardBg} rounded-xl shadow-xl max-w-sm w-full mx-auto p-6 z-10`}>
            <Dialog.Title className={`text-xl font-bold mb-4 text-red-500`}>
              {t('reports.delete_confirmation')}
            </Dialog.Title>
            <p className={`mb-6 ${colors.textSecondary}`}>
              {t('reports.delete_admin_confirm')}
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
                onClick={handleDelete}
              >
                {t('reports.delete')}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 