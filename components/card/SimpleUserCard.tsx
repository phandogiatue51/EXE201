"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { accountAPI } from "@/services/api";

interface SimpleUserCardProps {
  userId: number;
  className?: string;
}

export default function SimpleUserCard({ userId, className = "" }: SimpleUserCardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountAPI.getById(userId);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-muted-foreground">{error || "Không tìm thấy người dùng"}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUser}
          className="mt-4"
        >
          <Loader2 className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
            {user.name ? (
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-8 h-8 text-white/70" />
            )}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-white/80">ID: {user.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {user.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          )}

          {user.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          )}

          {user.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Địa điểm</p>
                <p className="font-medium">{user.location}</p>
              </div>
            </div>
          )}

          {user.dateOfBirth && (
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày sinh</p>
                <p className="font-medium">
                  {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          )}

          {user.bio && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Giới thiệu</p>
              <p className="text-muted-foreground whitespace-pre-line">
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}