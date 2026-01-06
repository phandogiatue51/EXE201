"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, categoryAPI } from "../../../../services/api";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "../../../../components/form/ProjectForm";
import { useToast } from "@/hooks/use-toast";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userOrganizationId = user?.organizationId;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<number>(0);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    challenges: "",
    goals: "",
    activities: "",
    impacts: "",
    benefits: "",
    requirements: "",
    type: 0,
    location: "",
    startDate: "",
    endDate: "",
    requiredVolunteers: 1,
    categories: [] as number[],
  });

  useEffect(() => {
    if (userOrganizationId) {
      const orgIdNumber = parseInt(userOrganizationId);
      if (!isNaN(orgIdNumber)) {
        setOrganizationId(orgIdNumber);
      }
    }
  }, [userOrganizationId]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryAPI.getAll();
        const activeCategories = data.filter((cat: any) => cat.isActive);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleCategoryToggle = (categoryId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((id) => id !== categoryId),
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
        return;
      }

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

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên chương trình");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      alert("Vui lòng nhập mô tả chương trình");
      setLoading(false);
      return;
    }

    if (formData.categories.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục cho chương trình");
      setLoading(false);
      return;
    }

    if (organizationId === 0) {
      alert("Không tìm thấy thông tin tổ chức. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const toUTCISOString = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString();
      };

      const projectData: any = {
        title: formData.title,
        description: formData.description,
        challenges: formData.challenges,
        goals: formData.goals,
        activities: formData.activities,
        impacts: formData.impacts,
        benefits: formData.benefits,
        requirements: formData.requirements,
        type: formData.type,
        organizationId: organizationId,
        location: formData.location || null,
        startDate: toUTCISOString(formData.startDate),
        endDate: toUTCISOString(formData.endDate),
        requiredVolunteers: formData.requiredVolunteers,
        categoryIds: formData.categories,
      };

      if (imageFile) {
        projectData.imageUrl = imageFile;
      }

      console.log("Sending project data:", projectData);
      const response = await projectAPI.create(projectData);

      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });
      router.push("/organization/programs");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating project:", error);

      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const projectTypes = [
    { value: 0, label: "Giảng dạy" },
    { value: 1, label: "Hỗ trợ y tế" },
    { value: 2, label: "Cơ sở hạ tầng" },
    { value: 3, label: "Sự kiện" },
    { value: 4, label: "Đào tạo" },
    { value: 5, label: "Tư vấn" },
    { value: 6, label: "Khác" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/programs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Thêm chương trình mới
              </h1>

              <ProjectForm
                formData={formData}
                imagePreview={imagePreview}
                categories={categories}
                loadingCategories={loadingCategories}
                projectTypes={projectTypes}
                onInputChange={handleInputChange}
                onCategoryToggle={handleCategoryToggle}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                onSubmit={handleSubmit}
                loading={loading}
                submitText="Tạo chương trình"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
