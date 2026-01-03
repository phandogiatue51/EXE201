"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { organizationAPI } from "../../../../services/api";
import { Organization } from "../../../../lib/type";
import { OrganizationStatusBadge, OrganizationStatus } from "@/components/organization/OrganizationStatusBadge";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  UserMinus,
  AlertCircle,
} from "lucide-react";

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const data = await organizationAPI.getById(parseInt(id));
      setOrganization(data);
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tổ chức này?")) return;
    
    try {
      await organizationAPI.delete(parseInt(id));
      window.location.href = "/admin/organizations";
    } catch (error) {
      console.error("Error deleting organization:", error);
      alert("Không thể xóa tổ chức");
    }
  };

  const handleStatusChange = async (newStatus: OrganizationStatus) => {
    // try {
    //   let rejectionReason;
    //   if (newStatus === OrganizationStatus.Rejected) {
    //     rejectionReason = prompt("Nhập lý do từ chối:");
    //     if (!rejectionReason) return;
    //   }
      
    //   await organizationAPI.verify(parseInt(id), newStatus, rejectionReason);
    //   fetchOrganization();
    // } catch (error) {
    //   console.error("Error updating status:", error);
    //   alert("Không thể cập nhật trạng thái");
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </main>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy tổ chức</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/organizations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {organization.logoUrl ? (
                    <img
                      src={organization.logoUrl}
                      alt={organization.name}
                      className="w-32 h-32 rounded-2xl object-cover border"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {organization.name}
                      </h1>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {organization.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${organization.status}`}>
                          <div className="flex items-center gap-2">
                            <OrganizationStatusBadge status={organization.status} />
                          </div>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/organizations/${id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {organization.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Mô tả</h3>
                      <p className="text-foreground">{organization.description}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organization.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <a
                            href={`mailto:${organization.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {organization.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {organization.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Điện thoại</p>
                          <a
                            href={`tel:${organization.phoneNumber}`}
                            className="text-foreground hover:text-blue-600"
                          >
                            {organization.phoneNumber}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                        <p className="text-foreground">
                          {new Date(organization.createAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    {organization.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Địa chỉ</p>
                          <p className="text-foreground">{organization.address}</p>
                        </div>
                      </div>
                    )}

                    {organization.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organization.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {organization.rejectionReason && organization.status === OrganizationStatus.Rejected && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <p className="font-medium">Lý do từ chối</p>
                      </div>
                      <p className="text-red-600">{organization.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Status Actions */}
            {organization.status === OrganizationStatus.Pending && (
              <Card className="p-6 mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Phê duyệt tổ chức</h2>
                <div className="flex gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(OrganizationStatus.Active)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Duyệt tổ chức
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleStatusChange(OrganizationStatus.Rejected)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                </div>
              </Card>
            )}

            {/* Other Status Actions */}
            {organization.status !== OrganizationStatus.Pending && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Thay đổi trạng thái</h2>
                <div className="flex flex-wrap gap-2">
                  {organization.status !== OrganizationStatus.Active && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(OrganizationStatus.Active)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Kích hoạt
                    </Button>
                  )}
                  {organization.status !== OrganizationStatus.Unactive && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(OrganizationStatus.Unactive)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Ngừng hoạt động
                    </Button>
                  )}
                  {organization.status !== OrganizationStatus.Rejected && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleStatusChange(OrganizationStatus.Rejected)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}