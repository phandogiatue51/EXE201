"use client";

import type React from "react";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPrograms, mockAccounts } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";

export default function ProgramRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    skills: "",
    hasPassport: "",
    passportNumber: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user && user.role === "volunteer") {
      const account = mockAccounts.find((a) => a.id === user.id);
      if (account) {
        setFormData((prev) => ({
          ...prev,
          fullName: account.name,
          email: account.email,
          phone: account.phone,
        }));
      }
    }
  }, [user]);

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

  if (!user || user.role !== "volunteer") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href={`/programs/${program.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Link>
            </Button>

            <Card className="p-8 border-[#77E5C8] bg-[#77E5C8]/10">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Vui lòng đăng nhập
              </h1>
              <p className="text-muted-foreground mb-6">
                Bạn cần đăng nhập với tài khoản tình nguyện viên để đăng ký tham
                gia chương trình này.
              </p>
              <div className="flex gap-3">
                <Button className="bg-[#6085F0] hover:opacity-90" asChild>
                  <Link href="/auth/volunteer">Đăng nhập</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/volunteer-signup">Tạo tài khoản</Link>
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.reason
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate passport for international programs
    if (program.isInternational && !formData.hasPassport) {
      alert("Vui lòng cho biết bạn đã có hộ chiếu chưa");
      return;
    }

    // Create registration object
    const registration = {
      id: `reg-${Date.now()}`,
      volunteerId: user.id,
      volunteerName: formData.fullName,
      programId: program.id,
      programName: program.name,
      status: "pending" as const,
      appliedDate: new Date().toISOString().split("T")[0],
      reason: formData.reason,
      skills: formData.skills,
      hasPassport: formData.hasPassport,
      passportNumber: formData.passportNumber,
    };

    // Save to localStorage
    const stored = localStorage.getItem("programRegistrations");
    const registrations = stored ? JSON.parse(stored) : [];
    registrations.push(registration);
    localStorage.setItem("programRegistrations", JSON.stringify(registrations));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#6085F0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Đăng ký thành công!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Đơn đăng ký của bạn đã được gửi. Tổ chức sẽ xem xét và liên hệ
                  với bạn sớm.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button className="bg-[#6085F0] hover:opacity-90" asChild>
                    <Link href="/programs">Xem chương trình khác</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/programs/${program.id}`}>
                      Quay lại chương trình
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/programs/${program.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-[#77E5C8]">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Đăng ký tham gia
              </h1>
              <p className="text-muted-foreground mb-8">{program.name}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                    placeholder="Nhập email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Lý do tham gia <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                    placeholder="Chia sẻ lý do bạn muốn tham gia chương trình này"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Kỹ năng
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                    placeholder="Ví dụ: Dạy học, Lập trình, Thiết kế..."
                  />
                </div>

                {/* Passport for International Programs */}
                {program.isInternational && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Đã có hộ chiếu? <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="hasPassport"
                        value={formData.hasPassport}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                        required
                      >
                        <option value="">Chọn</option>
                        <option value="yes">Có</option>
                        <option value="no">Chưa có</option>
                      </select>
                    </div>

                    {formData.hasPassport === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Số hộ chiếu (tùy chọn)
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                          placeholder="Nhập số hộ chiếu"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#6085F0] hover:opacity-90"
                  >
                    Gửi đơn đăng ký
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/programs/${program.id}`}>Hủy</Link>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
