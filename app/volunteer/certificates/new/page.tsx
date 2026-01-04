"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { certificateAPI, categoryAPI } from "../../../../services/api";
import { ArrowLeft, UserPlus } from "lucide-react";
import CertificateForm from "@/components/form/CertificateForm";
import { Category } from "@/lib/type";

export default function CreateCertificatePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    certificateName: "",
    certificateNumber: "",
    categoryId: "",
    issuingOrganization: "",
    issueDate: "",
    expiryDate: "",
    description: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryAPI.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("CertificateName", formData.certificateName);
      formDataToSend.append("CertificateNumber", formData.certificateNumber);
      formDataToSend.append("CategoryId", formData.categoryId);
      formDataToSend.append(
        "IssuingOrganization",
        formData.issuingOrganization
      );
      formDataToSend.append("IssueDate", formData.issueDate);

      if (formData.expiryDate) {
        formDataToSend.append("ExpiryDate", formData.expiryDate);
      }

      if (formData.description) {
        formDataToSend.append("Description", formData.description);
      }

      if (user?.accountId) {
        formDataToSend.append("AccountId", user.accountId.toString());
      } else {
        throw new Error("Không tìm thấy Account ID. Vui lòng đăng nhập lại.");
      }

      if (imageFile) {
        formDataToSend.append("ImageUrl", imageFile);
      }

      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      await certificateAPI.create(formDataToSend);

      alert("Tạo chứng chỉ thành công!");
      router.push("/volunteer");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating certificate:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      if (error.data?.errors) {
        const errorMessages = Object.values(error.data.errors)
          .flat()
          .join(", ");
        alert(`Lỗi xác thực: ${errorMessages}`);
      } else {
        alert(error.message || "Có lỗi xảy ra khi tạo chứng chỉ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/volunteer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Thêm chứng chỉ
                  </h1>
                </div>
              </div>

              <CertificateForm
                formData={formData}
                categories={categories}
                loadingCategories={loadingCategories}
                imagePreview={imagePreview}
                loading={loading}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                onSubmit={handleSubmit}
                submitText="Thêm chứng chỉ"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
