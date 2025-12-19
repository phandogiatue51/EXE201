"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockAccounts, mockPrograms, mockRegistrations } from "@/lib/mock-data";
import { Users, Briefcase, CheckCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function OrganizationDashboardPage() {
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [customPrograms, setCustomPrograms] = useState<any[]>([]);
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);
  const { user } = useAuth();
  const [organizationFull, setOrganizationFull] = useState<any | null>(null);
  
  const organization = organizationFull || mockAccounts.find((a) => a.id === user?.id);
  
  // Load custom programs and registrations
  useEffect(() => {
    // Load full org data from localStorage for demo accounts
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setOrganizationFull(JSON.parse(storedUser));
      } else {
        const approved = JSON.parse(localStorage.getItem("approvedAccounts") || "[]");
        const found = approved.find((a: any) => a.id === user?.id || a.email === user?.email);
        if (found) setOrganizationFull(found);
      }
    } catch {}

    const storedPrograms = localStorage.getItem("customPrograms");
    if (storedPrograms) {
      setCustomPrograms(JSON.parse(storedPrograms));
    }
    
    const storedRegistrations = localStorage.getItem("programRegistrations");
    if (storedRegistrations) {
      setCustomRegistrations(JSON.parse(storedRegistrations));
    }
  }, []);
  
  // Combine mock and custom programs for this organization
  const allPrograms = [
    ...mockPrograms.filter((p) => p.organizationId === user?.id),
    ...customPrograms.filter((p) => p.organizationId === user?.id),
  ];
  
  const programs = allPrograms;
  
  // Combine mock and custom registrations
  const allRegistrations = [...registrations, ...customRegistrations];
  const organizationRegistrations = allRegistrations.filter((r) =>
    programs.some((p) => p.id === r.programId),
  );
  const approvedRegistrations = organizationRegistrations.filter(
    (r) => r.status === "approved",
  );

  useEffect(() => {
    const stored = localStorage.getItem("registrations");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRegistrations([...mockRegistrations, ...parsed]);
    }
  }, []);

  const handleApproveRegistration = (id: string) => {
    // Find the registration to get program ID
    const registration = [...registrations, ...customRegistrations].find((r) => r.id === id);
    
    // Update mock registrations
    const updatedMock = registrations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "approved",
            approvedDate: new Date().toISOString().split("T")[0],
          }
        : r,
    );
    setRegistrations(updatedMock);
    
    // Update custom registrations
    const updatedCustom = customRegistrations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "approved",
            approvedDate: new Date().toISOString().split("T")[0],
          }
        : r,
    );
    setCustomRegistrations(updatedCustom);
    
    // Update volunteer count in custom programs
    if (registration) {
      const updatedPrograms = customPrograms.map((p) =>
        p.id === registration.programId
          ? { ...p, volunteersJoined: (p.volunteersJoined || 0) + 1 }
          : p,
      );
      setCustomPrograms(updatedPrograms);
      localStorage.setItem("customPrograms", JSON.stringify(updatedPrograms));
    }
    
    // Save to localStorage
    localStorage.setItem("programRegistrations", JSON.stringify(updatedCustom));
    localStorage.setItem(
      "registrations",
      JSON.stringify(
        updatedMock.filter((r) => !mockRegistrations.some((mr) => mr.id === r.id)),
      ),
    );
  };

  const handleRejectRegistration = (id: string) => {
    // Update mock registrations
    const updatedMock = registrations.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r,
    );
    setRegistrations(updatedMock);
    
    // Update custom registrations
    const updatedCustom = customRegistrations.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r,
    );
    setCustomRegistrations(updatedCustom);
    
    // Save to localStorage
    localStorage.setItem("programRegistrations", JSON.stringify(updatedCustom));
    localStorage.setItem(
      "registrations",
      JSON.stringify(
        updatedMock.filter((r) => !mockRegistrations.some((mr) => mr.id === r.id)),
      ),
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Chào mừng, {organization?.name}
            </h1>
            <p className="text-muted-foreground">
              Quản lý các chương trình thiện nguyện của bạn
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    Chương trình hoạt động
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {programs.length}
                  </p>
                </div>
                <Briefcase className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
            <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">
                    Đơn đăng ký
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {organizationRegistrations.length}
                  </p>
                </div>
                <Users className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
            <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Đã duyệt</p>
                  <p className="text-3xl font-bold text-foreground">
                    {approvedRegistrations.length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8 mb-8 border-[#77E5C8]">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Chương trình của tôi
                </h2>
                <div className="space-y-4">
                  {programs.length > 0 ? (
                    programs.map((program) => (
                      <div
                        key={program.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">
                            {program.name}
                          </h3>
                          <span className="text-xs font-semibold text-[#6085F0] bg-[#77E5C8]/10 px-3 py-1 rounded-full">
                            {program.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {program.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {program.volunteersJoined}/
                            {program.volunteersNeeded} tình nguyện viên
                          </p>
                          <div className="flex gap-2">
                            {program.volunteersJoined === 0 && program.status === "active" && (
                              <Button size="sm" variant="outline" asChild className="border-[#77E5C8]">
                                <Link href={`/organization/programs/${program.id}/edit`}>
                                  Chỉnh sửa
                                </Link>
                              </Button>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/programs/${program.id}/chat`}>
                                Xem thảo luận
                              </Link>
                            </Button>
                            {program.status === "active" && (
                              <Button
                                size="sm"
                                className="gradient-primary text-white"
                                asChild
                              >
                                <Link
                                  href={`/organization/programs/${program.id}/complete`}
                                >
                                  Hoàn thành
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Bạn chưa tạo chương trình nào
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-8 border-[#77E5C8]">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Đơn đăng ký chờ duyệt
                </h2>
                <div className="space-y-4">
                  {organizationRegistrations.filter(
                    (r) => r.status === "pending",
                  ).length > 0 ? (
                    organizationRegistrations
                      .filter((r) => r.status === "pending")
                      .map((reg) => (
                        <div
                          key={reg.id}
                          className="p-4 border border-border rounded-lg bg-yellow-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {reg.volunteerName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {reg.programName}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-yellow-600 bg-white px-3 py-1 rounded-full">
                              Chờ duyệt
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Đăng ký: {reg.appliedDate}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-[#6085F0] hover:opacity-90"
                              onClick={() => handleApproveRegistration(reg.id)}
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRegistration(reg.id)}
                            >
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-muted-foreground">
                      Không có đơn đăng ký chờ duyệt
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-6 border-[#77E5C8] sticky top-4">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Thông tin tổ chức
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên</p>
                    <p className="font-semibold text-foreground">
                      {organization?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">
                      {organization?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số điện thoại
                    </p>
                    <p className="font-semibold text-foreground">
                      {organization?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mô tả</p>
                    <p className="text-sm text-foreground">
                      {organization?.bio}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-[#6085F0] hover:opacity-90"
                  asChild
                >
                  <Link href="/organization/create-program">
                    Tạo chương trình mới
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
