import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogStatusBadgeProps {
  status: number;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BlogStatusBadge({
  status,
  showIcon = true,
  showText = true,
  className,
  size = "md",
}: BlogStatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && config.icon}
      {showText && config.text}
    </span>
  );
}

function getStatusConfig(status: number) {
  switch (status) {
    case 1: // Draft
      return {
        text: "Bản nháp",
        icon: <Clock className="w-4 h-4" />,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      };
    case 2: // Published
      return {
        text: "Đã đăng",
        icon: <CheckCircle className="w-4 h-4" />,
        className: "bg-green-100 text-green-800 border-green-200",
      };
    case 3: // Archived
      return {
        text: "Lưu trữ",
        icon: <XCircle className="w-4 h-4" />,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    default:
      return {
        text: "Không xác định",
        icon: <Clock className="w-4 h-4" />,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      };
  }
}
