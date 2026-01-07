"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/date";
import {
  ProjectStatusBadge,
  toProjectStatus,
} from "@/components/status-badge/ProjectStatusBadge";

export default function ProjectDetailCard({
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

      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <div className="p-6 space-y-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              {project.title}
            </h1>

            <div className="flex flex-col items-end gap-2">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                {project.typeName}
              </span>

              <ProjectStatusBadge
                status={toProjectStatus(project.status || 0)}
                showIcon={true}
                showText={true}
              />
            </div>
          </div>

          <ProjectDetailSection
            title="Mô tả chương trình"
            content={project.description}
          />

          <ProjectDetailSection
            title="Yêu cầu từ tình nguyện viên"
            content={project.requirements}
          />

          <ProjectInfoGrid
            location={project.location}
            startDate={project.startDate}
            endDate={project.endDate}
            currentVolunteers={project.currentVolunteers}
            requiredVolunteers={project.requiredVolunteers}
          />

          <VolunteerProgress
            currentVolunteers={project.currentVolunteers}
            requiredVolunteers={project.requiredVolunteers}
          />

          {project.categories && project.categories.length > 0 && (
            <div>
              <ProjectCategories categories={project.categories} />
            </div>
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
    <div className="mb-4">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-sm">
      <Card className="flex flex-col items-center justify-center text-center">
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

      <Card className="p-6 flex flex-col items-center justify-center text-center">
        {" "}
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

      <Card className="p-6 flex flex-col items-center justify-center text-center">
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
    <div>
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
                {cat.categoryIcon ? <i className={cat.categoryIcon}></i> : "C"}
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
