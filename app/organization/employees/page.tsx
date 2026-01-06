"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { staffAPI } from "../../../services/api";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

const STAFF_ROLES: Record<number, { name: string; color: string; bgColor: string }> = {
  0: { name: "Quản lý", color: "text-orange-700", bgColor: "bg-orange-100" },
  1: { name: "Cộng tác viên", color: "text-blue-700", bgColor: "bg-blue-100" },
  2: { name: "Nhân viên", color: "text-green-700", bgColor: "bg-green-100" },
};

export default function StaffPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const OrganizationId = user?.organizationId;
  const StaffRole = user?.staffRole;
  const AccountId = user?.accountId;

  useEffect(() => {
    console.log('User data:', {
      user,
      OrganizationId,
      StaffRole,
      AccountId
    });
  }, [user]);

  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");

  useEffect(() => {
    if (OrganizationId) {
      fetchStaff();
    }
  }, [OrganizationId]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const orgIdNumber = parseInt(OrganizationId || '0');

      const filters: any = {
        OrganizationId: orgIdNumber  // Send as number
      };

      if (roleFilter !== "all") {
        filters.Role = roleFilter;
      }

      if (statusFilter !== "all") {
        filters.IsActive = statusFilter;
      }

      console.log('Fetching with filters:', filters);

      const data = await staffAPI.filter(filters);
      console.log('Received staff data:', data);

      // Double-check filtering on client side as well
      const filteredData = data.filter((member: any) =>
        member.organizationId === orgIdNumber ||
        parseInt(member.organizationId) === orgIdNumber
      );

      console.log('After client-side filtering:', filteredData);

      setStaff(filteredData);

    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number) => {
    try {
      const response = await staffAPI.changeStatus(id);

      setStaff(staff.map(member =>
        member.id === id
          ? { ...member, ...response }
          : member
      ));

      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error updating staff status:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const filteredStaff = staff.filter(member => {
    const orgIdNumber = parseInt(OrganizationId || '0');
    const memberOrgId = parseInt(member.organizationId || '0');

    const matchesOrganization = memberOrgId === orgIdNumber;

    if (!matchesOrganization) return false;

    // Then apply other filters
    const searchLower = search.toLowerCase();
    const matchesSearch = search === "" ||
      member.name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const STAFF_ROLES: Record<number, { name: string; color: string; bgColor: string }> = {
    0: { name: "Quản lý", color: "text-orange-700", bgColor: "bg-orange-100" },
    1: { name: "Người đánh giá", color: "text-purple-700", bgColor: "bg-purple-100" },
    2: { name: "Nhân viên", color: "text-blue-700", bgColor: "bg-blue-100" },
  };

  const uniqueRoles = staff
    .map(s => ({ value: s.role, label: s.staffRole }))
    .filter((role, index, self) =>
      role.value !== undefined &&
      role.value !== null &&
      self.findIndex(r => r.value === role.value) === index
    )
    .sort((a, b) => a.value - b.value);


  const canEditStaff = (staffMember: any) => {
    if (StaffRole === "Manager") return true;

    if (StaffRole === "Manager") {
      return staffMember.role > 2;
    }

    return false;
  };

  const canDeleteStaff = (staffMember: any) => {
    return StaffRole === "Manager";
  };

  const canChangeStatus = (staffMember: any) => {
    if (staffMember.accountId === AccountId) return false;

    if (StaffRole === "Manager") return true;

    if (StaffRole === "Manager") {
      return staffMember.role > 2;
    }

    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quản lý nhân sự</h1>
              <p className="text-muted-foreground mt-2">
                Quản lý nhân sự {OrganizationId ? `của tổ chức bạn` : "hệ thống"}
              </p>
            </div>

            <Button asChild className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]">
              <Link href="/organization/employees/new" className="flex items-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm nhân sự
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Role Filter */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRoleFilter(value === "all" ? "all" : parseInt(value));
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="all">Tất cả vai trò</option>
                    {uniqueRoles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={statusFilter === "all" ? "all" : statusFilter ? "true" : "false"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStatusFilter(value === "all" ? "all" : value === "true");
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              {/* Counter */}
              <div className="md:col-span-1 flex items-center justify-end">
                <span className="text-muted-foreground whitespace-nowrap">
                  {filteredStaff.length} nhân sự
                </span>
              </div>
            </div>
          </Card>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            /* Staff Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((member) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                        {member.profileImageUrl ? (
                          <img
                            src={member.profileImageUrl}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white mb-1">
                          {member.name || "Không có tên"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STAFF_ROLES[member.role]?.bgColor || 'bg-gray-100'
                            } ${STAFF_ROLES[member.role]?.color || 'text-gray-800'
                            }`}>
                            {STAFF_ROLES[member.role]?.name || `Vai trò ${member.role}`}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate" title={member.email}>
                          {member.email || "—"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {member.phoneNumber || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Organization & Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Tham gia</span>
                          <span className="text-sm font-medium">
                            {new Date(member.joinedDate).toLocaleDateString("vi-VN")} -
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Info */}
                    {member.leftAt && !member.isActive && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-xs text-red-600 font-medium">
                          Đã ngừng hoạt động: {new Date(member.leftDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/organization/employees/${member.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          Xem
                        </Link>
                      </Button>

                      {canEditStaff(member) && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/organization/employees/${member.id}/edit`}>
                            <Edit className="w-3 h-3 mr-1" />
                            Sửa
                          </Link>
                        </Button>
                      )}

                      {canChangeStatus(member) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStatusChange(member.id)}
                        >
                          {member.isActive ? (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Vô hiệu hóa
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Kích hoạt
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy nhân sự
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || roleFilter !== "all" || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Chưa có nhân sự nào trong hệ thống"}
              </p>
              <Button asChild>
                <Link href="/organization/employees/new" className="flex items-center">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm nhân sự đầu tiên
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}