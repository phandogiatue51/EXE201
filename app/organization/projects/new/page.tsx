"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI } from "../../../../services/api";
import { organizationAPI } from "../../../../services/api";
import { ArrowLeft, Upload, Calendar, MapPin, Users, Tag, Building2 } from "lucide-react";

interface Organization {
  id: number;
  name: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: 0,
    organizationId: 0,
    location: "",
    startDate: "",
    endDate: "",
    requiredVolunteers: 1,
    categories: [] as number[],
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await organizationAPI.getAll();
      setOrganizations(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, organizationId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
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
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (key === 'categories') {
            // Handle array separately
            if (Array.isArray(value) && value.length > 0) {
              value.forEach(catId => {
                formDataToSend.append('categories', catId.toString());
              });
            }
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // Append image file if exists
      if (imageFile) {
        formDataToSend.append('imageFile', imageFile);
      }

      await projectAPI.create(formDataToSend);
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Không thể tạo dự án. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Chỉ admin mới có thể truy cập trang này
          </p>
        </main>
      </div>
    );
  }

  const projectTypes = [
    { value: 0, label: "Giảng dạy" },
    { value: 1, label: "Hỗ trợ y tế" },
    { value: 2, label: "Cơ sở hạ tầng" },
    { value: 3, label: "Sự kiện" },
    { value: 4, label: "Đào tạo" },
    { value: 5, label: "Tư vấn" },
    { value: 6, label: "Khác" },
  ];

  const projectCategories = [
    { id: 1, name: "Giáo dục", color: "#4CAF50" },
    { id: 2, name: "Y tế", color: "#F44336" },
    { id: 3, name: "Môi trường", color: "#8BC34A" },
    { id: 4, name: "Cộng đồng", color: "#2196F3" },
    { id: 5, name: "Trẻ em", color: "#FF9800" },
    { id: 6, name: "Người cao tuổi", color: "#795548" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Thêm dự án mới</h1>
              <p className="text-muted-foreground mb-6">
                Tạo dự án tình nguyện mới
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hình ảnh dự án
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-48 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
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
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Tải lên hình ảnh
                        </Button>
                      </label>
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
                      Tên dự án *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Nhập tên dự án"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mô tả *
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về dự án..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Tag className="w-4 h-4 inline mr-2" />
                        Loại dự án *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg bg-background"
                        required
                      >
                        <option value="">Chọn loại dự án</option>
                        {projectTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Tổ chức *
                      </label>
                      <select
                        name="organizationId"
                        value={formData.organizationId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg bg-background"
                        required
                      >
                        <option value="">Chọn tổ chức</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Địa điểm & Thời gian</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Địa điểm
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Nhập địa điểm thực hiện dự án"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Ngày bắt đầu
                      </label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Ngày kết thúc
                      </label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Volunteers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Tình nguyện viên</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Số lượng tình nguyện viên cần *
                    </label>
                    <Input
                      type="number"
                      name="requiredVolunteers"
                      value={formData.requiredVolunteers}
                      onChange={handleInputChange}
                      min="1"
                      max="1000"
                      required
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Danh mục</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chọn các danh mục phù hợp với dự án
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {projectCategories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                categories: [...prev.categories, category.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                categories: prev.categories.filter(id => id !== category.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-foreground">
                            {category.name}
                          </span>
                        </div>
                      </label>
                    ))}
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
                    <Link href="/admin/projects">Hủy</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#77E5C8]"
                    disabled={loading}
                  >
                    {loading ? "Đang tạo..." : "Tạo dự án"}
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