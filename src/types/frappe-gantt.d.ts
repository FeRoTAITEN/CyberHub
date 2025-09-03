declare module 'frappe-gantt' {
  export interface Task {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string;
    custom_class?: string;
  }

  export interface GanttOptions {
    header_height?: number;
    column_width?: number;
    step?: number;
    view_modes?: string[];
    view_mode?: string;
    date_format?: string;
    popup_trigger?: string;
    custom_popup_html?: string | null;
    language?: string;
    on_click?: (task: Task) => void;
    on_date_change?: (task: Task, start: string, end: string) => void;
    on_progress_change?: (task: Task, progress: number) => void;
  }

  const Gantt: {
    new(wrapper: HTMLElement, tasks: Task[], options?: GanttOptions): {
      refresh(tasks: Task[]): void;
      change_view_mode(mode: string): void;
      update_options(options: GanttOptions): void;
    };
  };
  
  export default Gantt;
} 