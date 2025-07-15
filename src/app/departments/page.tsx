"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Mock Data
const departments = [
  {
    id: 1,
    name: "قسم التطوير",
    description: "تطوير البرمجيات والتطبيقات",
    employeeCount: 12,
    projects: 8,
    budget: "500,000 ريال",
    manager: "أحمد محمد",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    status: "نشط"
  },
  {
    id: 2,
    name: "قسم التصميم",
    description: "تصميم واجهات المستخدم والهوية البصرية",
    employeeCount: 6,
    projects: 5,
    budget: "200,000 ريال",
    manager: "فاطمة علي",
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    status: "نشط"
  },
  {
    id: 3,
    name: "قسم إدارة المشاريع",
    description: "إدارة وتنسيق المشاريع",
    employeeCount: 4,
    projects: 12,
    budget: "300,000 ريال",
    manager: "محمد حسن",
    skills: ["Agile", "Scrum", "Jira", "Trello"],
    status: "نشط"
  },
  {
    id: 4,
    name: "قسم الموارد البشرية",
    description: "إدارة شؤون الموظفين والتوظيف",
    employeeCount: 3,
    projects: 2,
    budget: "150,000 ريال",
    manager: "سارة أحمد",
    skills: ["التوظيف", "التدريب", "التقييم", "الرواتب"],
    status: "نشط"
  }
];

const employees = [
  { id: 1, name: "أحمد محمد", position: "مطور Full Stack", department: "التطوير", status: "متاح" },
  { id: 2, name: "فاطمة علي", position: "مصممة UI/UX", department: "التصميم", status: "مشغول" },
  { id: 3, name: "محمد حسن", position: "مدير مشاريع", department: "الإدارة", status: "متاح" },
  { id: 4, name: "سارة أحمد", position: "مديرة موارد بشرية", department: "الموارد البشرية", status: "إجازة" }
];

export default function DepartmentsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح": return "bg-green-600";
      case "مشغول": return "bg-yellow-600";
      case "إجازة": return "bg-blue-600";
      default: return "bg-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">إدارة الأقسام</h1>
          <p className="text-slate-300/70 mt-2">إدارة أقسام الشركة وموظفيها</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Departments List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <motion.div
                  key={dept.id}
                  whileHover={{ scale: 1.02 }}
                  className={`card cursor-pointer hover:shadow-lg transition-all duration-300 ${
                    selectedDepartment === dept.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{dept.name}</h3>
                      <p className="text-slate-300/70 text-sm">{dept.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dept.status === "نشط" ? "bg-green-600/10 text-green-400" : "bg-red-600/10 text-red-400"
                    }`}>
                      {dept.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{dept.employeeCount}</div>
                      <div className="text-xs text-slate-300/70">موظف</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-500 font-semibold">{dept.projects}</div>
                      <div className="text-xs text-slate-300/70">مشاريع</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-500 font-semibold">{dept.budget}</div>
                      <div className="text-xs text-slate-300/70">الميزانية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">{dept.manager}</div>
                      <div className="text-xs text-slate-300/70">المدير</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300/70 mb-2">المهارات المطلوبة:</p>
                    <div className="flex flex-wrap gap-2">
                      {dept.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-600/10 text-blue-400 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <span className="px-2 py-1 bg-blue-600/10 text-blue-400 text-xs rounded-full">
                      {dept.employeeCount} موظف نشط
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Department Details */}
          <div className="lg:col-span-1">
            {selectedDepartment ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-600">
                    تفاصيل القسم
                  </h2>
                  <button
                    onClick={() => setSelectedDepartment(null)}
                    className="text-slate-300/70 hover:text-blue-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {(() => {
                  const dept = departments.find(d => d.id === selectedDepartment);
                  if (!dept) return null;

                  return (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-700 rounded-lg">
                          <UserGroupIcon className="w-5 h-5 text-blue-500 ml-2 mx-auto mb-2" />
                          <h4 className="font-semibold text-slate-100">الموظفين</h4>
                          <div className="text-2xl font-bold text-blue-500">{dept.employeeCount}</div>
                          <p className="text-sm text-slate-300/70">إجمالي الموظفين</p>
                        </div>
                        
                        <div className="text-center p-4 bg-slate-700 rounded-lg">
                          <ChartBarIcon className="w-5 h-5 text-green-500 ml-2 mx-auto mb-2" />
                          <h4 className="font-semibold text-slate-100">المشاريع</h4>
                          <div className="text-2xl font-bold text-green-500">{dept.projects}</div>
                          <p className="text-sm text-slate-300/70">المشاريع النشطة</p>
                        </div>
                        
                        <div className="text-center p-4 bg-slate-700 rounded-lg">
                          <CogIcon className="w-5 h-5 text-red-500 ml-2 mx-auto mb-2" />
                          <h4 className="font-semibold text-slate-100">الميزانية</h4>
                          <div className="text-2xl font-bold text-red-500">{dept.budget}</div>
                          <p className="text-sm text-slate-300/70">الميزانية السنوية</p>
                        </div>
                      </div>

                      {/* Employees List */}
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-4">قائمة الموظفين</h4>
                        <div className="space-y-2">
                          {employees
                            .filter(emp => emp.department === dept.name.split(" ")[1])
                            .map(employee => (
                              <div key={employee.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                                <div>
                                  <div className="font-medium text-slate-100">{employee.name}</div>
                                  <div className="text-sm text-slate-300/70">{employee.position}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                  {employee.status}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-4">المهارات المطلوبة</h4>
                        <div className="flex flex-wrap gap-2">
                          {dept.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-blue-600/10 text-blue-400 rounded-lg text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="card text-center">
                <CogIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">اختر قسم</h3>
                <p className="text-slate-300/70">اضغط على أي قسم لعرض تفاصيله</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Department Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-4">إضافة قسم جديد</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-slate-100 text-sm mb-2">اسم القسم</label>
                  <input type="text" className="input-field" placeholder="أدخل اسم القسم" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">الوصف</label>
                  <textarea className="input-field" rows={3} placeholder="أدخل وصف القسم"></textarea>
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">مدير القسم</label>
                  <input type="text" className="input-field" placeholder="أدخل اسم المدير" />
                </div>
                <div>
                  <label className="block text-slate-100 text-sm mb-2">الميزانية</label>
                  <input type="text" className="input-field" placeholder="أدخل الميزانية" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">إضافة القسم</button>
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