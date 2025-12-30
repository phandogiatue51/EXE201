"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { accountAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Phone, Calendar, UserCircle, Info, ArrowLeft, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  isFemale: boolean;
  profileImageUrl: string | null;
  bio: string | null;
  role: number;
  roleName: string;
  status: number;
  statusName: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: ProfileData;
      const userId = user?.accountId || user?.id;
      
      if (userId) {
        // Fetch specific user by ID - GET /api/Account/{id}
        data = await accountAPI.getById(userId);
      } else {
        // Fetch current user - GET /api/Account returns current user's account
        const response = await accountAPI.getAll();
        
        // Handle both single object and array responses
        if (Array.isArray(response)) {
          const currentUserId = user?.accountId || user?.id;
          if (currentUserId) {
            // Try to find user in array by ID, or fetch by ID
            const foundUser = response.find((u: ProfileData) => u.id === currentUserId);
            if (foundUser) {
              data = foundUser;
            } else {
              data = await accountAPI.getById(currentUserId);
            }
          } else if (response.length > 0) {
            // Fallback to first item if no user ID available
            data = response[0];
          } else {
            throw new Error("Không tìm thấy thông tin tài khoản");
          }
        } else {
          // Single object response
          data = response;
        }
      }
      
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin profile. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800 border-green-200";
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 2:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground text-center">
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

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#6085F0] bg-clip-text text-transparent mb-4 animate-in fade-in zoom-in-95 duration-1000">
                Hồ sơ của tôi
              </h1>
              <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
                Thông tin chi tiết về tài khoản của bạn
              </p>
            </div>

            {isLoading ? (
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            ) : error ? (
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={fetchProfileData}
                    className="bg-[#6085F0] text-white hover:bg-[#77E5C8] transition-colors"
                  >
                    Thử lại
                  </Button>
                </div>
              </Card>
            ) : profileData ? (
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700 hover:shadow-2xl transition-all duration-500">
                <div className="space-y-8">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-border/50 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                    <div className="relative group mx-auto sm:mx-0">
                      <Avatar className="h-32 w-32 border-4 border-[#77E5C8]/20 transition-all duration-500 group-hover:scale-110 group-hover:border-[#6085F0]/40 group-hover:shadow-2xl group-hover:shadow-[#77E5C8]/30">
                        <AvatarImage
                          src={profileData.profileImageUrl || undefined}
                          alt={profileData.name}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white text-3xl font-bold transition-all duration-500 group-hover:from-[#6085F0] group-hover:to-[#A7CBDC]">
                          {getInitials(profileData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#77E5C8]/20 to-[#6085F0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
                    </div>
                    <div className="flex-1 space-y-4 text-center sm:text-left animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground mb-3 transition-all duration-300 hover:text-[#6085F0]">
                          {profileData.name}
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <Badge
                            className={`px-4 py-1.5 text-sm font-medium border transition-all duration-300 hover:scale-110 ${getStatusColor(
                              profileData.status
                            )}`}
                          >
                            {profileData.statusName}
                          </Badge>
                          <Badge className="px-4 py-1.5 text-sm font-medium bg-[#77E5C8]/10 text-[#6085F0] border border-[#77E5C8]/30 transition-all duration-300 hover:scale-110 hover:bg-[#77E5C8]/20">
                            {profileData.roleName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <Mail className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">Email</p>
                        <p className="text-base font-medium text-foreground break-all">
                          {profileData.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <Phone className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          Số điện thoại
                        </p>
                        <p className="text-base font-medium text-foreground">
                          {profileData.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <Calendar className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          Ngày sinh
                        </p>
                        <p className="text-base font-medium text-foreground">
                          {formatDate(profileData.dateOfBirth)}
                        </p>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <UserCircle className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">Giới tính</p>
                        <p className="text-base font-medium text-foreground">
                          {profileData.isFemale ? "Nữ" : "Nam"}
                        </p>
                      </div>
                    </div>

                    {/* ID */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <User className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">ID</p>
                        <p className="text-base font-medium text-foreground">
                          {profileData.id}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200">
                      <div className="p-3 rounded-lg bg-[#77E5C8]/10 shrink-0 transition-all duration-300 group-hover:bg-[#6085F0]/20 group-hover:scale-110">
                        <Info className="h-6 w-6 text-[#6085F0] transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-2">Vai trò</p>
                        <p className="text-base font-medium text-foreground">
                          {profileData.roleName} (Mã: {profileData.role})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {profileData.bio && (
                    <div className="p-6 rounded-xl bg-[#77E5C8]/5 border border-[#77E5C8]/20 hover:bg-[#77E5C8]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#77E5C8]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1300">
                      <p className="text-sm text-muted-foreground mb-3 font-medium">
                        Giới thiệu
                      </p>
                      <p className="text-base text-foreground leading-relaxed">
                        {profileData.bio}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-border/50 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1400">
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                    >
                      <Link href="/profile/settings" className="flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                        Cài đặt tài khoản
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

