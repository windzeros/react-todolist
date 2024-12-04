'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { useTodoStore } from '@/lib/store/todo-store';
import { useCategoryStore } from '@/lib/store/category-store';
import { Todo, Priority } from '@/lib/types/todo';
import { DatePicker } from '@/components/ui/date-picker';

interface EditTodoDialogProps {
  todo: Todo;
}

export function EditTodoDialog({ todo }: EditTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>(todo.title);
  const [categoryId, setCategoryId] = useState<string>(todo.categoryId || '');
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [startDate, setStartDate] = useState<Date | undefined>(todo.startDate);
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate);

  const categories = useCategoryStore((state) => state.categories);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodo(todo.id, {
      ...todo,
      title,
      categoryId,
      priority,
      startDate,
      dueDate,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할일 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                제목
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="할일을 입력하세요"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">카테고리</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">우선순위</label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="우선순위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">시작일</label>
              <DatePicker
                date={startDate}
                onSelect={(date) => setStartDate(date)}
                placeholder="시작일 선택"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">마감일</label>
              <DatePicker
                date={dueDate}
                onSelect={(date) => setDueDate(date)}
                placeholder="마감일 선택"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button type="submit">수정</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
