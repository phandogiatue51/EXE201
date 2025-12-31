import { User, Building, Shield } from "lucide-react";

interface AccountBadgeProps {
  role: number;   // 0 = Volunteer, 1 = Staff, 2 = Admin
  status: number; // 0 = Active, 1 = Inactive
}

const roleMap: Record<number, { icon: JSX.Element; label: string }> = {
  0: {
    icon: <User className="h-4 w-4 text-gray-500" />,
    label: "Tình nguyện viên",
  },
  1: {
    icon: <Building className="h-4 w-4 text-blue-500" />,
    label: "Nhân viên tổ chức",
  },
  2: {
    icon: <Shield className="h-4 w-4 text-red-500" />,
    label: "Quản trị viên",
  },
};

const statusMap: Record<number, { color: string; label: string }> = {
  0: {
    color: "bg-green-100 text-green-800",
    label: "Đang hoạt động",
  },
  1: {
    color: "bg-red-100 text-red-800",
    label: "Ngừng hoạt động",
  },
};

export function AccountBadge({ role, status }: AccountBadgeProps) {
  const roleInfo = roleMap[role] ?? roleMap[0];
  const statusInfo = statusMap[status] ?? {
    color: "bg-gray-100 text-gray-800",
    label: "Không rõ",
  };

  return (
    <div className="flex items-center gap-2">
      {roleInfo.icon}
      <span className="text-sm">{roleInfo.label}</span>
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    </div>
  );
}
