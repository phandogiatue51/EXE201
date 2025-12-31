import {
  CheckCircle,
  Clock,
  UserMinus,
  XCircle,
} from "lucide-react";

export enum OrganizationStatus {
  Pending = 0,
  Active = 1,
  Unactive = 2,
  Rejected = 3,
}

interface OrganizationStatusBadgeProps {
  status: OrganizationStatus;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function OrganizationStatusBadge({
  status,
  showIcon = true,
  showText = true,
  className = "",
}: OrganizationStatusBadgeProps) {
  const statusConfig = {
    [OrganizationStatus.Active]: {
      icon: CheckCircle,
      label: "Đang hoạt động",
      colorClasses: "bg-green-100 text-green-800 border-green-200",
      iconColor: "text-green-600",
    },
    [OrganizationStatus.Pending]: {
      icon: Clock,
      label: "Đang chờ duyệt",
      colorClasses: "bg-yellow-100 text-yellow-800 border-yellow-200",
      iconColor: "text-yellow-600",
    },
    [OrganizationStatus.Unactive]: {
      icon: UserMinus,
      label: "Không hoạt động",
      colorClasses: "bg-gray-100 text-gray-800 border-gray-200",
      iconColor: "text-gray-600",
    },
    [OrganizationStatus.Rejected]: {
      icon: XCircle,
      label: "Bị từ chối",
      colorClasses: "bg-red-100 text-red-800 border-red-200",
      iconColor: "text-red-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.colorClasses} ${className}`}
    >
      {showIcon && <Icon className={`w-4 h-4 ${config.iconColor}`} />}
      {showText && config.label}
    </span>
  );
}