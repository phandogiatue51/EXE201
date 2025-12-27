"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import {
  mockAccounts,
  mockRegistrations,
  mockPrograms,
  mockCertificates,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  User,
  MapPin,
} from "lucide-react";

export default function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  const volunteer = mockAccounts.find(
    (acc) => acc.id === id && acc.role === "volunteer",
  );
  const registrations = mockRegistrations.filter((r) => r.volunteerId === id);
  const certificates = mockCertificates.filter((c) => c.volunteerId === id);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Chỉ admin mới có thể truy cập trang này
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Không tìm thấy tình nguyện viên
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const approvedRegistrations = registrations.filter(
    (r) => r.status === "approved",
  );
  const pendingRegistrations = registrations.filter(
    (r) => r.status === "pending",
  );
  const rejectedRegistrations = registrations.filter(
    (r) => r.status === "rejected",
  );
  const totalHours = certificates.reduce(
    (sum, cert) => sum + cert.hoursContributed,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#77E5C8]/10 via-white to-blue-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 hover:bg-[#77E5C8]/10"
          >
            <Link href="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Header Card */}
            <Card className="p-8 mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {volunteer.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{volunteer.email}</span>
                    </div>
                    {volunteer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{volunteer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia từ {volunteer.joinedDate || "2024"}</span>
                    </div>
                  </div>
                  {volunteer.bio && (
                    <p className="text-muted-foreground">{volunteer.bio}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 border-0 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white shadow-lg">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {approvedRegistrations.length}
                  </p>
                  <p className="text-sm text-white/90">
                    Chương trình đã tham gia
                  </p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {pendingRegistrations.length}
                  </p>
                  <p className="text-sm text-yellow-100">Chờ duyệt</p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-blue-100">Chứng chỉ</p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalHours}h</p>
                  <p className="text-sm text-purple-100">Tổng giờ đóng góp</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registrations */}
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Đăng ký chương trình
                </h2>
                <div className="space-y-4">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => {
                      const program = mockPrograms.find(
                        (p) => p.id === reg.programId,
                      );
                      if (!program) return null;

                      return (
                        <div
                          key={reg.id}
                          className="p-4 border border-border rounded-lg hover:bg-[#77E5C8]/10 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground">
                              {program.name}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                reg.status === "approved"
                                  ? "bg-[#77E5C8]/20 text-[#6085F0]"
                                  : reg.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {reg.status === "approved"
                                ? "Đã duyệt"
                                : reg.status === "pending"
                                  ? "Chờ duyệt"
                                  : "Từ chối"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {program.organizationName}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Đăng ký: {reg.appliedDate}</span>
                          </div>
                          {reg.status === "approved" && reg.approvedDate && (
                            <div className="flex items-center gap-2 text-sm text-[#6085F0] mt-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Duyệt: {reg.approvedDate}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có đăng ký nào
                    </p>
                  )}
                </div>
              </Card>

              {/* Certificates */}
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Chứng chỉ
                </h2>
                <div className="space-y-4">
                  {certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 border border-[#77E5C8] rounded-lg bg-[#77E5C8]/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">
                            {cert.programName}
                          </h3>
                          <Award className="w-5 h-5 text-[#6085F0]" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Số chứng chỉ: {cert.certificateNumber}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Cấp: {cert.issuedDate}</span>
                          </div>
                          <span className="text-[#6085F0] font-semibold">
                            {cert.hoursContributed} giờ
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có chứng chỉ nào
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
