"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account } from "@/lib/type";
import { AccountBadge } from "@/components/status-badge/AccountBadge";
import { formatDate } from "@/lib/date";
import { ArrowLeft, Mail, Phone, Trash2, Award } from "lucide-react";
import { accountAPI, certificateAPI } from "@/services/api";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "info" | "certificates" | "activity"
  >("info");

  useEffect(() => {
    fetchUserData();
    fetchUserCertificates();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await accountAPI.getById(userId);
      setUser(userData);
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

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user, isActive: !user.status };
      await accountAPI.update(userId, updatedUser);
      setUser(updatedUser);
      alert(`Đã ${user.status ? "vô hiệu hóa" : "kích hoạt"} người dùng!`);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác."
      )
    ) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "info"
                    ? "text-[#6085F0] border-b-2 border-[#6085F0]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("info")}
              >
                Thông tin
              </button>
              {user.role === 0 && (
                <>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "certificates"
                        ? "text-[#6085F0] border-b-2 border-[#6085F0]"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("certificates")}
                  >
                    Chứng chỉ
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">
                          {user.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Giới thiệu
                  </h3>

                  <p className="text-gray-700 whitespace-pre-line">
                    {user.bio || "Chưa có thông tin giới thiệu"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "certificates" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chứng chỉ
                </h3>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có chứng chỉ nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {cert.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {cert.issuedDate}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {cert.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Tổ chức: {cert.organizationName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6 mt-8">
          <div>
            <div className="flex gap-2"></div>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <AccountBadge role={user.role} status={user.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ngày tham gia</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {user.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cập nhật lần cuối</span>
                    <span className="font-medium">
                      {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
