"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { staffAPI } from "../../../../../services/api";
import { ArrowLeft, UserCog } from "lucide-react";
import StaffForm from "../../../../../components/organization/StaffForm";

export default function EditEmployeePage({
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
  const [initialData, setInitialData] = useState<any>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    isFemale: false,
    bio: "",
    role: 2,
    isActive: true,
  });

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoadingEmployee(true);
        const data = await staffAPI.getById(parseInt(id));
        setInitialData(data);
        
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth 
            ? new Date(data.dateOfBirth).toISOString().split('T')[0]
            : "",
          isFemale: data.isFemale || false,
          bio: data.bio || "",
          role: data.role || 2,
          isActive: data.isActive ?? true,
        });
        
        if (data.profileImageUrl) {
          setImagePreview(data.profileImageUrl);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" || name === "isActive") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: name === "isActive" ? value === "true" : target.checked
      }));
    } else if (name === "role") {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGenderChange = (isFemale: boolean) => {
    setFormData(prev => ({
      ...prev,
      isFemale
    }));
  };

  const handleRoleChange = (role: number) => {
    setFormData(prev => ({
      ...prev,
      role
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

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        isFemale: formData.isFemale,
        bio: formData.bio || null,
        role: formData.role,
        isActive: formData.isActive,
      };

      // Add image file if it exists
      if (imageFile) {
        updateData.profileImageUrl = imageFile;
      }

      console.log('Updating employee with data:', updateData);
      await staffAPI.update(parseInt(id), updateData);

      alert("Cập nhật nhân sự thành công!");
      router.push("/organization/employees");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating employee:", error);
      const errorMessage = error?.message || error?.data?.message || "Không thể cập nhật nhân sự. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const staffRoles = [
    { value: 0, label: "Quản lý", description: "Quản lý toàn bộ tổ chức và nhân sự" },
    { value: 1, label: "Người duyệt", description: "Duyệt đơn đăng ký dự án" },
    { value: 2, label: "Nhân viên", description: "Thành viên thông thường" },
  ];

  if (loadingEmployee) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Đang tải thông tin nhân sự...</p>
        </main>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy nhân sự</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/employees">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Chỉnh sửa nhân sự</h1>
                  <p className="text-muted-foreground">
                    Cập nhật thông tin nhân sự
                  </p>
                </div>
              </div>

              <StaffForm
                formData={formData}
                imagePreview={imagePreview}
                isEdit={true}
                showPassword={showPassword}
                loading={loading}
                staffRoles={staffRoles}
                onInputChange={handleInputChange}
                onGenderChange={handleGenderChange}
                onRoleChange={handleRoleChange}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                onPasswordToggle={() => setShowPassword(!showPassword)}
                onSubmit={handleSubmit}
                submitText="Cập nhật nhân sự"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}