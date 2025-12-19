"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { mockAccounts, mockPrograms, mockRegistrations } from "@/lib/mock-data";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Building2,
  MapPin,
  Globe,
  X,
  Info,
} from "lucide-react";
import type { Program } from "@/lib/types";

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const organization = mockAccounts.find(
    (acc) => acc.id === id && acc.role === "organization",
  );
  const programs = mockPrograms.filter((p) => p.organizationId === id);

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

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy tổ chức</p>
        </main>
        <Footer />
      </div>
    );
  }

  const activePrograms = programs.filter((p) => p.status === "active");
  const completedPrograms = programs.filter((p) => p.status === "completed");
  const totalVolunteers = programs.reduce(
    (sum, p) => sum + p.volunteersJoined,
    0,
  );
  const totalRegistrations = mockRegistrations.filter((r) =>
    programs.some((p) => p.id === r.programId),
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-[#77E5C8]/10">
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {organization.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{organization.email}</span>
                    </div>
                    {organization.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{organization.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Tham gia từ {organization.joinedDate || "2024"}
                      </span>
                    </div>
                  </div>
                  {organization.bio && (
                    <p className="text-muted-foreground mb-3">
                      {organization.bio}
                    </p>
                  )}
                  {organization.address && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{organization.address}</span>
                    </div>
                  )}
                  {organization.website && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {organization.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{programs.length}</p>
                  <p className="text-sm text-blue-100">Tổng chương trình</p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white shadow-lg">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{activePrograms.length}</p>
                  <p className="text-sm text-white/90">Đang hoạt động</p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalVolunteers}</p>
                  <p className="text-sm text-purple-100">Tình nguyện viên</p>
                </div>
              </Card>
              <Card className="p-6 border-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalRegistrations}</p>
                  <p className="text-sm text-yellow-100">Đơn đăng ký</p>
                </div>
              </Card>
            </div>

            {/* Programs List */}
            <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Chương trình
              </h2>
              <div className="space-y-4">
                {programs.length > 0 ? (
                  programs.map((program) => {
                    const programRegistrations = mockRegistrations.filter(
                      (r) => r.programId === program.id,
                    );
                    const approvedCount = programRegistrations.filter(
                      (r) => r.status === "approved",
                    ).length;
                    const pendingCount = programRegistrations.filter(
                      (r) => r.status === "pending",
                    ).length;

                    return (
                      <div
                        key={program.id}
                        className="p-6 border border-border rounded-lg hover:bg-blue-50 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {program.name}
                              </h3>
                              {program.isInternational && (
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  Quốc tế
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {program.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{program.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {program.startDate} - {program.endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>
                                  {program.volunteersJoined}/
                                  {program.volunteersNeeded} tình nguyện viên
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              program.status === "active"
                                ? "bg-[#77E5C8]/20 text-[#6085F0]"
                                : program.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {program.status === "active"
                              ? "Đang hoạt động"
                              : program.status === "completed"
                                ? "Hoàn thành"
                                : "Hủy"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 pt-3 border-t border-border">
                          <span className="text-sm text-[#6085F0] font-medium">
                            {approvedCount} đã duyệt
                          </span>
                          {pendingCount > 0 && (
                            <span className="text-sm text-yellow-600 font-medium">
                              {pendingCount} chờ duyệt
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProgram(program)}
                            className="ml-auto"
                          >
                            <Info className="w-3 h-3 mr-1" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Chưa có chương trình nào
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setSelectedProgram(null)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] p-6 flex items-center justify-between border-b border-[#6085F0] rounded-t-2xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {selectedProgram.name}
                    </h2>
                    {selectedProgram.isInternational && (
                      <span className="text-xs font-semibold px-3 py-1 bg-blue-500 text-white rounded-full">
                        Quốc tế
                      </span>
                    )}
                  </div>
                  <p className="text-white/90">
                    {selectedProgram.organizationName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      selectedProgram.status === "active"
                        ? "bg-[#77E5C8]/20 text-[#6085F0]"
                        : selectedProgram.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedProgram.status === "active"
                      ? "Đang hoạt động"
                      : selectedProgram.status === "completed"
                        ? "Hoàn thành"
                        : "Đã hủy"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Danh mục:{" "}
                    <span className="font-medium text-foreground">
                      {selectedProgram.category}
                    </span>
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Mô tả chương trình
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProgram.description}
                  </p>
                </div>

                {/* International Descriptions */}
                {selectedProgram.isInternational && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProgram.domesticDescription && (
                      <div className="p-4 bg-[#77E5C8]/10 rounded-lg border border-[#77E5C8]">
                        <h4 className="font-semibold text-[#6085F0] mb-2">
                          Mô tả trong nước
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedProgram.domesticDescription}
                        </p>
                      </div>
                    )}
                    {selectedProgram.internationalDescription && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-700 mb-2">
                          Mô tả quốc tế
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedProgram.internationalDescription}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#6085F0] mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Địa điểm</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProgram.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#6085F0] mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Thời gian</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProgram.startDate} - {selectedProgram.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-[#6085F0] mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Tình nguyện viên
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProgram.volunteersJoined}/
                        {selectedProgram.volunteersNeeded} người
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#6085F0] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(selectedProgram.volunteersJoined / selectedProgram.volunteersNeeded) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {selectedProgram.duration && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#6085F0] mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Thời lượng
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProgram.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Info */}
                {(selectedProgram.schedule || selectedProgram.timeSlots) && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Lịch trình hoạt động
                    </h3>
                    {selectedProgram.schedule &&
                      selectedProgram.schedule.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-foreground mb-1">
                            Ngày hoạt động:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedProgram.schedule.join(", ")}
                          </p>
                        </div>
                      )}
                    {selectedProgram.timeSlots && (
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Khung giờ:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProgram.timeSlots}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Registrations Stats */}
                {(() => {
                  const programRegistrations = mockRegistrations.filter(
                    (r) => r.programId === selectedProgram.id,
                  );
                  const approvedCount = programRegistrations.filter(
                    (r) => r.status === "approved",
                  ).length;
                  const pendingCount = programRegistrations.filter(
                    (r) => r.status === "pending",
                  ).length;
                  const rejectedCount = programRegistrations.filter(
                    (r) => r.status === "rejected",
                  ).length;

                  return (
                    <div className="p-4 bg-[#77E5C8]/10 rounded-lg border border-[#77E5C8]">
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Thống kê đăng ký
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#6085F0]">
                            {approvedCount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Đã duyệt
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">
                            {pendingCount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Chờ duyệt
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">
                            {rejectedCount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Từ chối
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProgram(null)}
                    className="flex-1"
                  >
                    Đóng
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                  >
                    <Link
                      href={`/programs/${selectedProgram.id}`}
                      target="_blank"
                    >
                      Xem trang đầy đủ
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
