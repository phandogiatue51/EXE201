import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Info, Award } from "lucide-react";
import Link from "next/link";
import { VolunteerApplication } from "@/lib/type";

interface ProgramsListProps {
  registrations: (VolunteerApplication & {
    projectTitle: string;
    organizationName: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    projectImage?: string;
  })[];
}

export function ProgramsList({ registrations }: ProgramsListProps) {
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { text: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
      case 1: return { text: "Đã duyệt", className: "bg-[#77E5C8]/20 text-[#6085F0] border border-[#77E5C8]" };
      case 2: return { text: "Đã từ chối", className: "bg-red-100 text-red-700 border border-red-200" };
      case 3: return { text: "Đã hoàn thành", className: "bg-green-100 text-green-700 border border-green-200" };
      default: return { text: "Không xác định", className: "bg-gray-100 text-gray-700 border border-gray-200" };
    }
  };

  return (
    <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
          Chương trình của tôi
        </h2>
        <Button
          className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
          asChild
        >
          <Link href="/programs">Tìm chương trình mới</Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        {registrations.length > 0 ? (
          registrations.map((reg) => {
            const statusInfo = getStatusInfo(reg.status);
            return (
              <div
                key={reg.id}
                className="p-6 border-0 bg-gradient-to-r from-[#77E5C8]/10 to-transparent rounded-xl hover:from-[#77E5C8]/10 hover:to-[#77E5C8]/10 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {reg.projectImage && (
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={reg.projectImage} 
                        alt={reg.projectTitle}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {reg.projectTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reg.organizationName}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold px-4 py-2 rounded-full ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày bắt đầu</p>
                        <p className="text-sm font-medium">{formatDate(reg.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày kết thúc</p>
                        <p className="text-sm font-medium">{formatDate(reg.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Địa điểm</p>
                        <p className="text-sm font-medium">{reg.location || 'Online'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
                      >
                        <Link href={`/programs/${reg.projectId}`}>
                          <Info className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Link>
                      </Button>
                      
                      {reg.status === 1 && reg.selectedCertificates && reg.selectedCertificates.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-[#6085F0]" />
                          <span className="font-medium">{reg.selectedCertificates.length} chứng chỉ</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyProgramsState />
        )}
      </div>
    </Card>
  );
}

function ProgramCard({ registration }: { registration: any }) {
  return (
    <div className="p-6 border-0 bg-gradient-to-r from-[#77E5C8]/10 to-transparent rounded-xl hover:from-[#77E5C8]/10 hover:to-[#77E5C8]/10 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex-1">
          {registration.programName}
        </h3>
        <span
          className={`text-sm font-semibold px-4 py-2 rounded-full ${
            registration.status === "approved"
              ? "bg-[#77E5C8]/20 text-[#6085F0] border border-[#77E5C8]"
              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
          }`}
        >
          {registration.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        📅 Đăng ký: {registration.appliedDate}
      </p>
      {registration.hoursContributed && (
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#6085F0]" />
          <p className="text-sm font-semibold text-[#6085F0]">
            Đã đóng góp: {registration.hoursContributed} giờ
          </p>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
      >
        <Link href={`/programs/${registration.programId}`}>
          <Info className="w-4 h-4 mr-2" />
          Chi tiết
        </Link>
      </Button>
    </div>
  );
}

function EmptyProgramsState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Info className="w-8 h-8 text-[#6085F0]" />
      </div>
      <p className="text-muted-foreground text-lg">
        Bạn chưa tham gia chương trình nào
      </p>
      <Button
        className="mt-4 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
        asChild
      >
        <Link href="/programs">Khám phá chương trình</Link>
      </Button>
    </div>
  );
}