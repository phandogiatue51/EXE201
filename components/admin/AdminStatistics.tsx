import { Card } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  FileText,
  Award,
  BarChart3,
} from "lucide-react";
import {
  mockAccounts,
  mockPrograms,
  mockRegistrations,
  mockCertificates,
} from "@/lib/mock-data";

interface AdminStatisticsProps {
  customPrograms: any[];
  customCertificates: any[];
  approvedAccounts: any[];
}

export default function AdminStatistics({
  customPrograms,
  customCertificates,
  approvedAccounts,
}: AdminStatisticsProps) {
  const allAccounts = [...mockAccounts, ...approvedAccounts];
  const totalVolunteers = allAccounts.filter(
    (a) => a.role === "volunteer"
  ).length;
  const totalOrganizations = allAccounts.filter(
    (a) => a.role === "organization"
  ).length;
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
            <div className="text-xs text-muted-foreground">{totalHours} giờ</div>
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
                    width: `${
                      totalPrograms > 0
                        ? (activePrograms / totalPrograms) * 100
                        : 0
                    }%`,
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
                    width: `${
                      totalPrograms > 0
                        ? (completedPrograms / totalPrograms) * 100
                        : 0
                    }%`,
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
                  ? (
                      (pendingRegistrations / totalRegistrations) *
                      100
                    ).toFixed(0)
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