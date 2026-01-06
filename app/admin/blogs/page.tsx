"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { blogAPI } from "../../../services/api";
import { BlogPost } from "../../../lib/type";
import { BlogStatusBadge } from "@/components/status-badge/BlogStatusBadge";
import { useToast } from "@/hooks/use-toast";

import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  FileText,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";

export default function BlogsPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, search, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getAll();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let result = blogs;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchLower) ||
          blog.subtitle?.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.author?.name?.toLowerCase().includes(searchLower) ||
          blog.organization?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((blog) => blog.status === statusFilter);
    }

    setFilteredBlogs(result);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      const response = await blogAPI.delete(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: number) => {
    try {
      const response = await blogAPI.updateStatus(id, newStatus);
      setBlogs(
        blogs.map((blog) =>
          blog.id === id ? { ...blog, status: newStatus } : blog
        )
      );
      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quản lý bài viết
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý tất cả bài viết blog trên hệ thống
              </p>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
            >
              <Link href="//blogs/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm bài viết
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng bài viết</p>
                  <p className="text-2xl font-bold">{blogs.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã đăng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {blogs.filter((b) => b.status === 2).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bản nháp</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {blogs.filter((b) => b.status === 1).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lưu trữ</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {blogs.filter((b) => b.status === 3).length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, tác giả, tổ chức..."
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
                    <option value="1">Bản nháp</option>
                    <option value="2">Đã đăng</option>
                    <option value="3">Lưu trữ</option>
                  </select>
                </div>
              </div>

              {/* Counter */}
              <div className="md:col-span-2 flex items-center justify-end">
                <span className="text-muted-foreground">
                  {filteredBlogs.length} bài viết
                </span>
              </div>
            </div>
          </Card>

          {/* Blogs Table */}
          <Card>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Không tìm thấy bài viết nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-700">
                        ID
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Tiêu đề
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Tác giả
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Tổ chức
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Ngày đăng
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Cập nhật
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Trạng thái
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="border-b hover:bg-gray-50">
                        {/* ID */}
                        <td className="p-4">
                          <p className="text-sm font-mono text-gray-600">
                            #{blog.id}
                          </p>
                        </td>

                        {/* Title */}
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {blog.title || "Không có tiêu đề"}
                            </p>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm">
                                {blog.author?.name || `ID: ${blog.authorId}`}
                              </p>
                              {blog.author?.email && (
                                <p className="text-xs text-gray-500">
                                  {blog.author.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Organization */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm">
                                {blog.organization?.name ||
                                  `ID: ${blog.organizationId}`}
                              </p>
                              {blog.organization && (
                                <p className="text-xs text-gray-500">
                                  ID: {blog.organization.id}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Published Date */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(blog.publishedDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Updated Date */}
                        <td className="p-4">
                          {blog.updatedDate ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(blog.updatedDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Chưa cập nhật
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border`}
                          >
                            <BlogStatusBadge
                              status={blog.status}
                              showIcon={true}
                              size="sm"
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/blogs/${blog.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                Xem
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="h-3 w-3 mr-1" />
                                Sửa
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(blog.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Xóa
                            </Button>
                          </div>

                          {/* Quick Status Actions */}
                          <div className="flex gap-1 mt-2">
                            {blog.status !== 2 && (
                              <Button
                                size="sm"
                                className="text-xs h-6 bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(blog.id, 2)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Đăng
                              </Button>
                            )}
                            {blog.status !== 3 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => handleStatusChange(blog.id, 3)}
                              >
                                Lưu trữ
                              </Button>
                            )}
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
      </main>
    </div>
  );
}
