"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { staffAPI } from "../../../../services/api";
import { ArrowLeft, UserPlus } from "lucide-react";
import StaffForm from "../../../../components/form/StaffForm";
import { useToast } from "@/hooks/use-toast";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { user } = useAuth();
  const OrganizationId = user?.organizationId;
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    imageFile: "",
    isFemale: false,
    organizationId: 0,
    role: 2,
  });

  useEffect(() => {
    if (OrganizationId) {
      const orgIdNumber = parseInt(OrganizationId);
      if (!isNaN(orgIdNumber)) {
        setFormData((prev) => ({
          ...prev,
          organizationId: orgIdNumber,
        }));
      }
    }
  }, [OrganizationId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview URL
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" || name === "isActive") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "isActive" ? value === "true" : target.checked,
      }));
    } else if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenderChange = (isFemale: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isFemale,
    }));
  };

  const handleRoleChange = (role: number) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Password confirmation does not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("NewAccount.Name", formData.name);
      formDataToSend.append("NewAccount.Email", formData.email);
      formDataToSend.append("NewAccount.Password", formData.password);
      formDataToSend.append(
        "NewAccount.IsFemale",
        formData.isFemale.toString()
      );

      if (formData.phoneNumber) {
        formDataToSend.append("NewAccount.PhoneNumber", formData.phoneNumber);
      }

      if (formData.dateOfBirth) {
        formDataToSend.append("NewAccount.DateOfBirth", formData.dateOfBirth);
      }

      if (imageFile) {
        formDataToSend.append("NewAccount.ProfileImageUrl", imageFile);
      } else {
        formDataToSend.append("NewAccount.ProfileImageUrl", "");
      }

      formDataToSend.append(
        "OrganizationId",
        formData.organizationId.toString()
      );
      formDataToSend.append("Role", formData.role.toString());

      const response = await staffAPI.create(formDataToSend);

      toast({
        description: response,
        variant: "success",
        duration: 3000,
      }); router.push("/organization/employees");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const staffRoles = [
    {
      value: 0,
      label: "Quản lý",
      description: "Quản lý toàn bộ tổ chức và nhân sự",
    },
    {
      value: 1,
      label: "Người duyệt",
      description: "Duyệt đơn đăng ký chương trình",
    },
    { value: 2, label: "Nhân viên", description: "Thành viên thông thường" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Thêm nhân sự mới
                  </h1>
                  <p className="text-muted-foreground">
                    Tạo tài khoản nhân sự cho tổ chức của bạn
                  </p>
                </div>
              </div>

              <StaffForm
                formData={formData}
                imagePreview={imagePreview}
                isEdit={false}
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
                submitText="Add Staff"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
