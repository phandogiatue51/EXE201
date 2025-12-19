"use client";

import type React from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"volunteer" | "organization">("volunteer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    address: "",
    website: "",
    dateOfBirth: "",
  });

  // Check if coming from "Dành cho tổ chức" - set role to organization
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "organization") {
      setRole("organization");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "volunteer") {
      // Volunteers are auto-approved - create account directly
      const newAccount = {
        id: `vol-${Date.now()}`,
        ...formData,
        role: "volunteer",
      };

      // Save to approvedAccounts directly
      const approvedAccounts = JSON.parse(
        localStorage.getItem("approvedAccounts") || "[]"
      );
      approvedAccounts.push(newAccount);
      localStorage.setItem("approvedAccounts", JSON.stringify(approvedAccounts));

      // Save password
      const userPasswords = JSON.parse(
        localStorage.getItem("userPasswords") || "{}"
      );
      userPasswords[formData.email] = formData.password;
      localStorage.setItem("userPasswords", JSON.stringify(userPasswords));

      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      router.push("/auth/login");
    } else {
      // Organizations need admin approval
      const orgRegistration = {
        id: `org-reg-${Date.now()}`,
        ...formData,
        role: "organization",
        status: "pending",
        registeredDate: new Date().toISOString().split("T")[0],
      };

      // Save to orgRegistrations (for admin to approve)
      const stored = localStorage.getItem("orgRegistrations");
      const registrations = stored ? JSON.parse(stored) : [];
      registrations.push(orgRegistration);
      localStorage.setItem("orgRegistrations", JSON.stringify(registrations));

      alert("Đăng ký thành công! Tài khoản tổ chức của bạn đang chờ Admin phê duyệt.");
      router.push("/auth/login");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl p-8 border-[#77E5C8]">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đăng ký tài khoản
          </h1>
          <p className="text-muted-foreground mb-8">
            Tạo tài khoản mới để bắt đầu
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Đăng ký với vai trò
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("volunteer")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    role === "volunteer"
                      ? "gradient-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tình nguyện viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organization")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    role === "organization"
                      ? "gradient-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tổ chức
                </button>
              </div>
            </div>

            {/* Fixed height container to prevent size changes */}
            <div className="min-h-[480px]">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {role === "volunteer" ? "Họ và tên" : "Tên tổ chức"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={
                      role === "volunteer"
                        ? "Nguyễn Văn A"
                        : "Tên tổ chức của bạn"
                    }
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mật khẩu
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                  />
                </div>

                {/* Conditional fields based on role */}
                {role === "organization" ? (
                  <>
                    {/* Address (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Địa chỉ văn phòng
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Đường ABC, Quận XYZ"
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                      />
                    </div>

                    {/* Website - REQUIRED */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Website
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Volunteer: Date of Birth - REQUIRED */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Ngày sinh
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                        required
                      />
                    </div>

                    {/* Volunteer: Address (optional) - fill space */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Đường ABC, Quận XYZ"
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Bio - Full width */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {role === "volunteer"
                    ? "Giới thiệu bản thân"
                    : "Giới thiệu tổ chức"}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder={
                    role === "volunteer"
                      ? "Chia sẻ về bản thân và sự quan tâm đến hoạt động tình nguyện..."
                      : "Chia sẻ về sứ mệnh và hoạt động của tổ chức..."
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground resize-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white py-3"
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-[#6085F0] hover:underline font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 flex items-center justify-center py-12 px-4">
            <Card className="w-full max-w-2xl p-8 border-[#77E5C8]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0] mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </Card>
          </main>
          <Footer />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
