"use client";

import {
  FileText,        // Draft
  CalendarCheck,   // Planning
  Users,           // Recruiting
  PlayCircle,      // Active
  CheckCircle,     // Completed
  XCircle,         // Cancelled
} from "lucide-react";

export enum ProjectStatus {
  Draft = 0,         // Bản nháp
  Planning = 1,      // Đang lên kế hoạch
  Recruiting = 2,    // Đang tuyển dụng
  Active = 3,        // Đang triển khai
  Completed = 4,     // Hoàn thành
  Cancelled = 5,     // Đã hủy
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ProjectStatusBadge({
  status,
  showIcon = true,
  showText = true,
  className = "",
  size = "md",
}: ProjectStatusBadgeProps) {
  const statusConfig = {
    [ProjectStatus.Draft]: {
      icon: FileText,
      label: "Bản nháp",
      colorClasses: "bg-gray-100 text-gray-800 border-gray-200",
      iconColor: "text-gray-600",
    },
    [ProjectStatus.Planning]: {
      icon: CalendarCheck,
      label: "Đang lên kế hoạch",
      colorClasses: "bg-blue-100 text-blue-800 border-blue-200",
      iconColor: "text-blue-600",
    },
    [ProjectStatus.Recruiting]: {
      icon: Users,
      label: "Đang tuyển dụng",
      colorClasses: "bg-purple-100 text-purple-800 border-purple-200",
      iconColor: "text-purple-600",
    },
    [ProjectStatus.Active]: {
      icon: PlayCircle,
      label: "Đang triển khai",
      colorClasses: "bg-green-100 text-green-800 border-green-200",
      iconColor: "text-green-600",
    },
    [ProjectStatus.Completed]: {
      icon: CheckCircle,
      label: "Hoàn thành",
      colorClasses: "bg-emerald-100 text-emerald-800 border-emerald-200",
      iconColor: "text-emerald-600",
    },
    [ProjectStatus.Cancelled]: {
      icon: XCircle,
      label: "Đã hủy",
      colorClasses: "bg-red-100 text-red-800 border-red-200",
      iconColor: "text-red-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium border ${config.colorClasses} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`w-3 h-3 ${size === "lg" ? "w-4 h-4" : ""} ${config.iconColor}`} />}
      {showText && config.label}
    </span>
  );
}

export function toProjectStatusFriendlyName(status: ProjectStatus | number): string {
  const statusMap: Record<number, string> = {
    [ProjectStatus.Draft]: "Bản nháp",
    [ProjectStatus.Planning]: "Đang lên kế hoạch",
    [ProjectStatus.Recruiting]: "Đang tuyển dụng",
    [ProjectStatus.Active]: "Đang triển khai",
    [ProjectStatus.Completed]: "Hoàn thành",
    [ProjectStatus.Cancelled]: "Đã hủy",
  };
  return statusMap[status as number] || "Không xác định";
}

export function toProjectStatus(status: number): ProjectStatus {
  if (status >= ProjectStatus.Draft && status <= ProjectStatus.Cancelled) {
    return status as ProjectStatus;
  }
  return ProjectStatus.Draft;
}