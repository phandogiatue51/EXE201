"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { organizationAPI } from "../../../services/api";
import { Organization } from "../../../lib/type";
import { OrganizationStatusBadge } from "@/components/status-badge/OrganizationStatusBadge";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

export default function OrganizationsPage() {
  const { user } = useAuth();
  const adminId = user?.accountId;
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const filter: any = {};

      if (search.trim()) {
        filter.name = search;
      }

      if (statusFilter !== "all") {
        filter.status = statusFilter;
      }

      const data = await organizationAPI.filter(filter);
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrganizations();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, fetchOrganizations]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tổ chức này?")) return;

    try {
      await organizationAPI.delete(id);
      setOrganizations(organizations.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
      alert("Không thể xóa tổ chức");
    }
  };

  const handleStatusChange = async (id: number, newStatus: number) => {
    try {
      let rejectionReason: string | undefined;

      if (newStatus === 3) {
        const input = prompt("Nhập lý do từ chối:");
        if (!input) return;
        rejectionReason = input;
      }

      const verifyData = {
        Status: newStatus,
        AdminId: adminId || 1,
        ...(rejectionReason && { RejectionReason: rejectionReason }),
      };

      await organizationAPI.verify(id, verifyData);

      setOrganizations(
        organizations.map((org) =>
          org.id === id
            ? {
                ...org,
                status: newStatus,
                rejectionReason: rejectionReason || org.rejectionReason,
              }
            : org
        )
      );
      alert("Xác thực tổ chức thành công");
      router.push(`/admin/organizations`);
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quản lý tổ chức
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý tất cả các tổ chức tình nguyện trong hệ thống
              </p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
            >
              <Link href="/admin/organizations/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm tổ chức
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="md:col-span-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as number | "all")
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value={0}>Chờ duyệt</option>
                    <option value={1}>Đang hoạt động</option>
                    <option value={2}>Ngừng hoạt động</option>
                    <option value={3}>Đã từ chối</option>
                  </select>
                </div>
              </div>

              {/* Counter */}
              <div className="md:col-span-3 flex items-center justify-end">
                <span className="text-muted-foreground">
                  Hiển thị {organizations.length} / {organizations.length} tổ
                  chức
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
            /* Organizations Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3
                            className="font-semibold text-foreground truncate"
                            title={org.name}
                          >
                            {org.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <OrganizationStatusBadge status={org.status} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {org.typeName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          ID: {org.id} •{" "}
                          {new Date(org.createAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-6 space-y-3">
                    {org.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`mailto:${org.email}`}
                          className="text-blue-600 hover:underline truncate"
                          title={org.email}
                        >
                          {org.email}
                        </a>
                      </div>
                    )}

                    {org.phoneNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`tel:${org.phoneNumber}`}
                          className="text-foreground hover:text-blue-600 truncate"
                          title={org.phoneNumber}
                        >
                          {org.phoneNumber}
                        </a>
                      </div>
                    )}

                    {org.address && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span
                          className="text-muted-foreground truncate"
                          title={org.address}
                        >
                          {org.address}
                        </span>
                      </div>
                    )}

                    {org.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                          title={org.website}
                        >
                          {org.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/admin/organizations/${org.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/admin/organizations/${org.id}/edit`}>
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(org.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Xóa
                    </Button>
                  </div>

                  {org.status === 0 && (
                    <div className="px-6 pb-6 pt-0 border-t pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleStatusChange(org.id, 1)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleStatusChange(org.id, 3)}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && organizations.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy tổ chức
              </h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Chưa có tổ chức nào trong hệ thống"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
