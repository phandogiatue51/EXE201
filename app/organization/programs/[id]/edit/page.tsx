"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, categoryAPI } from "../../../../../services/api";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "../../../../../components/form/ProjectForm";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const userOrganizationId = user?.organizationId;
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(true);
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
    status: 0,
  });

  useEffect(() => {
    if (userOrganizationId) {
      const orgIdNumber = parseInt(userOrganizationId);
      if (!isNaN(orgIdNumber)) {
        setOrganizationId(orgIdNumber);
      }
    }
  }, [userOrganizationId]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        const data = await projectAPI.getById(parseInt(id));
        setInitialData(data);

        setFormData({
          title: data.title,
          description: data.description,
          challenges: data.challenges || "",
          goals: data.goals || "",
          activities: data.activities,
          impacts: data.impacts || "",
          benefits: data.benefits || "",
          requirements: data.requirements,
          type: data.type,
          location: data.location || "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().slice(0, 16)
            : "",
          endDate: data.endDate
            ? new Date(data.endDate).toISOString().slice(0, 16)
            : "",
          requiredVolunteers: data.requiredVolunteers,
          categories:
            data.categories?.map((c: any) => c.categoryId || c.id) || [],
          status: data.status,
        });

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [id]);

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
    if (loading) return;

    const validationErrors: string[] = [];

    const requiredTextFields = [
      { key: "title" as const, label: "Tên chương trình" },
      { key: "description" as const, label: "Mô tả" },
      { key: "goals" as const, label: "Mục tiêu" },
      { key: "activities" as const, label: "Hoạt động" },
      { key: "requirements" as const, label: "Yêu cầu" },
    ];

    requiredTextFields.forEach(({ key, label }) => {
      if (!formData[key]?.toString()?.trim()) {
        validationErrors.push(`${label} không được để trống`);
      }
    });

    if (!formData.requiredVolunteers || formData.requiredVolunteers < 1) {
      validationErrors.push("Số lượng tình nguyện viên phải ít nhất là 1");
    }

    if (formData.categories.length === 0) {
      validationErrors.push("Vui lòng chọn ít nhất một danh mục");
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        validationErrors.push("Ngày kết thúc phải sau ngày bắt đầu");
      }
    }

    if (validationErrors.length > 0) {
      toast({
        description: validationErrors[0],
        variant: "destructive",
        duration: 5000,
      });
      setLoading(false);
      return;
    }
    try {
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
        location: formData.location || "",
        status: formData.status,
        organizationId: organizationId,
        requiredVolunteers: formData.requiredVolunteers,
        categoryIds: formData.categories,
      };

      if (formData.startDate) {
        projectData.startDate = new Date(formData.startDate).toISOString();
      }

      if (formData.endDate) {
        projectData.endDate = new Date(formData.endDate).toISOString();
      }

      if (imageFile) {
        projectData.imageUrl = imageFile;
      }

      console.log("Updating project with data:", projectData);
      console.log("Categories array:", projectData.categoryIds);

      const response = await projectAPI.update(parseInt(id), projectData);

      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      router.push("/organization/programs");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating project:", error);

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

  const statusOptions = [
    { value: 0, label: "Bản nháp", color: "bg-gray-100 text-gray-800" },
    {
      value: 1,
      label: "Đang lên kế hoạch",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: 2,
      label: "Đang tuyển dụng",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: 3,
      label: "Đang triển khai",
      color: "bg-green-100 text-green-800",
    },
    { value: 4, label: "Hoàn thành", color: "bg-purple-100 text-purple-800" },
    { value: 5, label: "Đã hủy", color: "bg-red-100 text-red-800" },
  ];

  if (loadingProject) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Đang tải chương trình...</p>
        </main>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Không tìm thấy chương trình</p>
        </main>
      </div>
    );
  }

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
                Chỉnh sửa chương trình
              </h1>

              <ProjectForm
                formData={formData}
                imagePreview={imagePreview}
                categories={categories}
                loadingCategories={loadingCategories}
                projectTypes={projectTypes}
                statusOptions={statusOptions}
                isEdit={true}
                onInputChange={handleInputChange}
                onCategoryToggle={handleCategoryToggle}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                onSubmit={handleSubmit}
                loading={loading}
                submitText="Cập nhật dự án"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
