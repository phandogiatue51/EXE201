"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { organizationAPI } from "../../../../services/api";
import {
  ArrowLeft,
  Upload,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
} from "lucide-react";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      formDataToSend.append(
        "Manager.IsFemale",
        managerData.isFemale.toString()
      );
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

      await organizationAPI.createWithManager(formDataToSend);
      toast({
        title: "Thành công",
        description: "Tạo tài khoản tổ chức thành công!",
        duration: 3000,
      });
      router.push("/admin/organizations");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating organization:", error);
      toast({
        title: "Lỗi",
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
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

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/organizations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-[#77E5C8]">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Thêm tổ chức mới
              </h1>
              <p className="text-muted-foreground mb-8">
                Tạo tổ chức mới với thông tin người quản lý
              </p>

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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
                          />
                          Nữ
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isFemale"
                            checked={managerData.isFemale === false}
                            onChange={() =>
                              setManagerData({
                                ...managerData,
                                isFemale: false,
                              })
                            }
                            className="mr-2"
                            disabled={loading}
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
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      >
                        <option value="">Chọn loại tổ chức</option>
                        {organizationTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
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
                        disabled={loading}
                      />
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1"
                  >
                    <Link href="/admin/organizations">Hủy</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary hover:opacity-90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Đang tạo..." : "Tạo tổ chức"}
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
