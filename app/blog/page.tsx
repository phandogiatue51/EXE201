"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogAPI } from "@/services/api";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/type"
import { formatDate } from "@/lib/date"

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogAPI.getAll();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "Không thể tải danh sách blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        {/* Hero Section */}
        <section className="py-10 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-6">Blog</h1>
              <p className="text-xl text-white/90">
                Cập nhật tin tức, bài viết và chia sẻ từ cộng đồng Together
              </p>
            </div>
          </div>
        </section>

        {/* Blog List Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
                <p className="mt-4 text-muted-foreground">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <Card className="p-8 max-w-md mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="gradient-primary text-white"
                  >
                    Thử lại
                  </Button>
                </Card>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <Card className="p-8 max-w-md mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <p className="text-muted-foreground text-lg">
                    Chưa có bài viết nào
                  </p>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col"
                  >
                    {(blog.featuredImageUrl || blog.imageUrl1) && (
                      <div className="aspect-video bg-muted overflow-hidden relative flex-shrink-0">
                        <img
                          src={blog.featuredImageUrl || blog.imageUrl1}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#6085F0] transition-colors duration-200 min-h-[3.5rem]">
                        {blog.title}
                      </h3>
                      {blog.subtitle && (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          {blog.subtitle}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {truncateContent(
                          blog.excerpt ||
                            blog.paragraph1 ||
                            blog.paragraph2 ||
                            ""
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                        {blog.publishedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(blog.publishedDate)}
                          </span>
                        )}
                        {blog.authorName && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {blog.authorName}
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full gradient-primary text-white shadow-lg hover:opacity-90 transition-all duration-300"
                        asChild
                      >
                        <Link href={`/blog/${blog.id}`}>
                          Đọc thêm{" "}
                          <ArrowRight className="ml-2 w-4 h-4 inline" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

