"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { ProjectDetailCard } from "@/components/ProjectDetailCard";
import CertificateForm from "@/components/volunteer/CertificateForm";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { applicationAPI, projectAPI, categoryAPI } from "@/services/api";
import {
  ApplicationStatus,
  StatusBadge,
} from "@/components/organization/ApplicationStatusBadge";
import { ArrowLeft, Calendar, User, FileText, AlertCircle } from "lucide-react";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const appData = await applicationAPI.getById(parseInt(id));
      setApplication(appData);

      if (appData.projectId) {
        const projectData = await projectAPI.getById(appData.projectId);
        setProject(projectData);
      }

      const catsData = await categoryAPI.getAll();
      setCategories(catsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải thông tin đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const convertToFormData = (cert: any) => {
    if (!cert) return null;

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
        <LoadingState message="Đang tải thông tin đơn đăng ký..." />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ErrorState
          message={error || "Không tìm thấy đơn đăng ký"}
          onRetry={fetchData}
        />
      </div>
    );
  }

  const formData = convertToFormData(application.selectedCertificate);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <a href="/volunteer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang cá nhân
          </a>
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Chi tiết đơn đăng ký
              </h1>
              <p className="text-muted-foreground">
                Thông tin chi tiết về đơn đăng ký của bạn
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border`}
            >
              <StatusBadge status={application.status as ApplicationStatus} />
            </div>
          </div>
        </div>

        {!project ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Không tìm thấy thông tin chương trình
            </h2>
            <p className="text-muted-foreground mb-6">
              Chương trình có thể đã bị xóa hoặc không tồn tại
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Project Detail Card */}
            <div className="lg:col-span-2">
              <ProjectDetailCard
                project={project}
                showBackButton={false}
                showOrganizationLink={true}
                className="mb-6"
              />

              {/* Application Details */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Thông tin đơn đăng ký
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Ngày nộp đơn
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="font-medium">
                          {new Date(application.appliedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Người đăng ký
                      </p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <p className="font-medium">
                          {application.volunteerName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {application.reviewedAt && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Ngày xét duyệt
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="font-medium">
                          {new Date(application.reviewedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.rejectionReason && (
                    <div className="p-4 bg-red-50 border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-medium mb-1">
                        Lý do từ chối
                      </p>
                      <p className="text-red-800">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}

                  {application.feedback && (
                    <div className="p-4 bg-blue-50 border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium mb-1">
                        Phản hồi từ tổ chức
                      </p>
                      <p className="text-blue-800">{application.feedback}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Selected Certificate Preview */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Chứng chỉ đã chọn
                  </h2>
                </div>

                {application.selectedCertificate && formData ? (
                  <div className="space-y-6">
                    {/* Certificate Preview */}
                    <div className="rounded-lg overflow-hidden">
                      <CertificateForm
                        formData={formData}
                        categories={categories}
                        loadingCategories={false}
                        imagePreview={
                          application.selectedCertificate.imageUrl || ""
                        }
                        isViewMode={true}
                        onInputChange={() => {}}
                        onCategoryChange={() => {}}
                        onImageChange={() => {}}
                        onImageRemove={() => {}}
                        onSubmit={() => {}}
                        loading={false}
                      />
                    </div>

                    {/* Application Info */}
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h3 className="font-semibold text-foreground mb-3">
                        Thông tin ứng tuyển
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID đơn:</span>
                          <span className="font-medium text-foreground">
                            {application.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Trạng thái:
                          </span>
                          <span className="font-medium">
                            <span
                              className={`px-2 py-1 rounded-full text-xs `}
                            ></span>
                            <StatusBadge
                              status={application.status as ApplicationStatus}
                            />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">
                      Không tìm thấy chứng chỉ
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Chứng chỉ có thể đã bị xóa
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
