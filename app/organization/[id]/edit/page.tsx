"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { organizationAPI } from "@/services/api";
import { ArrowLeft, Upload, Building2, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: 0,
    website: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const data = await organizationAPI.getById(parseInt(id));
      setFormData({
        name: data.name,
        description: data.description || "",
        type: data.type,
        website: data.website || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });
      if (data.logoUrl) {
        setImagePreview(data.logoUrl);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' ? parseInt(value as string) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Append form data (use backend field names)
      const keyMap: Record<string, string> = {
        name: 'Name',
        description: 'Description',
        type: 'Type',
        website: 'Website',
        email: 'Email',
        phoneNumber: 'PhoneNumber',
        address: 'Address',
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          const mapped = keyMap[key] || key;
          formDataToSend.append(mapped, value.toString());
        }
      });

      // Append image file if exists (match DTO property)
      if (imageFile) {
        formDataToSend.append('ImageFile', imageFile);
      }

      await organizationAPI.update(parseInt(id), formDataToSend);
      alert("Cập nhật tổ chức thành công");
      router.push(`/organization`);
      router.refresh();
    } catch (error) {
      console.error("Error updating organization:", error);
      alert("Không thể cập nhật tổ chức. Vui lòng thử lại.");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin tổ chức</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin tổ chức của bạn</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/organization">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                />
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview ? "Thay đổi logo" : "Tải lên logo"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG, GIF tối đa 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tên tổ chức *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên tổ chức"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Loại tổ chức *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              >
                {organizationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mô tả
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả về tổ chức..."
                rows={4}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Thông tin liên hệ</h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@organization.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Số điện thoại *
              </label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0123 456 789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Địa chỉ *
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Số nhà, đường, quận/huyện, thành phố"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website *
              </label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                required
              />
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
              <Link href="/organization">Hủy</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

