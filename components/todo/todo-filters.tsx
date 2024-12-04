'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Priority, FilterOptions } from '@/lib/types/todo';
import { useTodoStore } from '@/lib/store/todo-store';
import { useCategoryStore } from '@/lib/store/category-store';

export function TodoFilters() {
  const filterOptions = useTodoStore((state) => state.filterOptions) as FilterOptions;
  const setFilterOptions = useTodoStore((state) => state.setFilterOptions);
  const categories = useCategoryStore((state) => state.categories);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 카테고리 필터 */}
        <Select
          value={filterOptions.categoryId ?? "all"}
          onValueChange={(value) => {
            const newOptions = { ...filterOptions };
            if (value === "all") {
              newOptions.categoryId = undefined;
            } else if (categories.some(cat => cat.id === value)) {
              newOptions.categoryId = value;
            } else {
              newOptions.categoryId = undefined;
            }
            setFilterOptions(newOptions);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="모든 카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 우선순위 필터 */}
        <Select
          value={filterOptions.priority ?? "all"}
          onValueChange={(value) => {
            setFilterOptions({
              ...filterOptions,
              priority: value === "all" ? undefined : (value as Priority),
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="모든 우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 우선순위</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
            <SelectItem value="medium">중간</SelectItem>
            <SelectItem value="high">높음</SelectItem>
          </SelectContent>
        </Select>

        {/* 날짜 필터 */}
        <Input
          type="date"
          value={filterOptions.startDate || ''}
          onChange={(e) => {
            setFilterOptions({
              ...filterOptions,
              startDate: e.target.value || undefined,
            });
          }}
          className="w-full"
          placeholder="시작일"
        />

        <Input
          type="date"
          value={filterOptions.endDate || ''}
          onChange={(e) => {
            setFilterOptions({
              ...filterOptions,
              endDate: e.target.value || undefined,
            });
          }}
          className="w-full"
          placeholder="종료일"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterOptions.showCompleted}
            onChange={(e) => {
              setFilterOptions({
                ...filterOptions,
                showCompleted: e.target.checked,
              });
            }}
            className="form-checkbox"
          />
          <span>완료된 항목 표시</span>
        </label>
      </div>
    </div>
  );
}
