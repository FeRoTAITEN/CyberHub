"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserGroupIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Mock Data
const employees = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@company.com",
    phone: "+966501234567",
    position: "مطور Full Stack",
    department: "التطوير",
    projects: 3,
    salary: "15,000 ريال",
    status: "متاح",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "فاطمة علي",
    email: "fatima@company.com",
    phone: "+966502345678",
    position: "مصممة UI/UX",
    department: "التصميم",
    projects: 2,
    salary: "12,000 ريال",
    status: "مشغول",
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    joinDate: "2023-03-20"
  },
  {
    id: 3,
    name: "محمد حسن",
    email: "mohammed@company.com",
    phone: "+966503456789",
    position: "مدير مشاريع",
    department: "الإدارة",
    projects: 4,
    salary: "18,000 ريال",
    status: "متاح",
    skills: ["Agile", "Scrum", "Jira", "Trello"],
    joinDate: "2022-11-10"
  },
  {
    id: 4,
    name: "سارة أحمد",
    email: "sara@company.com",
    phone: "+966504567890",
    position: "مديرة موارد بشرية",
    department: "الموارد البشرية",
    projects: 1,
    salary: "14,000 ريال",
    status: "إجازة",
    skills: ["التوظيف", "التدريب", "التقييم", "الرواتب"],
    joinDate: "2023-06-05"
  },
  {
    id: 5,
    name: "علي محمود",
    email: "ali@company.com",
    phone: "+966505678901",
    position: "مطور Backend",
    department: "التطوير",
    projects: 2,
    salary: "16,000 ريال",
    status: "متاح",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    joinDate: "2023-02-28"
  },
  {
    id: 6,
    name: "نورا محمد",
    email: "nora@company.com",
    phone: "+966506789012",
    position: "مصممة جرافيك",
    department: "التصميم",
    projects: 3,
    salary: "11,000 ريال",
    status: "مشغول",
    skills: ["Photoshop", "Illustrator", "InDesign", "After Effects"],
    joinDate: "2023-04-12"
  }
];

const departments = ["الكل", "التطوير", "التصميم", "الإدارة", "الموارد البشرية"];
const statuses = ["الكل", "متاح", "مشغول", "إجازة"];

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح": return "bg-green-600";
      case "مشغول": return "bg-yellow-600";
      case "إجازة": return "bg-blue-600";
      default: return "bg-red-600";
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "الكل" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "الكل" || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">إدارة الموظفين</h1>
          <p className="text-slate-300/70 mt-2">إدارة معلومات وبيانات جميع موظفي الشركة</p>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="البحث في الموظفين..."
                className="input-field pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              {/* Department Filter */}
              <div className="flex bg-slate-700 rounded-lg p-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedDepartment === dept
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:text-blue-500"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex bg-slate-700 rounded-lg p-1">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:text-blue-500"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:text-blue-500"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:text-blue-500"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                whileHover={{ scale: 1.02 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-slate-100">{employee.name}</h3>
                  <p className="text-slate-300/70 text-sm">{employee.position}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-300/70">
                    <span className="ml-2">📧</span>
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300/70">
                    <span className="ml-2">📱</span>
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300/70">
                    <span className="ml-2">🏢</span>
                    <span>{employee.department}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-300/70 mb-2">المهارات:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-600/10 text-green-400 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {employee.skills.length > 3 && (
                      <span className="px-2 py-1 bg-blue-600/10 text-blue-400 text-xs rounded-full">
                        +{employee.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                  <span className="text-blue-500 font-semibold">{employee.projects} مشاريع</span>
                  <span className="text-slate-300/70">{employee.salary}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Employees Table */}
        {viewMode === "table" && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="p-3 text-right text-slate-100 font-semibold">الموظف</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">المنصب</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">القسم</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">المشاريع</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">الراتب</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">الحالة</th>
                    <th className="p-3 text-center text-slate-100 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-600 hover:bg-slate-700 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-3">
                            {employee.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-slate-100 font-medium">{employee.name}</div>
                            <div className="text-slate-300/70 text-sm">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center text-slate-100">{employee.position}</td>
                      <td className="p-3 text-center text-slate-100">{employee.department}</td>
                      <td className="p-3 text-center text-blue-500 font-semibold">{employee.projects}</td>
                      <td className="p-3 text-center text-slate-100">{employee.salary}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="btn-secondary text-xs">تعديل</button>
                          <button className="btn-danger text-xs">حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircleIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">لا يوجد موظفين</h3>
            <p className="text-slate-300/70">لم يتم العثور على موظفين تطابق معايير البحث</p>
          </div>
        )}

        {/* Add Employee Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-600">إضافة موظف جديد</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-200">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-slate-100 text-sm mb-2">الاسم الكامل</label>
                  <input type="text" className="input-field" placeholder="أدخل الاسم الكامل" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">البريد الإلكتروني</label>
                  <input type="email" className="input-field" placeholder="أدخل البريد الإلكتروني" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">رقم الهاتف</label>
                  <input type="tel" className="input-field" placeholder="أدخل رقم الهاتف" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">المنصب</label>
                  <input type="text" className="input-field" placeholder="أدخل المنصب" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">القسم</label>
                  <select className="input-field">
                    <option value="">اختر القسم</option>
                    <option value="التطوير">التطوير</option>
                    <option value="التصميم">التصميم</option>
                    <option value="الإدارة">الإدارة</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">الراتب</label>
                  <input type="text" className="input-field" placeholder="أدخل الراتب" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">إضافة الموظف</button>
                  <button 
                    type="button" 
                    className="btn-secondary flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          <PlusIcon className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
} 