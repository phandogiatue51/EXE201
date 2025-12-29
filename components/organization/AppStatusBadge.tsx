import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const APPLICATION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  WITHDRAWN: 3,
  COMPLETED: 4,
} as const;

export type ApplicationStatus =
  typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}
const statusConfig: Record<ApplicationStatus, {
  icon: typeof Clock;
  color: string;
  text: string;
}> = {
  [APPLICATION_STATUS.PENDING]: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    text: "Chờ xử lý",
  },
  [APPLICATION_STATUS.COMPLETED]: {
    icon: AlertCircle,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    text: "Đã hoàn thành",
  },
  [APPLICATION_STATUS.APPROVED]: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    text: "Đã chấp nhận",
  },
  [APPLICATION_STATUS.REJECTED]: {
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    text: "Đã từ chối",
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    icon: XCircle,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    text: "Đã rút đơn",
  },
};

export function StatusBadge({
  status,
  className,
  showIcon = true,
  showText = true,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium",
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {showText && config.text}
    </span>
  );
}