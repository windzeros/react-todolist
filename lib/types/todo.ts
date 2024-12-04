export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  categoryId?: string;
  delayCount?: number;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: Priority;
  startDate?: Date;
  dueDate?: Date;
  categoryId?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  completed?: boolean;
  startDate?: Date;
  dueDate?: Date;
  categoryId?: string;
}

export type Period = 'week' | 'month' | 'year';

export interface FilterTodosByPeriodResult {
  todos: Todo[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface FilterOptions {
  categoryId?: string;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  showCompleted: boolean;
}

export function filterTodosByPeriod(todos: Todo[], period: Period): FilterTodosByPeriodResult {
  // 구현은 별도로...
  return {
    todos: [],
    dateRange: {
      start: new Date(),
      end: new Date()
    }
  };
}
