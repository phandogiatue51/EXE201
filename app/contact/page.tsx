"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                Liên hệ với chúng tôi
              </h1>
              <p className="text-xl text-white/90">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          Email
                        </h3>
                        <p className="text-muted-foreground">
                          contact@together.vn
                        </p>
                        <p className="text-muted-foreground">
                          support@together.vn
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          Điện thoại
                        </h3>
                        <p className="text-muted-foreground">
                          +84 28 1234 5678
                        </p>
                        <p className="text-muted-foreground">+84 90 123 4567</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          Địa chỉ
                        </h3>
                        <p className="text-muted-foreground">
                          Số 123, Đường ABC
                          <br />
                          Quận 1, TP. Hồ Chí Minh
                          <br />
                          Việt Nam
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <Card className="p-8 md:p-12 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-8">
                      Gửi tin nhắn cho chúng tôi
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            placeholder="Nhập họ và tên"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                            placeholder="Nhập email"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Nhập số điện thoại"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Tiêu đề *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subject: e.target.value,
                              })
                            }
                            required
                            placeholder="Nhập tiêu đề"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Nội dung *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          required
                          rows={6}
                          placeholder="Nhập nội dung tin nhắn..."
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-300"
                        disabled={isLoading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
