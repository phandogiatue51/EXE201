"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, categoryAPI } from "../../../services/api";
import { ProjectFilters } from "../../../components/filter/ProjectFilter";
import { ProjectFilterDto } from "../../../lib/filter-type";
import {
  PlusCircle,
  Building2,
  LogIn,
  LogOut,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import ExtraSimpleProjectCard from "@/components/card/ExtraSimpleProjectCard";

export default function ProjectsPage() {
  const { user } = useAuth();
  const organizationId = user?.organizationId;
  const { toast } = useToast();
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
      const response = await projectAPI.delete(id);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      fetchProjects();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const uniqueTypes = [...new Set(projects.map((p) => p.type))];
  const uniqueStatuses = [...new Set(projects.map((p) => p.status))];

  const filteredCount = projects.length;

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col">
                  <ExtraSimpleProjectCard
                    project={project}
                    showBackButton={false}
                    showOrganizationLink={false}
                    className="h-full flex-1"
                  />
                  <div className="flex gap-2 mt-3">
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
                      <Link href={`/organization/programs/${project.id}/edit`}>
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

                  <div className="mt-3 flex-shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 hover:from-blue-200 hover:to-blue-400"
                      asChild
                    >
                      <Link
                        href={`/organization/programs/${project.id}/attendance`}
                      >
                        <LogIn className="w-3 h-3 mr-1" />
                        Quản lý điểm danh
                      </Link>
                    </Button>
                  </div>

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
