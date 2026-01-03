"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { applicationAPI } from "../../../services/api";
import { ApplicationFilter } from "../../../components/organization/ApplicationFilter";
import { ApplicationFilterDto } from "../../../lib/filter-type";
import {
  StatusBadge,
  ApplicationStatus,
} from "../../../components/organization/ApplicationStatusBadge";
import { formatDate, formatDateTime } from "@/lib/date";
import { Eye, Calendar, User, FileText, Building2 } from "lucide-react";
import { VolunteerApplication } from "../../../lib/type";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [uniqueStatuses, setUniqueStatuses] = useState<number[]>([]);
  const [projectInfo, setProjectInfo] = useState<Record<number, any>>({});

  // Fetch applications with filters
  const fetchApplications = useCallback(async () => {
    try {
      if (!organizationId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const orgIdNumber = parseInt(organizationId || "0");

      const filter: ApplicationFilterDto = {
        organizationId: orgIdNumber,
        projectId: undefined,
        volunteerId: undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      console.log("Fetching applications with filter:", filter);

      const data: VolunteerApplication[] = await applicationAPI.filter(filter);
      setApplications(data || []);

      if (data && data.length > 0) {
        const statuses = [...new Set(data.map((app) => app.status))];
        setUniqueStatuses(statuses);
      } else {
        setUniqueStatuses([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      setUniqueStatuses([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId, statusFilter]);

  useEffect(() => {
    if (organizationId) {
      fetchApplications();
    }
  }, [organizationId, statusFilter, fetchApplications]);

  const filteredCount = applications.length;

  const handleResetFilters = () => {
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quản lý đơn ứng tuyển
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý tất cả đơn ứng tuyển vào chương trình của tổ chức
              </p>
            </div>
          </div>

          <ApplicationFilter
            organizationId={organizationId ? parseInt(organizationId) : "all"}
            projectId="all"
            volunteerId="all"
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredCount}
            onReset={handleResetFilters}
            uniqueStatuses={uniqueStatuses}
            applications={applications}
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-muted-foreground ml-3">
                Đang tải đơn ứng tuyển...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((application) => (
                <Card
                  key={application.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <StatusBadge
                        status={application.status as ApplicationStatus}
                      />

                      <span className="text-xs text-muted-foreground">
                        #{application.id.toString().padStart(4, "0")}
                      </span>
                    </div>

                    {/* Project Info */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                        {application.projectTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>Dự án ID: {application.projectId}</span>
                      </div>
                    </div>

                    {/* Volunteer Info */}
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {application.volunteerName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Tình nguyện viên ID: {application.volunteerId}
                          </p>
                        </div>
                      </div>

                      {application.relevantExperience && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Kinh nghiệm liên quan:
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.relevantExperience}
                          </p>
                        </div>
                      )}

                      {application.selectedCertificates &&
                        application.selectedCertificates.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              Chứng chỉ (
                              {application.selectedCertificates.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {application.selectedCertificates
                                .slice(0, 2)
                                .map((cert, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                    title={`${cert.certificateName} - ${cert.issuingOrganization}`}
                                  >
                                    {cert.certificateName}
                                  </span>
                                ))}
                              {application.selectedCertificates.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{application.selectedCertificates.length - 2}{" "}
                                  khác
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Dates and Info */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Ngày ứng tuyển
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(application.appliedAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(application.appliedAt)}
                          </p>
                        </div>
                      </div>

                      {application.reviewedAt && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Ngày xem xét
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(application.reviewedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Feedback/Rejection Reason (if exists) */}
                    {(application.feedback || application.rejectionReason) && (
                      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {application.rejectionReason
                            ? "Lý do từ chối"
                            : "Phản hồi"}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {application.rejectionReason || application.feedback}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link
                          href={`/organization/applications/${application.id}`}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Xem chi tiết
                        </Link>
                      </Button>

                      {application.status === 0 && (
                        <Button variant="default" size="sm" className="flex-1">
                          Xét duyệt
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && applications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {statusFilter !== "all"
                  ? "Không tìm thấy đơn ứng tuyển với trạng thái này"
                  : "Chưa có đơn ứng tuyển"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc trạng thái hoặc quay lại 'Tất cả trạng thái'"
                  : "Các tình nguyện viên sẽ xuất hiện ở đây khi họ ứng tuyển vào chương trình của bạn"}
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                Đặt lại bộ lọc
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
