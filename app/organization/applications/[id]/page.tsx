"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { applicationAPI, projectAPI, accountAPI } from "../../../../services/api";
import { StatusBadge } from "../../../../components/organization/AppStatusBadge";
import {  APPLICATION_STATUS,  ApplicationStatus} from "../../../../components/organization/AppStatusBadge";
import { VolunteerApplication, Account, Project } from "@/lib/type";
import { ReviewAppDto } from "@/lib/type";
import { formatDate, formatDateTime } from "@/lib/date";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,  
  Award,
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  
  const { user } = useAuth();
  const [application, setApplication] = useState<VolunteerApplication | null>(null);
  const [projectDetail, setProjectDetails] = useState<Project | null>(null);
  const [volunteerDetail, setVolunteerDetails] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationAPI.getById(id);
      setApplication(data);
      
      if (data?.projectId) {
        try {
          const projectData = await projectAPI.getById(data.projectId);
          setProjectDetails(projectData);
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }

      if (data?.volunteerId) {
        try {
          const volunteerData = await accountAPI.getById(data.volunteerId);
          setVolunteerDetails(volunteerData);
        } catch (error) {
          console.error("Error fetching volunteer details:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
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

      console.log("Submitting approval with data:", reviewData);
      await applicationAPI.review(id, reviewData);

      alert("Đã phê duyệt đơn ứng tuyển!");
      fetchApplication(); 
    } catch (error: any) {
      console.error("Error approving application:", error);
      const errorMessage = error?.message || error?.data?.message || "Không thể phê duyệt đơn ứng tuyển.";
      alert(errorMessage);
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

      console.log("Submitting rejection with data:", reviewData);
      await applicationAPI.review(id, reviewData);

      alert("Đã từ chối đơn ứng tuyển!");
      fetchApplication(); 
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      const errorMessage = error?.message || error?.data?.message || "Không thể từ chối đơn ứng tuyển.";
      alert(errorMessage);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground ml-3">Đang tải thông tin đơn ứng tuyển...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy đơn ứng tuyển</h2>
            <p className="text-muted-foreground mb-6">Đơn ứng tuyển bạn đang tìm kiếm không tồn tại.</p>
            <Button asChild>
              <Link href="/organization/applications">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const account = volunteerDetail;
  const project = projectDetail;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/organization/applications">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách đơn
            </Link>
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <Card className="p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Đơn ứng tuyển #{application.id.toString().padStart(4, '0')}
                  </h1>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={application.status as ApplicationStatus} />
                    <span className="text-sm text-muted-foreground">
                      Ứng tuyển vào: {formatDate(application.appliedAt)}
                    </span>
                  </div>
                </div>

                {(application.status === 0) && (
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

              <Separator className="my-6" />

              {/* Project Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Thông tin chương trình
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{project?.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Mã chương trình:</span>
                        <span className="font-medium">{project?.id}</span>
                      </div>
                      {project?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Địa điểm:</span>
                          <span>{project?.location}</span>
                        </div>
                      )}
                      {(project?.startDate || project?.endDate) && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Thời gian:</span>
                          <span>
                            {project?.startDate ? formatDate(project?.startDate) : "Chưa có"} - 
                            {project?.endDate ? formatDate(project?.endDate) : "Chưa có"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Số lượng:</span>
                        <span>
                          {project?.currentVolunteers || 0}/{project?.requiredVolunteers || 0}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="mt-4">
                      <Link href={`/programs/${project?.id}`} target="_blank">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Xem chi tiết chương trình
                      </Link>
                    </Button>
                  </Card>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Volunteer Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Volunteer Profile */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin tình nguyện viên
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {account?.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Mã tình nguyện viên:</span>
                          <span className="font-medium">{account?.id}</span>
                        </div>
                        {account?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{account?.email}</span>
                          </div>
                        )}
                        {account?.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{account?.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {account?.bio && (
                    <div className="mb-6">
                      <h4 className="font-medium text-foreground mb-2">Giới thiệu bản thân</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {account?.bio}
                      </p>
                    </div>
                  )}

                  <Button variant="outline" size="sm" asChild className="mt-4">
                    <Link href={`/volunteers/${account?.id}`} target="_blank">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Xem hồ sơ đầy đủ
                    </Link>
                  </Button>
                </Card>

                {/* Relevant Experience */}
                {application.relevantExperience && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Kinh nghiệm liên quan
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {application.relevantExperience}
                    </p>
                  </Card>
                )}

                {/* Certificates */}
                {application.selectedCertificates && application.selectedCertificates.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Chứng chỉ đã đính kèm ({application.selectedCertificates.length})
                    </h2>
                    <div className="space-y-4">
                      {application.selectedCertificates.map((certificate: any, index: number) => (
                        <Card key={index} className="p-4 border">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                {certificate.certificateName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {certificate.issuingOrganization}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {certificate.categoryName}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Số chứng chỉ:</p>
                              <p className="font-medium">{certificate.certificateNumber}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ngày cấp:</p>
                              <p className="font-medium">{formatDate(certificate.issueDate)}</p>
                            </div>
                            {certificate.expiryDate && (
                              <div>
                                <p className="text-muted-foreground">Ngày hết hạn:</p>
                                <p className="font-medium">{formatDate(certificate.expiryDate)}</p>
                              </div>
                            )}
                          </div>

                          {certificate.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {certificate.description}
                            </p>
                          )}

                          {certificate.imageUrl && (
                            <div className="space-y-2">
                              <img
                                src={certificate.imageUrl}
                                alt="Certificate"
                                className="max-w-full max-h-[400px] rounded border"
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column: Review Section */}
              <div className="space-y-8">
                {/* Timeline */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Lịch sử đơn
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Nộp đơn ứng tuyển</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(application.appliedAt)}</p>
                      </div>
                    </div>

                    {application.reviewedAt && (
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          application.status === 2 ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {application.status === 2 ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {application.status === 2 ? "Đã phê duyệt" : "Đã từ chối"}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDateTime(application.reviewedAt)}</p>
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
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Phản hồi
                  </h2>
                  
                  {(application.rejectionReason || application.feedback) ? (
                    <div className="space-y-4">
                      {application.rejectionReason && (
                        <div>
                          <h3 className="font-medium text-red-600 mb-2">Lý do từ chối:</h3>
                          <p className="text-sm text-muted-foreground p-3 bg-red-50 rounded-lg">
                            {application.rejectionReason}
                          </p>
                        </div>
                      )}
                      
                      {application.feedback && (
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Phản hồi:</h3>
                          <p className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-lg">
                            {application.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {application.status === 0 ? "Chưa có phản hồi" : 
                       application.status === 1 ? "Đang chờ xét duyệt" : 
                       "Không có phản hồi"}
                    </p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}