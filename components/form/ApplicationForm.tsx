"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { applicationAPI, projectAPI, categoryAPI } from "@/services/api";
import {
  StatusBadge,
  APPLICATION_STATUS,
  ApplicationStatus,
} from "../status-badge/ApplicationStatusBadge";
import { VolunteerApplication, Project } from "@/lib/type";
import { ReviewAppDto } from "@/lib/type";
import { formatDateTime } from "@/lib/date";
import { useParams } from "next/navigation";
import SimpleProjectCard from "../card/SimpleProjectCard";
import SimpleUserCard from "../card/SimpleUserCard";
import CertificateForm from "../form/CertificateForm";

import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ApplicationDetailViewProps {
  applicationId?: number;
  onBack?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export function ApplicationDetailView({
  applicationId,
  onBack,
  showBackButton = true,
  backButtonText = "Quay lại danh sách đơn",
  backButtonHref = "/organization/applications",
}: ApplicationDetailViewProps) {
  const params = useParams();
  const id = applicationId || Number(params?.id);

  const { user } = useAuth();
  const [application, setApplication] = useState<VolunteerApplication | null>(
    null
  );
  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchApplication();
    fetchCategories();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationAPI.getById(id);
      setApplication(data);

      // Fetch actual project details
      if (data?.projectId) {
        try {
          const projectData = await projectAPI.getById(data.projectId);
          setProject(projectData);
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Bạn có chắc chắn muốn phê duyệt đơn ứng tuyển này?")) return;

    setReviewing(true);
    try {
      const reviewData: ReviewAppDto = {
        status: APPLICATION_STATUS.APPROVED,
        reviewedByStaffId: user?.staffId ? parseInt(user.staffId) : undefined,
      };
      await applicationAPI.review(id, reviewData);
      alert("Đã phê duyệt đơn ứng tuyển!");
      fetchApplication();
    } catch (error: any) {
      console.error("Error approving application:", error);
      alert(error?.message || "Không thể phê duyệt đơn ứng tuyển.");
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Vui lòng nhập lý do từ chối:");
    if (!reason) return;

    setReviewing(true);
    try {
      const reviewData: ReviewAppDto = {
        status: APPLICATION_STATUS.REJECTED,
        rejectionReason: reason,
        reviewedByStaffId: user?.staffId ? parseInt(user.staffId) : undefined,
      };
      await applicationAPI.review(id, reviewData);
      alert("Đã từ chối đơn ứng tuyển!");
      fetchApplication();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      alert(error?.message || "Không thể từ chối đơn ứng tuyển.");
    } finally {
      setReviewing(false);
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

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Đang tải thông tin đơn ứng tuyển...
          </p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Không tìm thấy đơn ứng tuyển
        </h2>
        <p className="text-muted-foreground mb-6">
          Đơn ứng tuyển bạn đang tìm kiếm không tồn tại.
        </p>
        <Button asChild>
          <Link href={backButtonHref}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backButtonText}
          </Link>
        </Button>
      </div>
    );
  }

  const formData = convertToFormData(application.selectedCertificate);

  return (
    <div>
      {/* Navigation */}
      {showBackButton && (
        <div className="mb-4">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backButtonText}
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href={backButtonHref}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backButtonText}
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Đơn ứng tuyển #{application.id.toString().padStart(4, "0")}
              </h1>
              <div className="flex items-center gap-4">
                <StatusBadge status={application.status as ApplicationStatus} />
                <span className="text-sm text-muted-foreground">
                  Ứng tuyển vào: {formatDateTime(application.appliedAt)}
                </span>
              </div>
            </div>

            {application.status === 0 && (
              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={handleApprove}
                  disabled={reviewing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {reviewing ? "Đang xử lý..." : "Phê duyệt"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={reviewing}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {reviewing ? "Đang xử lý..." : "Từ chối"}
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-2" />

          {/* Project Info */}
          <div className="w-full">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Thông tin chương trình
            </h2>
            {project ? (
              <SimpleProjectCard
                project={project}
                showBackButton={false}
                showOrganizationLink={false}
                className="border-0 shadow-none p-0 w-full"
              />
            ) : (
              <Card className="p-4 w-full">
                <p className="text-muted-foreground">
                  Không thể tải thông tin chương trình
                </p>
              </Card>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Certificate (Big) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Certificate Section */}
            {application.selectedCertificate && formData ? (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Chứng chỉ đã chọn
                </h2>
                <CertificateForm
                  formData={formData}
                  categories={categories}
                  loadingCategories={false}
                  imagePreview={application.selectedCertificate.imageUrl || ""}
                  isViewMode={true}
                  onInputChange={() => {}}
                  onCategoryChange={() => {}}
                  onImageChange={() => {}}
                  onImageRemove={() => {}}
                  onSubmit={() => {}}
                  loading={false}
                  submitText=""
                />
              </Card>
            ) : (
              <Card className="p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Không có chứng chỉ được đính kèm
                  </p>
                </div>
              </Card>
            )}

            {/* Relevant Experience */}
            {application.relevantExperience && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Kinh nghiệm liên quan
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {application.relevantExperience}
                </p>
              </Card>
            )}
          </div>

          {/* Right Column: User Card + Timeline + Feedback (Small) */}
          <div className="space-y-16">
            {/* Volunteer Card */}
            <SimpleUserCard userId={application.volunteerId} />

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Lịch sử đơn
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Nộp đơn ứng tuyển
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(application.appliedAt)}
                    </p>
                  </div>
                </div>

                {application.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        <StatusBadge
                          status={application.status as ApplicationStatus}
                        />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(application.reviewedAt)}
                      </p>
                      {application.reviewedByStaffId && (
                        <p className="text-xs text-muted-foreground">
                          Bởi nhân viên ID: {application.reviewedByStaffId}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Feedback */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Phản hồi
              </h2>
              {application.rejectionReason || application.feedback ? (
                <div className="space-y-4">
                  {application.rejectionReason && (
                    <div>
                      <h3 className="font-medium text-red-600 mb-2">
                        Lý do từ chối:
                      </h3>
                      <p className="text-sm text-muted-foreground p-3 bg-red-50 rounded-lg">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}
                  {application.feedback && (
                    <div>
                      <h3 className="font-medium text-foreground mb-2">
                        Phản hồi:
                      </h3>
                      <p className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-lg">
                        {application.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4"></p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
