"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { accountAPI } from "@/services/api";
import { ArrowLeft, Lock, Eye, EyeOff, Shield, KeyRound } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp!",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự!",
        variant: "destructive",
      });
      return;
    }

    const userId = user?.accountId;
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID người dùng",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);

    try {
      // Call API to change password
      await accountAPI.changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      // Clear form on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      toast({
        title: "Thành công",
        description: "Đổi mật khẩu thành công!",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      const errorMessage = error?.message || "Có lỗi xảy ra khi đổi mật khẩu";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để truy cập trang này
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-16">
          <Button variant="ghost" asChild className="mb-8">
            <Link
              href={
                user.role === "volunteer"
                  ? "/volunteer/dashboard"
                  : user.role === "organization"
                    ? "/organization/dashboard"
                    : "/admin/dashboard"
              }
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#77E5C8] to-[#6085F0] mb-6 shadow-lg shadow-[#77E5C8]/30 animate-in zoom-in-95 duration-1000">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] via-[#6085F0] to-[#A7CBDC] bg-clip-text text-transparent mb-4 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                Cài đặt bảo mật
              </h1>
              <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                Bảo vệ tài khoản của bạn bằng mật khẩu mạnh
              </p>
            </div>

            {/* Password Change Card */}
            <Card className="p-0 border-0 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400 hover:shadow-3xl transition-all duration-500">
              {/* Decorative Header */}
              <div className="relative h-32 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
                    <KeyRound className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-[#6085F0]" />
                    Đổi mật khẩu
                  </h2>
                  <p className="text-muted-foreground">
                    Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                    <Label htmlFor="currentPassword" className="text-base font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#6085F0]" />
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative group">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                        className="pr-10 h-12 text-base border-2 border-[#77E5C8]/20 focus:border-[#6085F0] focus:ring-2 focus:ring-[#6085F0]/20 transition-all duration-300"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#6085F0] transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-600">
                    <Label htmlFor="newPassword" className="text-base font-semibold flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#6085F0]" />
                      Mật khẩu mới
                    </Label>
                    <div className="relative group">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                        className="pr-10 h-12 text-base border-2 border-[#77E5C8]/20 focus:border-[#6085F0] focus:ring-2 focus:ring-[#6085F0]/20 transition-all duration-300"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#6085F0] transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                      <p className="text-sm text-amber-600 flex items-center gap-1">
                        <span>⚠️</span> Mật khẩu phải có ít nhất 6 ký tự
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-700">
                    <Label htmlFor="confirmNewPassword" className="text-base font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#6085F0]" />
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative group">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmNewPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                        className="pr-10 h-12 text-base border-2 border-[#77E5C8]/20 focus:border-[#6085F0] focus:ring-2 focus:ring-[#6085F0]/20 transition-all duration-300"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#6085F0] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordData.confirmNewPassword &&
                      passwordData.newPassword !== passwordData.confirmNewPassword && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span>❌</span> Mật khẩu không khớp
                        </p>
                      )}
                    {passwordData.confirmNewPassword &&
                      passwordData.newPassword === passwordData.confirmNewPassword &&
                      passwordData.newPassword.length >= 6 && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span>✅</span> Mật khẩu khớp
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#77E5C8] via-[#6085F0] to-[#A7CBDC] hover:from-[#6085F0] hover:via-[#77E5C8] hover:to-[#A7CBDC] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Đang thay đổi...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                          Đổi mật khẩu
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>

            {/* Security Tips */}
            <Card className="mt-6 p-6 border-2 border-[#77E5C8]/20 bg-gradient-to-br from-[#77E5C8]/5 to-[#6085F0]/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10 shrink-0">
                  <Shield className="w-5 h-5 text-[#6085F0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mẹo bảo mật</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Sử dụng mật khẩu có ít nhất 8 ký tự</li>
                    <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>Không sử dụng thông tin cá nhân trong mật khẩu</li>
                    <li>Đổi mật khẩu định kỳ để bảo vệ tài khoản</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
