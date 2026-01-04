"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountBadge } from "@/components/status-badge/AccountBadge";
import {
  Users,
  Search,
  Mail,
  Phone,
  User,
  Building,
  Shield,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { accountAPI } from "../../../services/api";
import { Account } from "../../../lib/type";

export default function UsersPage() {
  const [users, setUsers] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const filter: any = {};

      if (search.trim()) {
        filter.name = search;
      }

      if (roleFilter !== "all") {
        filter.role = roleFilter;
      }

      if (statusFilter !== "all") {
        filter.status = statusFilter;
      }

      const data = await accountAPI.filter(filter);
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, roleFilter, statusFilter, fetchUsers]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      await accountAPI.delete(id);
      setUsers(users.filter((user) => user.id !== id));
      alert("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi xóa người dùng!");
    }
  };

  const handleToggleStatus = async (user: Account) => {
    try {
      const newStatus = user.status === 0 ? 1 : 0;

      await accountAPI.update(user.id, { ...user, status: newStatus });
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      alert(`Đã ${newStatus === 0 ? "kích hoạt" : "vô hiệu hóa"} người dùng!`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h2>
          <p className="text-gray-500">
            Quản lý tất cả người dùng trên hệ thống
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]">
          <Users className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng người dùng</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tình nguyện viên</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === 0).length}
              </p>
            </div>
            <User className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nhân viên</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === 1).length}
              </p>
            </div>
            <Building className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quản trị viên</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === 2).length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as number | "all")}
            >
              <option value="all">Tất cả vai trò</option>
              <option value={0}>Tình nguyện viên</option>
              <option value={1}>Nhân viên</option>
              <option value={2}>Quản trị viên</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as number | "all")
              }
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={0}>Đang hoạt động</option>
              <option value={1}>Vô hiệu hóa</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center p-4 font-medium text-gray-700">
                    ID
                  </th>
                  <th className="text-center p-4 font-medium text-gray-700">
                    Người dùng
                  </th>
                  <th className="text-center p-4 font-medium text-gray-700">
                    Thông tin liên hệ
                  </th>
                  <th className="text-center p-4 font-medium text-gray-700">
                    Vai trò
                  </th>
                  <th className="text-center p-4 font-medium text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate">{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <AccountBadge role={user.role} status={user.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Eye className="w-3 h-3 mr-1" />
                            Xem
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
