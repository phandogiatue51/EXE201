"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI } from "../../../../services/api";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Users,
  Tag,
  Edit,
  Trash2,
  Globe,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  UserMinus,
  AlertCircle,
} from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getById(parseInt(id));
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa chương trình này?")) return;
    
    try {
      await projectAPI.delete(parseInt(id));
      window.location.href = "/admin/programs";
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Không thể xóa chương trình");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy chương trình</p>
        </main>
      </div>
    );
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 3: // Active
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 2: // Recruiting
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 4: // Completed
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 5: // Cancelled
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 3: // Active
        return "bg-green-100 text-green-800 border-green-200";
      case 2: // Recruiting
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 4: // Completed
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 5: // Cancelled
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/programs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <Card className="overflow-hidden mb-8">
              {/* Project Image */}
              <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 relative">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-24 h-24 text-white/30" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                          {project.typeName}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(project.status)}
                            {project.statusName}
                          </div>
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/programs/${id}/edit`}>
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
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                {/* Organization */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tổ chức</p>
                      <p className="text-foreground">{project.organizationName}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/admin/organizations/${project.organizationId}`}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Xem tổ chức
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Mô tả chương trình</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Thử thách</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.challenges}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Mục tiêu của chương trình</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.goals}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Hoạt động diễn ra trong chương trình</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.activities}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Sự ảnh hưởng của chương trình</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.impacts}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Quyền lợi của tình nguyện viên</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.benefits}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Yêu cầu từ tình nguyện viên</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.requirements}
                  </p>
                </div>
                
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Địa điểm</p>
                        <p className="font-medium text-foreground">
                          {project.location || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                        <p className="font-medium text-foreground">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                        <p className="font-medium text-foreground">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tình nguyện viên</p>
                        <p className="font-medium text-foreground">
                          {project.currentVolunteers}/{project.requiredVolunteers}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Tiến độ tuyển tình nguyện viên</span>
                    <span>{Math.round((project.currentVolunteers / project.requiredVolunteers) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (project.currentVolunteers / project.requiredVolunteers) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Categories */}
                {project.categories && project.categories.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Danh mục</h2>
                    <div className="flex flex-wrap gap-3">
                      {project.categories.map((cat: any) => (
                        <div
                          key={cat.categoryId}
                          className="px-4 py-3 rounded-lg border flex items-center gap-3"
                          style={{
                            backgroundColor: `${cat.categoryColor}10`,
                            borderColor: `${cat.categoryColor}30`
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: cat.categoryColor }}
                          >
                            <span className="text-xs text-white">
                              {cat.categoryIcon ? cat.categoryIcon.replace('fa-', '').charAt(0).toUpperCase() : 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: cat.categoryColor }}>
                              {cat.categoryName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>Ngày tạo: {new Date(project.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  {project.updatedAt && (
                    <div>
                      <p>Cập nhật lần cuối: {new Date(project.updatedAt).toLocaleString('vi-VN')}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Actions */}
            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link href={`/admin/programs/${id}/applications`}>
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