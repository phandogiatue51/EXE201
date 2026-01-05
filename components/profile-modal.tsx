"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { accountAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Phone, Calendar, UserCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountBadge } from "./status-badge/AccountBadge";
import { formatDate } from "@/lib/date";

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

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
}

export function ProfileModal({
  open,
  onOpenChange,
  userId,
}: ProfileModalProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProfileData();
    }
  }, [open, userId]);

  const fetchProfileData = async () => {
    if (!user?.accountId) {
      setError("Không tìm thấy thông tin tài khoản");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await accountAPI.getById(user.accountId);
      setProfileData(data);
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin profile. Vui lòng thử lại."
      );
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#6085F0] bg-clip-text text-transparent">
            Thông tin hồ sơ
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProfileData}
              className="px-4 py-2 bg-[#6085F0] text-white rounded-lg hover:bg-[#77E5C8] transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : profileData ? (
          <div className="space-y-6 py-4">
            {/* Profile Header */}
            <div className="flex items-start gap-6 pb-6 border-b border-border/50">
              <Avatar className="h-24 w-24 border-4 border-[#77E5C8]/20">
                <AvatarImage
                  src={profileData.profileImageUrl || undefined}
                  alt={profileData.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white text-2xl font-bold">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {profileData.name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <AccountBadge
                      role={profileData.role}
                      status={profileData.status}
                    />

                    <Badge className="px-3 py-1 text-sm font-medium bg-[#77E5C8]/10 text-[#6085F0] border border-[#77E5C8]/30">
                      {profileData.roleName}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <Mail className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {profileData.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <Phone className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Số điện thoại
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profileData.phoneNumber || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <Calendar className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Ngày sinh
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(profileData.dateOfBirth)}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <UserCircle className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Giới tính
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profileData.isFemale ? "Nữ" : "Nam"}
                  </p>
                </div>
              </div>

              {/* ID */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <User className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">ID</p>
                  <p className="text-sm font-medium text-foreground">
                    {profileData.id}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <div className="p-2 rounded-lg bg-[#77E5C8]/10">
                  <Info className="h-5 w-5 text-[#6085F0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Vai trò</p>
                  <p className="text-sm font-medium text-foreground">
                    {profileData.roleName} (Mã: {profileData.role})
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <div className="p-4 rounded-lg bg-[#77E5C8]/5 border border-[#77E5C8]/20">
                <p className="text-xs text-muted-foreground mb-2">Giới thiệu</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
