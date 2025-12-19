"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Try to login with each role
    let loginSuccess = false;
    let userRole: "volunteer" | "organization" | "admin" | null = null;

    if (login(email, "volunteer")) {
      loginSuccess = true;
      userRole = "volunteer";
    } else if (login(email, "organization")) {
      loginSuccess = true;
      userRole = "organization";
    } else if (login(email, "admin")) {
      loginSuccess = true;
      userRole = "admin";
    }

    if (loginSuccess && userRole) {
      // Redirect based on detected role
      if (userRole === "volunteer") {
        router.push("/");
      } else if (userRole === "organization") {
        router.push("/organization/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } else {
      alert("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8 border-[#77E5C8]">
          <h1 className="text-3xl font-bold text-foreground mb-2">Đăng nhập</h1>
          <p className="text-muted-foreground mb-8">
            Chào mừng bạn quay trở lại
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                href="/auth/signup"
                className="text-[#6085F0] hover:underline font-semibold"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
