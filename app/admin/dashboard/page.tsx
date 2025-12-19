"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  mockAccounts,
  mockPrograms,
  mockRegistrations,
  mockCertificates,
  mockOrganizationRegistrations,
} from "@/lib/mock-data";
import {
  Users,
  Briefcase,
  FileText,
  Award,
  LogOut,
  BarChart3,
  Tag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

type TabType = "overview" | "statistics" | "tags";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [orgRegistrations, setOrgRegistrations] = useState(
    mockOrganizationRegistrations,
  );
  const [customPrograms, setCustomPrograms] = useState<any[]>([]);
  const [customCertificates, setCustomCertificates] = useState<any[]>([]);
  const [approvedAccounts, setApprovedAccounts] = useState<any[]>([]);

  // Tags management state
  const defaultTags = [
    "Giáo dục AI",
    "Lập trình",
    "Dự án AI",
    "Robotics & AI",
    "Machine Learning",
  ];
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Load organization registrations
    const stored = localStorage.getItem("orgRegistrations");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrgRegistrations([
        ...mockOrganizationRegistrations,
        ...parsed.filter((r: any) => r.status === "pending"),
      ]);
    }


    // Load custom data for statistics
    const programs = JSON.parse(localStorage.getItem("customPrograms") || "[]");
    const certificates = JSON.parse(
      localStorage.getItem("customCertificates") || "[]",
    );
    setCustomPrograms(programs);
    setCustomCertificates(certificates);

    // Load approved accounts (volunteers + organizations approved by admin or auto)
    const approved = JSON.parse(
      localStorage.getItem("approvedAccounts") || "[]",
    );
    setApprovedAccounts(Array.isArray(approved) ? approved : []);

    // Load tags - if not exists, initialize with default
    const tagsStored = localStorage.getItem("adminTags");
    if (tagsStored) {
      try {
        const parsedTags = JSON.parse(tagsStored);
        if (Array.isArray(parsedTags) && parsedTags.length > 0) {
          setTags(parsedTags);
        } else {
          // If empty or invalid, set to default and save
          localStorage.setItem("adminTags", JSON.stringify(defaultTags));
          setTags(defaultTags);
        }
      } catch (e) {
        // If parse error, reset to default
        localStorage.setItem("adminTags", JSON.stringify(defaultTags));
        setTags(defaultTags);
      }
    } else {
      // First time - save default tags
      localStorage.setItem("adminTags", JSON.stringify(defaultTags));
    }
  }, []);

  const volunteers = mockAccounts.filter((a) => a.role === "volunteer");
  const organizations = mockAccounts.filter((a) => a.role === "organization");
  const pendingRegistrations = mockRegistrations.filter(
    (r) => r.status === "pending",
  );
  const pendingOrgRegistrations = orgRegistrations.filter(
    (r) => r.status === "pending",
  );


  const handleApproveOrgRegistration = (id: string) => {
    const updated = orgRegistrations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "approved",
            approvedDate: new Date().toISOString().split("T")[0],
          }
        : r,
    );
    setOrgRegistrations(updated);
    const stored = localStorage.getItem("orgRegistrations");
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated_stored = parsed.map((r: any) =>
        r.id === id
          ? {
              ...r,
              status: "approved",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      );
      localStorage.setItem("orgRegistrations", JSON.stringify(updated_stored));
    }
  };

  const handleRejectOrgRegistration = (id: string) => {
    const updated = orgRegistrations.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r,
    );
    setOrgRegistrations(updated);
    const stored = localStorage.getItem("orgRegistrations");
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated_stored = parsed.map((r: any) =>
        r.id === id ? { ...r, status: "rejected" } : r,
      );
      localStorage.setItem("orgRegistrations", JSON.stringify(updated_stored));
    }
  };

  // Tag management handlers
  const handleAddTag = () => {
    console.log("handleAddTag called, newTag:", newTag);
    console.log("Current tags:", tags);

    if (!newTag.trim()) {
      alert("Vui lòng nhập tên tag");
      return;
    }

    if (tags.includes(newTag.trim())) {
      alert("Tag này đã tồn tại");
      return;
    }

    const updatedTags = [...tags, newTag.trim()];
    console.log("Updated tags:", updatedTags);
    setTags(updatedTags);
    localStorage.setItem("adminTags", JSON.stringify(updatedTags));
    console.log("Saved to localStorage:", localStorage.getItem("adminTags"));
    setNewTag("");
    alert(`Đã thêm tag "${newTag.trim()}" thành công!`);
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      alert("Tên tag không được để trống");
      return;
    }

    if (editValue.trim() !== editingTag && tags.includes(editValue.trim())) {
      alert("Tag này đã tồn tại");
      return;
    }

    const updatedTags = tags.map((tag) =>
      tag === editingTag ? editValue.trim() : tag,
    );
    setTags(updatedTags);
    localStorage.setItem("adminTags", JSON.stringify(updatedTags));
    setEditingTag(null);
    setEditValue("");
    alert("Đã cập nhật tag thành công!");
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditValue("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (confirm(`Bạn có chắc muốn xóa tag "${tagToDelete}"?`)) {
      const updatedTags = tags.filter((tag) => tag !== tagToDelete);
      setTags(updatedTags);
      localStorage.setItem("adminTags", JSON.stringify(updatedTags));
      alert(`Đã xóa tag "${tagToDelete}" thành công!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bảng điều khiển Admin
            </h1>
              <p className="text-muted-foreground">Quản lý nền tảng Together</p>
            </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "overview"
                  ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("statistics")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "statistics"
                  ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Thống kê
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "tags"
                  ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Quản lý Tags
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Tình nguyện viên
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {volunteers.length}
                      </p>
                </div>
                    <Users className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
                <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Tổ chức
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {organizations.length}
                      </p>
                </div>
                    <Briefcase className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
                <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Chương trình
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {mockPrograms.length}
                      </p>
                </div>
                    <FileText className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
                <Card className="p-6 border-[#77E5C8] bg-[#77E5C8]/10">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Chứng chỉ
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {([...mockCertificates, ...customCertificates]).length}
                      </p>
                </div>
                    <Award className="w-12 h-12 text-[#6085F0]" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 border-[#77E5C8]">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Đơn đăng ký tổ chức chờ duyệt
                  </h2>
              <div className="space-y-4">
                {pendingOrgRegistrations.length > 0 ? (
                  pendingOrgRegistrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-4 border border-border rounded-lg bg-yellow-50"
                        >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                              <h3 className="font-semibold text-foreground">
                                {reg.organizationName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {reg.email}
                              </p>
                        </div>
                        <span className="text-xs font-semibold text-yellow-600 bg-white px-3 py-1 rounded-full">
                          Chờ duyệt
                        </span>
                      </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Điện thoại: {reg.phone}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Đăng ký: {reg.appliedDate}
                          </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                              className="bg-[#6085F0] hover:opacity-90"
                              onClick={() =>
                                handleApproveOrgRegistration(reg.id)
                              }
                        >
                          Duyệt
                        </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRejectOrgRegistration(reg.id)
                              }
                            >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                      <p className="text-muted-foreground">
                        Không có đơn đăng ký tổ chức chờ duyệt
                      </p>
                )}
              </div>
            </Card>

            {/* Recent Certificates */}
                <Card className="p-8 border-[#77E5C8]">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Chứng chỉ gần đây
                  </h2>
              <div className="space-y-4">
                {([...mockCertificates, ...customCertificates]
                  .slice(-5)
                  ).map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 border border-border rounded-lg"
                      >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                            <h3 className="font-semibold text-foreground">
                              {cert.volunteerName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {cert.programName}
                            </p>
                      </div>
                          <span className="text-xs font-semibold text-[#6085F0] bg-[#77E5C8]/10 px-3 py-1 rounded-full">
                        {cert.hoursContributed}h
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Số: {cert.certificateNumber} - Cấp: {cert.issuedDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Volunteers List */}
                <Card className="p-8 border-[#77E5C8]">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Tình nguyện viên
                  </h2>
              <div className="space-y-3">
                {volunteers.map((vol) => (
                      <div
                        key={vol.id}
                        className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-[#77E5C8]/10 transition"
                      >
                    <div>
                          <p className="font-semibold text-foreground">
                            {vol.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vol.email}
                          </p>
                    </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/volunteers/${vol.id}`}>
                      Chi tiết
                          </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Organizations List */}
                <Card className="p-8 border-[#77E5C8]">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Tổ chức
                  </h2>
              <div className="space-y-3">
                {organizations.map((org) => (
                      <div
                        key={org.id}
                        className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-blue-50 transition"
                      >
                    <div>
                          <p className="font-semibold text-foreground">
                            {org.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {org.email}
                          </p>
                    </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/organizations/${org.id}`}>
                      Chi tiết
                          </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
            </>
          )}

          {/* Statistics Tab */}
          {activeTab === "statistics" && (
            <StatisticsContent
              customPrograms={customPrograms}
              customCertificates={customCertificates}
              approvedAccounts={approvedAccounts}
            />
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div className="max-w-4xl">
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Quản lý Tags chương trình
                </h2>

                {/* Add New Tag */}
                <div className="mb-8">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nhập tag mới..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTag} className="gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm Tag
                    </Button>
                  </div>
                </div>

                {/* Tags List */}
                <div className="space-y-3">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="p-4 border border-[#77E5C8] rounded-lg bg-[#77E5C8]/5 flex items-center justify-between"
                    >
                      {editingTag === tag ? (
                        <>
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSaveEdit()
                            }
                            className="flex-1 mr-3"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="gradient-primary"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Tag className="w-5 h-5 text-[#6085F0]" />
                            <span className="font-semibold text-foreground text-lg">
                              {tag}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTag(tag)}
                              className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTag(tag)}
                              className="border-red-200 hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {tags.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có tag nào. Thêm tag đầu tiên!
                  </p>
                )}
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Statistics Component
function StatisticsContent({
  customPrograms,
  customCertificates,
  approvedAccounts,
}: {
  customPrograms: any[];
  customCertificates: any[];
  approvedAccounts: any[];
}) {
  const allAccounts = [...mockAccounts, ...approvedAccounts];
  const totalVolunteers = allAccounts.filter((a) => a.role === "volunteer").length;
  const totalOrganizations = allAccounts.filter((a) => a.role === "organization").length;
  const allPrograms = [...mockPrograms, ...customPrograms];
  const totalPrograms = allPrograms.length;
  const activePrograms = allPrograms.filter(
    (p) => p.status === "active",
  ).length;
  const completedPrograms = allPrograms.filter(
    (p) => p.status === "completed",
  ).length;

  const allCertificates = [...mockCertificates, ...customCertificates];
  const totalCertificates = allCertificates.length;
  const totalHours = allCertificates.reduce(
    (sum, c) => sum + (c.hoursContributed || 0),
    0,
  );

  const totalRegistrations = mockRegistrations.length;
  const approvedRegistrations = mockRegistrations.filter(
    (r) => r.status === "approved",
  ).length;
  const pendingRegistrations = mockRegistrations.filter(
    (r) => r.status === "pending",
  ).length;

  // Programs by category
  const programsByCategory: { [key: string]: number } = {};
  allPrograms.forEach((p) => {
    programsByCategory[p.category] = (programsByCategory[p.category] || 0) + 1;
  });

  // Top organizations
  const organizationStats: {
    [key: string]: { name: string; programs: number; volunteers: number };
  } = {};
  allPrograms.forEach((p) => {
    if (!organizationStats[p.organizationId]) {
      organizationStats[p.organizationId] = {
        name: p.organizationName,
        programs: 0,
        volunteers: 0,
      };
    }
    organizationStats[p.organizationId].programs++;
    organizationStats[p.organizationId].volunteers += p.volunteersJoined || 0;
  });

  const topOrganizations = Object.entries(organizationStats)
    .sort(([, a], [, b]) => b.programs - a.programs)
    .slice(0, 5);

  return (
    <div>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-[#6085F0]" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {totalVolunteers}
          </p>
          <p className="text-sm text-muted-foreground">Tình nguyện viên</p>
        </Card>

        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-10 h-10 text-[#6085F0]" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {totalOrganizations}
          </p>
          <p className="text-sm text-muted-foreground">Tổ chức</p>
        </Card>

        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-10 h-10 text-[#6085F0]" />
            <div className="text-xs text-muted-foreground">
              {activePrograms} đang diễn ra
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {totalPrograms}
          </p>
          <p className="text-sm text-muted-foreground">Tổng chương trình</p>
        </Card>

        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-[#6085F0]" />
            <div className="text-xs text-muted-foreground">
              {totalHours} giờ
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {totalCertificates}
          </p>
          <p className="text-sm text-muted-foreground">Chứng chỉ đã cấp</p>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Programs by Status */}
        <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#6085F0]" />
            Chương trình theo trạng thái
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Đang hoạt động
                </span>
                <span className="text-sm font-semibold text-[#6085F0]">
                  {activePrograms}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary"
                  style={{
                    width: `${totalPrograms > 0 ? (activePrograms / totalPrograms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Đã hoàn thành
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {completedPrograms}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${totalPrograms > 0 ? (completedPrograms / totalPrograms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Registration Status */}
        <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Đăng ký chương trình
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600">
                  {approvedRegistrations}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {totalRegistrations > 0
                  ? (
                      (approvedRegistrations / totalRegistrations) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingRegistrations}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {totalRegistrations > 0
                  ? ((pendingRegistrations / totalRegistrations) * 100).toFixed(
                      0,
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Programs by Category */}
      <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Chương trình theo danh mục
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(programsByCategory).map(([category, count]) => (
            <div
              key={category}
              className="p-4 bg-[#77E5C8]/10 rounded-lg text-center"
            >
              <p className="text-2xl font-bold text-[#6085F0] mb-1">{count}</p>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Organizations */}
      <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Top 5 tổ chức tích cực
        </h2>
        <div className="space-y-4">
          {topOrganizations.length > 0 ? (
            topOrganizations.map(([id, stats], index) => (
              <div
                key={id}
                className="flex items-center gap-4 p-4 bg-[#77E5C8]/10 rounded-lg"
              >
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{stats.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.programs} chương trình · {stats.volunteers} tình
                    nguyện viên
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Chưa có dữ liệu
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
