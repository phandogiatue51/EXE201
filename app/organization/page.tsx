"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrganizationStats from "../../components/status-badge/OrganizationStats";
import PendingRegistrations from "../../components/organization/PendingRegistrations";
import { useOrganizationDashboard } from "../../hooks/use-organization-dashboard";

export default function OrganizationDashboardPage() {
  const {
    stats,
    pendingRegistrations,
    programs,
    organization,
    handleApproveRegistration,
    handleRejectRegistration,
  } = useOrganizationDashboard();

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Integrated */}
      <Card className="p-6 gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chào mừng quay trở lại!</h2>
            <p className="opacity-90">
              Hiện có {stats.pendingRegistrations} đơn đăng ký cần duyệt
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/organization/programs/new">
              Tạo chương trình mới
            </Link>
          </Button>
        </div>
      </Card>
      
      <OrganizationStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PendingRegistrations
            registrations={pendingRegistrations}
            onApprove={handleApproveRegistration}
            onReject={handleRejectRegistration}
          />
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Chương trình của tôi</h3>
            </div>
            <div className="space-y-4">
              {programs.length > 0 ? (
                programs.slice(0, 5).map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{program.name}</h4>
                      <p className="text-sm text-gray-500">{program.location}</p>
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
                        {program.volunteersJoined}/{program.volunteersNeeded} tình nguyện viên
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Bạn chưa tạo chương trình nào
                </p>
              )}
            </div>
          </Card>
        </div>
        
        {/* Sidebar - OrganizationInfo Integrated */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin tổ chức
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <p className="font-semibold text-gray-900">
                  {organization?.name || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">
                  {organization?.email || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold text-gray-900">
                  {organization?.phone || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mô tả</p>
                <p className="text-sm text-gray-900 line-clamp-3">
                  {organization?.bio || "Chưa cập nhật"}
                </p>
              </div>
            </div>
            {organization?.id && (
              <Button
                className="w-full mt-6 bg-[#77E5C8] hover:opacity-90"
                asChild
              >
                <Link href={`/organization/${organization.id}/edit`}>
                  Chỉnh sửa thông tin
                </Link>
              </Button>
            )}
            <Button
              className="w-full mt-4 bg-[#6085F0] hover:opacity-90"
              asChild
            >
              <Link href="/organization/programs/new">
                Tạo chương trình mới
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}