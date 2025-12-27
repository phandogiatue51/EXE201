import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  FileText,
  Award,
} from "lucide-react";
import {
  mockAccounts,
  mockPrograms,
  mockRegistrations,
  mockCertificates,
} from "@/lib/mock-data";

interface AdminOverviewProps {
  orgRegistrations: any[];
  setOrgRegistrations: (registrations: any[]) => void;
}

export default function AdminOverview({
  orgRegistrations,
  setOrgRegistrations,
}: AdminOverviewProps) {
  const [customCertificates, setCustomCertificates] = useState<any[]>([]);

  useEffect(() => {
    const certificates = JSON.parse(
      localStorage.getItem("customCertificates") || "[]",
    );
    setCustomCertificates(certificates);
  }, []);

  const volunteers = mockAccounts.filter((a) => a.role === "volunteer");
  const organizations = mockAccounts.filter((a) => a.role === "organization");
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

  return (
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
              <p className="text-muted-foreground text-sm mb-1">Tổ chức</p>
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
              <p className="text-muted-foreground text-sm mb-1">Chương trình</p>
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
              <p className="text-muted-foreground text-sm mb-1">Chứng chỉ</p>
              <p className="text-3xl font-bold text-foreground">
                {[...mockCertificates, ...customCertificates].length}
              </p>
            </div>
            <Award className="w-12 h-12 text-[#6085F0]" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Organization Registrations */}
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
                      onClick={() => handleApproveOrgRegistration(reg.id)}
                    >
                      Duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectOrgRegistration(reg.id)}
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
            {[...mockCertificates, ...customCertificates]
              .slice(-5)
              .map((cert) => (
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
                  <p className="font-semibold text-foreground">{vol.name}</p>
                  <p className="text-sm text-muted-foreground">{vol.email}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/volunteers/${vol.id}`}>Chi tiết</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Organizations List */}
        <Card className="p-8 border-[#77E5C8]">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tổ chức</h2>
          <div className="space-y-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-blue-50 transition"
              >
                <div>
                  <p className="font-semibold text-foreground">{org.name}</p>
                  <p className="text-sm text-muted-foreground">{org.email}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/organizations/${org.id}`}>Chi tiết</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}