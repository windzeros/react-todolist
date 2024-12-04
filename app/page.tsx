'use client';

import { TodoForm } from '@/components/todo/todo-form';
import { TodoItem } from '@/components/todo/todo-item';
import { TodoFilters } from '@/components/todo/todo-filters';
import { CategoryManager } from '@/components/category/category-manager';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTodoStore } from '@/lib/store/todo-store';
import { PeriodView } from '@/components/dashboard/period-view';
import { useState } from 'react';

export default function Home() {
  const filteredTodos = useTodoStore((state) => state.filteredTodos);
  const [showPeriodView, setShowPeriodView] = useState(false);

  const showTodoList = () => {
    setShowPeriodView(false);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={showTodoList}
          className="text-3xl font-bold hover:text-primary"
        >
          Todo List
        </button>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPeriodView(!showPeriodView)}
          >
            {showPeriodView ? '할일 목록' : '기간별 보기'}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">카테고리 관리</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>카테고리 관리</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <CategoryManager />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {showPeriodView ? (
        <PeriodView />
      ) : (
        <>
          <TodoForm />
          <TodoFilters />
          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
            {filteredTodos.length === 0 && (
              <p className="text-center text-gray-500">표시할 할 일이 없습니다.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}
