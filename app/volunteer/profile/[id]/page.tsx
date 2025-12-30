"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { accountAPI, certificateAPI } from "@/services/api";
import { Mail, Phone, Calendar, UserCircle, ArrowLeft, Award, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Account, Certificate} from "@/lib/type"
import { formatDate, formatDateTime } from "@/lib/date";

export default function VolunteerProfilePage() {
  const params = useParams();
  const [profileData, setProfileData] = useState<Account | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const volunteerId = params.id as string;

  useEffect(() => {
    if (volunteerId) {
      fetchProfileData();
    }
  }, [volunteerId]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileResponse = await accountAPI.getById(parseInt(volunteerId));
      setProfileData(profileResponse);
      
      try {
        const certsResponse = await certificateAPI.getByAccountId(parseInt(volunteerId));
        setCertificates(certsResponse || []);
      } catch (certError) {
        console.error("Error fetching certificates:", certError);
        setCertificates([]);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin tình nguyện viên. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/volunteer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>
          
          <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl max-w-4xl mx-auto">
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
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/volunteer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>
          
          <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl max-w-4xl mx-auto">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || "Không tìm thấy thông tin tình nguyện viên"}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={fetchProfileData}
                  className="bg-[#6085F0] text-white hover:bg-[#77E5C8] transition-colors"
                >
                  Thử lại
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/volunteer">Quay lại Dashboard</Link>
                </Button>
              </div>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/volunteer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#6085F0] bg-clip-text text-transparent mb-4">
                Hồ sơ Tình nguyện viên
              </h1>
              <p className="text-xl text-muted-foreground">
                Thông tin chi tiết về tình nguyện viên
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-border/50">
                    <div className="relative group mx-auto sm:mx-0">
                      <Avatar className="h-32 w-32 border-4 border-[#77E5C8]/20">
                        <AvatarImage
                          src={profileData.profileImageUrl}
                          alt={profileData.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white text-3xl font-bold">
                          {getInitials(profileData.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground mb-3">
                          {profileData.name}
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">

                          <Badge className="px-4 py-1.5 text-sm font-medium bg-[#77E5C8]/10 text-[#6085F0] border border-[#77E5C8]/30">
                            {profileData.roleName}
                          </Badge>
                          {profileData.isFemale !== undefined && (
                            <Badge variant="outline" className="px-4 py-1.5 text-sm">
                              {profileData.isFemale ? "Nữ" : "Nam"}
                            </Badge>
                          )}
                          
                        </div>
                      </div>
                      
                      {profileData.bio && (
                        <p className="text-muted-foreground mt-4">
                          {profileData.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#77E5C8]/5">
                      <Mail className="h-5 w-5 text-[#6085F0]" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium break-all">{profileData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#77E5C8]/5">
                      <Phone className="h-5 w-5 text-[#6085F0]" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="font-medium">
                          {profileData.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#77E5C8]/5">
                      <Calendar className="h-5 w-5 text-[#6085F0]" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày sinh</p>
                        <p className="font-medium">
                          {profileData?.dateOfBirth ? formatDate(profileData.dateOfBirth) : "Chưa cập nhật"}
                        </p>

                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#77E5C8]/5">
                      <UserCircle className="h-5 w-5 text-[#6085F0]" />
                      <div>
                        <p className="text-sm text-muted-foreground">ID tình nguyện viên</p>
                        <p className="font-medium">#{profileData.id}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Certificates Section */}
                {certificates.length > 0 && (
                  <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Award className="h-6 w-6 text-[#6085F0]" />
                      Chứng chỉ & Bằng cấp
                      <Badge className="ml-2 bg-[#77E5C8]/20 text-[#6085F0]">
                        {certificates.length}
                      </Badge>
                    </h3>
                    
                    <div className="space-y-4">
                      {certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-4 border border-[#77E5C8]/20 rounded-lg bg-gradient-to-r from-[#77E5C8]/5 to-transparent hover:from-[#77E5C8]/10 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{cert.certificateName}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                {cert.categoryName && (
                                  <Badge variant="secondary" className="text-xs">
                                    {cert.categoryName}
                                  </Badge>
                                )}
                                {cert.issuingOrganization && (
                                  <span className="text-sm text-muted-foreground">
                                    {cert.issuingOrganization}
                                  </span>
                                )}
                              </div>
                              {cert.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {cert.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {cert.issueDate && (
                                <p className="text-sm">
                                  Cấp: {formatDate(cert.issueDate)}
                                </p>
                              )}
                              {cert.expiryDate && (
                                <p className="text-sm text-muted-foreground">
                                  Hết hạn: {formatDate(cert.expiryDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column - Stats & Actions */}
              <div className="space-y-8">
                <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <h3 className="text-xl font-bold">Thống kê</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chứng chỉ</span>
                      <span className="font-bold text-[#6085F0]">{certificates.length}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <Badge className={getStatusColor(profileData.status)}>
                        {profileData.statusName}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <h3 className="text-xl font-bold">Hành động</h3>
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0]">
                      <Link href={`/volunteer/profile/${volunteerId}/edit`}>
                        Chỉnh sửa hồ sơ
                      </Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/volunteer/${volunteerId}/applications`}>
                        Xem đơn đăng ký
                      </Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`volunteer/${volunteerId}/certificates`}>
                        Quản lý chứng chỉ
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}