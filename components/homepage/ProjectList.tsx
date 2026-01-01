"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusBadge, ProjectStatus, toProjectStatus } from "@/components/organization/ProjectStatusBadge";
import { Project } from "@/lib/type";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  emptyMessage?: string;
  organizationName?: string;
}

export function ProjectList({
  projects,
  loading = false,
  emptyMessage = "Chưa có chương trình nào",
  organizationName,
}: ProjectListProps) {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('vi-VN');
    } catch {
      return "N/A";
    }
  };

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
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          <Link href={`/projects/${project.id}`} className="block">
            {/* Project Image */}
            <div className="h-48 overflow-hidden bg-gray-100">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                  <Tag className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                  {project.title}
                </h3>
                <ProjectStatusBadge 
                  status={toProjectStatus(project.status || ProjectStatus.Draft)}
                  showIcon={false}
                  showText={true}
                  size="sm"
                />
              </div>

              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Project Details */}
              <div className="space-y-3">
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
                      {project.startDate && formatDate(project.startDate)}
                      {project.endDate && ` - ${formatDate(project.endDate)}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>Cần {project.requiredVolunteers || 0} tình nguyện viên</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.type || "Không xác định"}
                </Badge>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}