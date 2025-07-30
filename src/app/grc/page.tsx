"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  EyeSlashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useLang } from "../ClientLayout";
import { useTranslation } from "@/lib/useTranslation";

interface Policy {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  version: string;
  file_size: string;
  file_url?: string;
  downloads: number;
  views: number;
  status: string;
  is_visible: boolean;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  archived_versions?: Policy[];
}

const categories = [
  { en: "Access Control", ar: "التحكم في الوصول" },
  { en: "Data Security", ar: "أمان البيانات" },
  { en: "Network Security", ar: "أمان الشبكات" },
  { en: "Incident Management", ar: "إدارة الحوادث" },
  { en: "Resource Management", ar: "إدارة الموارد" },
  { en: "Compliance", ar: "الامتثال" },
];

export default function GRCPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [archivedVersions, setArchivedVersions] = useState<Policy[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    category: "",
    file: null as File | null,
  });

  // File upload state
  const [selectedFileName, setSelectedFileName] = useState("");

  // Fetch policies from API
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies');
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        } else {
          console.error('Failed to fetch policies');
        }
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  const resetForm = () => {
    setFormData({
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      category: "",
      file: null,
    });
    setSelectedFileName("");
    setEditingPolicy(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
      setSelectedFileName(file.name);
    }
  };

  // Version generation is now handled by the API

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingPolicy) {
        // Update existing policy via API
        let response;
        
        if (formData.file) {
          // If file is selected, use FormData
          const formDataToSend = new FormData();
          formDataToSend.append('titleEn', formData.titleEn);
          formDataToSend.append('titleAr', formData.titleAr);
          formDataToSend.append('descriptionEn', formData.descriptionEn);
          formDataToSend.append('descriptionAr', formData.descriptionAr);
          formDataToSend.append('categoryEn', formData.category);
          formDataToSend.append('categoryAr', categories.find((c) => c.en === formData.category)?.ar || "");
          formDataToSend.append('file', formData.file);

          response = await fetch(`/api/policies/${editingPolicy.id}`, {
            method: 'PUT',
            body: formDataToSend,
          });
        } else {
          // If no file, use JSON
          response = await fetch(`/api/policies/${editingPolicy.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              titleEn: formData.titleEn,
              titleAr: formData.titleAr,
              descriptionEn: formData.descriptionEn,
              descriptionAr: formData.descriptionAr,
              categoryEn: formData.category,
              categoryAr: categories.find((c) => c.en === formData.category)?.ar || "",
            }),
          });
        }

        if (response.ok) {
          const updatedPolicy = await response.json();
          setPolicies(policies.map((policy) =>
            policy.id === editingPolicy.id ? updatedPolicy : policy
          ));
        }
      } else {
        // Create new policy via API
        const formDataToSend = new FormData();
        formDataToSend.append('titleEn', formData.titleEn);
        formDataToSend.append('titleAr', formData.titleAr);
        formDataToSend.append('descriptionEn', formData.descriptionEn);
        formDataToSend.append('descriptionAr', formData.descriptionAr);
        formDataToSend.append('categoryEn', formData.category);
        formDataToSend.append('categoryAr', categories.find((c) => c.en === formData.category)?.ar || "");
        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }

        const response = await fetch('/api/policies', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const newPolicy = await response.json();
          setPolicies([newPolicy, ...policies]);
        }
      }

      setShowUploadModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving policy:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleUpdateFile = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      titleEn: policy.title_en,
      titleAr: policy.title_ar,
      descriptionEn: policy.description_en,
      descriptionAr: policy.description_ar,
      category: policy.category_en,
      file: null,
    });
    setSelectedFileName("");
    setShowUploadModal(true);
  };

  const handleDelete = async (policyId: number) => {
    if (window.confirm(lang === "ar" ? "هل أنت متأكد من حذف هذه السياسة؟" : "Are you sure you want to delete this policy?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/policies/${policyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPolicies(policies.filter((p) => p.id !== policyId));
        } else {
          console.error('Failed to delete policy');
        }
      } catch (error) {
        console.error("Error deleting policy:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };



  const handleToggleVisibility = async (policy: Policy) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/policies/${policy.id}/visibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: !policy.is_visible,
        }),
      });

      if (response.ok) {
        setPolicies(policies.map((p) =>
          p.id === policy.id ? { ...p, is_visible: !p.is_visible } : p
        ));
      } else {
        console.error('Failed to update policy visibility');
      }
    } catch (error) {
      console.error("Error updating policy visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVersions = async (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/policies/${policy.id}/versions`);
      if (response.ok) {
        const versions = await response.json();
        setArchivedVersions(versions);
        setShowVersionsModal(true);
      } else {
        console.error('Failed to fetch policy versions');
      }
    } catch (error) {
      console.error("Error fetching policy versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (policy: Policy) => {
    try {
      // Update download count via API
      await fetch(`/api/policies/${policy.id}/download`, {
        method: 'POST',
      });

      // Simulate download
      const link = document.createElement("a");
      link.href = policy.file_url || "#";
      link.download = `${lang === 'ar' ? policy.title_ar : policy.title_en}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state
      setPolicies(
        policies.map((p) =>
          p.id === policy.id ? { ...p, downloads: p.downloads + 1 } : p
        )
      );
    } catch (error) {
      console.error('Error downloading policy:', error);
    }
  };

  const handleView = async (policy: Policy) => {
    try {
      // Update view count via API
      await fetch(`/api/policies/${policy.id}/view`, {
        method: 'POST',
      });

      // Update local state
      setPolicies(
        policies.map((p) =>
          p.id === policy.id ? { ...p, views: p.views + 1 } : p
        )
      );
      
      // Open policy in new tab
      window.open(policy.file_url || "#", "_blank");
    } catch (error) {
      console.error('Error viewing policy:', error);
    }
  };

  const totalDownloads = policies.reduce((acc, policy) => acc + policy.downloads, 0);
  const totalViews = policies.reduce((acc, policy) => acc + policy.views, 0);

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <DocumentTextIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">{t("grc.title")}</h1>
          <p className="page-subtitle subtitle-animate">
            {t("grc.intro")}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 content-animate">
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">
              {policies.length}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_policies")}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-blue-400 mb-3">
              {totalDownloads}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_downloads")}
            </div>
          </div>
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-purple-400 mb-3">
              {totalViews}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {t("grc.total_views")}
            </div>
          </div>
        </div>

        {/* Policy Management Section */}
        <div className="card p-8 mb-12 content-animate">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {t("grc.policy_management")}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowUploadModal(true);
              }}
              className="btn-primary flex items-center px-6 py-3 rounded-lg transition-all duration-200 hover:bg-green-700"
            >
              <PlusIcon className={`w-5 h-5 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {t("grc.upload_policy")}
            </button>
          </div>

          {/* Policies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.policy_title")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.policy_category")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.policy_version")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.downloads")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.views")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.last_updated")}
                  </th>
                  <th className="text-right py-4 px-4 text-slate-300 font-medium">
                    {t("grc.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-white">
                          {lang === 'ar' ? policy.title_ar : policy.title_en}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {lang === 'ar' ? policy.description_ar : policy.description_en}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm border border-blue-500/30">
                        {lang === 'ar' ? policy.category_ar : policy.category_en}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {policy.version}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {policy.downloads}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {policy.views}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {new Date(policy.updated_at).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`flex items-center ${
                          lang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
                        }`}
                      >
                                          <button
                    onClick={() => handleView(policy)}
                    className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                    title={t("grc.view")}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(policy)}
                    className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                    title={t("grc.download")}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleUpdateFile(policy)}
                    className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                    title={lang === "ar" ? "تحديث الملف" : "Update File"}
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(policy)}
                    className={`p-2 transition-colors ${
                      policy.is_visible 
                        ? 'text-slate-400 hover:text-orange-400' 
                        : 'text-orange-400 hover:text-orange-300'
                    }`}
                    title={policy.is_visible ? t("grc.hide") : t("grc.show")}
                  >
                    <EyeSlashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewVersions(policy)}
                    className="p-2 text-slate-400 hover:text-gray-400 transition-colors"
                    title={t("grc.archive")}
                  >
                    <ArchiveBoxIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title={t("grc.delete")}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {policies.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                {t("grc.no_policies")}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPolicy 
                  ? (formData.file ? t("grc.update_file") : t("grc.edit"))
                  : t("grc.upload_policy")
                }
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("grc.policy_title")} (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("grc.policy_title")} (AR)
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) =>
                      setFormData({ ...formData, titleAr: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("grc.policy_description")} (EN)
                  </label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionEn: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("grc.policy_description")} (AR)
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionAr: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("grc.policy_category")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                  required
                >
                  <option value="">{lang === "ar" ? "اختر الفئة" : "Select Category"}</option>
                  {categories.map((category) => (
                    <option key={category.en} value={category.en}>
                      {category[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {editingPolicy ? t("grc.update_file") : t("grc.policy_file")}
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                    required={!editingPolicy}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <CloudArrowUpIcon className="w-12 h-12 text-slate-400 mb-4" />
                    <span className="text-slate-300">
                      {selectedFileName
                        ? selectedFileName
                        : editingPolicy
                        ? lang === "ar"
                          ? "اختر ملف محدث (اختياري)"
                          : "Choose updated file (optional)"
                        : lang === "ar"
                        ? "انقر لاختيار ملف أو اسحب الملف هنا"
                        : "Click to select file or drag and drop"}
                    </span>
                    {editingPolicy && !selectedFileName && (
                      <span className="text-sm text-slate-500 mt-2">
                        {lang === "ar" ? "سيتم الاحتفاظ بالملف الحالي" : "Current file will be kept"}
                      </span>
                    )}
                  </label>
                </div>
                {selectedFileName && (
                  <div className="mt-2 flex items-center justify-between bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                    <span className="text-green-400 text-sm">{selectedFileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, file: null });
                        setSelectedFileName("");
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div
                className={`flex items-center ${
                  lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
                }`}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1 py-3 rounded-lg transition-all duration-200 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      {t("grc.saving")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {editingPolicy 
                        ? (formData.file ? t("grc.update_file") : t("grc.save"))
                        : t("grc.upload")
                      }
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary flex-1 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700"
                >
                  {t("grc.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Versions Modal */}
      {showVersionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {t("grc.archived_versions")} - {selectedPolicy && (lang === 'ar' ? selectedPolicy.title_ar : selectedPolicy.title_en)}
              </h3>
              <button
                onClick={() => setShowVersionsModal(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {archivedVersions.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <div className="text-slate-400 text-lg">
                  {t("grc.no_archived_versions")}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {archivedVersions.map((version) => (
                  <div key={version.id} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-white">
                          {lang === 'ar' ? version.title_ar : version.title_en}
                        </div>
                        <div className="text-sm text-slate-400">
                          {t("grc.version")}: {version.version}
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">
                        {new Date(version.created_at).toLocaleDateString(
                          lang === "ar" ? "ar-EG" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-3">
                      {lang === 'ar' ? version.description_ar : version.description_en}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div>
                        {t("grc.downloads")}: {version.downloads} | {t("grc.views")}: {version.views}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(version)}
                          className="btn-secondary text-xs px-3 py-1 rounded transition-all duration-200 hover:bg-slate-700"
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {t("grc.view")}
                        </button>
                        <button
                          onClick={() => handleDownload(version)}
                          className="btn-primary text-xs px-3 py-1 rounded transition-all duration-200 hover:bg-green-700"
                        >
                          <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                          {t("grc.download")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 