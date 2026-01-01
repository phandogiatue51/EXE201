"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { organizationAPI } from "../../../services/api";
import { projectAPI, categoryAPI } from "../../../services/api";
import { Organization, Project } from "../../../lib/type";
import { OrganizationView } from "@/components/organization/OrganizationForm";
import { ProjectFilters } from "@/components/organization/ProjectFilter";
import { ProjectList } from "@/components/homepage/ProjectList";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProjectFilterDto } from "@/lib/filter-type";

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      // You'll need to implement this API call
      const categories = await categoryAPI.getAll();
      setAvailableCategories(categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAvailableCategories([]);
    }
  };
  useEffect(() => {
    fetchOrganization();
  }, [id]);

  useEffect(() => {
    fetchProjects();
  }, [id, search, typeFilter, statusFilter]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const data = await organizationAPI.getById(parseInt(id));
      setOrganization(data);
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      if (!id) {
        setLoadingProjects(false);
        return;
      }

      setLoadingProjects(true);
      const orgIdNumber = parseInt(id || "0");

      const filter: ProjectFilterDto = {
        organizationId: orgIdNumber,
        title: search || undefined,
        type: typeFilter !== "all" ? parseInt(typeFilter) : undefined,
        status: statusFilter !== "all" ? parseInt(statusFilter) : undefined,
        categoryIds: categoryFilter.length > 0 ? categoryFilter : undefined,
      };

      const data = await projectAPI.filter(filter);
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }, [id, search, statusFilter, typeFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6085F0]"></div>
            <span className="ml-3 text-muted-foreground">Đang tải...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Không tìm thấy tổ chức</p>
            <Button variant="outline" asChild>
              <Link href="/home-organization">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/home-organization">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách tổ chức
            </Link>
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Organization Info */}
            <OrganizationView organization={organization} />

            {/* Projects Section */}
            <div className="mt-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Chương trình từ {organization.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Khám phá các chương trình tình nguyện của tổ chức
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  {projects.length} chương trình
                </div>
              </div>

              <ProjectFilters
                search={search}
                setSearch={setSearch}
                statusFilter={
                  statusFilter === "all" ? "all" : parseInt(statusFilter)
                }
                setStatusFilter={(value) =>
                  setStatusFilter(value === "all" ? "all" : value.toString())
                }
                typeFilter={typeFilter === "all" ? "all" : parseInt(typeFilter)}
                setTypeFilter={(value) =>
                  setTypeFilter(value === "all" ? "all" : value.toString())
                }
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                availableCategories={availableCategories}
                uniqueTypes={Array.from(new Set(projects.map((p) => p.type)))}
                uniqueStatuses={Array.from(
                  new Set(projects.map((p) => p.status))
                )}
                projects={projects}
                filteredCount={projects.length}
              />

              <ProjectList
                projects={projects}
                loading={loadingProjects}
                organizationName={organization.name}
                emptyMessage={
                  search || typeFilter !== "all" || statusFilter !== "all"
                    ? "Không tìm thấy chương trình phù hợp với bộ lọc"
                    : "Tổ chức này chưa tạo chương trình nào"
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
