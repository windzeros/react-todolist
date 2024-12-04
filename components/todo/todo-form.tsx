'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Priority, Todo, CreateTodoInput } from '@/lib/types/todo';
import { useTodoStore } from '@/lib/store/todo-store';
import { useCategoryStore } from '@/lib/store/category-store';

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const addTodo = useTodoStore((state) => state.addTodo);
  const categories = useCategoryStore((state) => state.categories);

  // 기본 '할일' 카테고리 ID 찾기
  const defaultCategoryId = categories.find((cat) => cat.name === '할일')?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      alert('시작일은 종료일보다 늦을 수 없습니다.');
      return;
    }

    addTodo({
      title,
      description: description.trim() === '' ? undefined : description.trim(),
      priority,
      startDate: startDate ? new Date(startDate + 'T00:00:00') : undefined,
      dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : undefined,
      categoryId: categoryId === 'none' ? defaultCategoryId : (categoryId || defaultCategoryId),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStartDate('');
    setDueDate('');
    setCategoryId(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="할 일을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1"
          />

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">카테고리 없음</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="상세 설명 (선택사항)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">낮음</SelectItem>
            <SelectItem value="medium">중간</SelectItem>
            <SelectItem value="high">높음</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full"
          placeholder="시작일"
        />

        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full"
          placeholder="종료일"
        />
      </div>

      <Button type="submit">추가</Button>
    </form>
  );
}
