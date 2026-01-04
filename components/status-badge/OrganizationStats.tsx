import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Stats {
  programs: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  activePrograms: number;
  totalRegistrations: number;
}

interface OrganizationStatsProps {
  stats: Stats;
}

export default function OrganizationStats({ stats }: OrganizationStatsProps) {
  const statCards = [
    {
      title: "Chương trình",
      value: stats.programs,
      icon: Briefcase,
      color: "text-blue-600",
      subtext: null,
    },
    {
      title: "Đơn đăng ký",
      value: stats.totalRegistrations,
      icon: Users,
      color: "text-green-600",
      subtext: null,
    },
    {
      title: "Đã duyệt",
      value: stats.approvedRegistrations,
      icon: CheckCircle,
      color: "text-purple-600",
      subtext: null,
    },
    {
      title: "Chờ duyệt",
      value: stats.pendingRegistrations,
      icon: AlertCircle,
      color: "text-amber-600",
      subtext: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Link key={stat.title} href="#">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">
                  +0%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 mt-1">{stat.title}</p>
              {stat.subtext && (
                <p className="text-sm text-gray-500 mt-2">{stat.subtext}</p>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}