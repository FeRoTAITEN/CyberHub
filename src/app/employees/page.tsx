"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserGroupIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useTheme } from '../ClientLayout';
import Navigation from '@/components/Navigation';

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
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [realEmployees, setRealEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState(["الكل"]);
  const [loading, setLoading] = useState(true);
  
  const isSalam = theme === 'salam';
  
  // Theme colors
  const themeColors = {
    // Page background
    pageBg: isSalam ? 'min-h-screen gradient-bg' : 'min-h-screen bg-slate-900',
    
    // Header
    headerTitle: isSalam ? 'text-[#003931]' : 'text-blue-600',
    headerSubtitle: isSalam ? 'text-white' : 'text-slate-300/70',
    
    // Cards and containers
    cardBg: isSalam ? 'bg-white' : 'bg-slate-800',
    cardBorder: isSalam ? 'border border-[#003931]' : '',
    cardHover: isSalam ? 'hover:bg-[#EEFDEC]' : 'hover:bg-slate-700',
    
    // Text colors
    textPrimary: isSalam ? 'text-[#003931]' : 'text-slate-100',
    textSecondary: isSalam ? 'text-[#005147]' : 'text-slate-300/70',
    textMuted: isSalam ? 'text-[#005147]' : 'text-slate-400',
    
    // Input and controls
    inputBg: isSalam ? 'bg-white' : 'bg-slate-700',
    inputBorder: isSalam ? 'border-[#003931] text-[#003931]' : 'border-slate-600 text-white',
    inputFocus: isSalam ? 'focus:ring-[#00F000] focus:border-[#00F000]' : 'focus:ring-blue-500 focus:border-blue-500',
    
    // Buttons and filters
    filterBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-700',
    activeBg: isSalam ? 'bg-[#00F000] text-[#003931]' : 'bg-blue-600 text-white',
    inactiveText: isSalam ? 'text-[#005147]' : 'text-slate-300',
    hoverText: isSalam ? 'hover:text-[#00F000]' : 'hover:text-blue-500',
    
    // Status colors
    statusAvailable: isSalam ? 'bg-[#00F000] text-[#003931]' : 'bg-green-600',
    statusBusy: isSalam ? 'bg-[#73F64B] text-[#003931]' : 'bg-yellow-600',
    statusLeave: isSalam ? 'bg-[#36C639] text-white' : 'bg-blue-600',
    
    // Avatar and icons
    avatarBg: isSalam ? 'bg-[#36C639]' : 'bg-blue-600',
    iconBg: isSalam ? 'bg-[#EEFDEC]' : 'bg-blue-600/10',
    iconColor: isSalam ? 'text-[#00F000]' : 'text-blue-500',
    
    // Skills and tags
    skillBg: isSalam ? 'bg-[#EEFDEC] text-[#003931]' : 'bg-green-600/10 text-green-400',
    skillCountBg: isSalam ? 'bg-[#36C639] text-white' : 'bg-blue-600/10 text-blue-400',
    
    // Projects and salary
    projectsColor: isSalam ? 'text-[#00F000]' : 'text-blue-500',
    salaryColor: isSalam ? 'text-[#005147]' : 'text-slate-300/70',
    
    // Modal
    modalBg: isSalam ? 'bg-white' : 'bg-slate-800',
    modalTitle: isSalam ? 'text-[#003931]' : 'text-blue-600',
    
    // Table
    tableHeader: isSalam ? 'bg-[#EEFDEC]' : 'bg-slate-700',
    tableRow: isSalam ? 'border-[#003931]/20 hover:bg-[#EEFDEC]/50' : 'border-slate-600 hover:bg-slate-700',
    
    // Buttons
    primaryBtn: isSalam ? 'bg-[#00F000] hover:bg-[#73F64B] text-[#003931]' : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryBtn: isSalam ? 'bg-[#EEFDEC] hover:bg-[#36C639] text-[#003931] border-[#003931]' : 'bg-slate-700 hover:bg-slate-600 text-white',
    dangerBtn: isSalam ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
  };

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const [employeesRes, departmentsRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/departments')
        ]);
        
        if (employeesRes.ok) {
          const employeesData = await employeesRes.json();
          setRealEmployees(employeesData);
        }
        
        if (departmentsRes.ok) {
          const departmentsData = await departmentsRes.json();
          const deptNames = ["الكل", ...departmentsData.map((dept: any) => dept.name)];
          setDepartments(deptNames);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data
        setRealEmployees(employees);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  const getStatusColor = (status: string) => {
    if (isSalam) {
      switch (status) {
        case "متاح": 
        case "active": return themeColors.statusAvailable;
        case "مشغول": 
        case "busy": return themeColors.statusBusy;
        case "إجازة": 
        case "inactive": return themeColors.statusLeave;
        default: return "bg-red-500 text-white";
      }
    } else {
      switch (status) {
        case "متاح": 
        case "active": return "bg-green-600";
        case "مشغول": 
        case "busy": return "bg-yellow-600";
        case "إجازة": 
        case "inactive": return "bg-blue-600";
        default: return "bg-red-600";
      }
    }
  };

  // Use real employees data if available, otherwise fallback to mock data
  const currentEmployees = realEmployees.length > 0 ? realEmployees : employees;
  
  const filteredEmployees = currentEmployees.filter((employee: any) => {
    const name = employee.name || employee.name_ar || '';
    const email = employee.email || '';
    const position = employee.job_title || employee.position || '';
    const department = employee.department?.name || employee.department || '';
    const status = employee.is_active ? 'active' : 'inactive';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "الكل" || department === selectedDepartment;
    const matchesStatus = selectedStatus === "الكل" || status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className={themeColors.pageBg}>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-icon icon-animate">
            <UserGroupIcon className={`w-12 h-12 ${isSalam ? 'text-[#36C639]' : 'text-white'}`} />
          </div>
          <h1 className={`page-title title-animate ${themeColors.headerTitle}`}>إدارة الموظفين</h1>
          <p className={`page-subtitle subtitle-animate ${themeColors.headerSubtitle}`}>
            إدارة معلومات وبيانات جميع موظفي الشركة
          </p>
        </div>

        {/* Controls */}
        <div className={`${themeColors.cardBg} ${themeColors.cardBorder} rounded-xl shadow-lg p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="البحث في الموظفين..."
                className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus} pr-10`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeColors.textMuted}`} />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              {/* Department Filter */}
              <div className={`flex ${themeColors.filterBg} rounded-lg p-1`}>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedDepartment === dept
                        ? themeColors.activeBg
                        : `${themeColors.inactiveText} ${themeColors.hoverText}`
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className={`flex ${themeColors.filterBg} rounded-lg p-1`}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? themeColors.activeBg
                        : `${themeColors.inactiveText} ${themeColors.hoverText}`
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
                  viewMode === "grid" ? themeColors.activeBg : `${themeColors.filterBg} ${themeColors.inactiveText} ${themeColors.hoverText}`
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table" ? themeColors.activeBg : `${themeColors.filterBg} ${themeColors.inactiveText} ${themeColors.hoverText}`
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`${themeColors.cardBg} ${themeColors.cardBorder} rounded-xl shadow-lg p-12 text-center`}>
            <div className={`w-16 h-16 ${themeColors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <UserGroupIcon className={`w-8 h-8 ${themeColors.iconColor} animate-pulse`} />
            </div>
            <h3 className={`text-lg font-semibold ${themeColors.textPrimary} mb-2`}>جاري تحميل الموظفين...</h3>
            <p className={themeColors.textSecondary}>يرجى الانتظار</p>
          </div>
        )}

        {/* Employees Grid */}
        {viewMode === "grid" && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-animate">
            {filteredEmployees.map((employee: any, index: number) => {
              const name = employee.name || employee.name_ar || 'غير محدد';
              const email = employee.email || '';
              const position = employee.job_title || employee.position || 'غير محدد';
              const department = employee.department?.name || employee.department || 'غير محدد';
              const phone = employee.phone || '';
              const status = employee.is_active !== undefined ? (employee.is_active ? 'active' : 'inactive') : employee.status || 'inactive';
              const skills = employee.skills || ['JavaScript', 'React', 'TypeScript'];
              const projects = employee.projects || 0;
              const salary = employee.salary || '';
              
              return (
                <motion.div
                  key={employee.id || index}
                  whileHover={{ scale: 1.02 }}
                  className={`${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.cardHover} rounded-xl shadow-lg p-6 transition-all duration-300 cursor-pointer stagger-animate`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${themeColors.avatarBg} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status === 'active' ? 'نشط' : status === 'inactive' ? 'غير نشط' : status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className={`font-semibold ${themeColors.textPrimary} mb-1`}>{name}</h3>
                    <p className={`${themeColors.textSecondary} text-sm`}>{position}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {email && (
                      <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                        <span className="ml-2">📧</span>
                        <span className="truncate">{email}</span>
                      </div>
                    )}
                    {phone && (
                      <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                        <span className="ml-2">📱</span>
                        <span>{phone}</span>
                      </div>
                    )}
                    <div className={`flex items-center text-sm ${themeColors.textSecondary}`}>
                      <span className="ml-2">🏢</span>
                      <span>{department}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={`text-sm ${themeColors.textSecondary} mb-2`}>المهارات:</p>
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className={`px-2 py-1 ${themeColors.skillBg} text-xs rounded-full`}
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className={`px-2 py-1 ${themeColors.skillCountBg} text-xs rounded-full`}>
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`flex justify-between items-center pt-4 border-t ${isSalam ? 'border-[#003931]/20' : 'border-slate-600'}`}>
                    <span className={`${themeColors.projectsColor} font-semibold text-sm`}>
                      {projects} مشاريع
                    </span>
                    {salary && (
                      <span className={`${themeColors.salaryColor} text-sm`}>{salary}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
        {!loading && filteredEmployees.length === 0 && (
          <div className={`${themeColors.cardBg} ${themeColors.cardBorder} rounded-xl shadow-lg text-center py-12`}>
            <div className={`w-16 h-16 ${themeColors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <UserCircleIcon className={`w-8 h-8 ${themeColors.iconColor}`} />
            </div>
            <h3 className={`text-lg font-semibold ${themeColors.textPrimary} mb-2`}>لا يوجد موظفين</h3>
            <p className={themeColors.textSecondary}>لم يتم العثور على موظفين تطابق معايير البحث</p>
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
              className={`${themeColors.modalBg} ${themeColors.cardBorder} rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${themeColors.modalTitle}`}>إضافة موظف جديد</h3>
                <button onClick={() => setShowAddForm(false)} className={`${themeColors.textMuted} hover:${themeColors.textPrimary}`}>
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>الاسم الكامل</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}
                    placeholder="أدخل الاسم الكامل" 
                  />
                </div>
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}
                    placeholder="أدخل البريد الإلكتروني" 
                  />
                </div>
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}
                    placeholder="أدخل رقم الهاتف" 
                  />
                </div>
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>المنصب</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}
                    placeholder="أدخل المنصب" 
                  />
                </div>
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>القسم</label>
                  <select className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}>
                    <option value="">اختر القسم</option>
                    {departments.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block ${themeColors.textPrimary} text-sm mb-2`}>الراتب</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputFocus}`}
                    placeholder="أدخل الراتب" 
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className={`${themeColors.primaryBtn} flex-1 px-4 py-2 rounded-lg font-semibold transition-colors`}>
                    إضافة الموظف
                  </button>
                  <button 
                    type="button" 
                    className={`${themeColors.secondaryBtn} flex-1 px-4 py-2 rounded-lg font-semibold transition-colors border`}
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
          className={`fixed bottom-6 left-6 ${themeColors.primaryBtn} p-4 rounded-full shadow-lg transition-all duration-200`}
        >
          <PlusIcon className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
} 