"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/lib/type";
import { blogAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const blogId = params?.id as string;
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getById(parseInt(blogId));
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1: return { text: "Bản nháp", icon: <Clock className="w-4 h-4" />, color: "text-gray-600 bg-gray-100" };
      case 2: return { text: "Đã đăng", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600 bg-green-100" };
      case 3: return { text: "Lưu trữ", icon: <XCircle className="w-4 h-4" />, color: "text-yellow-600 bg-yellow-100" };
      default: return { text: "Không xác định", icon: <Clock className="w-4 h-4" />, color: "text-gray-600 bg-gray-100" };
    }
  };

  // Helper function to get string values from blog
  const getStringValue = (key: keyof BlogPost): string => {
    if (!blog) return "";
    const value = blog[key];
    return typeof value === 'string' ? value : "";
  };

  // Helper function to get paragraph content
  const getParagraph = (index: number): string => {
    const key = `paragraph${index + 1}` as keyof BlogPost;
    return getStringValue(key);
  };

  // Helper function to get image URL
  const getImageUrl = (index: number): string => {
    const key = `imageUrl${index + 1}` as keyof BlogPost;
    return getStringValue(key);
  };

  // Get all paragraphs that have content
  const getParagraphs = () => {
    const paragraphs = [];
    for (let i = 0; i < 5; i++) {
      const content = getParagraph(i);
      if (content) paragraphs.push({ content, index: i });
    }
    return paragraphs;
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
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy bài viết</h2>
              <Button asChild>
                <Link href="/organization/blogs">Quay lại danh sách</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusInfo = getStatusInfo(blog.status);
  const paragraphs = getParagraphs();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{blog.title}</h1>
              {blog.subtitle && (
                <h2 className="text-xl text-gray-600 mt-2">{blog.subtitle}</h2>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{blog.authorName || `ID: ${blog.authorId}`}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.publishedDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span className="text-sm font-medium">{statusInfo.text}</span>
                </div>
              </div>
            </div>

            {user?.accountId === blog.authorId && (
              <Button asChild>
                <Link href={`/organization/blogs/${blog.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Link>
              </Button>
            )}
          </div>

          {/* Featured Image */}
          {blog.featuredImageUrl && typeof blog.featuredImageUrl === 'string' && (
            <div className="mb-8">
              <img
                src={blog.featuredImageUrl}
                alt={blog.title || "Bài viết"}
                className="w-full h-auto max-h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && typeof blog.excerpt === 'string' && (
            <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <Eye className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
              </div>
            </Card>
          )}

          {/* Content */}
          <div className="space-y-8">
            {paragraphs.map(({ content, index }) => {
              const imageUrl = getImageUrl(index);
              
              return (
                <div key={index}>
                  {/* Display image for this paragraph if exists */}
                  {imageUrl && (
                    <div className="mb-4">
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto max-h-80 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Display paragraph content */}
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}