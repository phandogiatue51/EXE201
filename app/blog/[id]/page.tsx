"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogAPI } from "@/services/api";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  subtitle?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  paragraph4?: string;
  paragraph5?: string;
  authorId?: number;
  authorName?: string;
  organizationId?: number;
  organizationName?: string;
  publishedDate?: string;
  updatedDate?: string | null;
  status?: number;
  statusName?: string;
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogAPI.getById(id);
        setBlog(data);
      } catch (err: any) {
        console.error("Error fetching blog:", err);
        setError(err.message || "Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20">
          <Card className="p-8 max-w-md mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <p className="text-red-600 mb-4 text-center">
              {error || "Bài viết không tìm thấy"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
              >
                Thử lại
              </Button>
              <Button
                asChild
                className="gradient-primary text-white"
              >
                <Link href="/blog">Quay lại danh sách</Link>
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="ghost"
            className="mb-8 hover:bg-[#77E5C8]/10"
            asChild
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại danh sách blog
            </Link>
          </Button>

          <article className="max-w-4xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
              {(blog.featuredImageUrl || blog.imageUrl1) && (
                <div className="aspect-video bg-muted overflow-hidden relative">
                  <img
                    src={blog.featuredImageUrl || blog.imageUrl1}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {blog.statusName && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold text-white bg-[#6085F0] px-3 py-1 rounded-full shadow-lg">
                        {blog.statusName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {blog.title}
                </h1>
                {blog.subtitle && (
                  <p className="text-xl text-muted-foreground mb-6 italic">
                    {blog.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-6 border-b border-border/50">
                  {blog.publishedDate && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.publishedDate)}
                    </span>
                  )}
                  {blog.authorName && (
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {blog.authorName}
                    </span>
                  )}
                  {blog.organizationName && (
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {blog.organizationName}
                    </span>
                  )}
                  {blog.updatedDate && blog.updatedDate !== blog.publishedDate && (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cập nhật: {formatDate(blog.updatedDate)}
                    </span>
                  )}
                </div>

                <div className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-6">
                  {blog.paragraph1 && (
                    <p className="text-lg leading-relaxed">{blog.paragraph1}</p>
                  )}
                  {blog.imageUrl2 && (
                    <div className="my-8">
                      <img
                        src={blog.imageUrl2}
                        alt={blog.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  {blog.paragraph2 && (
                    <p className="text-lg leading-relaxed">{blog.paragraph2}</p>
                  )}
                  {blog.imageUrl3 && (
                    <div className="my-8">
                      <img
                        src={blog.imageUrl3}
                        alt={blog.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  {blog.paragraph3 && (
                    <p className="text-lg leading-relaxed">{blog.paragraph3}</p>
                  )}
                  {blog.imageUrl4 && (
                    <div className="my-8">
                      <img
                        src={blog.imageUrl4}
                        alt={blog.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  {blog.paragraph4 && (
                    <p className="text-lg leading-relaxed">{blog.paragraph4}</p>
                  )}
                  {blog.imageUrl5 && (
                    <div className="my-8">
                      <img
                        src={blog.imageUrl5}
                        alt={blog.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  {blog.paragraph5 && (
                    <p className="text-lg leading-relaxed">{blog.paragraph5}</p>
                  )}
                </div>
              </div>
            </Card>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

