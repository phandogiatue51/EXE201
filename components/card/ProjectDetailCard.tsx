"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
} from "lucide-react";
import { ProjectStatusBadge, toProjectStatus, } from "@/components/status-badge/ProjectStatusBadge";
import { formatDateTime } from "@/lib/date";

export function ProjectDetailCard({
  project,
  showBackButton = true,
  backHref = "/programs",
  showOrganizationLink = true,
  className = "",
}: ProjectDetailCardProps) {
  return (
    <div className={className}>
      {/* Navigation */}
      {showBackButton && (
        <Button variant="ghost" asChild className="mb-6">
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      )}

      <Card className="overflow-hidden">
        {/* Hero Image Section */}
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-md">
                    {project.typeName}
                  </span>

                  <ProjectStatusBadge
                    status={toProjectStatus(project.status || 0)}
                    showIcon={true}
                    showText={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Organization Info */}
          {showOrganizationLink && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Tổ chức</p>
                  <p className="text-foreground">{project.organizationName}</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link href={`/home-organization/${project.organizationId}`}>
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Xem tổ chức
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Project Details Sections */}
          <ProjectDetailSection
            title="Mô tả chương trình"
            content={project.description}
          />

          <ProjectDetailSection
            title="Thử thách"
            content={project.challenges}
          />

          <ProjectDetailSection
            title="Mục tiêu của chương trình"
            content={project.goals}
          />

          <ProjectDetailSection
            title="Hoạt động diễn ra trong chương trình"
            content={project.activities}
          />

          <ProjectDetailSection
            title="Sự ảnh hưởng của chương trình"
            content={project.impacts}
          />

          <ProjectDetailSection
            title="Quyền lợi của tình nguyện viên"
            content={project.benefits}
          />

          <ProjectDetailSection
            title="Yêu cầu từ tình nguyện viên"
            content={project.requirements}
          />

          {/* Info Grid */}
          <ProjectInfoGrid
            location={project.location}
            startDate={project.startDate}
            endDate={project.endDate}
            currentVolunteers={project.currentVolunteers}
            requiredVolunteers={project.requiredVolunteers}
          />

          {/* Progress Bar */}
          <VolunteerProgress
            currentVolunteers={project.currentVolunteers}
            requiredVolunteers={project.requiredVolunteers}
          />

          {/* Categories */}
          {project.categories && project.categories.length > 0 && (
            <ProjectCategories categories={project.categories} />
          )}
        </div>
      </Card>
    </div>
  );
}

// Sub-component for each detail section
function ProjectDetailSection({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground whitespace-pre-line">{content}</p>
    </div>
  );
}

// Sub-component for info grid
function ProjectInfoGrid({
  location,
  startDate,
  endDate,
  currentVolunteers,
  requiredVolunteers,
}: {
  location?: string;
  startDate?: string;
  endDate?: string;
  currentVolunteers: number;
  requiredVolunteers: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 text-center">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Địa điểm</p>
            <p className="font-medium text-foreground">
              {location || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
            <p className="font-medium text-foreground">
              {startDate
                ? formatDateTime(startDate)
                : "Chưa có"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
            <p className="font-medium text-foreground">
              {endDate
                ? formatDateTime(endDate)
                : "Chưa có"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Tình nguyện viên</p>
            <p className="font-medium text-foreground">
              {currentVolunteers}/{requiredVolunteers}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Sub-component for volunteer progress
function VolunteerProgress({
  currentVolunteers,
  requiredVolunteers,
}: {
  currentVolunteers: number;
  requiredVolunteers: number;
}) {
  const percentage = Math.round((currentVolunteers / requiredVolunteers) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Tiến độ tuyển tình nguyện viên</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, percentage)}%`,
          }}
        />
      </div>
    </div>
  );
}

// Sub-component for categories
function ProjectCategories({
  categories,
}: {
  categories: Array<{
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon?: string;
  }>;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-3">Danh mục</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <div
            key={cat.categoryId}
            className="px-4 py-3 rounded-lg border flex items-center gap-3"
            style={{
              backgroundColor: `${cat.categoryColor}10`,
              borderColor: `${cat.categoryColor}30`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.categoryColor }}
            >
              <span className="text-xs text-white">
                {cat.categoryIcon
                  ? cat.categoryIcon.replace("fa-", "").charAt(0).toUpperCase()
                  : "C"}
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
  );
}
