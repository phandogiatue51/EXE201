"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { ProjectDetailCard } from "@/components/card/ProjectDetailCard";
import CertificateForm from "@/components/form/CertificateForm";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useToast } from "@/hooks/use-toast";
import {
  certificateAPI,
  categoryAPI,
  projectAPI,
  applicationAPI,
} from "@/services/api";
import {
  ArrowLeft,
  AlertCircle,
  Send,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const certificateId = searchParams.get("certificateId");

  const [project, setProject] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, certificateId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectData = await projectAPI.getById(parseInt(id));
      setProject(projectData);

      if (certificateId) {
        const certData = await certificateAPI.getById(certificateId);
        setCertificate(certData);
      }

      const catsData = await categoryAPI.getAll();
      setCategories(catsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải thông tin đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegistration = async () => {
    if (!certificate || !project || !user) return;

    try {
      setSubmitting(true);

      const appData = {
        projectId: parseInt(id),
        volunteerId: user.accountId,
        relevantExperience: "",
        selectedCertificateId: certificate.id,
      };

      const response = await applicationAPI.create(appData);

      const applicationId = response.id;

      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });

      router.push(`/volunteer/application/${applicationId}`);
    } catch (error: any) {
      console.error("Error registering:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const convertToFormData = (cert: any) => {
    return {
      certificateName: cert.certificateName || "",
      certificateNumber: cert.certificateNumber || "",
      categoryId: cert.categoryId?.toString() || "",
      issuingOrganization: cert.issuingOrganization || "",
      issueDate: cert.issueDate || "",
      expiryDate: cert.expiryDate || "",
      description: cert.description || "",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <LoadingState message="Đang tải thông tin đăng ký..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ErrorState
          message={error || "Không tìm thấy chương trình"}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <a href={`/programs/${id}/certificate-selection`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại chọn chứng chỉ
          </a>
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Xác nhận đăng ký tham gia
          </h1>
          <p className="text-muted-foreground">
            Vui lòng xác nhận thông tin đăng ký của bạn
          </p>
        </div>

        {!certificate ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Không tìm thấy chứng chỉ
            </h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng quay lại và chọn một chứng chỉ
            </p>
            <Button asChild variant="outline">
              <a href={`/programs/${id}/certificate-selection`}>
                Quay lại chọn chứng chỉ
              </a>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProjectDetailCard
                project={project}
                showBackButton={false}
                showOrganizationLink={false}
                className="mb-0"
              />

              <Card className="p-6 mt-6 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">
                      Điều khoản đăng ký
                    </h3>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>
                          Bằng việc đăng ký, bạn đồng ý với tất cả các điều
                          khoản của chương trình
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>
                          Thông tin chứng chỉ của bạn sẽ được chia sẻ với tổ
                          chức chương trình
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>
                          Bạn cam kết tham gia đầy đủ các hoạt động nếu được
                          chấp nhận
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>
                          Đăng ký này có thể được tổ chức xem xét và phê duyệt
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Chứng chỉ đã chọn
                  </h2>
                </div>

                <div className="rounded-lg overflow-hidden mb-6">
                  <CertificateForm
                    formData={convertToFormData(certificate)}
                    categories={categories}
                    loadingCategories={false}
                    imagePreview={certificate.imageUrl || ""}
                    isViewMode={true}
                    onInputChange={() => { }}
                    onCategoryChange={() => { }}
                    onImageChange={() => { }}
                    onImageRemove={() => { }}
                    onSubmit={() => { }}
                    loading={false}
                  />
                </div>

                <Button
                  onClick={handleSubmitRegistration}
                  className="w-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Xác nhận đăng ký
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Sau khi xác nhận, đơn đăng ký của bạn sẽ được gửi đến tổ chức
                  để phê duyệt
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
