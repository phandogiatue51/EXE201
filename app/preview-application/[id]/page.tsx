"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, applicationAPI } from "@/services/api";
import {
  StatusBadge,
  ApplicationStatus,
  APPLICATION_STATUS,
} from "@/components/status-badge/ApplicationStatusBadge";
import { formatDate } from "@/lib/date";
import { ApplicationDetailView } from "@/components/form/ApplicationForm";
import {
  ArrowLeft,
  Eye,
  Calendar,
  FileText,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { Project, VolunteerApplication } from "@/lib/type";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export default function ProjectApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = parseInt(id);

  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<VolunteerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusLabels: Record<number, string> = {
    [APPLICATION_STATUS.PENDING]: "Chờ xử lý",
    [APPLICATION_STATUS.APPROVED]: "Đã chấp nhận",
    [APPLICATION_STATUS.REJECTED]: "Đã từ chối",
    [APPLICATION_STATUS.WITHDRAWN]: "Đã rút đơn",
    [APPLICATION_STATUS.COMPLETED]: "Đã hoàn thành",
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project details
      const projectData = await projectAPI.getById(projectId);
      setProject(projectData);

      // Fetch all applications for this project
      const appsData = await applicationAPI.filter({ projectId });
      setApplications(appsData || []);

      // Select first application if exists
      if (appsData && appsData.length > 0) {
        setSelectedApplication(appsData[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Handle application selection
  const handleSelectApplication = async (application: VolunteerApplication) => {
    setSelectedApplication(application);
    setLoadingDetails(true);

    try {
      // Refresh the selected application to get latest data
      const freshData = await applicationAPI.getById(application.id);
      setSelectedApplication(freshData);
    } catch (error) {
      console.error("Error refreshing application:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter applications based on status and search
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    // const matchesSearch = searchTerm === "" ||
    //   app.volunteerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   app.volunteerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   app.relevantExperience?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus;
  });

  // Get unique statuses for filter
  const uniqueStatuses = [...new Set(applications.map((app) => app.status))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingState message="Đang tải dữ liệu..." />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            message={error || "Không tìm thấy chương trình"}
            onRetry={fetchData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/organization/programs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách chương trình
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {project.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý đơn ứng tuyển cho chương trình
              </p>
            </div>
          </div>
        </div>

        <Card className="mt-8 p-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Tổng quan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {applications.length}
              </div>
              <p className="text-sm text-muted-foreground">Tổng số đơn</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter((a) => a.status === 1).length}
              </div>
              <p className="text-sm text-muted-foreground">Đã phê duyệt</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter((a) => a.status === 0).length}
              </div>
              <p className="text-sm text-muted-foreground">Chờ xử lý</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter((a) => a.status === 2).length}
              </div>
              <p className="text-sm text-muted-foreground">Đã từ chối</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              {/* Filters */}
              <div className="space-y-4">
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm tình nguyện viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value === "all"
                            ? "all"
                            : Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {filteredApplications.length} đơn
                  </span>
                  <Button
                    className="border border-black"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all");
                      setSearchTerm("");
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy đơn ứng tuyển
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((app) => (
                    <Card
                      key={app.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedApplication?.id === app.id
                          ? "border-blue-500 bg-blue-50"
                          : "border"
                      }`}
                      onClick={() => handleSelectApplication(app)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-foreground line-clamp-1">
                            {app.volunteerName}
                          </h4>
                        </div>
                        <StatusBadge status={app.status as ApplicationStatus} />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDate(app.appliedAt)}
                          </span>
                        </div>

                        {app.relevantExperience && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {app.relevantExperience}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Application Details */}
          <div className="lg:col-span-3">
            {selectedApplication ? (
              loadingDetails ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Đang tải chi tiết...
                    </p>
                  </div>
                </div>
              ) : (
                <ApplicationDetailView
                  applicationId={selectedApplication.id}
                  showBackButton={false}
                  backButtonText="Quay lại danh sách"
                  backButtonHref={`/organization/programs/${projectId}/applications`}
                />
              )
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Chọn một đơn ứng tuyển
                </h3>
                <p className="text-muted-foreground">
                  Nhấn vào đơn ứng tuyển từ danh sách bên trái để xem chi tiết
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
