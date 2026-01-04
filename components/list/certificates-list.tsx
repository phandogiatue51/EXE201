"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Trash2, Info } from "lucide-react";

interface CertificatesListProps {
  certificates: any[];
  onView?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onApprove?: (id: string | number) => void;
}

export function CertificatesList({
  certificates,
  onView,
  onDelete,
}: CertificatesListProps) {
  return (
    <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
          Chứng chỉ
        </h2>
        <Button
          className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
          asChild
        >
          <Link href="/volunteer/certificates/new">Thêm chứng chỉ</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={() => onView?.(cert.id)}
              onDelete={() => onDelete?.(cert.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-[#6085F0]" />
            </div>
            <p className="text-muted-foreground text-lg">
              Bạn chưa thêm chứng chỉ vào tài khoản
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC]"
              asChild
            >
              <Link href="/volunteer/certificates/new">Thêm chứng chỉ</Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface CertificateCardProps {
  certificate: any;
  onView?: () => void;
  onDelete?: () => void;
}

function CertificateCard({
  certificate,
  onView,
  onDelete,
}: CertificateCardProps) {
  return (
    <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-[#77E5C8]/10 to-transparent hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            {certificate.certificateName}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {certificate.certificateNumber && (
              <p className="text-muted-foreground">
                Số:{" "}
                <span className="text-foreground">
                  {certificate.certificateNumber}
                </span>
              </p>
            )}
            {certificate.issueDate && (
              <p className="text-muted-foreground">
                Ngày cấp:{" "}
                <span className="text-foreground">
                  {new Date(certificate.issueDate).toLocaleDateString("vi-VN")}
                </span>
              </p>
            )}
            {certificate.issuingOrganization && (
              <p className="text-muted-foreground">
                Cấp bởi Tổ chức:{" "}
                <span className="text-foreground">
                  {certificate.issuingOrganization}
                </span>
              </p>
            )}
            {certificate.issueDate && (
              <p className="text-muted-foreground">
                Ngày hết hạn:{" "}
                <span className="text-foreground">
                  {new Date(certificate.expiryDate).toLocaleDateString("vi-VN")}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
              title="Xóa chứng chỉ"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
