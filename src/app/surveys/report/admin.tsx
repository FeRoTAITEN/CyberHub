"use client";

import { useTheme, useLang } from '../../ClientLayout';
import { UserIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

// Initial example admin data
type Admin = {
  id: number;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
};

const initialAdmins: Admin[] = [
  { id: 1, name: { en: 'Sarah Al-Qahtani', ar: 'سارة القحطاني' }, role: { en: 'Survey Admin', ar: 'مشرفة الاستبيانات' } },
  { id: 2, name: { en: 'Mohammed Al-Salem', ar: 'محمد السالم' }, role: { en: 'Data Analyst', ar: 'محلل بيانات' } },
];

const themeCardStyles = {
  default: 'bg-[#0a1826] border border-slate-600',
  light: 'bg-white border border-slate-200',
  midnight: 'bg-slate-900 border border-slate-700',
  novel: 'bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-300',
  cyber: 'bg-gradient-to-br from-[#0f172a] to-[#0a1826] border border-green-500/30 shadow-[0_0_24px_#39ff14cc]',
};

export default function ReportAdminSection() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const styles = themeCardStyles[theme] || themeCardStyles.default;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', role_en: '', role_ar: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Open modal for add or edit
  const openModal = (admin: Admin | null = null) => {
    setEditAdmin(admin);
    if (admin) {
      setForm({
        name_en: admin.name.en,
        name_ar: admin.name.ar,
        role_en: admin.role.en,
        role_ar: admin.role.ar,
      });
    } else {
      setForm({ name_en: '', name_ar: '', role_en: '', role_ar: '' });
    }
    setShowModal(true);
  };

  // Save admin (add or edit)
  const handleSave = () => {
    if (editAdmin) {
      setAdmins(admins.map(a => a.id === editAdmin.id ? {
        ...a,
        name: { en: form.name_en, ar: form.name_ar },
        role: { en: form.role_en, ar: form.role_ar },
      } : a));
    } else {
      const newId = admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1;
      setAdmins([
        ...admins,
        {
          id: newId,
          name: { en: form.name_en, ar: form.name_ar },
          role: { en: form.role_en, ar: form.role_ar },
        },
      ]);
    }
    setShowModal(false);
    setEditAdmin(null);
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
        <h3 className="text-lg font-bold text-blue-900 dark:text-white">
          {lang === 'ar' ? 'إدارة المشرفين' : 'Admin Management'}
        </h3>
        <button className="btn-primary flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => openModal()}>
          <PlusIcon className="w-5 h-5" /> {lang === 'ar' ? 'إضافة مشرف جديد' : 'Add New Admin'}
        </button>
      </div>
      <div className={`card card-hover ${styles} p-6 rounded-xl w-full flex flex-col`}>
        <ul className="space-y-4">
          {admins.map((admin) => (
            <li key={admin.id} className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-lg px-5 py-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="rounded-full bg-blue-200 dark:bg-blue-900 p-2">
                  <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </span>
                <div>
                  <div className="font-bold text-base text-blue-900 dark:text-white">{admin.name[lang]}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-300">{admin.role[lang]}</div>
                </div>
              </div>
              <button className="btn-primary flex items-center gap-1 px-3 py-1 text-xs" onClick={() => openModal(admin)}>
                <PencilIcon className="w-4 h-4" /> {lang === 'ar' ? 'تعديل' : 'Edit'}
              </button>
              <button className="btn-danger flex items-center gap-1 px-3 py-1 text-xs" onClick={() => openDelete(admin.id)}>
                <TrashIcon className="w-4 h-4" /> {lang === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Add/Edit Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-10`}>
            <Dialog.Title className="text-xl font-bold mb-4 text-blue-900 dark:text-white flex items-center gap-2">
              {editAdmin ? (lang === 'ar' ? 'تعديل المشرف' : 'Edit Admin') : (lang === 'ar' ? 'إضافة مشرف جديد' : 'Add New Admin')}
              <button className="ml-auto text-slate-400 hover:text-red-500" onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-base font-bold text-black dark:text-slate-200">{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
                <input
                  className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-base font-bold text-black dark:text-slate-200">{lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                <input
                  className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                  value={form.name_ar}
                  onChange={e => setForm({ ...form, name_ar: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-base font-bold text-black dark:text-slate-200">{lang === 'ar' ? 'الدور (إنجليزي)' : 'Role (EN)'}</label>
                <input
                  className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                  value={form.role_en}
                  onChange={e => setForm({ ...form, role_en: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-base font-bold text-black dark:text-slate-200">{lang === 'ar' ? 'الدور (عربي)' : 'Role (AR)'}</label>
                <input
                  className="input-field text-slate-800 dark:text-white border border-slate-400 dark:border-slate-700"
                  value={form.role_ar}
                  onChange={e => setForm({ ...form, role_ar: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn-secondary px-4 py-2 rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="btn-primary px-4 py-2 rounded-lg"
                  onClick={handleSave}
                >
                  {lang === 'ar' ? 'حفظ' : 'Save'}
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
          <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full mx-auto p-6 z-10`}>
            <Dialog.Title className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">
              {lang === 'ar' ? 'تأكيد الحذف' : 'Delete Confirmation'}
            </Dialog.Title>
            <p className="mb-6 text-slate-700 dark:text-slate-200">
              {lang === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this admin? This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-lg"
                onClick={() => setShowDelete(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                className="btn-danger px-4 py-2 rounded-lg"
                onClick={handleDelete}
              >
                {lang === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 