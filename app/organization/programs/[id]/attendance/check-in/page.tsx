"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { projectAPI, applicationAPI, categoryAPI } from "@/services/api";
import {
  StatusBadge,
  APPLICATION_STATUS,
  ApplicationStatus,
} from "@/components/status-badge/ApplicationStatusBadge";
import { formatDate } from "@/lib/date";
import { ApplicationFilterDto } from "@/lib/filter-type";
import { Project, VolunteerApplication } from "@/lib/type";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import SimpleUserCard from "@/components/card/SimpleUserCard";
import CertificateForm from "@/components/form/CertificateForm";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";

export default function CheckInPage({
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
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project details
      const projectData = await projectAPI.getById(projectId);
      setProject(projectData);

      // Fetch applications for this project with status 1 (approved)
      const filter: ApplicationFilterDto = {
        projectId: projectId,
        status: APPLICATION_STATUS.APPROVED, // Only approved applications
      };
      const appsData = await applicationAPI.filter(filter);
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

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  // Filter applications based on search
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === "" ||
      app.volunteerName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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

  const formData = selectedApplication
    ? convertToFormData(selectedApplication.selectedCertificate)
    : null;

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
                Check in - {project.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý điểm danh cho chương trình
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      setSearchTerm("");
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 mt-4">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy đơn ứng tuyển đã chấp nhận
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
                      <div className="mb-2">
                        <h4 className="font-medium text-foreground line-clamp-1">
                          {app.volunteerName}
                        </h4>
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

          {/* Right Column: Certificate Form and User Card */}
          <div className="lg:col-span-2 space-y-6">
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
                <>
                  {/* Certificate Form */}
                  {selectedApplication.selectedCertificate && formData ? (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-6">
                        Chứng chỉ đã chọn
                      </h2>
                      <CertificateForm
                        formData={formData}
                        categories={categories}
                        loadingCategories={false}
                        imagePreview={
                          selectedApplication.selectedCertificate.imageUrl || ""
                        }
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

                  {/* User Card */}
                  <SimpleUserCard userId={selectedApplication.volunteerId} />
                </>
              )
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
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

