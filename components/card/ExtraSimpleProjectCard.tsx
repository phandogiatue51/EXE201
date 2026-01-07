"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import {
  ProjectStatusBadge,
  toProjectStatus,
} from "@/components/status-badge/ProjectStatusBadge";
import { formatDateTime } from "@/lib/date";

export default function ExtraSimpleProjectCard({
  project,
}: ProjectDetailCardProps) {
  return (
    <div>
      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <div className="p-6 space-y-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <h1 className="text-lg font-bold text-foreground">
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

          <ProjectInfoGrid
            location={project.location}
            startDate={project.startDate}
            endDate={project.endDate}
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

function ProjectInfoGrid({
  location,
  startDate,
  endDate,
}: {
  location?: string;
  startDate?: string;
  endDate?: string;
}) {
  return (
    <div className="space-y-2 text-xs">
      {/* Địa điểm */}
      <div className="flex items-center justify-between p-2 rounded">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Địa điểm</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {location || "Chưa cập nhật"}
        </span>
      </div>

      {/* Ngày bắt đầu */}
      <div className="flex items-center justify-between p-2 rounded">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Ngày bắt đầu</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {startDate
            ? formatDateTime(startDate)
            : "Chưa có"}
        </span>
      </div>

      {/* Ngày kết thúc */}
      <div className="flex items-center justify-between p-2 rounded">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Ngày kết thúc</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {endDate
            ? formatDateTime(endDate)
            : "Chưa có"}
        </span>
      </div>
    </div>
  );
}

function VolunteerProgress({
  currentVolunteers,
  requiredVolunteers,
}: {
  currentVolunteers: number;
  requiredVolunteers: number;
}) {
  const percentage = Math.round((currentVolunteers / requiredVolunteers) * 100);

  return (
    <div>
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
      <h2 className="text-md font-semibold text-foreground mb-3">Danh mục</h2>
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
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.categoryColor }}
            >
              <span className="text-xs text-white">
                {cat.categoryIcon ? <i className={cat.categoryIcon}></i> : "C"}
              </span>
            </div>
            <div>
              <p className="font-small" style={{ color: cat.categoryColor }}>
                {cat.categoryName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
