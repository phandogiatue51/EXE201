"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, categoryAPI } from "../../../services/api";
import { ProjectFilters } from "../../../components/filter/ProjectFilter";
import { ProjectFilterDto } from "../../../lib/filter-type";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Building2,
  Tag,
  MapPin,
  Calendar,
  Users,
  LogIn,
  LogOut,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TextMarquee } from "@/components/ui/text-marquee";

export default function ProjectsPage() {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch projects with filters
  const fetchProjects = useCallback(async () => {
    try {
      if (!organizationId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const orgIdNumber = parseInt(organizationId || "0");

      const filter: ProjectFilterDto = {
        organizationId: orgIdNumber,
        title: debouncedSearch || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      if (categoryFilter.length > 0) {
        filter.categoryIds = categoryFilter;
      }

      console.log("Fetching with filter:", filter);

      const data = await projectAPI.filter(filter);
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [
    organizationId,
    debouncedSearch,
    statusFilter,
    typeFilter,
    categoryFilter,
  ]);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await categoryAPI.getAll();
      setAvailableCategories(categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAvailableCategories([]);
    }
  }, []);

  useEffect(() => {
    if (organizationId) {
      fetchCategories();
    }
  }, [organizationId, fetchCategories]);

  useEffect(() => {
    if (organizationId) {
      fetchProjects();
    }
  }, [organizationId, fetchProjects]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chương trình này?")) return;

    try {
      await projectAPI.delete(id);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Không thể xóa chương trình");
    }
  };

  const uniqueTypes = [...new Set(projects.map((p) => p.type))];
  const uniqueStatuses = [...new Set(projects.map((p) => p.status))];

  const filteredCount = projects.length;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Chưa có";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quản lý chương trình
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý tất cả các chương trình tình nguyện
              </p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
            >
              <Link href="/organization/programs/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm chương trình
              </Link>
            </Button>
          </div>

          <ProjectFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            availableCategories={availableCategories}
            uniqueTypes={uniqueTypes}
            uniqueStatuses={uniqueStatuses}
            projects={projects}
            filteredCount={filteredCount}
          />

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full text-sm"
                >
                  {/* Project Image */}
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden flex-shrink-0">
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
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          project.status === 3
                            ? "bg-green-100 text-green-800" // Active
                            : project.status === 2
                            ? "bg-blue-100 text-blue-800" // Recruiting
                            : project.status === 4
                            ? "bg-purple-100 text-purple-800" // Completed
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.statusName}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Title and Type */}
                    <div className="mb-3 flex-shrink-0">
                      <h3 className="font-semibold text-base text-foreground mb-1 min-h-[3rem]">
                        <TextMarquee maxLines={2} className="line-clamp-2">
                          {project.title}
                        </TextMarquee>
                      </h3>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <TextMarquee maxLines={1} className="text-sm text-muted-foreground">
                          {project.typeName}
                        </TextMarquee>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <TextMarquee maxLines={1} className="text-sm text-muted-foreground">
                        {project.organizationName}
                      </TextMarquee>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 flex-shrink-0 min-h-[3.5rem]">
                      <TextMarquee maxLines={3} className="line-clamp-3">
                        {project.description}
                      </TextMarquee>
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span
                          className="text-xs text-muted-foreground truncate"
                          title={project.location}
                        >
                          {project.location || "Chưa có địa điểm"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {project.startDate
                            ? formatDate(project.startDate)
                            : "Chưa có"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {project.currentVolunteers || 0}/
                          {project.requiredVolunteers || 0}
                        </span>
                      </div>

                      {/* Categories */}
                      {project.categories && project.categories.length > 0 && (
                        <div className="col-span-2 mt-2">
                          <div className="flex flex-wrap gap-2">
                            {project.categories.slice(0, 2).map((cat: any) => (
                              <span
                                key={cat.categoryId || cat.id}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${
                                    cat.categoryColor || cat.color
                                  }20`,
                                  color: cat.categoryColor || cat.color,
                                  border: `1px solid ${
                                    cat.categoryColor || cat.color
                                  }40`,
                                }}
                              >
                                {cat.categoryName || cat.name}
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

                    {/* Spacer to push actions to bottom */}
                    <div className="flex-1"></div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/organization/programs/${project.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          Xem
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link
                          href={`/organization/programs/${project.id}/edit`}
                        >
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

                    {/* Status-based Actions */}
                    {project.status === 4 && (
                      <div className="mt-3 flex-shrink-0">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-100 to-green-300 text-green-800 hover:from-green-200 hover:to-green-400"
                          asChild
                        >
                          <Link href={`/attendace/${project.id}/check-out`}>
                            <LogOut className="w-3 h-3 mr-1" />
                            Check out
                          </Link>
                        </Button>
                      </div>
                    )}

                    {project.status === 3 && (
                      <div className="mt-3 flex-shrink-0">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 hover:from-blue-200 hover:to-blue-400"
                          asChild
                        >
                          <Link href={`/attendace/${project.id}/check-in`}>
                            <LogIn className="w-3 h-3 mr-1" />
                            Check in
                          </Link>
                        </Button>
                      </div>
                    )}

                    {project.status === 2 && (
                      <div className="mt-3 flex-shrink-0">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-100 to-purple-300 text-purple-800 hover:from-purple-200 hover:to-purple-400"
                          asChild
                        >
                          <Link
                            href={`/organization/programs/${project.id}/applications`}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Quản lý đơn đăng ký
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy chương trình
              </h3>
              <p className="text-muted-foreground mb-4">
                {search ||
                statusFilter !== "all" ||
                typeFilter !== "all" ||
                categoryFilter.length > 0
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Chưa có chương trình nào trong hệ thống"}
              </p>
              <Button asChild>
                <Link href="/organization/programs/new">
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
