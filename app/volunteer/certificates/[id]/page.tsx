"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { certificateAPI, categoryAPI } from "@/services/api";
import { ArrowLeft, Trash2, UserPlus } from "lucide-react";
import CertificateForm from "@/components/volunteer/CertificateForm";

export default function CertificateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const certificateId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const data = await certificateAPI.getById(certificateId);
        setCertificate(data);
      } catch (error) {
        console.error("Error fetching certificate:", error);
        alert("Không thể tải thông tin chứng chỉ");
        router.push("/volunteer");
      } finally {
        setLoading(false);
      }
    };

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

    if (certificateId) {
      fetchCertificate();
      fetchCategories();
    }
  }, [certificateId, router]);

  const handleDelete = async () => {
    if (!certificateId) return;

    if (!confirm("Bạn có chắc chắn muốn xóa chứng chỉ này?")) return;

    try {
      setDeleting(true);
      await certificateAPI.delete(certificateId);
      alert("Xóa chứng chỉ thành công!");
      router.push("/volunteer");
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      alert(error.message || "Có lỗi xảy ra khi xóa chứng chỉ");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Chứng chỉ không tồn tại
            </h1>
            <Button asChild>
              <Link href="/volunteer">Quay lại danh sách</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formData = {
    certificateName: certificate.certificateName || "",
    certificateNumber: certificate.certificateNumber || "",
    categoryId: certificate.categoryId?.toString() || "",
    issuingOrganization: certificate.issuingOrganization || "",
    issueDate: certificate.issueDate ? certificate.issueDate.split("T")[0] : "",
    expiryDate: certificate.expiryDate
      ? certificate.expiryDate.split("T")[0]
      : "",
    description: certificate.description || "",
    status: certificate.status || "",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/volunteer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                  Chi tiết chứng chỉ
                </h1>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Đang xóa..." : "Xóa"}
                </Button>
              </div>
              <CertificateForm
                loading={true}
                formData={formData}
                categories={categories}
                loadingCategories={loadingCategories}
                imagePreview={certificate.imageUrl || null}
                isViewMode={true}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
