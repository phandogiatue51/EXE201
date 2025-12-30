"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { accountAPI } from "@/services/api";
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  UserCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditVolunteerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const volunteerId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    isFemale: false,
    bio: "",
    profileImageUrl: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingProfileImage, setExistingProfileImage] = useState<string>("");

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

      const formattedDate = profileResponse.dateOfBirth
        ? new Date(profileResponse.dateOfBirth).toISOString().split("T")[0]
        : "";

      setFormData({
        name: profileResponse.name || "",
        email: profileResponse.email || "",
        phoneNumber: profileResponse.phoneNumber || "",
        dateOfBirth: formattedDate,
        isFemale: profileResponse.isFemale || false,
        bio: profileResponse.bio || "",
        profileImageUrl: profileResponse.profileImageUrl || null,
      });

      if (profileResponse.profileImageUrl) {
        setExistingProfileImage(profileResponse.profileImageUrl);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin tình nguyện viên. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh không được vượt quá 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      setProfileImage(file);

      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Vui lòng nhập họ tên");
      }

      if (!formData.email.trim()) {
        throw new Error("Vui lòng nhập email");
      }

      const formDataObj = new FormData();

      if (formData.name) formDataObj.append("Name", formData.name);
      if (formData.email) formDataObj.append("Email", formData.email);
      if (formData.phoneNumber)
        formDataObj.append("PhoneNumber", formData.phoneNumber);
      if (formData.dateOfBirth)
        formDataObj.append("DateOfBirth", formData.dateOfBirth);
      formDataObj.append("IsFemale", formData.isFemale.toString());
      if (formData.bio) formDataObj.append("Bio", formData.bio);

      if (profileImage) {
        formDataObj.append("ProfileImageUrl", profileImage);
      }

      const response = await accountAPI.update(
        parseInt(volunteerId),
        formDataObj
      );

      alert("Cập nhật hồ sơ thành công!");

      setTimeout(() => {
        router.push(`/volunteer/profile/${volunteerId}`);
      }, 1500);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.message || "Cập nhật thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Button variant="ghost" asChild className="mb-8">
            <Link href={`/volunteer/profile/${volunteerId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại hồ sơ
            </Link>
          </Button>

          <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
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
      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-16">
          <Button variant="ghost" asChild className="mb-8">
            <Link href={`/volunteer/profile/${volunteerId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại hồ sơ
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#6085F0] bg-clip-text text-transparent mb-4">
                Chỉnh sửa hồ sơ
              </h1>
              <p className="text-muted-foreground">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>

            <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 border-4 border-[#77E5C8]/20">
                      <AvatarImage
                        src={profileImagePreview || existingProfileImage}
                        alt={formData.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#77E5C8] to-[#6085F0] text-white text-2xl font-bold">
                        {getInitials(formData.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex gap-4">
                    <Label
                      htmlFor="profileImageUrl"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#77E5C8]/10 hover:bg-[#77E5C8]/20 text-[#6085F0] rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Chọn ảnh mới
                    </Label>

                    <Input
                      id="profileImageUrl"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {(profileImagePreview || existingProfileImage) && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={removeImage}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Xóa ảnh
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    Hỗ trợ: JPG, PNG (tối đa 5MB)
                  </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 mb-2"
                    >
                      <User className="w-4 h-4 text-[#6085F0]" />
                      Họ và tên *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên"
                      className="border-[#77E5C8]/30 focus:border-[#6085F0]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 mb-2"
                    >
                      <Mail className="w-4 h-4 text-[#6085F0]" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập địa chỉ email"
                      className="border-[#77E5C8]/30 focus:border-[#6085F0]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="flex items-center gap-2 mb-2"
                    >
                      <Phone className="w-4 h-4 text-[#6085F0]" />
                      Số điện thoại
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="border-[#77E5C8]/30 focus:border-[#6085F0]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="dateOfBirth"
                        className="flex items-center gap-2 mb-2"
                      >
                        <Calendar className="w-4 h-4 text-[#6085F0]" />
                        Ngày sinh
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="border-[#77E5C8]/30 focus:border-[#6085F0]"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="gender"
                        className="flex items-center gap-2 mb-2"
                      >
                        <UserCircle className="w-4 h-4 text-[#6085F0]" />
                        Giới tính
                      </Label>

                      <div className="flex items-center space-x-4 p-2 border border-[#77E5C8]/30 rounded-lg">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.isFemale === false}
                            onChange={() =>
                              setFormData({ ...formData, isFemale: false })
                            }
                            className="accent-[#6085F0]"
                          />
                          Nam
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.isFemale === true}
                            onChange={() =>
                              setFormData({ ...formData, isFemale: true })
                            }
                            className="accent-[#6085F0]"
                          />
                          Nữ
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-2 mb-2"
                    >
                      <Info className="w-4 h-4 text-[#6085F0]" />
                      Giới thiệu bản thân
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Giới thiệu về bản thân, kinh nghiệm, sở thích..."
                      rows={4}
                      className="border-[#77E5C8]/30 focus:border-[#6085F0] resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Tối đa 500 ký tự
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push(`/volunteer/profile/${volunteerId}`)
                    }
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang cập nhật...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
