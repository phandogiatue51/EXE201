"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { organizationAPI } from "@/services/api";
import { Upload, Building2, Mail, Phone, MapPin, Globe, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [managerData, setManagerData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    isFemale: false,
    role: 0,
  });

  const [organizationData, setOrganizationData] = useState({
    name: "",
    description: "",
    type: 0,
    website: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleManagerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setManagerData({
      ...managerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOrganizationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrganizationData({
      ...organizationData,
      [name]: name === "type" ? parseInt(value as string) : value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append Manager data
      formDataToSend.append("Manager.Name", managerData.name);
      formDataToSend.append("Manager.Email", managerData.email);
      formDataToSend.append("Manager.Password", managerData.password);

      if (managerData.phoneNumber) {
        formDataToSend.append("Manager.PhoneNumber", managerData.phoneNumber);
      }
      if (managerData.dateOfBirth) {
        formDataToSend.append("Manager.DateOfBirth", managerData.dateOfBirth);
      }
      formDataToSend.append("Manager.IsFemale", managerData.isFemale.toString());
      formDataToSend.append("Manager.Role", managerData.role.toString());

      // Append Organization data
      formDataToSend.append("Name", organizationData.name);
      formDataToSend.append("Description", organizationData.description);
      formDataToSend.append("Type", organizationData.type.toString());
      formDataToSend.append("Website", organizationData.website);
      formDataToSend.append("Email", organizationData.email);
      formDataToSend.append("PhoneNumber", organizationData.phoneNumber);
      formDataToSend.append("Address", organizationData.address);

      if (imageFile) {
        formDataToSend.append("ImageFile", imageFile);
      }

      const response = await organizationAPI.createWithManager(formDataToSend);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });

    } finally {
      setIsLoading(false);
    }
  };

  const organizationTypes = [
    { value: 0, label: "Tổ chức phi chính phủ" },
    { value: 1, label: "Doanh nghiệp" },
    { value: 2, label: "Trường học" },
    { value: 3, label: "Cộng đồng" },
    { value: 4, label: "Chính phủ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-4xl p-8 border-[#77E5C8]">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đăng ký tổ chức
          </h1>
          <p className="text-muted-foreground mb-8">
            Tạo tài khoản quản lý cho tổ chức của bạn
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Manager Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin người quản lý
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={managerData.name}
                    onChange={handleManagerChange}
                    placeholder="Nguyễn Văn A"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={managerData.email}
                    onChange={handleManagerChange}
                    placeholder="manager@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mật khẩu
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={managerData.password}
                    onChange={handleManagerChange}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={managerData.phoneNumber}
                    onChange={handleManagerChange}
                    placeholder="0123456789"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ngày sinh
                  </label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={managerData.dateOfBirth}
                    onChange={handleManagerChange}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Giới tính
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isFemale"
                        checked={managerData.isFemale === true}
                        onChange={() =>
                          setManagerData({ ...managerData, isFemale: true })
                        }
                        className="mr-2"
                        disabled={isLoading}
                      />
                      Nữ
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isFemale"
                        checked={managerData.isFemale === false}
                        onChange={() =>
                          setManagerData({ ...managerData, isFemale: false })
                        }
                        className="mr-2"
                        disabled={isLoading}
                      />
                      Nam
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Information Section */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Thông tin tổ chức
              </h2>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo tổ chức
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      id="logoInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên logo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, GIF tối đa 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tên tổ chức
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    name="name"
                    value={organizationData.name}
                    onChange={handleOrganizationChange}
                    placeholder="Nhập tên tổ chức"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Loại tổ chức
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="type"
                    value={organizationData.type}
                    onChange={handleOrganizationChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6085F0] bg-background text-foreground"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Chọn loại tổ chức</option>
                    {organizationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={organizationData.email}
                    onChange={handleOrganizationChange}
                    placeholder="contact@organization.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    name="phoneNumber"
                    value={organizationData.phoneNumber}
                    onChange={handleOrganizationChange}
                    placeholder="0123 456 789"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Địa chỉ
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    name="address"
                    value={organizationData.address}
                    onChange={handleOrganizationChange}
                    placeholder="Số nhà, đường, quận/huyện, thành phố"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    name="website"
                    value={organizationData.website}
                    onChange={handleOrganizationChange}
                    placeholder="https://example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mô tả
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Textarea
                    name="description"
                    value={organizationData.description}
                    onChange={handleOrganizationChange}
                    placeholder="Mô tả về tổ chức..."
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký tổ chức"}
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
            <p className="text-muted-foreground mt-2">
              Bạn là tình nguyện viên?{" "}
              <Link
                href="/auth/signup"
                className="text-[#6085F0] hover:underline font-semibold"
              >
                Đăng ký tài khoản tình nguyện viên
              </Link>
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

