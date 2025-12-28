"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { staffAPI } from "../../../../services/api";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Briefcase,
  MapPin,
  Globe,
  Mailbox,
  UserCog,
} from "lucide-react";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await staffAPI.getById(parseInt(id));
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) return;
    
    try {
      // await staffAPI.delete(parseInt(id));
      window.location.href = "/organization/employees";
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Không thể xóa nhân sự");
    }
  };

  const handleStatusChange = async (isActive: boolean) => {
    if (!confirm(`Bạn có chắc chắn muốn ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} nhân sự này?`)) return;
    
    try {
      // await staffAPI.updateStatus(parseInt(id), isActive);
      setEmployee({
        ...employee,
        isActive,
        leftDate: isActive ? null : new Date().toISOString()
      });
      alert(`Đã ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} nhân sự`);
    } catch (error) {
      console.error("Error updating employee status:", error);
      alert("Không thể cập nhật trạng thái");
    }
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

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy nhân sự</p>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRoleInfo = (role: number) => {
    const roles = {
      0: { name: "Quản lý", color: "text-orange-700", bgColor: "bg-orange-100" },
      1: { name: "Cộng tác viên", color: "text-blue-700", bgColor: "bg-blue-100" },
      2: { name: "Nhân viên", color: "text-green-700", bgColor: "bg-green-100" },
    };
    return roles[role as keyof typeof roles] || { name: `Vai trò ${role}`, color: "text-gray-700", bgColor: "bg-gray-100" };
  };

  const getStatusInfo = (isActive: boolean, leftDate?: string) => {
    if (!isActive && leftDate) {
      return {
        text: "Đã nghỉ việc",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-5 h-5 text-red-600" />
      };
    }
    return {
      text: "Đang làm việc",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    };
  };

  const roleInfo = getRoleInfo(employee.role);
  const statusInfo = getStatusInfo(employee.isActive, employee.leftDate);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/employees">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <Card className="overflow-hidden mb-8">
              {/* Profile Header */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Profile Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                        {employee.profileImageUrl ? (
                          <img
                            src={employee.profileImageUrl}
                            alt={employee.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
                        <div className="flex flex-wrap gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${roleInfo.bgColor} ${roleInfo.color}`}>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              {employee.staffRole || roleInfo.name}
                            </div>
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                            <div className="flex items-center gap-2">
                              {statusInfo.icon}
                              {statusInfo.text}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/organization/employees/${id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa thông tin
                        </Link>
                      </Button>
                      {employee.isActive ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-orange-600 hover:text-orange-700"
                          onClick={() => handleStatusChange(false)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Vô hiệu hóa
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleStatusChange(true)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Kích hoạt lại
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                {/* Organization */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tổ chức</p>
                      <p className="text-foreground">{employee.organizationName}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Thông tin liên hệ</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{employee.email}</p>
                        </div>
                      </div>
                      
                      {employee.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Số điện thoại</p>
                            <p className="font-medium text-foreground">{employee.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Thông tin bổ sung</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Vai trò hệ thống</p>
                          <p className="font-medium text-foreground">
                            <span className={`px-2 py-1 rounded-full text-xs ${roleInfo.bgColor} ${roleInfo.color}`}>
                              {roleInfo.name}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <UserCog className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">ID Tài khoản</p>
                          <p className="font-medium text-foreground">{employee.accountId}</p>
                        </div>
                      </div>

                      {employee.leftDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Ngày nghỉ việc</p>
                            <p className="font-medium text-foreground">
                              {formatDate(employee.leftDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Dòng thời gian công việc</h2>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    <div className="space-y-6">
                      {/* Join Date */}
                      <div className="flex items-start gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Tham gia tổ chức</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(employee.joinedDate)} - Hiện tại
                          </p>
                          <p className="text-sm mt-1">
                            Đã tham gia tổ chức với vai trò {employee.staffRole || roleInfo.name}
                          </p>
                        </div>
                      </div>

                      {/* Left Date if exists */}
                      {employee.leftDate && (
                        <div className="flex items-start gap-4 relative">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 z-10">
                            <UserX className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Nghỉ việc</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(employee.leftDate)}
                            </p>
                            <p className="text-sm mt-1">
                              Đã ngừng hoạt động trong tổ chức
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Current Status */}
                      <div className="flex items-start gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 z-10">
                          {employee.isActive ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Trạng thái hiện tại</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                          </p>
                          <p className="text-sm mt-1">
                            {employee.isActive 
                              ? "Nhân sự đang làm việc trong tổ chức"
                              : "Nhân sự đã ngừng làm việc trong tổ chức"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}