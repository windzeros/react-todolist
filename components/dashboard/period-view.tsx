'use client';

import { useState, useEffect } from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
  format
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTodoStore } from '@/lib/store/todo-store';
import { useCategoryStore } from '@/lib/store/category-store';
import { Todo, Period, FilterTodosByPeriodResult } from '@/lib/types/todo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function getDateRange(period: Period): { start: Date; end: Date; label: string } {
  const now = new Date();
  switch (period) {
    case 'week':
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      return {
        start: weekStart,
        end: weekEnd,
        label: `${format(weekStart, 'M.d', { locale: ko })} - ${format(weekEnd, 'M.d', { locale: ko })}`
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, 'M월', { locale: ko })
      };
    case 'year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
        label: format(now, 'yyyy년', { locale: ko })
      };
  }
}

function filterTodosByPeriod(todos: Todo[], period: Period): FilterTodosByPeriodResult {
  const dateRange = getDateRange(period);
  
  const filteredTodos = todos.filter(todo => {
    // 마감일이나 시작일 중 하나라도 있으면 필터링
    const todoDate = todo.dueDate ? new Date(todo.dueDate) : 
                    todo.startDate ? new Date(todo.startDate) : 
                    new Date(todo.createdAt);
    
    return isWithinInterval(todoDate, { 
      start: startOfWeek(dateRange.start, { weekStartsOn: 1 }), 
      end: endOfWeek(dateRange.end, { weekStartsOn: 1 }) 
    });
  });

  return {
    todos: filteredTodos,
    dateRange: {
      start: dateRange.start,
      end: dateRange.end
    }
  };
}

function formatTodoDate(todo: Todo): string {
  if (todo.dueDate) {
    return `마감일: ${format(new Date(todo.dueDate), 'M.d')}`;
  }
  if (todo.startDate) {
    return `시작일: ${format(new Date(todo.startDate), 'M.d')}`;
  }
  return `생성일: ${format(new Date(todo.createdAt), 'M.d')}`;
}

function getDelayColor(delayCount?: number) {
  if (!delayCount || delayCount <= 0) return '';
  switch (delayCount) {
    case 1: // 첫 주 이동
      return 'bg-yellow-50';
    case 2: // 두 번째 주 이동
      return 'bg-orange-50';
    default: // 3주 이상 이동
      return 'bg-red-50';
  }
}

function getDelayTextColor(delayCount?: number) {
  if (!delayCount || delayCount <= 0) return '';
  switch (delayCount) {
    case 1:
      return 'text-yellow-800';
    case 2:
      return 'text-orange-800';
    default:
      return 'text-red-800';
  }
}

function getDelayText(delayCount: number) {
  if (delayCount === 1) {
    return '1주 지연';
  } else if (delayCount === 2) {
    return '2주 지연';
  } else {
    return `${delayCount}주 지연`;
  }
}

export function PeriodView() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const todos = useTodoStore(state => state.todos);
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const moveUncompletedTodos = useTodoStore(state => state.moveUncompletedTodos);
  const categories = useCategoryStore(state => state.categories);

  useEffect(() => {
    if (selectedPeriod === 'week') {
      moveUncompletedTodos();
    }
  }, [selectedPeriod, moveUncompletedTodos]);

  // 카테고리 필터링
  const filteredByCategory = selectedCategoryId === 'all'
    ? todos
    : todos.filter(todo => todo.categoryId === selectedCategoryId);

  // 기간 필터링
  const { todos: filteredTodos, dateRange } = filterTodosByPeriod(
    filteredByCategory,
    selectedPeriod
  );

  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const totalCount = filteredTodos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as Period)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">주간</SelectItem>
              <SelectItem value="month">월간</SelectItem>
              <SelectItem value="year">연간</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="전체 카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {getDateRange(selectedPeriod).label}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">진행 상황</h3>
          <div className="text-sm text-muted-foreground">
            완료: {completedCount}/{totalCount} ({completionRate}%)
          </div>
        </div>
        <div className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-2 rounded-md ${getDelayColor(todo.delayCount)}`}
              >
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex flex-col">
                    <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                      {todo.title}
                      {(todo.delayCount ?? 0) > 0 && (
                        <span className={`ml-2 text-xs ${getDelayTextColor(todo.delayCount)}`}>
                          {getDelayText(todo.delayCount!)}
                        </span>
                      )}
                    </span>
                    {todo.description && 
                     (typeof todo.description === 'string' || typeof todo.description === 'number') &&
                     todo.description.toString() !== '0' && 
                     todo.description.toString().trim() !== '' && (
                      <span className="text-sm text-muted-foreground">
                        {todo.description.toString().trim()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatTodoDate(todo)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              해당 기간에 할 일이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
