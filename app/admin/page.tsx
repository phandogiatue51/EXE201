"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  mockAccounts,
  mockPrograms,
  mockCertificates,
  mockOrganizationRegistrations,
} from "@/lib/mock-data";
import RecentActivity from "../../components/admin/RecentActivity";
import QuickStats from "../../components/admin/QuickStats";
import PendingApprovals from "../../components/admin/PendingApprovals";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    volunteers: 0,
    organizations: 0,
    programs: 0,
    certificates: 0,
    pendingApprovals: 0,
    activePrograms: 0,
  });

  useEffect(() => {
    // Load data from localStorage
    const customPrograms = JSON.parse(localStorage.getItem("customPrograms") || "[]");
    const customCertificates = JSON.parse(localStorage.getItem("customCertificates") || "[]");
    const orgRegistrations = JSON.parse(localStorage.getItem("orgRegistrations") || "[]");
    
    const volunteers = mockAccounts.filter(a => a.role === "volunteer").length;
    const organizations = mockAccounts.filter(a => a.role === "organization").length;
    const allPrograms = [...mockPrograms, ...customPrograms];
    const allCertificates = [...mockCertificates, ...customCertificates];
    
    setStats({
      volunteers,
      organizations,
      programs: allPrograms.length,
      certificates: allCertificates.length,
      pendingApprovals: orgRegistrations.filter((r: any) => r.status === "pending").length,
      activePrograms: allPrograms.filter((p: any) => p.status === "active").length,
    });
  }, []);

  const statCards = [
    {
      title: "Tình nguyện viên",
      value: stats.volunteers,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      href: "/admin/volunteers",
    },
    {
      title: "Tổ chức",
      value: stats.organizations,
      icon: Briefcase,
      color: "bg-green-500",
      change: "+5%",
      href: "/admin/organizations",
    },
    {
      title: "Chương trình",
      value: stats.programs,
      icon: Calendar,
      color: "bg-purple-500",
      change: "+8%",
      href: "/admin/projects",
      subtext: `${stats.activePrograms} đang hoạt động`,
    },
    {
      title: "Chứng chỉ",
      value: stats.certificates,
      icon: Award,
      color: "bg-amber-500",
      change: "+15%",
      href: "/admin/certificates",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="p-6 gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chào mừng quay trở lại, Admin!</h2>
            <p className="opacity-90">Hôm nay có {stats.pendingApprovals} yêu cầu cần duyệt</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/admin/projects/create">
              Tạo chương trình mới
            </Link>
          </Button>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-1">
          <PendingApprovals />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <QuickStats />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Recent Programs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Chương trình gần đây</h3>
          <Link href="/admin/projects" className="text-sm text-[#6085F0] hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="space-y-4">
          {mockPrograms.slice(0, 5).map((program) => (
            <div
              key={program.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900"></h4>
                <p className="text-sm text-gray-500">{program.organizationName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  program.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {program.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </span>
                <span className="text-sm text-gray-500">
                  {program.volunteersJoined} tình nguyện viên
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}