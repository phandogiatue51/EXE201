"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BlogForm } from "../../../../../components/organization/blogs/BlogForm";
import { Header } from "@/components/header";
import { BlogPost } from "@/lib/type";
import { blogAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";

export default function EditBlogPage() {
  const params = useParams();
  const { user } = useAuth();
  const blogId = params?.id as string;
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId || !user?.organizationId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getById(parseInt(blogId));
        
        // Check if user has permission to edit this blog
        if (data.organizationId !== parseInt(user.organizationId || '0')) {
          setError("Bạn không có quyền chỉnh sửa bài viết này");
          return;
        }
        
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Không tìm thấy bài viết hoặc đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, user?.organizationId]);

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Chỉnh sửa bài viết
            </h1>
            <p className="text-muted-foreground mt-2">
              Chỉnh sửa bài viết: {blog?.title}
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm blog={blog} isEdit={true} />
        </div>
      </main>
    </div>
  );
}