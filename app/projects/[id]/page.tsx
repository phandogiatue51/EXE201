"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { mockPrograms, mockRegistrations } from "@/lib/mock-data";
import { ArrowLeft, MapPin, Calendar, Users, Clock } from "lucide-react";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [customPrograms, setCustomPrograms] = useState<any[]>([]);
  
  // Load custom programs
  useEffect(() => {
    const stored = localStorage.getItem("customPrograms");
    if (stored) {
      setCustomPrograms(JSON.parse(stored));
    }
  }, []);
  
  const allPrograms = [...mockPrograms, ...customPrograms];
  const program = allPrograms.find((p) => p.id === id);
  
  // Load custom registrations
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("programRegistrations");
    if (stored) {
      setCustomRegistrations(JSON.parse(stored));
    }
  }, []);
  
  const allRegistrations = [...mockRegistrations, ...customRegistrations];
  const registrations = allRegistrations.filter((r) => r.programId === id);
  
  // Check if current user already registered
  const userRegistration = user 
    ? allRegistrations.find((r) => r.programId === id && r.volunteerId === user.id)
    : null;

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Chương trình không tìm thấy</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine back URL based on user role
  const getBackUrl = () => {
    if (!user) return "/programs";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "organization") return "/organization/dashboard";
    return "/programs";
  };

  const backUrl = getBackUrl();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={backUrl}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại{" "}
              {user?.role === "admin" || user?.role === "organization"
                ? "Dashboard"
                : ""}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {program.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-[#6085F0]" />
                  {program.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-[#6085F0]" />
                  {program.startDate} - {program.endDate}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-[#6085F0]" />
                  {program.volunteersJoined}/{program.volunteersNeeded} tình
                  nguyện viên
                </div>
              </div>

              <Card className="p-8 mb-8 border-[#77E5C8] bg-[#77E5C8]/10">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Về chương trình
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
              </Card>

              {/* Schedule Information */}
              {(program.duration || program.schedule || program.timeSlots) && (
                <Card className="p-8 mb-8 border-[#77E5C8]">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Lịch trình hoạt động
                  </h2>
                  <div className="space-y-4">
                    {program.duration && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#6085F0] mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Thời lượng
                          </p>
                          <p className="text-muted-foreground">
                            {program.duration}
                          </p>
                        </div>
                      </div>
                    )}
                    {program.schedule && program.schedule.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-[#6085F0] mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Lịch hoạt động
                          </p>
                          <p className="text-muted-foreground">
                            {program.schedule.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                    {program.timeSlots && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#6085F0] mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Khung giờ
                          </p>
                          <p className="text-muted-foreground">
                            {program.timeSlots}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warning for time conflicts */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      ⚠️ Lưu ý về lịch trình
                    </p>
                    <p className="text-sm text-yellow-700">
                      Đảm bảo bạn có thể tham gia đầy đủ các buổi hoạt động theo
                      lịch trình đã niêm yết. Tổ chức sẽ kiểm tra khả năng tham
                      gia của bạn trước khi phê duyệt.
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-8 border-[#77E5C8]">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Tình nguyện viên tham gia
                </h2>
                <div className="space-y-4">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {reg.volunteerName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trạng thái:{" "}
                            <span
                              className={
                                reg.status === "approved"
                                  ? "text-[#6085F0]"
                                  : "text-yellow-600"
                              }
                            >
                              {reg.status === "approved"
                                ? "Đã duyệt"
                                : "Chờ duyệt"}
                            </span>
                          </p>
                        </div>
                        {reg.hoursContributed && (
                          <p className="text-sm font-semibold text-[#6085F0]">
                            {reg.hoursContributed} giờ
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Chưa có tình nguyện viên nào đăng ký
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-8 sticky top-4 border-[#77E5C8]">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Tổ chức</p>
                  <p className="text-lg font-bold text-foreground">
                    {program.organizationName}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Danh mục</p>
                  <span className="inline-block text-sm font-semibold text-[#6085F0] bg-[#77E5C8]/10 px-3 py-1 rounded-full">
                    {program.category}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Tiến độ</p>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#6085F0]"
                      style={{
                        width: `${(program.volunteersJoined / program.volunteersNeeded) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {program.volunteersJoined}/{program.volunteersNeeded} tình
                    nguyện viên
                  </p>
                </div>

                {/* Only show register button for volunteers and non-logged-in users */}
                {(!user || user.role === "volunteer") && (
                  <>
                    {userRegistration ? (
                      <Button
                        className="w-full mb-3"
                        disabled
                        variant={userRegistration.status === "approved" ? "default" : "outline"}
                      >
                        {userRegistration.status === "approved" 
                          ? "✓ Đã tham gia" 
                          : userRegistration.status === "pending"
                          ? "⏳ Chờ duyệt"
                          : "❌ Đã từ chối"
                        }
                      </Button>
                    ) : (
                      <Button
                        className="w-full gradient-primary hover:opacity-90 mb-3"
                        asChild
                      >
                        <Link href={`/programs/${id}/register`}>
                          Đăng ký tham gia
                        </Link>
                      </Button>
                    )}
                  </>
                )}
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  asChild
                >
                  <Link href={`/programs/${program.id}/chat`}>
                    Xem thảo luận
                  </Link>
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
