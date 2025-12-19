"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  mockAccounts,
  mockRegistrations,
  mockCertificates,
} from "@/lib/mock-data";
import { Award, Clock, CheckCircle, LogOut, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function VolunteerDashboardPage() {
  const { user } = useAuth();
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);
  const [customCerts, setCustomCerts] = useState<any[]>([]);
  const [volunteerFull, setVolunteerFull] = useState<any | null>(null);
  
  const volunteer = volunteerFull || mockAccounts.find((a) => a.id === user?.id);
  
  // Load custom data
  useEffect(() => {
    // Load full user data from localStorage for demo accounts
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setVolunteerFull(JSON.parse(storedUser));
      } else {
        const approved = JSON.parse(localStorage.getItem("approvedAccounts") || "[]");
        const found = approved.find((a: any) => a.id === user?.id || a.email === user?.email);
        if (found) setVolunteerFull(found);
      }
    } catch {}

    const storedRegs = localStorage.getItem("programRegistrations");
    if (storedRegs) {
      setCustomRegistrations(JSON.parse(storedRegs));
    }
    
    const storedCerts = localStorage.getItem("customCertificates");
    if (storedCerts) {
      setCustomCerts(JSON.parse(storedCerts));
    }
  }, [user?.id]);
  
  const allRegistrations = [...mockRegistrations, ...customRegistrations];
  const registrations = allRegistrations.filter(
    (r) => r.volunteerId === user?.id,
  );

  // Load certificates (mock + custom)
  const mockCerts = mockCertificates.filter((c) => c.volunteerId === user?.id);
  const filteredCustomCerts = customCerts.filter((c: any) => c.volunteerId === user?.id);
  const certificates = [...mockCerts, ...filteredCustomCerts];

  const totalHours = certificates.reduce(
    (sum, c) => sum + (c.hoursContributed || 0),
    0,
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-4">
              Chào mừng, {volunteer?.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quản lý các chương trình tình nguyện của bạn và theo dõi tiến độ
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2 font-medium">
                    Chương trình tham gia
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
                    {registrations.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2 font-medium">
                    Giờ tình nguyện
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
                    {totalHours}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
            <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2 font-medium">
                    Chứng chỉ nhận được
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
                    {certificates.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8 mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-8">
                  Chương trình của tôi
                </h2>
                <div className="space-y-6">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="p-6 border-0 bg-gradient-to-r from-[#77E5C8]/10 to-transparent rounded-xl hover:from-[#77E5C8]/10 hover:to-[#77E5C8]/10 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-foreground flex-1">
                            {reg.programName}
                          </h3>
                          <span
                            className={`text-sm font-semibold px-4 py-2 rounded-full ${
                              reg.status === "approved"
                                ? "bg-[#77E5C8]/20 text-[#6085F0] border border-[#77E5C8]"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}
                          >
                            {reg.status === "approved"
                              ? "Đã duyệt"
                              : "Chờ duyệt"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          📅 Đăng ký: {reg.appliedDate}
                        </p>
                        {reg.hoursContributed && (
                          <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-4 h-4 text-[#6085F0]" />
                            <p className="text-sm font-semibold text-[#6085F0]">
                              Đã đóng góp: {reg.hoursContributed} giờ
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
                        >
                          <Link href={`/programs/${reg.programId}`}>
                            <Info className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[#6085F0]" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        Bạn chưa tham gia chương trình nào
                      </p>
                      <Button
                        className="mt-4 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                        asChild
                      >
                        <Link href="/programs">Khám phá chương trình</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-8">
                  Chứng chỉ
                </h2>
                <div className="space-y-4">
                  {certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 border border-border rounded-lg bg-gradient-to-r from-[#77E5C8]/10 to-transparent"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cert.programName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Số chứng chỉ: {cert.certificateNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Cấp ngày: {cert.issuedDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#6085F0]">
                              {cert.hoursContributed} giờ
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 bg-transparent"
                            >
                              Tải xuống
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Bạn chưa nhận được chứng chỉ nào
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl sticky top-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-6">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên</p>
                    <p className="font-semibold text-foreground">
                      {volunteer?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">
                      {volunteer?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số điện thoại
                    </p>
                    <p className="font-semibold text-foreground">
                      {volunteer?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mô tả</p>
                    <p className="text-sm text-foreground">{volunteer?.bio}</p>
                  </div>
                </div>
                <Button
                  className="w-full mt-8 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/programs">Khám phá chương trình</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
