'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useLang, useTheme } from '../ClientLayout';
import { useTranslation } from '@/lib/useTranslation';
import {
  ChartBarIcon,
  PlusIcon,
  DocumentArrowUpIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  CalendarIcon,
  UserGroupIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  ChartPieIcon,
  StarIcon,
  CogIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  progress: number;
  manager?: {
    id: number;
    name: string;
    name_ar?: string;
    email: string;
  };
  phases: Phase[];
  tasks: Task[];
  imported_from_xml: boolean;
  xml_file_path?: string;
}

interface Phase {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
  order: number;
  tasks: Task[];
}

interface Task {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  progress: number;
  order: number;
  outline_level: number;
  duration: number;
  work: number;
  cost: number;
  xml_uid?: string;
  phase_id?: number;
  parent_task_id?: number;
  subtasks: Task[];
  assignments: TaskAssignment[];
}

interface TaskAssignment {
  id: number;
  task_id: number;
  employee_id: number;
  role: string;
  units: number;
  work: number;
  assigned_at: string;
  employee: {
    id: number;
    name: string;
    name_ar?: string;
    email: string;
  };
}

interface Employee {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  job_title?: string;
}

export default function ExcellentPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('project_management');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    status: 'active',
    duration: 0,
    work: 0,
    cost: 0
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [parentProject, setParentProject] = useState<Project | null>(null);
  const [parentPhase, setParentPhase] = useState<Phase | null>(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    status: 'active',
    duration: 0,
    work: 0,
    cost: 0
  });
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    manager_id: ''
  });

  // Load projects and employees on component mount
  useEffect(() => {
    loadProjects();
    loadEmployees();
  }, []);

  // Reload projects when filters change
  useEffect(() => {
    loadProjects();
  }, [statusFilter, priorityFilter, searchTerm]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Projects loaded:', data);
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.xml')) {
      setSelectedFile(file);
    } else {
      alert(t('excellent.invalid_file'));
    }
  };

  const handleImportXML = async () => {
    if (!selectedFile) {
      alert(t('excellent.no_xml_file'));
      return;
    }

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/projects/import-xml', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(t('excellent.project_imported'));
        setShowImportModal(false);
        setSelectedFile(null);
        loadProjects();
      } else {
        const error = await response.json();
        alert(`${t('excellent.import_failed')}: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert(t('excellent.import_error'));
    } finally {
      setImporting(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setShowNewProjectModal(false);
        setNewProject({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          priority: 'medium',
          manager_id: '',
        });
        loadProjects();
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteConfirmModal(false);
        setProjectToDelete(null);
        loadProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteConfirmModal(true);
  };

  const handleUpdateTaskProgress = async (taskId: number, progress: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        loadProjects(); // Reload to get updated progress
      } else {
        alert('Failed to update task progress');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task progress');
    }
  };

  const handleAssignEmployee = async (taskId: number, employeeId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigned_employee_id: employeeId,
        }),
      });

      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setEditingTask({
      name: task.name,
      description: task.description || '',
      start_date: task.start_date.split('T')[0],
      end_date: task.end_date.split('T')[0],
      priority: task.priority,
      status: task.status,
      duration: task.duration,
      work: task.work,
      cost: task.cost
    });
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async () => {
    if (!taskToEdit) return;

    try {
      const response = await fetch(`/api/tasks/${taskToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_en: editingTask.name,
          name_ar: editingTask.name, // Use same name for both
          description: editingTask.description,
          start_date: editingTask.start_date,
          end_date: editingTask.end_date,
          priority: editingTask.priority,
          status: editingTask.status,
          duration: editingTask.duration,
          work: editingTask.work,
          cost: editingTask.cost
        }),
      });

      if (response.ok) {
        setShowEditTaskModal(false);
        setTaskToEdit(null);
        loadProjects();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

    const handleCreateTask = async () => {
    // Validate required fields
    if (!newTask.name || !newTask.start_date || !newTask.end_date) {
      alert('Please fill in all required fields: Name, Start Date, and End Date');
      return;
    }

    // Validate project selection for new tasks
    if (!parentTask && !parentPhase && !parentProject && !selectedProjectForTask) {
      alert('Please select a project for the new task');
      return;
    }

    try {
      const taskData: any = {
          name: newTask.name,
          description: newTask.description,
          start_date: newTask.start_date,
          end_date: newTask.end_date,
          priority: newTask.priority,
          status: newTask.status,
          duration: newTask.duration,
          work: newTask.work,
          cost: newTask.cost
      };

      // Add parent references
      if (parentTask) {
        taskData.parent_task_id = parentTask.id;
        // For subtasks, we need to get project_id and phase_id from context
        if (parentProject) {
          taskData.project_id = parentProject.id;
        }
        if (parentPhase) {
          taskData.phase_id = parentPhase.id;
        }
      } else if (parentPhase) {
        taskData.phase_id = parentPhase.id;
        if (parentProject) {
          taskData.project_id = parentProject.id;
        }
      } else if (parentProject) {
        taskData.project_id = parentProject.id;
      } else {
        // If no parent is set, use the selected project
        if (selectedProjectForTask) {
          taskData.project_id = selectedProjectForTask;
        } else if (projects.length > 0) {
          // Fallback to first project if none selected
          taskData.project_id = projects[0].id;
        }
      }

      console.log('Creating task with data:', taskData);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const createdTask = await response.json();
        console.log('Task created successfully:', createdTask);
        setShowAddTaskModal(false);
        setShowAddSubtaskModal(false);
        setParentTask(null);
        setParentProject(null);
        setParentPhase(null);
        setSelectedProjectForTask(null);
        setNewTask({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          priority: 'medium',
          status: 'active',
          duration: 0,
          work: 0,
          cost: 0
        });
        loadProjects();
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Unknown error';
          console.error('Failed to create task:', errorMessage);
        } catch (parseError) {
          console.error('Failed to create task and parse error response');
        }
        alert(`Failed to create task: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'on_hold': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const isOverdue = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderProgressBar = (progress: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    };

    return (
      <div className={`w-full bg-slate-700 rounded-full ${sizeClasses[size]}`}>
        <div 
          className="bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, height: '100%' }}
        />
      </div>
    );
  };

  const renderTask = (task: Task, level: number = 0) => {
    const isExpanded = expandedItems.has(`task-${task.id}`);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const assignedEmployee = task.assignments && task.assignments[0]?.employee;
    const isLate = isOverdue(task.end_date);
    const daysLeft = getDaysLeft(task.end_date);

    return (
      <div key={task.id} className="border-l-2 border-slate-700 ml-4">
        <div className={`p-3 bg-slate-800/50 rounded-lg mb-2 ${isLate ? 'border-l-red-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              {hasSubtasks && (
                <button
                  onClick={() => toggleExpanded(`task-${task.id}`)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-white">
                    {task.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.progress === 100 && (
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  )}
                  {isLate && (
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(task.end_date).toLocaleDateString()}</span>
                  </div>
                  {task.duration > 0 && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{Math.round(task.duration)}{t('excellent.duration_hours')}</span>
                    </div>
                  )}
                  {task.work > 0 && (
                    <div className="flex items-center space-x-1">
                      <CogIcon className="w-4 h-4" />
                      <span>{Math.round(task.work)}{t('excellent.duration_hours')} {t('excellent.work_hours')}</span>
                    </div>
                  )}
                  {assignedEmployee && (
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{lang === 'ar' ? assignedEmployee.name_ar : assignedEmployee.name}</span>
                    </div>
                  )}
                  {isLate && (
                    <div className="text-red-400">
                      {Math.abs(daysLeft)} {t('excellent.days')} {t('excellent.overdue')}
                    </div>
                  )}
                  {!isLate && daysLeft <= 7 && daysLeft > 0 && (
                    <div className="text-yellow-400">
                      {daysLeft} {t('excellent.days')} {t('excellent.left')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-32">
                {renderProgressBar(task.progress, 'sm')}
                <div className="text-xs text-slate-400 mt-1">{task.progress}%</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => handleUpdateTaskProgress(task.id, parseInt(e.target.value))}
                  className="w-20"
                />
                
                <select
                  value={assignedEmployee?.id || ''}
                  onChange={(e) => handleAssignEmployee(task.id, parseInt(e.target.value))}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
                >
                  <option value="">{t('excellent.select_employee')}</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {lang === 'ar' ? emp.name_ar : emp.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit Task"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    setParentTask(task);
                    setParentProject(null);
                    setParentPhase(null);
                    setShowAddSubtaskModal(true);
                  }}
                  className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors"
                  title="Add Subtask"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasSubtasks && isExpanded && (
          <div className="ml-4">
            {task.subtasks?.map(subtask => renderTask(subtask, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPhase = (phase: Phase) => {
    const isExpanded = expandedItems.has(`phase-${phase.id}`);
    const hasTasks = phase.tasks && phase.tasks.length > 0;

    return (
      <div key={phase.id} className="mb-6">
        <div className="bg-slate-800/80 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {hasTasks && (
                <button
                  onClick={() => toggleExpanded(`phase-${phase.id}`)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
              )}
              
              <h3 className="text-lg font-semibold text-white">
                {phase.name}
              </h3>
              <span className={`text-sm px-2 py-1 rounded ${getStatusColor(phase.status)}`}>
                {phase.status}
              </span>
              {phase.description && (
                <span className="text-sm text-slate-400 ml-2">
                  {phase.description}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">
                  {new Date(phase.start_date).toLocaleDateString()} - {new Date(phase.end_date).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-400">
                  {phase.tasks?.length || 0} {t('excellent.tasks_in_phase')}
                </div>
              </div>
              <div className="w-48">
                {renderProgressBar(phase.progress, 'md')}
                <div className="text-sm text-slate-400 mt-1">{phase.progress}% complete</div>
              </div>
              
              <button
                onClick={() => {
                  setParentPhase(phase);
                  setParentProject(null);
                  setParentTask(null);
                  setShowAddTaskModal(true);
                }}
                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors"
                title="Add Task to Phase"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {hasTasks && isExpanded && (
            <div className="space-y-2">
              {phase.tasks?.map(task => renderTask(task))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProject = (project: Project) => {
    const isExpanded = expandedItems.has(`project-${project.id}`);
    const hasPhases = project.phases && project.phases.length > 0;
    const hasTasks = project.tasks && project.tasks.length > 0;

    return (
      <div key={project.id} className="card mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {(hasPhases || hasTasks) && (
                <button
                  onClick={() => toggleExpanded(`project-${project.id}`)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-6 h-6" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6" />
                  )}
                </button>
              )}
              
              <div>
                <h2 className="text-xl font-bold text-white">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="text-slate-400 mt-1">{project.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                  <span>{project.phases?.length || 0} {t('excellent.phases_count')}</span>
                  <span>{project.tasks?.length || 0} {t('excellent.tasks_count')}</span>
                  {project.imported_from_xml && (
                    <span className="text-blue-400">{t('excellent.imported_from_xml')}</span>
                  )}
                  {project.tasks && project.tasks.length > 0 && (
                    <span>
                      {Math.round(project.tasks.reduce((sum, task) => sum + (task.duration || 0), 0))} {t('excellent.duration_hours')} {t('excellent.total_duration')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </div>
                {project.manager && (
                  <div className="text-sm text-slate-400">
                    {t('excellent.manager')}: {lang === 'ar' ? project.manager.name_ar : project.manager.name}
                  </div>
                )}
              </div>
              
              <div className="w-64">
                {renderProgressBar(project.progress, 'lg')}
                <div className="text-sm text-slate-400 mt-1">{project.progress}% complete</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm px-3 py-1 rounded ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`text-sm px-3 py-1 rounded ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                {project.imported_from_xml && (
                  <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-400 rounded">
                    XML
                  </span>
                )}
                <button
                  onClick={() => confirmDeleteProject(project)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              {hasPhases && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t('excellent.phases')}</h3>
                  {project.phases?.map(phase => renderPhase(phase))}
                </div>
              )}
              
              {hasTasks && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{t('excellent.tasks')}</h3>
                    <button
                      onClick={() => {
                        setParentProject(project);
                        setParentPhase(null);
                        setParentTask(null);
                        setShowAddTaskModal(true);
                      }}
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors"
                      title="Add Task to Project"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {project.tasks?.map(task => renderTask(task))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Theme colors based on current theme
  const colors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    primaryHover: theme === 'light' ? 'text-green-500' : 'text-green-300',
    primaryBg: theme === 'light' ? 'bg-green-600' : 'bg-green-500',
    primaryBgHover: theme === 'light' ? 'bg-green-500' : 'bg-green-400',
    cardBg: theme === 'light' ? 'bg-white' : 'bg-slate-900',
    cardBgHover: theme === 'light' ? 'bg-slate-50' : 'bg-slate-800',
    textPrimary: theme === 'light' ? 'text-slate-900' : 'text-white',
    textSecondary: theme === 'light' ? 'text-slate-600' : 'text-slate-400',
    borderPrimary: theme === 'light' ? 'border-slate-200' : 'border-slate-700',
    borderHover: theme === 'light' ? 'border-green-500' : 'border-green-500',
    inputBg: theme === 'light' ? 'bg-white' : 'bg-slate-800',
    inputBorder: theme === 'light' ? 'border-slate-300' : 'border-slate-700',
    iconBg: theme === 'light' ? 'bg-slate-200' : 'bg-slate-800',
    glassBg: theme === 'light' ? 'bg-white/80' : 'bg-slate-900/80',
    glassBorder: theme === 'light' ? 'border-green-500/20' : 'border-green-500/20'
  };

  // Tab configuration
  const tabs = [
    {
      id: 'project_management',
      name: t('excellent.tabs.project_management'),
      icon: ChartBarIcon,
      description: 'Manage projects, phases, tasks, and assignments'
    },
    {
      id: 'quality_assurance',
      name: t('excellent.tabs.quality_assurance'),
      icon: CheckCircleIcon,
      description: 'Quality control and assurance processes'
    },
    {
      id: 'performance_monitoring',
      name: t('excellent.tabs.performance_monitoring'),
      icon: ChartPieIcon,
      description: 'Monitor and track performance metrics'
    },
    {
      id: 'excellence_standards',
      name: t('excellent.tabs.excellence_standards'),
      icon: StarIcon,
      description: 'Excellence standards and best practices'
    }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'project_management':
        return renderProjectManagement();
      case 'quality_assurance':
        return renderQualityAssurance();
      case 'performance_monitoring':
        return renderPerformanceMonitoring();
      case 'excellence_standards':
        return renderExcellenceStandards();
      default:
        return renderProjectManagement();
    }
  };

  const renderProjectManagement = () => (
    <div>
        {/* Controls */}
      <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg mb-8 content-animate`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                placeholder={t('excellent.search_projects')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
              className={`${colors.primaryBg} text-white px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <CloudArrowUpIcon className="w-5 h-5" />
              <span>{t('excellent.import_xml')}</span>
              </button>
              
              <button
                onClick={() => setShowNewProjectModal(true)}
              className={`bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <PlusIcon className="w-5 h-5" />
              <span>{t('excellent.new_project')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.total_projects')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-purple-400 transition-colors duration-200`}>{projects.length}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
          </div>
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.active_projects')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-blue-400 transition-colors duration-200`}>
              {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
          </div>
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-yellow-500/50 hover:bg-gradient-to-br hover:from-yellow-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.completed_projects')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-yellow-400 transition-colors duration-200`}>
              {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <StarIcon className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
          </div>
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.avg_progress')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-purple-400 transition-colors duration-200`}>
              {projects.length > 0 
                ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
                  : 0}%
              </p>
            </div>
            <ChartPieIcon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
        
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-red-500/50 hover:bg-gradient-to-br hover:from-red-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.high_priority')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-red-400 transition-colors duration-200`}>
                {projects.filter(p => p.priority === 'high' || p.priority === 'critical').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`${colors.textSecondary}`}>{t('excellent.loading_projects')}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="card text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('excellent.no_projects')}</h3>
              <p className="text-slate-400 mb-6">{t('excellent.import_first')}</p>
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-primary"
              >
                {t('excellent.import_xml')}
              </button>
            </div>
          ) : (
            projects.map(project => renderProject(project))
          )}
        </div>
      </div>
  );

  const renderQualityAssurance = () => (
    <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg content-animate`}>
      <div className="text-center py-12">
        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-2`}>Quality Assurance</h3>
        <p className={`${colors.textSecondary}`}>Quality control and assurance processes will be implemented here.</p>
      </div>
    </div>
  );

  const renderPerformanceMonitoring = () => (
    <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg content-animate`}>
      <div className="text-center py-12">
        <ChartPieIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-2`}>Performance Monitoring</h3>
        <p className={`${colors.textSecondary}`}>Performance monitoring and metrics tracking will be implemented here.</p>
            </div>
    </div>
  );

  const renderExcellenceStandards = () => (
    <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-xl shadow-lg content-animate`}>
      <div className="text-center py-12">
        <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-2`}>Excellence Standards</h3>
        <p className={`${colors.textSecondary}`}>Excellence standards and best practices will be implemented here.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="page-header content-animate">
          <div className="page-header-icon icon-animate">
            <StarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="page-title title-animate">
            {t('excellent.title')}
          </h1>
          <p className="page-subtitle subtitle-animate">
            {t('excellent.intro')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 content-animate">
          <div className={`flex rounded-lg p-1 ${colors.cardBg} border ${colors.borderPrimary}`}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? `${colors.primaryBg} text-white shadow-lg`
                      : `${colors.textSecondary} hover:${colors.textPrimary}`
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
              </button>
              );
            })}
            </div>
          </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">{t('excellent.new_project')}</h3>
            <div className="mb-4">
              <label htmlFor="newProjectName" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.name')}
              </label>
                <input
                  type="text"
                id="newProjectName"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
            <div className="mb-4">
              <label htmlFor="newProjectDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
                <textarea
                id="newProjectDescription"
                  value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
            <div className="mb-4">
              <label htmlFor="newProjectStartDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.start_date')}
              </label>
                  <input
                    type="date"
                id="newProjectStartDate"
                    value={newProject.start_date}
                onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
            <div className="mb-4">
              <label htmlFor="newProjectEndDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.end_date')}
              </label>
                  <input
                    type="date"
                id="newProjectEndDate"
                    value={newProject.end_date}
                onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
            <div className="mb-4">
              <label htmlFor="newProjectPriority" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.priority')}
              </label>
                  <select
                id="newProjectPriority"
                    value={newProject.priority}
                onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
            <div className="mb-4">
              <label htmlFor="newProjectManager" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.manager')}
              </label>
                  <select
                id="newProjectManager"
                    value={newProject.manager_id}
                onChange={(e) => setNewProject({ ...newProject, manager_id: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  >
                <option value="">{t('excellent.select_manager')}</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {lang === 'ar' ? emp.name_ar : emp.name}
                      </option>
                    ))}
                  </select>
                </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200"
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-all duration-200"
              >
                {t('excellent.create_project')}
              </button>
              </div>
            </div>
        </div>
      )}

      {/* Import XML Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">{t('excellent.import_xml')}</h3>
            <p className="text-slate-400 mb-4">{t('excellent.import_xml_description')}</p>
            <input
              type="file"
              accept=".xml"
              onChange={handleFileSelect}
              className="block w-full text-sm text-slate-400 border border-slate-600 rounded-lg cursor-pointer bg-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200"
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleImportXML}
                disabled={importing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? `${t('excellent.importing')}...` : t('excellent.import_xml')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">{t('excellent.confirm_delete')}</h3>
            <p className="text-slate-400 mb-6">{t('excellent.deleteConfirm')}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200"
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? `${t('excellent.deleting')}...` : t('excellent.delete')}
              </button>
              </div>
              </div>
            </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && taskToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">{t('excellent.edit_task')}</h3>
            <div className="mb-4">
              <label htmlFor="editTaskNameEn" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="editTaskNameEn"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
              </div>

            <div className="mb-4">
              <label htmlFor="editTaskDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
              <textarea
                id="editTaskDescription"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskStartDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.start_date')}
              </label>
              <input
                type="date"
                id="editTaskStartDate"
                value={editingTask.start_date}
                onChange={(e) => setEditingTask({ ...editingTask, start_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskEndDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.end_date')}
              </label>
              <input
                type="date"
                id="editTaskEndDate"
                value={editingTask.end_date}
                onChange={(e) => setEditingTask({ ...editingTask, end_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskPriority" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.priority')}
              </label>
              <select
                id="editTaskPriority"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskStatus" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.status')}
              </label>
              <select
                id="editTaskStatus"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskDuration" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.duration_hours')}
              </label>
              <input
                type="number"
                id="editTaskDuration"
                value={editingTask.duration}
                onChange={(e) => setEditingTask({ ...editingTask, duration: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskWork" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.work_hours')}
              </label>
              <input
                type="number"
                id="editTaskWork"
                value={editingTask.work}
                onChange={(e) => setEditingTask({ ...editingTask, work: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editTaskCost" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.cost')}
              </label>
              <input
                type="number"
                id="editTaskCost"
                value={editingTask.cost}
                onChange={(e) => setEditingTask({ ...editingTask, cost: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200"
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleUpdateTask}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-all duration-200"
              >
                {t('excellent.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              {parentTask ? t('excellent.add_subtask') : t('excellent.add_task')}
            </h3>
            {!parentTask && !parentPhase && !parentProject && (
              <div className="mb-4">
                <label htmlFor="newTaskProject" className="block text-sm font-medium text-slate-400 mb-1">
                  {t('excellent.project')}
                </label>
                <select
                  id="newTaskProject"
                  value={selectedProjectForTask || ''}
                  onChange={(e) => setSelectedProjectForTask(e.target.value ? parseInt(e.target.value) : null)}
                  className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                >
                  <option value="">{t('excellent.select_project')}</option>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>{t('excellent.no_projects')}</option>
                  )}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="newTaskNameEn" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="newTaskNameEn"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newTaskDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
              <textarea
                id="newTaskDescription"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskStartDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.start_date')}
              </label>
              <input
                type="date"
                id="newTaskStartDate"
                value={newTask.start_date}
                onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskEndDate" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.end_date')}
              </label>
              <input
                type="date"
                id="newTaskEndDate"
                value={newTask.end_date}
                onChange={(e) => setNewTask({ ...newTask, end_date: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskPriority" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.priority')}
              </label>
              <select
                id="newTaskPriority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskStatus" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.status')}
              </label>
              <select
                id="newTaskStatus"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskDuration" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.duration_hours')}
              </label>
              <input
                type="number"
                id="newTaskDuration"
                value={newTask.duration}
                onChange={(e) => setNewTask({ ...newTask, duration: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskWork" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.work_hours')}
              </label>
              <input
                type="number"
                id="newTaskWork"
                value={newTask.work}
                onChange={(e) => setNewTask({ ...newTask, work: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newTaskCost" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.cost')}
              </label>
              <input
                type="number"
                id="newTaskCost"
                value={newTask.cost}
                onChange={(e) => setNewTask({ ...newTask, cost: parseFloat(e.target.value) })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setShowAddSubtaskModal(false);
                  setParentTask(null);
                  setParentProject(null);
                  setParentPhase(null);
                  setSelectedProjectForTask(null);
                }}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-500 transition-all duration-200"
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleCreateTask}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-all duration-200"
              >
                {t('excellent.create')}
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
} 