"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import CertificateForm from "@/components/form/CertificateForm";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { certificateAPI, categoryAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Check } from "lucide-react";

export default function CertificateSelectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [certificates, setCertificates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.accountId) {
      fetchData();
    }
  }, [id, user?.accountId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const certsData = await certificateAPI.getByAccountId(user!.accountId);
      setCertificates(certsData || []);

      const catsData = await categoryAPI.getAll();
      setCategories(catsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải danh sách chứng chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
  };

  const handleContinue = () => {
    if (selectedCertificate) {
      router.push(
        `/programs/${id}/register-preview?certificateId=${selectedCertificate.id}`
      );
    }
  };

  const convertToFormData = (certificate: any) => {
    return {
      certificateName: certificate.certificateName || "",
      certificateNumber: certificate.certificateNumber || "",
      categoryId: certificate.categoryId?.toString() || "",
      issuingOrganization: certificate.issuingOrganization || "",
      issueDate: certificate.issueDate || "",
      expiryDate: certificate.expiryDate || "",
      description: certificate.description || "",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <LoadingState message="Đang tải danh sách chứng chỉ..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ErrorState
          message={error || "Vui lòng đăng nhập để xem chứng chỉ"}
          onRetry={() => (user ? fetchData() : router.push("/login"))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <a href={`/programs/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại chi tiết chương trình
          </a>
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Chọn chứng chỉ để đăng ký
          </h1>
          <p className="text-muted-foreground">
            Vui lòng chọn một chứng chỉ để đăng ký tham gia chương trình này
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-[#6085F0]" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">
                    Bạn chưa có chứng chỉ nào
                  </p>
                  <Button
                    className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                    asChild
                  >
                    <a href="/volunteer/certificates/new">Thêm chứng chỉ mới</a>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Chứng chỉ của bạn ({certificates.length})
                  </h2>
                  {certificates.map((certificate) => (
                    <CertificateSelectionCard
                      key={certificate.id}
                      certificate={certificate}
                      isSelected={selectedCertificate?.id === certificate.id}
                      onSelect={() => handleSelectCertificate(certificate)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-16">
              <h2 className="text-lg font-semibold text-foreground">
                Chứng chỉ đã chọn
              </h2>

              {selectedCertificate ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <CertificateForm
                      formData={convertToFormData(selectedCertificate)}
                      categories={categories}
                      loadingCategories={false}
                      imagePreview={selectedCertificate.imageUrl || ""}
                      isViewMode={true}
                      onInputChange={() => {}}
                      onCategoryChange={() => {}}
                      onImageChange={() => {}}
                      onImageRemove={() => {}}
                      onSubmit={() => {}}
                      loading={false}
                    />
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Tiếp tục với chứng chỉ này
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Bạn sẽ được chuyển đến trang xác nhận đăng ký
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">Chưa chọn chứng chỉ</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vui lòng chọn một chứng chỉ từ danh sách bên trái
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CertificateSelectionCardProps {
  certificate: any;
  isSelected: boolean;
  onSelect: () => void;
}

function CertificateSelectionCard({
  certificate,
  isSelected,
  onSelect,
}: CertificateSelectionCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-2 border-[#77E5C8] bg-gradient-to-r from-[#77E5C8]/5 to-transparent"
          : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground">
              {certificate.certificateName}
            </h3>
            {isSelected && (
              <span className="px-2 py-1 bg-[#77E5C8] text-white text-xs rounded-full">
                Đã chọn
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-muted-foreground">
              Số:{" "}
              <span className="text-foreground">
                {certificate.certificateNumber}
              </span>
            </p>
            <p className="text-muted-foreground">
              Cấp bởi:{" "}
              <span className="text-foreground">
                {certificate.issuingOrganization}
              </span>
            </p>
            <p className="text-muted-foreground">
              Ngày cấp:{" "}
              <span className="text-foreground">
                {new Date(certificate.issueDate).toLocaleDateString("vi-VN")}
              </span>
            </p>
            {certificate.expiryDate && (
              <p className="text-muted-foreground">
                Ngày hết hạn:{" "}
                <span className="text-foreground">
                  {new Date(certificate.expiryDate).toLocaleDateString("vi-VN")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
