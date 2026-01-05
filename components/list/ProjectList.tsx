"use client";

import { Card } from "@/components/ui/card";
import { ProjectStatusBadge, ProjectStatus, toProjectStatus, } from "@/components/status-badge/ProjectStatusBadge";
import { Project } from "@/lib/type";
import { Calendar, MapPin, Users, Tag, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pen, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatDateTime } from "@/lib/date";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  emptyMessage?: string;
  organizationName?: string;
  organizationId?: number;
}

export function ProjectList({
  projects,
  loading = false,
  emptyMessage = "Chưa có chương trình nào",
  organizationName,
}: ProjectListProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6085F0] mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải chương trình...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {emptyMessage}
        </h3>
        {organizationName && (
          <p className="text-muted-foreground">
            {organizationName} chưa tạo chương trình nào
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        return (
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Whole card is a link */}
            <Link href={`/programs/${project.id}`} className="block">
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
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full">
                    <ProjectStatusBadge
                      status={toProjectStatus(project.status)}
                      showIcon={false}
                      showText={true}
                      size="sm"
                    />
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-3">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {project.description}
                </p>

                <ProjectStatusBadge
                  status={toProjectStatus(project.status || ProjectStatus.Draft)}
                  showIcon={false}
                  showText={true}
                />

                {/* Project Details */}
                <div className="space-y-3 mt-3">
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  )}

                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>
                        {project.startDate && formatDateTime(project.startDate)}
                        {project.endDate && ` - ${formatDateTime(project.endDate)}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      Cần {project.requiredVolunteers || 0} tình nguyện viên
                    </span>
                  </div>

                  {project.categories?.length > 0 && (
                    <div className="col-span-2 mt-2 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.categories.slice(0, 2).map((cat: any) => (
                          <span
                            key={cat.categoryId}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${cat.categoryColor}20`,
                              color: cat.categoryColor,
                              border: `1px solid ${cat.categoryColor}40`,
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

                {/* Action buttons (not links) */}
                <div className="flex gap-2 mt-3">
                  {user?.accountId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        router.push(`/programs/${project.id}/certificate-selection`);
                      }}
                    >
                      <Pen className="w-3 h-3 mr-1" />
                      Đăng ký
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        alert("Bạn cần đăng nhập để tiếp tục");
                      }}
                    >
                      <Pen className="w-3 h-3 mr-1" />
                      Đăng ký
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          </Card>

        );
      })}
    </div>
  );
}
