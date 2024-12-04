import { create } from 'zustand';
import { Todo, CreateTodoInput, UpdateTodoInput, Priority } from '../types/todo';
import { addWeeks, isWithinInterval, startOfWeek, endOfWeek, parseISO } from 'date-fns';

interface FilterOptions {
  priority?: Priority;
  categoryId?: string;
  showCompleted?: boolean;
  startDate?: string;
  endDate?: string;
}

interface TodoStore {
  todos: Todo[];
  filteredTodos: Todo[];
  filterOptions: FilterOptions;
  addTodo: (input: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'delayCount'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updatedTodo: Partial<Todo>) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  moveUncompletedTodos: () => void;
}

const applyFilters = (todos: Todo[], options: FilterOptions): Todo[] => {
  return todos.filter((todo) => {
    // 카테고리 필터
    if (options.categoryId && todo.categoryId !== options.categoryId) {
      return false;
    }

    // 우선순위 필터
    if (options.priority && todo.priority !== options.priority) {
      return false;
    }

    // 완료 상태 필터
    if (!options.showCompleted && todo.completed) {
      return false;
    }

    // 날짜 필터
    if (options.startDate) {
      const startDate = new Date(options.startDate + 'T00:00:00');
      const todoStartDate = todo.startDate || todo.createdAt;
      if (todoStartDate < startDate) {
        return false;
      }
    }

    if (options.endDate) {
      const endDate = new Date(options.endDate + 'T23:59:59');
      const todoDueDate = todo.dueDate || todo.createdAt;
      if (todoDueDate > endDate) {
        return false;
      }
    }

    return true;
  });
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filteredTodos: [],
  filterOptions: {
    showCompleted: true,
  },
  addTodo: (input) =>
    set((state) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date(),
        delayCount: 0,
        ...input,
        description: 
          !input.description || 
          input.description.toString().trim() === '' || 
          input.description === '0' || 
          input.description === 0 
            ? undefined 
            : input.description.toString().trim()
      };
      const newTodos = [...state.todos, newTodo];
      return {
        todos: newTodos,
        filteredTodos: applyFilters(newTodos, state.filterOptions),
      };
    }),
  toggleTodo: (id) =>
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      return {
        todos: newTodos,
        filteredTodos: applyFilters(newTodos, state.filterOptions),
      };
    }),
  deleteTodo: (id) =>
    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      return {
        todos: newTodos,
        filteredTodos: applyFilters(newTodos, state.filterOptions),
      };
    }),
  updateTodo: (id, updatedTodo) =>
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...updatedTodo,
              description: 
                !updatedTodo.description || 
                updatedTodo.description.toString().trim() === '' || 
                updatedTodo.description === '0' || 
                updatedTodo.description === 0 
                  ? undefined 
                  : updatedTodo.description.toString().trim()
            }
          : todo
      );
      return {
        todos: newTodos,
        filteredTodos: applyFilters(newTodos, state.filterOptions),
      };
    }),
  setFilterOptions: (options) =>
    set((state) => ({
      filterOptions: { ...state.filterOptions, ...options },
      filteredTodos: applyFilters(state.todos, {
        ...state.filterOptions,
        ...options,
      }),
    })),
  moveUncompletedTodos: () =>
    set((state) => {
      // 기존 데이터의 description이 '0'인 항목들을 정리
      const cleanedTodos = state.todos.map(todo => ({
        ...todo,
        description: todo.description === '0' ? undefined : todo.description
      }));

      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      const updatedTodos = cleanedTodos.map((todo) => {
        if (!todo.startDate || !todo.dueDate) return todo;

        const isCurrentWeek = isWithinInterval(new Date(todo.dueDate), {
          start: currentWeekStart,
          end: currentWeekEnd,
        });

        if (isCurrentWeek && !todo.completed) {
          const nextWeekStart = addWeeks(new Date(todo.startDate), 1);
          const nextWeekDue = addWeeks(new Date(todo.dueDate), 1);

          return {
            ...todo,
            startDate: nextWeekStart,
            dueDate: nextWeekDue,
            delayCount: (todo.delayCount || 0) + 1,
          };
        }

        return todo;
      });

      return {
        todos: updatedTodos,
        filteredTodos: applyFilters(updatedTodos, state.filterOptions),
      };
    }),
}));
