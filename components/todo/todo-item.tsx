'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Todo } from '@/lib/types/todo';
import { useTodoStore } from '@/lib/store/todo-store';
import { useCategoryStore } from '@/lib/store/category-store';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { EditTodoDialog } from './edit-todo-dialog';

interface TodoItemProps {
  todo: Todo;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const priorityLabels = {
  low: '낮음',
  medium: '중간',
  high: '높음',
};

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoStore();
  const categories = useCategoryStore((state) => state.categories);

  const category = categories.find((cat) => cat.id === todo.categoryId);

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 오류';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            {category && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm">
                {category.name}
              </span>
            )}
          </div>
          
          {todo.description && (
            <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
              {priorityLabels[todo.priority]}
            </span>
            
            {!todo.startDate && (
              <span className="text-gray-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                생성일: {formatDate(todo.createdAt)}
              </span>
            )}

            {todo.startDate && (
              <span className="text-gray-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                시작일: {formatDate(todo.startDate)}
              </span>
            )}

            {todo.dueDate && (
              <span className="text-gray-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                마감일: {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <EditTodoDialog todo={todo} />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => deleteTodo(todo.id)}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
