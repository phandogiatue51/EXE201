"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI } from "../../../services/api";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  Tag,
  Building2,
} from "lucide-react";

export default function ProjectsPage() {
  useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<number | "all">("all");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const filter: any = {};

      if (search.trim()) {
        filter.title = search;
      }

      if (statusFilter !== "all") {
        filter.status = statusFilter;
      }

      if (typeFilter !== "all") {
        filter.type = typeFilter;
      }

      const data = await projectAPI.filter(filter);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, typeFilter, fetchProjects]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chương trình này?")) return;

    try {
      const response = await projectAPI.delete(id);
      setProjects(projects.filter(project => project.id !== id));
      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting program:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const uniqueTypes = [...new Set(projects.map(p => p.type))];
  const uniqueStatuses = [...new Set(projects.map(p => p.status))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quản lý chương trình</h1>
              <p className="text-muted-foreground mt-2">
                Quản lý tất cả các chương trình tình nguyện
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
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
                    {uniqueTypes.map(type => (
                      <option key={type} value={type}>
                        {projects.find(p => p.type === type)?.typeName || `Loại ${type}`}
                      </option>
                    ))}
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
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>
                        {projects.find(p => p.status === status)?.statusName || `Trạng thái ${status}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Counter */}
              <div className="md:col-span-2 flex items-center justify-end">
                <span className="text-muted-foreground">
                  {projects.length} chương trình
                </span>
              </div>
            </div>
          </Card>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 3 ? 'bg-green-100 text-green-800' : // Active
                          project.status === 2 ? 'bg-blue-100 text-blue-800' : // Recruiting
                            project.status === 4 ? 'bg-purple-100 text-purple-800' : // Completed
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {project.statusName}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title and Type */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {project.typeName}
                        </span>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {project.organizationName}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate" title={project.location}>
                          {project.location || "Chưa có địa điểm"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : "Chưa có"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {project.currentVolunteers}/{project.requiredVolunteers}
                        </span>
                      </div>

                      {/* Categories */}
                      {project.categories && project.categories.length > 0 && (
                        <div className="col-span-2 mt-2">
                          <div className="flex flex-wrap gap-2">
                            {project.categories.slice(0, 2).map((cat: any) => (
                              <span
                                key={cat.categoryId}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${cat.categoryColor}20`,
                                  color: cat.categoryColor,
                                  border: `1px solid ${cat.categoryColor}40`
                                }}
                              >
                                {cat.categoryName}
                              </span>
                            ))}
                            {project.categories.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.categories.length - 2} khác
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/programs/${project.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          Xem
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/programs/${project.id}/edit`}>
                          <Edit className="w-3 h-3 mr-1" />
                          Sửa
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy chương trình
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || statusFilter !== "all" || typeFilter !== "all"
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Chưa có chương trình nào trong hệ thống"}
              </p>
              <Button asChild>
                <Link href="/admin/programs/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm chương trình đầu tiên
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}