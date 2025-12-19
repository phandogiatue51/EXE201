"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Save, Lock, User } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    website: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data when user is available
  useEffect(() => {
    if (user) {
      // Load full user data from localStorage.currentUser
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          address: userData.address || "",
          website: userData.website || "",
        });
      }
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user from localStorage
      const storedUser = localStorage.getItem("currentUser");
      if (!storedUser) {
        alert("Không tìm thấy thông tin người dùng");
        return;
      }

      const currentUser = JSON.parse(storedUser);

      // Update user data
      const updatedUser = {
        ...currentUser,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        address: profileData.address,
        website: profileData.website,
      };

      // Save to localStorage.currentUser
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Also update in approvedAccounts if user is there
      const approvedAccounts = JSON.parse(localStorage.getItem("approvedAccounts") || "[]");
      const updatedApprovedAccounts = approvedAccounts.map((acc: any) =>
        acc.id === currentUser.id ? updatedUser : acc
      );
      if (updatedApprovedAccounts.length > 0) {
        localStorage.setItem("approvedAccounts", JSON.stringify(updatedApprovedAccounts));
      }

      // Dispatch event to update all components
      window.dispatchEvent(new Event("auth-change"));

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      setIsLoading(false);
      alert("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      // In real app, verify current password with backend
      // For demo, we'll just update it

      // Get stored passwords (for demo only - in real app this would be on backend)
      const storedPasswords = JSON.parse(
        localStorage.getItem("userPasswords") || "{}",
      );

      // Verify current password
      if (
        storedPasswords[user.id] &&
        storedPasswords[user.id] !== passwordData.currentPassword
      ) {
        alert("Mật khẩu hiện tại không đúng!");
        setIsLoading(false);
        return;
      }

      // Update password
      storedPasswords[user.id] = passwordData.newPassword;
      localStorage.setItem("userPasswords", JSON.stringify(storedPasswords));

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Đổi mật khẩu thành công!");
    } catch (error) {
      setIsLoading(false);
      alert("Có lỗi xảy ra khi đổi mật khẩu");
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

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-4">
                Cài đặt hồ sơ
              </h1>
              <p className="text-xl text-muted-foreground">
                Quản lý thông tin cá nhân và bảo mật tài khoản
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-[#77E5C8]/50 shadow-lg">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 data-[state=active]:bg-[#6085F0] data-[state=active]:text-white"
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-2 data-[state=active]:bg-[#6085F0] data-[state=active]:text-white"
                >
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-8">
                <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {user?.role === "organization"
                          ? "Tên tổ chức"
                          : user?.role === "admin"
                            ? "Tên"
                            : "Họ và tên"}
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        required
                        placeholder={
                          user?.role === "organization"
                            ? "Nhập tên tổ chức"
                            : "Nhập họ và tên"
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email {user?.role === "organization" ? "liên hệ" : ""}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        required
                        placeholder={
                          user?.role === "organization"
                            ? "Email chính thức của tổ chức"
                            : "Nhập email"
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Số điện thoại{" "}
                        {user?.role === "organization" ? "liên hệ" : ""}
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        required
                        placeholder={
                          user?.role === "organization"
                            ? "Hotline hoặc số điện thoại văn phòng"
                            : "Nhập số điện thoại"
                        }
                      />
                    </div>

                    {user?.role === "organization" && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ văn phòng</Label>
                        <Input
                          id="address"
                          value={profileData.address || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Số nhà, tên đường, quận/huyện, thành phố"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        {user?.role === "organization"
                          ? "Giới thiệu tổ chức"
                          : "Giới thiệu bản thân"}
                      </Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder={
                          user?.role === "organization"
                            ? "Giới thiệu về tổ chức, sứ mệnh, tầm nhìn..."
                            : "Viết một vài dòng về bản thân..."
                        }
                      />
                    </div>

                    {user?.role === "organization" && (
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (tùy chọn)</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              website: e.target.value,
                            })
                          }
                          placeholder="https://example.org"
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="password" className="mt-8">
                <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isLoading ? "Đang thay đổi..." : "Đổi mật khẩu"}
                    </Button>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
