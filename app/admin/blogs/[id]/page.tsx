"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { blogAPI } from "../../../../services/api";
import { BlogPost } from "../../../../lib/type";
import { BlogStatusBadge } from "@/components/status-badge/BlogStatusBadge";

import { ArrowLeft, Calendar, User, Building2, Eye, Globe } from "lucide-react";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getById(parseInt(id));
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
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

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy bài viết</p>
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
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild>
              <Link href="/admin/blogs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Featured Image */}
            {(blog.featuredImageUrl || blog.imageUrl1) && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={blog.featuredImageUrl || blog.imageUrl1}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border`}
                >
                  <BlogStatusBadge
                    status={blog.status}
                    showIcon={true}
                    size="sm"
                  />
                </span>
                <span className="text-sm text-muted-foreground">
                  ID: #{blog.id}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {blog.title || "Không có tiêu đề"}
              </h1>

              {blog.subtitle && (
                <p className="text-xl text-muted-foreground mb-6">
                  {blog.subtitle}
                </p>
              )}

              {blog.excerpt && (
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Tóm tắt
                  </h3>
                  <p className="text-muted-foreground">{blog.excerpt}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Paragraphs */}
                <div className="space-y-6">
                  {blog.paragraph1 && (
                    <div>
                      <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
                        {blog.paragraph1}
                      </p>
                    </div>
                  )}

                  {blog.paragraph2 && (
                    <div>
                      <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
                        {blog.paragraph2}
                      </p>
                    </div>
                  )}

                  {blog.paragraph3 && (
                    <div>
                      <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
                        {blog.paragraph3}
                      </p>
                    </div>
                  )}

                  {blog.paragraph4 && (
                    <div>
                      <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
                        {blog.paragraph4}
                      </p>
                    </div>
                  )}

                  {blog.paragraph5 && (
                    <div>
                      <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
                        {blog.paragraph5}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                {(blog.imageUrl2 ||
                  blog.imageUrl3 ||
                  blog.imageUrl4 ||
                  blog.imageUrl5) && (
                  <div className="grid grid-cols-2 gap-4">
                    {blog.imageUrl2 && (
                      <img
                        src={blog.imageUrl2}
                        alt="Image 2"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    {blog.imageUrl3 && (
                      <img
                        src={blog.imageUrl3}
                        alt="Image 3"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    {blog.imageUrl4 && (
                      <img
                        src={blog.imageUrl4}
                        alt="Image 4"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    {blog.imageUrl5 && (
                      <img
                        src={blog.imageUrl5}
                        alt="Image 5"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Meta Info Card */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Thông tin bài viết
                  </h3>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Tác giả
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {blog.author?.name || `ID: ${blog.authorId}`}
                      </p>
                    </div>
                    {blog.author && (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/users/${blog.author.id}`}>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Organization */}
                  {blog.organization && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Tổ chức
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {blog.organization.name}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link
                          href={`/admin/organizations/${blog.organization.id}`}
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Ngày đăng
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(blog.publishedDate).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    {blog.updatedDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Cập nhật lần cuối
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(blog.updatedDate).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Status Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Quản lý bài viết
                  </h3>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/blog/${blog.id}`} target="_blank">
                      <Globe className="w-4 h-4 mr-2" />
                      Xem trang công khai
                    </Link>
                  </Button>
                </Card>

                {/* Quick Links */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Hành động nhanh
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/blogs">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại danh sách
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
