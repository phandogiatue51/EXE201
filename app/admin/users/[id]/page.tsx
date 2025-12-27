"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Building,
  Edit,
  Save,
  X,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { accountAPI, certificateAPI } from "@/lib/api";

interface UserDetail {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  certificates?: any[];
  programs?: any[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserDetail>>({});
  const [certificates, setCertificates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "certificates" | "activity">("info");

  useEffect(() => {
    fetchUserData();
    fetchUserCertificates();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await accountAPI.getById(userId);
      setUser(userData);
      setEditForm(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCertificates = async () => {
    try {
      const data = await certificateAPI.filter({ accountId: userId });
      setCertificates(data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      await accountAPI.update(userId, editForm);
      setUser({ ...user, ...editForm });
      setEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user, isActive: !user.isActive };
      await accountAPI.update(userId, updatedUser);
      setUser(updatedUser);
      alert(`Đã ${user.isActive ? 'vô hiệu hóa' : 'kích hoạt'} người dùng!`);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      await accountAPI.delete(userId);
      alert("Xóa người dùng thành công!");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi xóa người dùng!");
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "admin":
        return { icon: Shield, color: "text-red-500", bgColor: "bg-red-100", text: "Quản trị viên" };
      case "organization":
        return { icon: Building, color: "text-blue-500", bgColor: "bg-blue-100", text: "Tổ chức" };
      default:
        return { icon: User, color: "text-green-500", bgColor: "bg-green-100", text: "Tình nguyện viên" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy người dùng</p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-500">ID: {user.id.substring(0, 8)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={user.isActive ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
            onClick={handleToggleStatus}
          >
            {user.isActive ? (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Đang hoạt động
              </>
            ) : (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Vô hiệu hóa
              </>
            )}
          </Button>
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button className="gradient-primary" onClick={handleUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "info" ? "text-[#6085F0] border-b-2 border-[#6085F0]" : "text-gray-500"}`}
                onClick={() => setActiveTab("info")}
              >
                Thông tin
              </button>
              {user.role === "volunteer" && (
                <>
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === "certificates" ? "text-[#6085F0] border-b-2 border-[#6085F0]" : "text-gray-500"}`}
                    onClick={() => setActiveTab("certificates")}
                  >
                    Chứng chỉ
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === "activity" ? "text-[#6085F0] border-b-2 border-[#6085F0]" : "text-gray-500"}`}
                    onClick={() => setActiveTab("activity")}
                  >
                    Hoạt động
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "info" && (
            <Card className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                      {editing ? (
                        <Input
                          value={editForm.username || ""}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{user.username}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {editing ? (
                        <Input
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      {editing ? (
                        <Input
                          value={editForm.phoneNumber || ""}
                          onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.phoneNumber || "Chưa cập nhật"}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      {editing ? (
                        <Input
                          value={editForm.address || ""}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{user.address || "Chưa cập nhật"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu</h3>
                  {editing ? (
                    <Textarea
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">
                      {user.bio || "Chưa có thông tin giới thiệu"}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "certificates" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Chứng chỉ</h3>
                <Button size="sm">
                  <Award className="h-4 w-4 mr-2" />
                  Cấp chứng chỉ mới
                </Button>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có chứng chỉ nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{cert.title}</h4>
                        <span className="text-sm text-gray-500">{cert.issuedDate}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Tổ chức: {cert.organizationName}</span>
                        <span>Số giờ: {cert.hours} giờ</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === "activity" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lịch sử hoạt động</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">Đăng ký tài khoản</p>
                  <p className="text-sm text-gray-500">Ngày {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {/* Add more activity logs here */}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* User Summary Card */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user.username.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 bg-gray-100">
                <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                <span className="text-sm font-medium">{roleInfo.text}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`font-medium ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                  {user.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ngày tham gia</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {user.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cập nhật lần cuối</span>
                  <span className="font-medium">
                    {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          {user.role === "volunteer" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Award className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Chứng chỉ</p>
                      <p className="text-xl font-bold">{certificates.length}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Clock className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tổng giờ</p>
                      <p className="text-xl font-bold">
                        {certificates.reduce((sum, cert) => sum + (cert.hours || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/admin/certificates/issue?userId=${userId}`}>
                  <Award className="h-4 w-4 mr-2" />
                  Cấp chứng chỉ
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Gửi email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Xuất hồ sơ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}