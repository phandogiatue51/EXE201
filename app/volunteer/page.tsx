"use client";

import { useState, useEffect, } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { StatsCards } from "../../components/volunteer/stats-cards";
import { ProgramsList } from "../../components/list/programs-list";
import { CertificatesList } from "../../components/list/certificates-list";
import { ProfileSidebar } from "../../components/volunteer/profile-sidebar";
import { accountAPI, certificateAPI, applicationAPI, projectAPI } from "@/services/api";
import { VolunteerApplication, Certificate, Account, Project } from "../../lib/type"
import { useToast } from "@/hooks/use-toast";

export default function VolunteerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [registrations, setRegistrations] = useState<VolunteerApplication[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [volunteerProfile, setVolunteerProfile] = useState<Account | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.accountId) {
      fetchDashboardData();
    }
  }, [user?.accountId]);

  const fetchDashboardData = async () => {
    if (!user?.accountId) return;

    setIsLoading(true);
    try {
      const [profileData, certificatesData, applicationsData] = await Promise.all([
        accountAPI.getById(user.accountId),
        certificateAPI.getByAccountId(user.accountId),
        applicationAPI.filter({ volunteerId: user.accountId }),
      ]);

      setVolunteerProfile(profileData);
      setCertificates(certificatesData || []);
      setRegistrations(applicationsData || []);

      if (applicationsData?.length > 0) {
        const projectIds = [...new Set(applicationsData.map(app => app.projectId))];
        const projectPromises = projectIds.map(id => projectAPI.getById(id));
        const projectResults = await Promise.all(projectPromises);
        setProjects(projectResults);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const enrichedRegistrations = registrations.map(registration => {
    const project = projects.find(p => p.id === registration.projectId);
    return {
      ...registration,
      projectTitle: project?.title || registration.projectTitle,
      organizationName: project?.organizationName || registration.organizationName,
      startDate: project?.startDate,
      endDate: project?.endDate,
      location: project?.location,
      projectImage: project?.imageUrl,
    };
  });

  const handleView = (id: string | number) => { router.push(`/volunteer/certificates/${id}`); };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chứng chỉ này?")) return;

    try {
      const response = await certificateAPI.delete(id);
      setCertificates(prev => prev.filter(cert => cert.id !== id));
      toast({
        description: response,
        variant: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#77E5C8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-4">
          Chào mừng, {volunteerProfile?.name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Quản lý các chương trình tình nguyện của bạn và theo dõi tiến độ
        </p>
      </div>

      {/* Stats Section */}
      <StatsCards
        registrations={enrichedRegistrations}
        certificates={certificates}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <ProgramsList registrations={enrichedRegistrations} />

          <CertificatesList
            certificates={certificates}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>

        <div className="lg:col-span-1">
          <ProfileSidebar user={volunteerProfile} />
        </div>
      </div>
    </>
  );
}