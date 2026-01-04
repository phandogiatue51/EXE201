"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Filter, Tag, X } from "lucide-react";

interface ProjectFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: number | "all";
  setStatusFilter: (value: number | "all") => void;
  typeFilter: number | "all";
  setTypeFilter: (value: number | "all") => void;
  categoryFilter: number[];
  setCategoryFilter: (value: number[]) => void;
  availableCategories: any[];
  uniqueTypes: number[];
  uniqueStatuses: number[];
  projects: any[];
  filteredCount: number;
}

export function ProjectFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  uniqueTypes,
  uniqueStatuses,
  projects,
  filteredCount,
}: ProjectFiltersProps) {
  const handleCategoryToggle = (categoryId: number) => {
    if (categoryFilter.includes(categoryId)) {
      setCategoryFilter(categoryFilter.filter(id => id !== categoryId));
    } else {
      setCategoryFilter([...categoryFilter, categoryId]);
    }
  };

  const clearCategoryFilter = () => {
    setCategoryFilter([]);
  };

  return (
    <Card className="p-6 mb-8">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm chương trình..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as number | "all")}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">Tất cả loại</option>
                {uniqueTypes.map(type => {
                  const project = projects.find(p => p.type === type);
                  return (
                    <option key={type} value={type}>
                      {project?.typeName || `Loại ${type}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as number | "all")}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">Tất cả trạng thái</option>
                {uniqueStatuses.map(status => {
                  const project = projects.find(p => p.status === status);
                  return (
                    <option key={status} value={status}>
                      {project?.statusName || `Trạng thái ${status}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Counter */}
          <div className="md:col-span-2 flex items-center justify-end">
            <span className="text-muted-foreground">
              {filteredCount} chương trình
            </span>
          </div>
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Lọc theo danh mục</span>
              </div>
              {categoryFilter.length > 0 && (
                <button
                  onClick={clearCategoryFilter}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Xóa lọc
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = categoryFilter.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all flex items-center gap-1.5 border ${
                      isSelected ? "border-2" : "hover:border-2"
                    }`}
                    style={{
                      color: isSelected ? "white" : category.color,
                      borderColor: category.color,
                      backgroundColor: isSelected ? `${category.color}` : "transparent",
                    }}
                  >
                    {category.icon && (
                      <i className={`${category.icon} text-xs`} />
                    )}

                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}