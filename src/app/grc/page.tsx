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



export default function GRCPage() {
  const { lang } = useLang();
  const { t } = useTranslation(lang);
  
  // Tab state management
  const [activeTab, setActiveTab] = useState<'policies' | 'standards' | 'procedures'>('policies');
  
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [standards, setStandards] = useState<Policy[]>([]);
  const [procedures, setProcedures] = useState<Policy[]>([]);
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
    file: null as File | null,
  });

  // File upload state
  const [selectedFileName, setSelectedFileName] = useState("");

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '/api/policies';
        
        // Use different endpoints for different tabs
        if (activeTab === 'standards') {
          endpoint = '/api/standards';
        } else if (activeTab === 'procedures') {
          endpoint = '/api/procedures';
        }
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          
          if (activeTab === 'policies') {
            setPolicies(data);
          } else if (activeTab === 'standards') {
            setStandards(data);
          } else if (activeTab === 'procedures') {
            setProcedures(data);
          }
        } else {
          console.error(`Failed to fetch ${activeTab}:`, response.status, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };

    fetchData();
  }, [activeTab]);

  const resetForm = () => {
    setFormData({
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
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
        // Update existing item via API
        let response;
        
        if (formData.file) {
          // If file is selected, use FormData
          const formDataToSend = new FormData();
          formDataToSend.append('titleEn', formData.titleEn);
          formDataToSend.append('titleAr', formData.titleAr);
          formDataToSend.append('descriptionEn', formData.descriptionEn);
          formDataToSend.append('descriptionAr', formData.descriptionAr);
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
            }),
          });
        }

        if (response.ok) {
          const updatedItem = await response.json();
          const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
            setItems(items.map((item) =>
              item.id === editingPolicy.id ? updatedItem : item
            ));
          };

          if (activeTab === 'policies') {
            updateState(policies, setPolicies);
          } else if (activeTab === 'standards') {
            updateState(standards, setStandards);
          } else if (activeTab === 'procedures') {
            updateState(procedures, setProcedures);
          }
        }
      } else {
        // Create new policy via API
        const formDataToSend = new FormData();
        formDataToSend.append('titleEn', formData.titleEn);
        formDataToSend.append('titleAr', formData.titleAr);
        formDataToSend.append('descriptionEn', formData.descriptionEn);
        formDataToSend.append('descriptionAr', formData.descriptionAr);
        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }

        let endpoint = '/api/policies';
        if (activeTab === 'standards') {
          endpoint = '/api/standards';
        } else if (activeTab === 'procedures') {
          endpoint = '/api/procedures';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const newItem = await response.json();
          if (activeTab === 'policies') {
            setPolicies([newItem, ...policies]);
          } else if (activeTab === 'standards') {
            setStandards([newItem, ...standards]);
          } else if (activeTab === 'procedures') {
            setProcedures([newItem, ...procedures]);
          }
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
      file: null,
    });
    setSelectedFileName("");
    setShowUploadModal(true);
  };

  const handleDelete = async (policyId: number) => {
    const itemType = activeTab === 'policies' ? 'policy' : activeTab === 'standards' ? 'standard' : 'procedure';
    const confirmMessage = lang === "ar" 
      ? `هل أنت متأكد من حذف هذا ${activeTab === 'policies' ? 'السياسة' : activeTab === 'standards' ? 'المعيار' : 'الإجراء'}؟`
      : `Are you sure you want to delete this ${itemType}?`;
    
    if (window.confirm(confirmMessage)) {
      setIsLoading(true);
      try {
        let endpoint = `/api/policies/${policyId}`;
        if (activeTab === 'standards') {
          endpoint = `/api/standards/${policyId}`;
        } else if (activeTab === 'procedures') {
          endpoint = `/api/procedures/${policyId}`;
        }

        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (response.ok) {
          if (activeTab === 'policies') {
            setPolicies(policies.filter((p) => p.id !== policyId));
          } else if (activeTab === 'standards') {
            setStandards(standards.filter((s) => s.id !== policyId));
          } else if (activeTab === 'procedures') {
            setProcedures(procedures.filter((p) => p.id !== policyId));
          }
        } else {
          console.error(`Failed to delete ${itemType}`);
        }
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
      } finally {
        setIsLoading(false);
      }
    }
  };



  const handleToggleVisibility = async (policy: Policy) => {
    setIsLoading(true);
    try {
      let endpoint = `/api/policies/${policy.id}/visibility`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${policy.id}/visibility`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${policy.id}/visibility`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: !policy.is_visible,
        }),
      });

      if (response.ok) {
        const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
          setItems(items.map((p) =>
            p.id === policy.id ? { ...p, is_visible: !p.is_visible } : p
          ));
        };

        if (activeTab === 'policies') {
          updateState(policies, setPolicies);
        } else if (activeTab === 'standards') {
          updateState(standards, setStandards);
        } else if (activeTab === 'procedures') {
          updateState(procedures, setProcedures);
        }
      } else {
        console.error('Failed to update visibility');
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVersions = async (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsLoading(true);
    try {
      let endpoint = `/api/policies/${policy.id}/versions`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${policy.id}/versions`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${policy.id}/versions`;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const versions = await response.json();
        setArchivedVersions(versions);
        setShowVersionsModal(true);
      } else {
        console.error('Failed to fetch versions');
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (policy: Policy) => {
    try {
      // Update download count via API based on active tab
      let endpoint = `/api/policies/${policy.id}/download`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${policy.id}/download`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${policy.id}/download`;
      }
      
      await fetch(endpoint, {
        method: 'POST',
      });

      // Simulate download
      const link = document.createElement("a");
      link.href = policy.file_url || "#";
      link.download = `${lang === 'ar' ? policy.title_ar : policy.title_en}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state based on active tab
      const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
        setItems(items.map((p) =>
          p.id === policy.id ? { ...p, downloads: p.downloads + 1 } : p
        ));
      };

      if (activeTab === 'policies') {
        updateState(policies, setPolicies);
      } else if (activeTab === 'standards') {
        updateState(standards, setStandards);
      } else if (activeTab === 'procedures') {
        updateState(procedures, setProcedures);
      }
    } catch (error) {
      console.error('Error downloading item:', error);
    }
  };

  const handleView = async (policy: Policy) => {
    try {
      // Update view count via API based on active tab
      let endpoint = `/api/policies/${policy.id}/view`;
      if (activeTab === 'standards') {
        endpoint = `/api/standards/${policy.id}/view`;
      } else if (activeTab === 'procedures') {
        endpoint = `/api/procedures/${policy.id}/view`;
      }
      
      await fetch(endpoint, {
        method: 'POST',
      });

      // Update local state based on active tab
      const updateState = (items: Policy[], setItems: React.Dispatch<React.SetStateAction<Policy[]>>) => {
        setItems(items.map((p) =>
          p.id === policy.id ? { ...p, views: p.views + 1 } : p
        ));
      };

      if (activeTab === 'policies') {
        updateState(policies, setPolicies);
      } else if (activeTab === 'standards') {
        updateState(standards, setStandards);
      } else if (activeTab === 'procedures') {
        updateState(procedures, setProcedures);
      }
      
      // Open item in new tab
      window.open(policy.file_url || "#", "_blank");
    } catch (error) {
      console.error('Error viewing item:', error);
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'policies':
        return policies;
      case 'standards':
        return standards;
      case 'procedures':
        return procedures;
      default:
        return policies;
    }
  };

  const currentData = getCurrentData();
  const totalDownloads = currentData.reduce((acc, item) => acc + item.downloads, 0);
  const totalViews = currentData.reduce((acc, item) => acc + item.views, 0);

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 content-animate">
          <div className="flex rounded-lg p-1 bg-slate-900 border border-slate-700">
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'policies'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('policies.policies_tab')}
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'standards'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('policies.standards_tab')}
            </button>
            <button
              onClick={() => setActiveTab('procedures')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'procedures'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('policies.procedures_tab')}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 content-animate">
          <div className="card text-center p-8 stagger-animate">
            <div className="text-3xl font-bold text-green-400 mb-3">
              {currentData.length}
            </div>
            <div className="text-slate-300 text-sm font-medium">
              {activeTab === 'policies' ? t("grc.total_policies") : 
               activeTab === 'standards' ? (lang === 'ar' ? 'إجمالي المعايير' : 'Total Standards') :
               (lang === 'ar' ? 'إجمالي الإجراءات' : 'Total Procedures')}
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

        {/* Management Section */}
        <div className="card p-8 mb-12 content-animate">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'policies' ? t("grc.policy_management") : 
               activeTab === 'standards' ? (lang === 'ar' ? 'إدارة المعايير' : 'Standards Management') :
               (lang === 'ar' ? 'إدارة الإجراءات' : 'Procedures Management')}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowUploadModal(true);
              }}
              className="btn-primary flex items-center px-6 py-3 rounded-lg transition-all duration-200 hover:bg-green-700"
            >
              <PlusIcon className={`w-5 h-5 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {activeTab === 'policies' ? t("grc.upload_policy") : 
               activeTab === 'standards' ? (lang === 'ar' ? 'رفع معيار' : 'Upload Standard') :
               (lang === 'ar' ? 'رفع إجراء' : 'Upload Procedure')}
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
                {currentData.map((policy) => (
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
                    <td className="py-6 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(policy)}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title={t("grc.view")}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDownload(policy)}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title={t("grc.download")}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdateFile(policy)}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title={lang === "ar" ? "تحديث الملف" : "Update File"}
                        >
                          <CloudArrowUpIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleVisibility(policy)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            policy.is_visible 
                              ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' 
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                          }`}
                          title={policy.is_visible ? t("grc.hide") : t("grc.show")}
                        >
                          <EyeSlashIcon className="w-4 h-4" />
                  </button>
                        <button
                          onClick={() => handleViewVersions(policy)}
                          className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-all duration-200 hover:scale-110"
                          title={t("grc.archive")}
                        >
                          <ArchiveBoxIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200 hover:scale-110"
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
            {currentData.length === 0 && (
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