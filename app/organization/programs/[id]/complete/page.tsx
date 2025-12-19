"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPrograms, mockRegistrations, mockAccounts } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CompleteProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [customPrograms, setCustomPrograms] = useState<any[]>([]);
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);
  const [volunteerHours, setVolunteerHours] = useState<{
    [key: string]: number;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load custom programs and registrations
  useEffect(() => {
    const storedPrograms = localStorage.getItem("customPrograms");
    if (storedPrograms) {
      setCustomPrograms(JSON.parse(storedPrograms));
    }
    
    const storedRegs = localStorage.getItem("programRegistrations");
    if (storedRegs) {
      setCustomRegistrations(JSON.parse(storedRegs));
    }
  }, []);

  const allPrograms = [...mockPrograms, ...customPrograms];
  const program = allPrograms.find((p) => p.id === id);
  
  const allRegistrations = [...mockRegistrations, ...customRegistrations];
  // Get approved volunteers for this program
  const approvedVolunteers = allRegistrations.filter(
    (r) => r.programId === id && r.status === "approved",
  );

  useEffect(() => {
    // Pre-fill hours from existing data
    const hours: { [key: string]: number } = {};
    approvedVolunteers.forEach((reg) => {
      hours[reg.volunteerId] = reg.hoursContributed || 0;
    });
    setVolunteerHours(hours);
  }, []);

  if (!user || user.role !== "organization") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Chỉ tổ chức mới có thể truy cập trang này
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!program || program.organizationId !== user.id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Không tìm thấy chương trình hoặc bạn không có quyền truy cập
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleHoursChange = (volunteerId: string, hours: string) => {
    setVolunteerHours({
      ...volunteerHours,
      [volunteerId]: parseInt(hours) || 0,
    });
  };

  const handleCompleteProgram = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn đánh dấu chương trình hoàn thành? Hành động này sẽ cấp chứng chỉ cho tất cả tình nguyện viên.",
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // Issue certificates for all approved volunteers
      const existingCertificates = JSON.parse(
        localStorage.getItem("customCertificates") || "[]",
      );
      
      // Get all accounts (mock + approved)
      const approvedAccounts = JSON.parse(
        localStorage.getItem("approvedAccounts") || "[]",
      );
      const allAccounts = [...mockAccounts, ...approvedAccounts];
      
      const newCertificates = approvedVolunteers.map((reg) => {
        const volunteer = allAccounts.find((a) => a.id === reg.volunteerId);
        return {
          id: `cert-${Date.now()}-${reg.volunteerId}`,
          volunteerId: reg.volunteerId,
          volunteerName: volunteer?.name || reg.volunteerName,
          programId: program.id,
          programName: program.name,
          hoursContributed: volunteerHours[reg.volunteerId] || 0,
          issuedDate: new Date().toISOString().split("T")[0],
          certificateNumber: `CERT-${Date.now()}-${reg.volunteerId.slice(-3)}`,
        };
      });

      localStorage.setItem(
        "customCertificates",
        JSON.stringify([...existingCertificates, ...newCertificates]),
      );

      // Mark program as completed (update customPrograms only)
      const updatedPrograms = customPrograms.map((p: any) =>
        p.id === id ? { ...p, status: "completed" } : p,
      );
      localStorage.setItem("customPrograms", JSON.stringify(updatedPrograms));

      setIsLoading(false);
      alert(`Đã cấp ${newCertificates.length} chứng chỉ thành công!`);
      router.push("/organization/dashboard");
    } catch (error) {
      setIsLoading(false);
      alert("Có lỗi xảy ra khi cấp chứng chỉ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <Card className="p-8 border-[#77E5C8]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Hoàn thành chương trình
                </h1>
                <p className="text-muted-foreground">{program.name}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Danh sách tình nguyện viên
              </h2>
              <p className="text-muted-foreground mb-6">
                Nhập số giờ tình nguyện cho từng người. Chứng chỉ sẽ được tự
                động cấp khi hoàn thành.
              </p>

              {approvedVolunteers.length === 0 ? (
                <p className="text-muted-foreground">
                  Chưa có tình nguyện viên nào được duyệt
                </p>
              ) : (
                <div className="space-y-4">
                  {approvedVolunteers.map((reg) => {
                    const volunteer = mockAccounts.find(
                      (a) => a.id === reg.volunteerId,
                    );
                    return (
                      <div
                        key={reg.id}
                        className="p-4 border border-border rounded-lg bg-[#77E5C8]/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <CheckCircle className="w-6 h-6 text-[#6085F0]" />
                          <div>
                            <p className="font-semibold text-foreground">
                              {volunteer?.name || reg.volunteerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {volunteer?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Label
                            htmlFor={`hours-${reg.volunteerId}`}
                            className="text-sm text-muted-foreground"
                          >
                            Số giờ:
                          </Label>
                          <Input
                            id={`hours-${reg.volunteerId}`}
                            type="number"
                            min="0"
                            value={volunteerHours[reg.volunteerId] || 0}
                            onChange={(e) =>
                              handleHoursChange(reg.volunteerId, e.target.value)
                            }
                            className="w-24"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Lưu ý:</strong> Sau khi hoàn thành, chương trình sẽ
                chuyển sang trạng thái "Đã hoàn thành" và không thể chỉnh sửa.
              </p>
            </div>

            <Button
              className="w-full gradient-primary hover:opacity-90 text-white"
              onClick={handleCompleteProgram}
              disabled={isLoading || approvedVolunteers.length === 0}
            >
              {isLoading
                ? "Đang xử lý..."
                : `Hoàn thành & Cấp ${approvedVolunteers.length} chứng chỉ`}
            </Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
