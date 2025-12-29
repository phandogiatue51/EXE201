import { BlogForm } from "../../../../components/organization/BlogForm";
import { Header } from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo bài viết mới",
  description: "Tạo bài viết blog mới cho tổ chức",
};

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Tạo bài viết mới</h1>
            <p className="text-muted-foreground mt-2">
              Tạo và đăng bài viết blog mới cho tổ chức của bạn
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm />
        </div>
      </main>
    </div>
  );
}