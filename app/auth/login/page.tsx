"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login: apiLogin, loading: authLoading, error: authError } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await apiLogin(email, password);
    } catch (error: any) {
      console.log("CATCH: Error message:", error?.message);
    } finally {
      setIsLoading(false);
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                required
                disabled={isLoading || authLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                required
                disabled={isLoading || authLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
            <p className="text-muted-foreground mt-2">
              Bạn đại diện cho tổ chức?{" "}
              <Link
                href="/auth/organization-signup"
                className="text-[#6085F0] hover:underline font-semibold"
              >
                Đăng ký tổ chức
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
