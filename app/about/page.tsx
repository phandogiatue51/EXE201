"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                Về chúng tôi
              </h1>
              <p className="text-xl text-white/90">
                Together - Nền tảng kết nối tình nguyện viên và các tổ chức giáo dục AI cho trẻ em vùng cao
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-8">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Together được thành lập với sứ mệnh phổ cập kiến thức AI và công nghệ cho trẻ em vùng cao. 
                  Chúng tôi tin rằng mỗi trẻ em đều xứng đáng được tiếp cận với tri thức hiện đại, 
                  bất kể hoàn cảnh địa lý hay kinh tế.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Thông qua nền tảng của mình, chúng tôi kết nối các tình nguyện viên đam mê công nghệ 
                  với các tổ chức giáo dục để mang kiến thức AI đến với trẻ em vùng cao, 
                  tạo cơ hội cho thế hệ trẻ phát triển trong kỷ nguyên số.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-b from-[#77E5C8]/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-6">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Tình yêu thương
                </h3>
                <p className="text-muted-foreground">
                  Đặt tình yêu thương và lòng nhân ái lên hàng đầu trong mọi
                  hoạt động
                </p>
              </Card>

              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Cộng đồng
                </h3>
                <p className="text-muted-foreground">
                  Xây dựng cộng đồng đoàn kết, sẵn sàng chia sẻ và giúp đỡ lẫn
                  nhau
                </p>
              </Card>

              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Minh bạch
                </h3>
                <p className="text-muted-foreground">
                  Hoạt động công khai, minh bạch để xây dựng niềm tin với cộng
                  đồng
                </p>
              </Card>

              <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Chất lượng
                </h3>
                <p className="text-muted-foreground">
                  Cam kết mang đến trải nghiệm tốt nhất cho tình nguyện viên và
                  tổ chức
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-6">
                Đội ngũ của chúng tôi
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những người đam mê tạo ra sự thay đổi tích cực cho cộng đồng
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <p className="text-lg text-muted-foreground text-center leading-relaxed">
                  Together được vận hành bởi một đội ngũ trẻ, năng động và tràn đầy nhiệt huyết với công nghệ. 
                  Chúng tôi đến từ nhiều lĩnh vực khác nhau nhưng đều có chung một mục tiêu: 
                  phổ cập kiến thức AI và công nghệ cho trẻ em vùng cao, giúp các em có cơ hội phát triển 
                  trong thời đại số hóa.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
