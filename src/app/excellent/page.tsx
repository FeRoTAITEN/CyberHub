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
  UserGroupIcon,
  PencilIcon,
  CheckCircleIcon,
  ChartPieIcon,
  StarIcon,
  ClockIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
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
  baseline_start?: string;
  baseline_finish?: string;
  actual_start?: string;
  actual_finish?: string;
}

interface Phase {
  id: number;
  name: string;
  description?: string;
  status: string;
  progress: number;
  order: number;
  tasks: Task[];
  baseline_start?: string;
  baseline_finish?: string;
  actual_start?: string;
  actual_finish?: string;
}

interface Task {
  id: number;
  name: string;
  description?: string;
  status: string;
  progress: number;
  order: number;
  outline_level: number;
  duration: number;
  xml_uid?: string;
  phase_id?: number;
  parent_task_id?: number;
  baseline_start?: string;
  baseline_finish?: string;
  actual_start?: string;
  actual_finish?: string;
  subtasks: Task[];
  assignments: TaskAssignment[];
}

interface TaskAssignment {
  id: number;
  task_id: number;
  employee_id: number;
  role: string;
  units: number;
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Delete modals for phases and tasks
  const [showDeletePhaseModal, setShowDeletePhaseModal] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<Phase | null>(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  // Custom Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  
  const [editingTask, setEditingTask] = useState({
    name: '',
    description: '',
    status: 'active',
    duration: 0,
    baseline_start: '',
    baseline_finish: '',
    actual_start: '',
    actual_finish: ''
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [parentProject, setParentProject] = useState<Project | null>(null);
  const [parentPhase, setParentPhase] = useState<Phase | null>(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'active',
    duration: 0,
    baseline_start: '',
    baseline_finish: '',
    actual_start: '',
    actual_finish: ''
  });
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    manager_id: ''
  });

  // Edit Project Modal State
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState({
    name: '',
    description: '',
    status: 'active',
    manager_id: '',
    baseline_start: '',
    baseline_finish: '',
    actual_start: '',
    actual_finish: ''
  });

  // Add Phase Modal State
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false);
  const [selectedProjectForPhase, setSelectedProjectForPhase] = useState<Project | null>(null);
  const [newPhase, setNewPhase] = useState({
    name: '',
    description: '',
    status: 'active',
    baseline_start: '',
    baseline_finish: '',
    actual_start: '',
    actual_finish: ''
  });

  // Edit Phase Modal State
  const [showEditPhaseModal, setShowEditPhaseModal] = useState(false);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);
  const [editingPhase, setEditingPhase] = useState({
    name: '',
    description: '',
    status: 'active',
    baseline_start: '',
    baseline_finish: '',
    actual_start: '',
    actual_finish: ''
  });

  // Dragging state for progress bars
  const [isDragging, setIsDragging] = useState(false);
  const [dragTaskId, setDragTaskId] = useState<number | null>(null);
  const [tempProgress, setTempProgress] = useState<number | null>(null);

  // State for scroll position preservation
  const [scrollPosition, setScrollPosition] = useState(0);



  // Load projects and employees on component mount
  useEffect(() => {
    loadProjects();
    loadEmployees();
  }, []);

  // Reload projects when filters change
  useEffect(() => {
    loadProjects();
  }, [statusFilter, searchTerm]);

  // Debug modal state
  useEffect(() => {
    if (showDeleteConfirmModal) {
      console.log('Delete modal opened for project:', projectToDelete);
    }
  }, [showDeleteConfirmModal, projectToDelete]);

  // Add mouse and touch event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, dragTaskId, tempProgress]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Projects loaded:', data);
        setProjects(data);
        // Calculate progress stats after loading projects
        setTimeout(() => {
    
          // Restore scroll position after data is loaded
          restoreScrollPosition();
        }, 100);
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
      showCustomAlert(t('excellent.invalid_file'), 'error');
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.xml')) {
        setSelectedFile(file);
      } else {
        showCustomAlert(t('excellent.invalid_file'), 'error');
      }
    }
  };

  // Custom Alert Function
  const showCustomAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  // Update Progress Stats
  const updateProgressStats = () => {

  };

  // Calculate Progress Statistics - removed unused function

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImportXML = async () => {
    if (!selectedFile) {
      showCustomAlert(t('excellent.no_xml_file'), 'warning');
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
        await response.json(); // Response is not used
        showCustomAlert(t('excellent.project_imported'), 'success');
        setShowImportModal(false);
        setSelectedFile(null);
        loadProjects();
        updateProgressStats();
      } else {
        const error = await response.json();
        showCustomAlert(`${t('excellent.import_failed')}: ${error.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Import error:', error);
      showCustomAlert(t('excellent.import_error'), 'error');
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
    console.log('confirmDeleteProject called with:', project);
    setProjectToDelete(project);
    setShowDeleteConfirmModal(true);
    console.log('showDeleteConfirmModal set to true');
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setEditingProject({
      name: project.name,
      description: project.description || '',
      status: project.status,
      manager_id: project.manager?.id?.toString() || '',
      baseline_start: project.baseline_start ? project.baseline_start.split('T')[0] : '',
      baseline_finish: project.baseline_finish ? project.baseline_finish.split('T')[0] : '',
      actual_start: project.actual_start ? project.actual_start.split('T')[0] : '',
      actual_finish: project.actual_finish ? project.actual_finish.split('T')[0] : ''
    });
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async () => {
    if (!projectToEdit) return;

    try {
      const response = await fetch(`/api/projects/${projectToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          manager_id: editingProject.manager_id ? parseInt(editingProject.manager_id) : null,
          baseline_start: editingProject.baseline_start || null,
          baseline_finish: editingProject.baseline_finish || null,
          actual_start: editingProject.actual_start || null,
          actual_finish: editingProject.actual_finish || null
        }),
      });

      if (response.ok) {
        setShowEditProjectModal(false);
        setProjectToEdit(null);
        loadProjects();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCreatePhase = async () => {
    if (!selectedProjectForPhase) {
      showCustomAlert('Please select a project for the new phase', 'warning');
      return;
    }

    if (!newPhase.name) {
      showCustomAlert('Please fill in all required fields: Name', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/phases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPhase.name,
          description: newPhase.description,
          status: newPhase.status,
          project_id: selectedProjectForPhase.id,
          baseline_start: newPhase.baseline_start || null,
          baseline_finish: newPhase.baseline_finish || null,
          actual_start: newPhase.actual_start || null,
          actual_finish: newPhase.actual_finish || null
        }),
      });

      if (response.ok) {
        setShowAddPhaseModal(false);
        setSelectedProjectForPhase(null);
        setNewPhase({
          name: '',
          description: '',
          status: 'active',
          baseline_start: '',
          baseline_finish: '',
          actual_start: '',
          actual_finish: ''
        });
        loadProjects();
      }
    } catch (error) {
      console.error('Error creating phase:', error);
    }
  };

  const handleEditPhase = (phase: Phase) => {
    setPhaseToEdit(phase);
    setEditingPhase({
      name: phase.name,
      description: phase.description || '',
      status: phase.status,
      baseline_start: phase.baseline_start ? phase.baseline_start.split('T')[0] : '',
      baseline_finish: phase.baseline_finish ? phase.baseline_finish.split('T')[0] : '',
      actual_start: phase.actual_start ? phase.actual_start.split('T')[0] : '',
      actual_finish: phase.actual_finish ? phase.actual_finish.split('T')[0] : ''
    });
    setShowEditPhaseModal(true);
  };

  const handleUpdatePhase = async () => {
    if (!phaseToEdit) return;

    try {
      const response = await fetch(`/api/phases/${phaseToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingPhase.name,
          description: editingPhase.description,
          status: editingPhase.status,
          baseline_start: editingPhase.baseline_start || null,
          baseline_finish: editingPhase.baseline_finish || null,
          actual_start: editingPhase.actual_start || null,
          actual_finish: editingPhase.actual_finish || null
        }),
      });

      if (response.ok) {
        setShowEditPhaseModal(false);
        setPhaseToEdit(null);
        loadProjects();
      }
    } catch (error) {
      console.error('Error updating phase:', error);
    }
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
        // Save scroll position before reloading
        saveScrollPosition();
        loadProjects(); // Reload to get updated progress
        updateProgressStats();
        // Restore scroll position after reload
        restoreScrollPosition();
      } else {
        showCustomAlert('Failed to update task progress', 'error');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showCustomAlert('Failed to update task progress', 'error');
    }
  };

  // Dragging handlers for progress bars
  const handleMouseDown = (taskId: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragTaskId(taskId);
    
    // Calculate initial percentage
    const rect = e.currentTarget.getBoundingClientRect();
    let percentage;
    if (lang === 'ar') {
      // For Arabic: reverse the direction (right to left)
      percentage = Math.max(0, Math.min(100, ((rect.right - e.clientX) / rect.width) * 100));
    } else {
      // For English: normal direction (left to right)
      percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    }
    setTempProgress(Math.round(percentage));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragTaskId) return;
    
    const progressBar = document.querySelector(`[data-task-id="${dragTaskId}"]`) as HTMLElement;
    if (!progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    let percentage;
    if (lang === 'ar') {
      // For Arabic: reverse the direction (right to left)
      percentage = Math.max(0, Math.min(100, ((rect.right - e.clientX) / rect.width) * 100));
    } else {
      // For English: normal direction (left to right)
      percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    }
    
    // Update visual progress immediately without API call
    setTempProgress(Math.round(percentage));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !dragTaskId) return;
    
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    if (!touch) return;
    
    const progressBar = document.querySelector(`[data-task-id="${dragTaskId}"]`) as HTMLElement;
    if (!progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    let percentage;
    if (lang === 'ar') {
      // For Arabic: reverse the direction (right to left)
      percentage = Math.max(0, Math.min(100, ((rect.right - touch.clientX) / rect.width) * 100));
    } else {
      // For English: normal direction (left to right)
      percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    }
    
    // Update visual progress immediately without API call
    setTempProgress(Math.round(percentage));
  };

  const handleMouseUp = async () => {
    if (dragTaskId && tempProgress !== null) {
      // Only here we send data to API
      await handleUpdateTaskProgress(dragTaskId, tempProgress);
    }
    
    // Clean up state
    setIsDragging(false);
    setDragTaskId(null);
    setTempProgress(null);
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
        // Save scroll position before reloading
        saveScrollPosition();
        loadProjects();
        // Restore scroll position after reload
        restoreScrollPosition();
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    // Find the task in the current projects
    let currentTask: Task | null = null;
    for (const project of projects) {
      // Check project-level tasks
      const foundTask = project.tasks?.find(t => t.id === taskId);
      if (foundTask) {
        currentTask = foundTask;
        break;
      }
      // Check tasks in phases
      for (const phase of project.phases || []) {
        const foundTask = phase.tasks?.find(t => t.id === taskId);
        if (foundTask) {
          currentTask = foundTask;
          break;
        }
        // Check subtasks
        for (const task of phase.tasks || []) {
          const foundSubtask = task.subtasks?.find(st => st.id === taskId);
          if (foundSubtask) {
            currentTask = foundSubtask;
            break;
          }
        }
        if (currentTask) break;
    }
      if (currentTask) break;
    }
    
    if (currentTask) {
      setTaskToDelete(currentTask);
      setShowDeleteTaskModal(true);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteTaskModal(false);
        setTaskToDelete(null);
        
        // Save scroll position before reloading
        saveScrollPosition();
        loadProjects();
        // Restore scroll position after reload
        restoreScrollPosition();
      } else {
        showCustomAlert('Failed to delete task', 'error');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showCustomAlert('Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePhase = async (phaseId: number) => {
    // Find the phase in the current projects
    let currentPhase: Phase | null = null;
    for (const project of projects) {
      const foundPhase = project.phases?.find(p => p.id === phaseId);
      if (foundPhase) {
        currentPhase = foundPhase;
        break;
      }
    }
    
    if (currentPhase) {
      setPhaseToDelete(currentPhase);
      setShowDeletePhaseModal(true);
    }
  };

  const confirmDeletePhase = async () => {
    if (!phaseToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/phases/${phaseToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeletePhaseModal(false);
        setPhaseToDelete(null);
        loadProjects();
      } else {
        showCustomAlert('Failed to delete phase', 'error');
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      showCustomAlert('Failed to delete phase', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setEditingTask({
      name: task.name,
      description: task.description || '',
      status: task.status,
      duration: task.duration,
      baseline_start: task.baseline_start ? task.baseline_start.split('T')[0] : '',
      baseline_finish: task.baseline_finish ? task.baseline_finish.split('T')[0] : '',
      actual_start: task.actual_start ? task.actual_start.split('T')[0] : '',
      actual_finish: task.actual_finish ? task.actual_finish.split('T')[0] : ''
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
          status: editingTask.status,
          duration: editingTask.duration,
          baseline_start: editingTask.baseline_start || null,
          baseline_finish: editingTask.baseline_finish || null,
          actual_start: editingTask.actual_start || null,
          actual_finish: editingTask.actual_finish || null
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
    if (!newTask.name) {
      showCustomAlert('Please fill in all required fields: Name', 'warning');
      return;
    }

    // Validate project selection for new tasks
    if (!parentTask && !parentPhase && !parentProject && !selectedProjectForTask) {
      showCustomAlert('Please select a project for the new task', 'warning');
    }

    try {
      const taskData: any = {
          name: newTask.name,
          description: newTask.description,
          status: newTask.status,
          duration: newTask.duration,
          baseline_start: newTask.baseline_start || null,
          baseline_finish: newTask.baseline_finish || null,
          actual_start: newTask.actual_start || null,
          actual_finish: newTask.actual_finish || null
      };

      // Add parent references
      if (parentTask) {
        taskData.parent_task_id = parentTask.id;
        // For subtasks, we need to get project_id from the parent task's project
        // Find the project that contains this parent task
        for (const project of projects) {
          const foundTask = findTaskInProject(project, parentTask.id);
          if (foundTask) {
            taskData.project_id = project.id;
                    // Set outline_level for subtasks
        taskData.outline_level = foundTask.outline_level + 1;
        // Set order for subtasks (next available order)
        const maxOrder = Math.max(...foundTask.subtasks.map(st => st.order), 0);
        taskData.order = maxOrder + 1;
        break;
      }
    }
        } else if (parentPhase) {
        taskData.phase_id = parentPhase.id;
        // Find the project that contains this phase
        for (const project of projects) {
          const foundPhase = project.phases.find(phase => phase.id === parentPhase.id);
          if (foundPhase) {
            taskData.project_id = project.id;
            // Set order for phase tasks (next available order)
            const maxOrder = Math.max(...foundPhase.tasks.map(t => t.order), 0);
            taskData.order = maxOrder + 1;
            break;
          }
        }
      } else if (parentProject) {
        taskData.project_id = parentProject.id;
        // Set order for project tasks (next available order)
        const maxOrder = Math.max(...parentProject.tasks.map(t => t.order), 0);
        taskData.order = maxOrder + 1;
      } else {
        // If no parent is set, use the selected project
        if (selectedProjectForTask) {
          taskData.project_id = selectedProjectForTask;
          // Find the project and set order
          const project = projects.find(p => p.id === selectedProjectForTask);
          if (project) {
            const maxOrder = Math.max(...project.tasks.map(t => t.order), 0);
            taskData.order = maxOrder + 1;
          }
        } else if (projects.length > 0) {
          // Fallback to first project if none selected
          taskData.project_id = projects[0].id;
          const maxOrder = Math.max(...projects[0].tasks.map(t => t.order), 0);
          taskData.order = maxOrder + 1;
        }
      }

      console.log('Creating task with data:', taskData);
      
      // Ensure we have a project_id
      if (!taskData.project_id) {
        showCustomAlert('Could not determine project for the task. Please try again.', 'error');
        return;
      }
      
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
        setParentTask(null);
        setParentProject(null);
        setParentPhase(null);
        setSelectedProjectForTask(null);
        setNewTask({
          name: '',
          description: '',
          status: 'active',
          duration: 0,
          baseline_start: '',
          baseline_finish: '',
          actual_start: '',
          actual_finish: ''
        });
        loadProjects();
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Unknown error';
          console.error('Failed to create task:', errorMessage);
        } catch {
          console.error('Failed to create task and parse error response');
        }
        showCustomAlert(`Failed to create task: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showCustomAlert('Failed to create task. Please try again.', 'error');
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
    if (isSalam) {
      switch (status) {
        case 'active': return 'bg-[#00F000] text-[#003931]';
        case 'completed': return 'bg-[#36C639] text-white';
        case 'on_hold': return 'bg-[#73F64B] text-[#003931]';
        case 'cancelled': return 'bg-red-500 text-white';
        default: return 'bg-[#EEFDEC] text-[#005147]';
      }
    } else {
      switch (status) {
        case 'active': return 'text-green-400';
        case 'completed': return 'text-blue-400';
        case 'on_hold': return 'text-yellow-400';
        case 'cancelled': return 'text-red-400';
        default: return 'text-slate-400';
      }
    }
  };





  // Helper function to find a task in a project (including subtasks)
  const findTaskInProject = (project: Project, taskId: number): Task | null => {
    // Search in project tasks
    for (const task of project.tasks) {
      if (task.id === taskId) {
        return task;
      }
      // Search in subtasks
      for (const subtask of task.subtasks) {
        if (subtask.id === taskId) {
          return subtask;
        }
      }
    }
    // Search in phases
    for (const phase of project.phases) {
      for (const task of phase.tasks) {
        if (task.id === taskId) {
          return task;
        }
        // Search in subtasks
        for (const subtask of task.subtasks) {
          if (subtask.id === taskId) {
            return subtask;
          }
        }
      }
    }
    return null;
  };

  const renderProgressBar = (progress: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    };

    return (
      <div className={`w-full ${colors.progressBg} rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colors.progressFill} rounded-full transition-all duration-300`}
          style={{ width: `${progress}%`, height: '100%' }}
        />
      </div>
    );
  };

  const renderInteractiveProgressBar = (task: Task, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    // Use temp progress if this task is being dragged, otherwise use actual progress
    const currentProgress = (dragTaskId === task.id && tempProgress !== null) 
      ? tempProgress 
      : task.progress;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      setDragTaskId(task.id);
      
      const touch = e.touches[0];
      if (!touch) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      let percentage;
      if (lang === 'ar') {
        // For Arabic: reverse the direction (right to left)
        percentage = Math.max(0, Math.min(100, ((rect.right - touch.clientX) / rect.width) * 100));
      } else {
        // For English: normal direction (left to right)
        percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      }
      setTempProgress(Math.round(percentage));
    };

    return (
      <div 
        className={`w-full ${colors.progressBg} rounded-full ${sizeClasses[size]} cursor-pointer select-none hover:${colors.cardBgHover} transition-colors touch-none`}
        data-task-id={task.id}
        onMouseDown={(e) => handleMouseDown(task.id, e)}
        onTouchStart={handleTouchStart}
        title={`Progress: ${currentProgress.toFixed(0)}% - Click/touch and drag to adjust`}
      >
        <div 
          className={`${colors.progressFill} rounded-full h-full transition-all duration-100`}
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    );
  };

  const renderTask = (task: Task, level: number = 0) => {
    const isExpanded = expandedItems.has(`task-${task.id}`);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const assignedEmployee = task.assignments && task.assignments[0]?.employee;

    return (
      <div key={task.id} className={`border-l-2 ${colors.borderPrimary} ml-4`}>
        <div className={`p-3 ${colors.cardBgHover} border ${colors.borderPrimary} rounded-lg mb-2 transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {hasSubtasks && (
                <button
                  onClick={() => toggleExpanded(`task-${task.id}`)}
                  className={`p-1 hover:${colors.cardBgHover} rounded ${colors.textPrimary}`}
                >
                  {isExpanded ? (
                    lang === 'ar' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  ) : (
                    lang === 'ar' ? (
                      <ChevronLeftIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              )}
              
              <div className="flex-1">
                <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <h4 className={`font-medium ${colors.textPrimary}`}>
                    {task.name}
                  </h4>
                  {task.progress === 100 && (
                    <CheckCircleIcon className={`w-4 h-4 ${colors.primary}`} />
                  )}
                </div>
                
                {task.description && (
                  <p className={`${colors.textSecondary} mt-1`}>{task.description}</p>
                )}
                
                <div className={`flex items-center space-x-4 mt-2 text-sm ${colors.textSecondary}`}>
                  {getTaskSubtasksCount(task) > 0 && (
                    <span>{getTaskSubtasksCount(task)} {t('excellent.subtasks_count')}</span>
                  )}
                  {task.duration > 0 && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{Math.round(task.duration)} {t('excellent.duration_hours')}</span>
                    </div>
                  )}
                  {assignedEmployee && (
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{lang === 'ar' ? assignedEmployee.name_ar : assignedEmployee.name}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Task Baseline and Actual Dates */}
                {(task.baseline_start || task.baseline_finish || task.actual_start || task.actual_finish) && (
                  <div className="mt-2 space-y-1">
                    {task.baseline_start && (
                      <div className={`text-xs ${colors.textSecondary}`}>
                        <span className="font-medium">Baseline Start:</span> {new Date(task.baseline_start).toLocaleDateString()}
                      </div>
                    )}
                    {task.baseline_finish && (
                      <div className={`text-xs ${colors.textSecondary}`}>
                        <span className="font-medium">Baseline Finish:</span> {new Date(task.baseline_finish).toLocaleDateString()}
                      </div>
                    )}
                    {task.actual_start && (
                      <div className={`text-xs ${colors.textSecondary}`}>
                        <span className="font-medium">Actual Start:</span> {new Date(task.actual_start).toLocaleDateString()}
                      </div>
                    )}
                    {task.actual_finish && (
                      <div className={`text-xs ${colors.textSecondary}`}>
                        <span className="font-medium">Actual Finish:</span> {new Date(task.actual_finish).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-32">
                {renderInteractiveProgressBar(task, 'sm')}
                <div className={`text-xs ${colors.textSecondary} mt-1`}>
                  {((dragTaskId === task.id && tempProgress !== null) ? tempProgress : task.progress).toFixed(2)}%
                </div>
              </div>
              
              <span className={`text-sm px-3 py-1 rounded ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              
              <button
                onClick={() => handleEditTask(task)}
                className={`p-1 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded transition-colors`}
                title="Edit Task"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  setParentTask(task);
                  setParentProject(null);
                  setParentPhase(null);
                  setShowAddTaskModal(true);
                }}
                className={`p-1 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded transition-colors`}
                title="Add Subtask"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-red-500 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
                title="Delete Task"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              
              <select
                value={assignedEmployee?.id || ''}
                onChange={(e) => handleAssignEmployee(task.id, parseInt(e.target.value))}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded px-2 py-1 text-sm ${colors.textPrimary}`}
              >
                <option value="">{t('excellent.select_employee')}</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {lang === 'ar' ? emp.name_ar : emp.name}
                  </option>
                ))}
              </select>
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
        <div className={`${colors.cardBgHover} border ${colors.borderPrimary} rounded-lg p-4 transition-all duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {hasTasks && (
                <button
                  onClick={() => toggleExpanded(`phase-${phase.id}`)}
                  className={`p-1 hover:${colors.cardBgHover} rounded ${colors.textPrimary}`}
                >
                  {isExpanded ? (
                    lang === 'ar' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  ) : (
                    lang === 'ar' ? (
                      <ChevronLeftIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              )}
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${colors.textPrimary}`}>
                  {phase.name}
                </h3>
                {phase.description && (
                  <p className={`${colors.textSecondary} mt-1`}>{phase.description}</p>
                )}
                <div className={`flex items-center space-x-4 mt-2 text-sm ${colors.textSecondary}`}>
                  <span>{getPhaseTasksCount(phase)} {t('excellent.tasks_count')}</span>
                  <span>{getPhaseSubtasksCount(phase)} {t('excellent.subtasks_count')}</span>
                </div>
              </div>
            </div>

            <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="text-right">
                {/* Phase Baseline and Actual Dates */}
                <div className="mt-2 space-y-1">
                  {phase.baseline_start && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Baseline Start:</span> {new Date(phase.baseline_start).toLocaleDateString()}
                    </div>
                  )}
                  {phase.baseline_finish && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Baseline Finish:</span> {new Date(phase.baseline_finish).toLocaleDateString()}
                    </div>
                  )}
                  {phase.actual_start && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Actual Start:</span> {new Date(phase.actual_start).toLocaleDateString()}
                    </div>
                  )}
                  {phase.actual_finish && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Actual Finish:</span> {new Date(phase.actual_finish).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-48">
                {renderProgressBar(phase.progress, 'md')}
                <div className={`text-sm ${colors.textSecondary} mt-1`}>{phase.progress.toFixed(2)}% complete</div>
              </div>
              
              <span className={`text-sm px-3 py-1 rounded ${getStatusColor(phase.status)}`}>
                {phase.status}
              </span>
              
              <button
                onClick={() => handleEditPhase(phase)}
                className={`p-2 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded transition-colors`}
                title="Edit Phase"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  setParentPhase(phase);
                  setParentProject(null);
                  setParentTask(null);
                  setShowAddTaskModal(true);
                }}
                className={`p-2 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded transition-colors`}
                title="Add Task to Phase"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleDeletePhase(phase.id)}
                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
                title="Delete Phase"
              >
                <TrashIcon className="w-5 h-5" />
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
      <div key={project.id} className={`${colors.cardBg} border ${colors.borderPrimary} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              {(hasPhases || hasTasks) && (
                <button
                  onClick={() => toggleExpanded(`project-${project.id}`)}
                  className={`p-2 ${colors.cardBgHover} rounded-lg transition-colors ${colors.textPrimary}`}
                >
                  {isExpanded ? (
                    lang === 'ar' ? (
                      <ChevronUpIcon className="w-6 h-6" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6" />
                    )
                  ) : (
                    lang === 'ar' ? (
                      <ChevronLeftIcon className="w-6 h-6" />
                    ) : (
                      <ChevronRightIcon className="w-6 h-6" />
                    )
                  )}
                </button>
              )}
              
              <div>
                <h2 className={`text-xl font-bold ${colors.textPrimary}`}>
                  {project.name}
                </h2>
                {project.description && (
                  <p className={`${colors.textSecondary} mt-1`}>{project.description}</p>
                )}
                <div className={`flex items-center space-x-4 mt-2 text-sm ${colors.textSecondary}`}>
                  <span>{project.phases?.length || 0} {t('excellent.phases_count')}</span>
                  <span>{getTasksCount(project)} {t('excellent.tasks_count')}</span>
                  <span>{getSubtasksCount(project)} {t('excellent.subtasks_count')}</span>
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
                {project.manager && (
                  <div className={`text-sm ${colors.textSecondary}`}>
                    {t('excellent.manager')}: {lang === 'ar' ? project.manager.name_ar : project.manager.name}
                  </div>
                )}
                
                {/* Project Baseline and Actual Dates */}
                <div className="mt-2 space-y-1">
                  {project.baseline_start && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Baseline Start:</span> {new Date(project.baseline_start).toLocaleDateString()}
                    </div>
                  )}
                  {project.baseline_finish && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Baseline Finish:</span> {new Date(project.baseline_finish).toLocaleDateString()}
                    </div>
                  )}
                  {project.actual_start && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Actual Start:</span> {new Date(project.actual_start).toLocaleDateString()}
                    </div>
                  )}
                  {project.actual_finish && (
                    <div className={`text-xs ${colors.textSecondary}`}>
                      <span className="font-medium">Actual Finish:</span> {new Date(project.actual_finish).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-64">
                {renderProgressBar(project.progress, 'lg')}
                <div className={`text-sm ${colors.textSecondary} mt-1`}>{project.progress.toFixed(2)}% complete</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm px-3 py-1 rounded ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <button
                  onClick={() => handleEditProject(project)}
                  className={`p-2 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded-lg transition-colors`}
                  title="Edit Project"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedProjectForPhase(project);
                    setShowAddPhaseModal(true);
                  }}
                  className={`p-2 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded-lg transition-colors`}
                  title="Add Phase"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => confirmDeleteProject(project)}
                  className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
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
                  <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-3`}>{t('excellent.phases')}</h3>
                  {project.phases?.map(phase => renderPhase(phase))}
                </div>
              )}
              
              {hasTasks && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-semibold ${colors.textPrimary}`}>{t('excellent.tasks')}</h3>
                    <button
                      onClick={() => {
                        setParentProject(project);
                        setParentPhase(null);
                        setParentTask(null);
                        setShowAddTaskModal(true);
                      }}
                      className={`p-2 ${colors.primary} hover:${colors.primaryHover} hover:${colors.cardBgHover} rounded transition-colors`}
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

  // Theme-aware styling
  const isSalam = theme === 'salam';
  const isLight = theme === 'light';


  // Theme colors based on current theme
  const colors = {
    primary: isSalam ? 'text-[#00F000]' : isLight ? 'text-green-600' : 'text-green-400',
    primaryHover: isSalam ? 'text-[#73F64B]' : isLight ? 'text-green-500' : 'text-green-300',
    primaryBg: isSalam ? 'bg-[#00F000]' : isLight ? 'bg-green-600' : 'bg-green-500',
    primaryBgHover: isSalam ? 'bg-[#73F64B]' : isLight ? 'bg-green-500' : 'bg-green-400',
    cardBg: isSalam ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-900',
    cardBgHover: isSalam ? 'bg-[#EEFDEC]' : isLight ? 'bg-slate-50' : 'bg-slate-800',
    textPrimary: isSalam ? 'text-[#003931]' : isLight ? 'text-slate-900' : 'text-white',
    textSecondary: isSalam ? 'text-[#005147]' : isLight ? 'text-slate-600' : 'text-slate-400',
    borderPrimary: isSalam ? 'border-[#003931]' : isLight ? 'border-slate-200' : 'border-slate-700',
    borderHover: isSalam ? 'border-[#00F000]' : 'border-green-500',
    inputBg: isSalam ? 'bg-white' : isLight ? 'bg-white' : 'bg-slate-800',
    inputBorder: isSalam ? 'border-[#003931]' : isLight ? 'border-slate-300' : 'border-slate-700',
    iconBg: isSalam ? 'bg-[#EEFDEC]' : isLight ? 'bg-slate-200' : 'bg-slate-800',
    glassBg: isSalam ? 'bg-white/95' : isLight ? 'bg-white/80' : 'bg-slate-900/80',
    glassBorder: isSalam ? 'border-[#00F000]/20' : 'border-green-500/20',
    tabActiveBg: isSalam ? 'bg-[#00F000]' : isLight ? 'bg-green-600' : 'bg-green-500',
    tabActiveText: isSalam ? 'text-[#003931]' : 'text-white',
    tabInactiveText: isSalam ? 'text-[#005147]' : isLight ? 'text-slate-600' : 'text-slate-400',
    tabInactiveHover: isSalam ? 'hover:bg-[#EEFDEC]' : isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800',
            progressBg: isSalam ? 'bg-[#36C639]' : isLight ? 'bg-gray-200' : 'bg-slate-700',
    progressFill: isSalam ? 'bg-[#00F000]' : isLight ? 'bg-green-600' : 'bg-green-500',
    badgeSuccess: isSalam ? 'bg-[#00F000] text-[#003931]' : 'bg-green-500 text-white',
    badgeWarning: isSalam ? 'bg-[#73F64B] text-[#003931]' : 'bg-yellow-500 text-white',
    badgeError: isSalam ? 'bg-red-500 text-white' : 'bg-red-500 text-white',
    badgeInfo: isSalam ? 'bg-[#36C639] text-white' : 'bg-blue-500 text-white'
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
    <div className="space-y-4">
        {/* Controls */}
      <div className={`${colors.cardBg} border ${colors.borderPrimary} p-4 rounded-xl shadow-lg content-animate`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary}`} />
                <input
                  type="text"
                placeholder={t('excellent.search_projects')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary}`} />
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
              className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <PlusIcon className="w-5 h-5" />
              <span>{t('excellent.new_project')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-transparent stagger-animate`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.textSecondary} mb-1`}>{t('excellent.total_projects')}</p>
              <p className={`text-2xl font-bold ${colors.textPrimary} group-hover:text-purple-400 transition-colors duration-200`}>{projects.length}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-transparent stagger-animate`}>
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
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-yellow-500/50 hover:bg-gradient-to-br hover:from-yellow-500/5 hover:to-transparent stagger-animate`}>
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
          
        <div className={`${colors.cardBg} border ${colors.borderPrimary} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-transparent stagger-animate`}>
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
      </div>

        {/* Projects List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`${colors.textSecondary}`}>{t('excellent.loading_projects')}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="card text-center py-8">
              <ChartBarIcon className={`w-16 h-16 ${colors.textSecondary} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-2`}>{t('excellent.no_projects')}</h3>
              <p className={`${colors.textSecondary} mb-4`}>{t('excellent.import_first')}</p>
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

  // Save scroll position before updates
  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };

  // Restore scroll position after updates
  const restoreScrollPosition = () => {
    if (scrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
  };



  // Helper functions are no longer needed

  // Helper function to calculate tasks count (without subtasks) in a project
  const getTasksCount = (project: Project): number => {
    let tasksCount = 0;
    
    // Count tasks directly in project (not in phases)
    tasksCount += project.tasks?.length || 0;
    
    // Count tasks in phases
    project.phases?.forEach(phase => {
      tasksCount += phase.tasks?.length || 0;
    });
    
    return tasksCount;
  };

  // Helper function to calculate subtasks count in a project
  const getSubtasksCount = (project: Project): number => {
    let subtasksCount = 0;
    
    // Count subtasks in project level tasks
    project.tasks?.forEach(task => {
      subtasksCount += task.subtasks?.length || 0;
    });
    
    // Count subtasks in phase tasks
    project.phases?.forEach(phase => {
      phase.tasks?.forEach(task => {
        subtasksCount += task.subtasks?.length || 0;
      });
    });
    
    return subtasksCount;
  };

  // Helper function to calculate tasks count in a phase
  const getPhaseTasksCount = (phase: Phase): number => {
    return phase.tasks?.length || 0;
  };

  // Helper function to calculate subtasks count in a phase
  const getPhaseSubtasksCount = (phase: Phase): number => {
    let subtasksCount = 0;
    
    phase.tasks?.forEach(task => {
      subtasksCount += task.subtasks?.length || 0;
    });
    
    return subtasksCount;
  };

  // Helper function to calculate subtasks count for a specific task
  const getTaskSubtasksCount = (task: Task): number => {
    return task.subtasks?.length || 0;
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="page-header content-animate mb-6">
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
        <div className="flex justify-center mb-6 content-animate">
          <div className={`flex rounded-lg p-1 ${colors.cardBg} border ${colors.borderPrimary}`}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? `${colors.tabActiveBg} ${colors.tabActiveText} shadow-lg`
                      : `${colors.tabInactiveText} ${colors.tabInactiveHover} hover:${colors.textPrimary}`
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
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>{t('excellent.new_project')}</h3>
            <div className="mb-4">
              <label htmlFor="newProjectName" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.name')}
              </label>
                <input
                  type="text"
                id="newProjectName"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200`}
                />
              </div>
            <div className="mb-4">
              <label htmlFor="newProjectDescription" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.description')}
              </label>
                <textarea
                id="newProjectDescription"
                  value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200`}
                />
              </div>


            <div className="mb-4">
              <label htmlFor="newProjectManager" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.manager')}
              </label>
                  <select
                id="newProjectManager"
                    value={newProject.manager_id}
                onChange={(e) => setNewProject({ ...newProject, manager_id: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200 ${colors.textPrimary}`}
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
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleCreateProject}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
              >
                {t('excellent.create_project')}
              </button>
              </div>
            </div>
        </div>
      )}

      {/* Import XML Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${colors.iconBg} rounded-xl animate-pulse`}>
                  <CloudArrowUpIcon className={`w-8 h-8 ${colors.primary}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${colors.textPrimary}`}>{t('excellent.import_xml')}</h3>
                  <p className={`text-sm ${colors.textSecondary}`}>
                    {lang === 'ar' ? 'استيراد ملفات Microsoft Project XML' : 'Import Microsoft Project XML files'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className={`p-2 ${colors.cardBgHover} rounded-xl transition-colors ${colors.textSecondary} hover:${colors.textPrimary}`}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed ${colors.borderPrimary} rounded-xl p-8 text-center mb-6 transition-all duration-300 hover:border-green-500 hover:bg-green-50/5 cursor-pointer group`}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              {!selectedFile ? (
                <div>
                  <CloudArrowUpIcon className={`w-16 h-16 ${colors.textSecondary} mx-auto mb-4 group-hover:scale-110 group-hover:${colors.primary} transition-all duration-300`} />
                  <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-2`}>
                    {lang === 'ar' ? 'اسحب ملف XML هنا' : 'Drop your XML file here'}
                  </h4>
                  <p className={`text-sm ${colors.textSecondary} mb-4`}>
                    {lang === 'ar' ? 'أو اضغط لاختيار ملف' : 'or click to browse files'}
                  </p>
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="xml-file-input"
                  />
                  <label
                    htmlFor="xml-file-input"
                    className={`inline-flex items-center px-6 py-3 ${colors.primaryBg} text-white rounded-lg font-medium cursor-pointer hover:${colors.primaryBgHover} transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
                  >
                    <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                    {lang === 'ar' ? 'اختيار ملف XML' : 'Choose XML File'}
                  </label>
                </div>
              ) : (
                <div>
                  <div className={`p-4 ${colors.iconBg} rounded-xl inline-block mb-4`}>
                    <DocumentArrowUpIcon className={`w-12 h-12 ${colors.primary}`} />
                  </div>
                  <h4 className={`text-lg font-semibold ${colors.textPrimary} mb-2`}>
                    {lang === 'ar' ? 'تم اختيار الملف' : 'File Selected'}
                  </h4>
                  <p className={`text-sm ${colors.textSecondary} mb-2`}>{selectedFile.name}</p>
                  <p className={`text-xs ${colors.textSecondary}`}>
                    {lang === 'ar' ? 'الحجم: ' : 'Size: '}
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className={`mt-3 px-4 py-2 ${colors.cardBgHover} ${colors.textPrimary} rounded-lg text-sm hover:${colors.primary} transition-colors`}
                  >
                    {lang === 'ar' ? 'تغيير الملف' : 'Change File'}
                  </button>
                </div>
              )}
            </div>



            {/* File Requirements */}
            <div className={`${colors.cardBgHover} rounded-xl p-4 mb-6`}>
              <h5 className={`text-sm font-semibold ${colors.textPrimary} mb-2`}>
                {lang === 'ar' ? 'متطلبات الملف:' : 'File Requirements:'}
              </h5>
              <ul className={`text-xs ${colors.textSecondary} space-y-1`}>
                <li>• {lang === 'ar' ? 'صيغة الملف: Microsoft Project XML (.xml)' : 'File format: Microsoft Project XML (.xml)'}</li>
                <li>• {lang === 'ar' ? 'الحد الأقصى لحجم الملف: 50 ميجابايت' : 'Maximum file size: 50 MB'}</li>
                <li>• {lang === 'ar' ? 'الإصدارات المدعومة: Project 2003-2021' : 'Supported versions: Project 2003-2021'}</li>
                <li>• {lang === 'ar' ? 'الترميز: UTF-8 موصى به' : 'Encoding: UTF-8 recommended'}</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className={`px-6 py-3 ${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} rounded-xl font-medium hover:${colors.cardBgHover} transition-all duration-200 flex-1 sm:flex-none hover:scale-105 active:scale-95`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleImportXML}
                disabled={!selectedFile || importing}
                className="px-6 py-3 bg-[#00f000] text-white rounded-xl font-medium hover:bg-[#00d400] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{lang === 'ar' ? 'جاري الاستيراد...' : 'Importing...'}</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>{t('excellent.import_xml')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar (shown during import) */}
            {importing && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className={colors.textSecondary}>
                    {lang === 'ar' ? 'معالجة ملف XML...' : 'Processing XML file...'}
                  </span>
                  <span className={colors.textSecondary}>100%</span>
                </div>
                <div className={`w-full ${colors.progressBg} rounded-full h-2`}>
                  <div className={`${colors.progressFill} rounded-full h-2 transition-all duration-500`} style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>{t('excellent.confirm_delete')}</h3>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className={`p-2 transition-colors ${
                  isSalam ? 'text-[#005147] hover:text-[#003931]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`text-center mb-4 ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                <p className={`text-lg font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-white'
                }`}>
                  {lang === "ar" ? "هل أنت متأكد من حذف" : "Are you sure you want to delete"}
                </p>
                <p className={`text-sm ${
                  isSalam ? 'text-[#005147]' : 'text-slate-300'
                }`}>
                  {projectToDelete.name}
                </p>
                <p className={`text-xs mt-2 ${
                  isSalam ? 'text-[#FF6B6B]' : 'text-red-400'
                }`}>
                  {lang === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}
                </p>
              </div>
            </div>

            <div className={`flex items-center ${
              lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
            }`}>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200 flex-1`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 ${
                  isSalam ? '!bg-[#FF6B6B] hover:!bg-[#FF5252]' : ''
                }`}
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
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>{t('excellent.edit_task')}</h3>
            <div className="mb-4">
              <label htmlFor="editTaskNameEn" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="editTaskNameEn"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200 ${colors.textPrimary}`}
              />
              </div>

            <div className="mb-4">
              <label htmlFor="editTaskDescription" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.description')}
              </label>
              <textarea
                id="editTaskDescription"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200 ${colors.textPrimary}`}
              />
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
              <label htmlFor="editTaskBaselineStart" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Start Date
              </label>
              <input
                type="date"
                id="editTaskBaselineStart"
                value={editingTask.baseline_start}
                onChange={(e) => setEditingTask({ ...editingTask, baseline_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editTaskBaselineFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Finish Date
              </label>
              <input
                type="date"
                id="editTaskBaselineFinish"
                value={editingTask.baseline_finish}
                onChange={(e) => setEditingTask({ ...editingTask, baseline_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editTaskActualStart" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Start Date
              </label>
              <input
                type="date"
                id="editTaskActualStart"
                value={editingTask.actual_start}
                onChange={(e) => setEditingTask({ ...editingTask, actual_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editTaskActualFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Finish Date
              </label>
              <input
                type="date"
                id="editTaskActualFinish"
                value={editingTask.actual_finish}
                onChange={(e) => setEditingTask({ ...editingTask, actual_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleUpdateTask}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
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
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>
              {parentTask ? t('excellent.add_subtask') : t('excellent.add_task')}
            </h3>
            {!parentTask && !parentPhase && !parentProject && (
              <div className="mb-4">
                <label htmlFor="newTaskProject" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                  {t('excellent.project')}
                </label>
                <select
                  id="newTaskProject"
                  value={selectedProjectForTask || ''}
                  onChange={(e) => setSelectedProjectForTask(e.target.value ? parseInt(e.target.value) : null)}
                  className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200 ${colors.textPrimary}`}
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
              <label htmlFor="newTaskBaselineStart" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Start Date
              </label>
              <input
                type="date"
                id="newTaskBaselineStart"
                value={newTask.baseline_start}
                onChange={(e) => setNewTask({ ...newTask, baseline_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newTaskBaselineFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Finish Date
              </label>
              <input
                type="date"
                id="newTaskBaselineFinish"
                value={newTask.baseline_finish}
                onChange={(e) => setNewTask({ ...newTask, baseline_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newTaskActualStart" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Start Date
              </label>
              <input
                type="date"
                id="newTaskActualStart"
                value={newTask.actual_start}
                onChange={(e) => setNewTask({ ...newTask, actual_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newTaskActualFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Finish Date
              </label>
              <input
                type="date"
                id="newTaskActualFinish"
                value={newTask.actual_finish}
                onChange={(e) => setNewTask({ ...newTask, actual_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setParentTask(null);
                  setParentProject(null);
                  setParentPhase(null);
                  setSelectedProjectForTask(null);
                }}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleCreateTask}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
              >
                {t('excellent.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && projectToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>{t('excellent.edit_project')}</h3>
            
            <div className="mb-4">
              <label htmlFor="editProjectName" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="editProjectName"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00F000] focus:border-transparent transition-all duration-200 ${colors.textPrimary}`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editProjectDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
              <textarea
                id="editProjectDescription"
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>



            <div className="mb-4">
              <label htmlFor="editProjectStatus" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.status')}
              </label>
              <select
                id="editProjectStatus"
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="editProjectManager" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.manager')}
              </label>
              <select
                id="editProjectManager"
                value={editingProject.manager_id}
                onChange={(e) => setEditingProject({ ...editingProject, manager_id: e.target.value })}
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

            <div className="mb-4">
              <label htmlFor="editProjectBaselineStart" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Start
              </label>
              <input
                type="date"
                id="editProjectBaselineStart"
                value={editingProject.baseline_start}
                onChange={(e) => setEditingProject({ ...editingProject, baseline_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editProjectBaselineFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Finish
              </label>
              <input
                type="date"
                id="editProjectBaselineFinish"
                value={editingProject.baseline_finish}
                onChange={(e) => setEditingProject({ ...editingProject, baseline_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editProjectActualStart" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Start
              </label>
              <input
                type="date"
                id="editProjectActualStart"
                value={editingProject.actual_start}
                onChange={(e) => setEditingProject({ ...editingProject, actual_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editProjectActualFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Finish
              </label>
              <input
                type="date"
                id="editProjectActualFinish"
                value={editingProject.actual_finish}
                onChange={(e) => setEditingProject({ ...editingProject, actual_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditProjectModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleUpdateProject}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
              >
                {t('excellent.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Phase Modal */}
      {showAddPhaseModal && selectedProjectForPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>{t('excellent.add_phase')}</h3>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.project')}
              </label>
              <div className={`${colors.textPrimary} font-medium`}>
                {selectedProjectForPhase.name}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseName" className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="newPhaseName"
                value={newPhase.name}
                onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
              <textarea
                id="newPhaseDescription"
                value={newPhase.description}
                onChange={(e) => setNewPhase({ ...newPhase, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>



            <div className="mb-4">
              <label htmlFor="newPhaseStatus" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.status')}
              </label>
              <select
                id="newPhaseStatus"
                value={newPhase.status}
                onChange={(e) => setNewPhase({ ...newPhase, status: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseBaselineStart" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Start
              </label>
              <input
                type="date"
                id="newPhaseBaselineStart"
                value={newPhase.baseline_start}
                onChange={(e) => setNewPhase({ ...newPhase, baseline_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseBaselineFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Finish
              </label>
              <input
                type="date"
                id="newPhaseBaselineFinish"
                value={newPhase.baseline_finish}
                onChange={(e) => setNewPhase({ ...newPhase, baseline_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseActualStart" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Start
              </label>
              <input
                type="date"
                id="newPhaseActualStart"
                value={newPhase.actual_start}
                onChange={(e) => setNewPhase({ ...newPhase, actual_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPhaseActualFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Finish
              </label>
              <input
                type="date"
                id="newPhaseActualFinish"
                value={newPhase.actual_finish}
                onChange={(e) => setNewPhase({ ...newPhase, actual_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddPhaseModal(false);
                  setSelectedProjectForPhase(null);
                }}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleCreatePhase}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
              >
                {t('excellent.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Phase Modal */}
      {showEditPhaseModal && phaseToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <h3 className={`text-xl font-semibold ${colors.textPrimary} mb-4`}>Edit Phase</h3>
            
            <div className="mb-4">
              <label htmlFor="editPhaseName" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.name')}
              </label>
              <input
                type="text"
                id="editPhaseName"
                value={editingPhase.name}
                onChange={(e) => setEditingPhase({ ...editingPhase, name: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseDescription" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.description')}
              </label>
              <textarea
                id="editPhaseDescription"
                value={editingPhase.description}
                onChange={(e) => setEditingPhase({ ...editingPhase, description: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseStatus" className="block text-sm font-medium text-slate-400 mb-1">
                {t('excellent.status')}
              </label>
              <select
                id="editPhaseStatus"
                value={editingPhase.status}
                onChange={(e) => setEditingPhase({ ...editingPhase, status: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseBaselineStart" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Start
              </label>
              <input
                type="date"
                id="editPhaseBaselineStart"
                value={editingPhase.baseline_start}
                onChange={(e) => setEditingPhase({ ...editingPhase, baseline_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseBaselineFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Baseline Finish
              </label>
              <input
                type="date"
                id="editPhaseBaselineFinish"
                value={editingPhase.baseline_finish}
                onChange={(e) => setEditingPhase({ ...editingPhase, baseline_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseActualStart" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Start
              </label>
              <input
                type="date"
                id="editPhaseActualStart"
                value={editingPhase.actual_start}
                onChange={(e) => setEditingPhase({ ...editingPhase, actual_start: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editPhaseActualFinish" className="block text-sm font-medium text-slate-400 mb-1">
                Actual Finish
              </label>
              <input
                type="date"
                id="editPhaseActualFinish"
                value={editingPhase.actual_finish}
                onChange={(e) => setEditingPhase({ ...editingPhase, actual_finish: e.target.value })}
                className={`${colors.inputBg} border ${colors.inputBorder} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditPhaseModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={handleUpdatePhase}
                className={`${colors.primaryBg} ${colors.tabActiveText} px-4 py-2 rounded-lg font-medium hover:${colors.primaryBgHover} transition-all duration-200`}
              >
                {t('excellent.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Phase Confirmation Modal */}
      {showDeletePhaseModal && phaseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>{t('excellent.confirm_delete')}</h3>
              <button
                onClick={() => setShowDeletePhaseModal(false)}
                className={`p-2 transition-colors ${
                  isSalam ? 'text-[#005147] hover:text-[#003931]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`text-center mb-4 ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                <p className={`text-lg font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-white'
                }`}>
                  {lang === "ar" ? "هل أنت متأكد من حذف المرحلة" : "Are you sure you want to delete the phase"}
                </p>
                <p className={`text-sm ${
                  isSalam ? 'text-[#005147]' : 'text-slate-300'
                }`}>
                  {phaseToDelete.name}
                </p>
                <p className={`text-xs mt-2 ${
                  isSalam ? 'text-[#FF6B6B]' : 'text-red-400'
                }`}>
                  {lang === "ar" ? "سيتم حذف جميع المهام في هذه المرحلة" : "All tasks in this phase will be deleted"}
                </p>
                <p className={`text-xs mt-1 ${
                  isSalam ? 'text-[#FF6B6B]' : 'text-red-400'
                }`}>
                  {lang === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}
                </p>
              </div>
            </div>

            <div className={`flex items-center ${
              lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
            }`}>
              <button
                onClick={() => setShowDeletePhaseModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200 flex-1`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={confirmDeletePhase}
                disabled={isDeleting}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 ${
                  isSalam ? '!bg-[#FF6B6B] hover:!bg-[#FF5252]' : ''
                }`}
              >
                {isDeleting ? `${t('excellent.deleting')}...` : t('excellent.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {showDeleteTaskModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-6 rounded-lg shadow-xl w-full max-w-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${colors.textPrimary}`}>{t('excellent.confirm_delete')}</h3>
              <button
                onClick={() => setShowDeleteTaskModal(false)}
                className={`p-2 transition-colors ${
                  isSalam ? 'text-[#005147] hover:text-[#003931]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`text-center mb-4 ${
                isSalam ? 'text-[#003931]' : 'text-white'
              }`}>
                <p className={`text-lg font-medium mb-2 ${
                  isSalam ? 'text-[#003931]' : 'text-white'
                }`}>
                  {lang === "ar" ? "هل أنت متأكد من حذف المهمة" : "Are you sure you want to delete the task"}
                </p>
                <p className={`text-sm ${
                  isSalam ? 'text-[#005147]' : 'text-slate-300'
                }`}>
                  {taskToDelete.name}
                </p>
                <p className={`text-xs mt-1 ${
                  isSalam ? 'text-[#FF6B6B]' : 'text-red-400'
                }`}>
                  {lang === "ar" ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}
                </p>
              </div>
            </div>

            <div className={`flex items-center ${
              lang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
            }`}>
              <button
                onClick={() => setShowDeleteTaskModal(false)}
                className={`${colors.cardBgHover} ${colors.textPrimary} border ${colors.borderPrimary} px-4 py-2 rounded-lg font-medium hover:${colors.cardBgHover} transition-all duration-200 flex-1`}
              >
                {t('excellent.cancel')}
              </button>
              <button
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 ${
                  isSalam ? '!bg-[#FF6B6B] hover:!bg-[#FF5252]' : ''
                }`}
              >
                {isDeleting ? `${t('excellent.deleting')}...` : t('excellent.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.cardBg} border ${colors.borderPrimary} p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100`}>
            {/* Icon */}
            <div className="text-center mb-6">
              <div className={`inline-flex p-4 rounded-full ${
                alertType === 'success' ? 'bg-green-100 text-green-600' :
                alertType === 'error' ? 'bg-red-100 text-red-600' :
                alertType === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {alertType === 'success' && (
                  <CheckCircleIcon className="w-12 h-12" />
                )}
                {alertType === 'error' && (
                  <ExclamationTriangleIcon className="w-12 h-12" />
                )}
                {alertType === 'warning' && (
                  <ExclamationTriangleIcon className="w-12 h-12" />
                )}
                {alertType === 'info' && (
                  <ChartBarIcon className="w-12 h-12" />
                )}
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <h3 className={`text-xl font-bold ${colors.textPrimary} mb-2`}>
                {alertType === 'success' ? (lang === 'ar' ? 'نجح!' : 'Success!') :
                 alertType === 'error' ? (lang === 'ar' ? 'خطأ!' : 'Error!') :
                 alertType === 'warning' ? (lang === 'ar' ? 'تحذير!' : 'Warning!') :
                 (lang === 'ar' ? 'معلومات' : 'Info')}
              </h3>
              <p className={`text-lg ${colors.textSecondary}`}>
                {alertMessage}
              </p>
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                onClick={() => setShowAlertModal(false)}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  alertType === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
                  alertType === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                  alertType === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                  'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {lang === 'ar' ? 'حسناً' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}