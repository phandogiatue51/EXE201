"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, Users, Award, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/LoadingState";
import SimpleProjectCard from "@/components/card/SimpleProjectCard";
import { Project } from "@/lib/type";
import { projectAPI } from "@/services/api";

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#77E5C8]/10 via-white to-[#A7CBDC]/10 py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6085F0]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#77E5C8]/10 to-transparent rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-gradient-primary mb-8 text-balance leading-tight mt-8">
                Phổ cập công nghệ cho trẻ em vùng cao
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
                Kết nối với các chương trình giáo dục công nghệ, giúp trẻ em
                vùng cao tiếp cận với tri thức hiện đại
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="gradient-primary text-white shadow-xl hover:opacity-90 transition-all duration-300 text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/programs">Khám phá chương trình</Link>
                </Button>
                {!user && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#77E5C8] hover:bg-[#77E5C8]/10 hover:border-[#6085F0] transition-all duration-300 text-lg px-8 py-4"
                    asChild
                  >
                    <Link href="/auth/signup">Đăng ký ngay</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-background to-[#A7CBDC]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Tác động của chúng ta
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những con số ấn tượng thể hiện tác động của chúng ta trong việc
                phổ cập kiến thức công nghệ
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gradient-primary mb-3">
                  1,250+
                </h3>
                <p className="text-muted-foreground text-lg">
                  Tình nguyện viên tham gia
                </p>
              </Card>
              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gradient-primary mb-3">
                  45+
                </h3>
                <p className="text-muted-foreground text-lg">
                  Chương trình hoạt động
                </p>
              </Card>
              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gradient-primary mb-3">
                  8,500+
                </h3>
                <p className="text-muted-foreground text-lg">Giờ tình nguyện</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-20 bg-gradient-to-b from-[#A7CBDC]/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gradient-primary mb-6">
                Chương trình nổi bật
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tham gia các chương trình giáo dục AI đang hoạt động và giúp trẻ
                em vùng cao tiếp cận công nghệ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <SimpleProjectCard
                  key={project.id}
                  project={project}
                  showBackButton={false}
                  showOrganizationLink={false}
                  className="border-0 shadow-none p-0 w-full"
                />
              ))}
            </div>

            <div className="text-center mt-16">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#77E5C8] hover:bg-[#77E5C8]/10 hover:border-[#6085F0] transition-all duration-300 px-8 py-4"
                asChild
              >
                <Link href="/programs">
                  Xem tất cả chương trình{" "}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Partner Organizations Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Đối tác tin cậy
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hợp tác cùng các tổ chức giáo dục công nghệ uy tín hàng đầu Việt
                Nam
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[
                { name: "Tổ chức Giáo dục AI Vùng Cao", logo: "AI" },
                { name: "Trung tâm Công nghệ Số", logo: "CN" },
                { name: "Quỹ Giáo dục AI Việt Nam", logo: "QA" },
                { name: "Hội Phát triển Công nghệ", logo: "PC" },
                { name: "Chương trình AI cho Trẻ em", logo: "AT" },
                { name: "Trung tâm Đào tạo AI", logo: "DA" },
              ].map((org) => (
                <Card
                  key={org.name}
                  className="group p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 cursor-pointer"
                >
                  <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                    <span className="text-white font-bold text-2xl">
                      {org.logo}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center">
                    {org.name}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {!user && (
          <section className="relative py-20 gradient-full overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 text-center relative">
              <h2 className="text-5xl font-bold text-white mb-6">
                Sẵn sàng tham gia?
              </h2>
              <p className="text-white/90 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                Đăng ký ngay để trở thành tình nguyện viên và giúp phổ cập kiến
                thức công nghệ cho trẻ em vùng cao
              </p>
              <Button
                size="lg"
                className="bg-white text-[#6085F0] hover:bg-white/90 shadow-2xl hover:shadow-white/25 transition-all duration-300 text-lg px-8 py-4"
                asChild
              >
                <Link href="/auth/signup">Đăng ký tình nguyện viên</Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
