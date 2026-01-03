"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI } from "../../../../services/api";
import { ProjectDetailCard } from "@/components/ProjectDetailCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Edit, Trash2, Globe, Users } from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectAPI.getById(parseInt(id));
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Không thể tải thông tin chương trình");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa chương trình này?")) return;

    try {
      await projectAPI.delete(parseInt(id));
      window.location.href = "/organization/programs";
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Không thể xóa chương trình");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          <LoadingState message="Đang tải..." />
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          <ErrorState 
            message={error || "Không tìm thấy chương trình"} 
            onRetry={fetchProject}
          />
        </main>
      </div>
    );
  }

  // Custom render function for action buttons in header
  const renderHeaderActions = () => (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" asChild>
        <Link href={`/organization/programs/${id}/edit`}>
          <Edit className="w-4 h-4 mr-1" />
          Sửa
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Xóa
      </Button>
    </div>
  );

  // Custom render function for timestamp section
  const renderTimestamps = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
      <div>
        <p>Ngày tạo: {new Date(project.createdAt).toLocaleString("vi-VN")}</p>
      </div>
      {project.updatedAt && (
        <div>
          <p>
            Cập nhật lần cuối:{" "}
            {new Date(project.updatedAt).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Project Detail Card */}
            <ProjectDetailCard
              project={project}
              showBackButton={true}
              backHref="/organization/programs"
              showOrganizationLink={true}
              className="mb-8"
            />

            {/* Additional Actions */}
            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link href={`/organization/programs/${id}/applications`}>
                  <Users className="w-4 h-4 mr-2" />
                  Quản lý đơn đăng ký
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1">
                <Link href={`/programs/${id}`} target="_blank">
                  <Globe className="w-4 h-4 mr-2" />
                  Xem trang công khai
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}