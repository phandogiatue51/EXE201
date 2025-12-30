import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CertificatesListProps {
  certificates: any[];
}

export function CertificatesList({ certificates }: CertificatesListProps) {
  return (
    <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-8">
        Chứng chỉ
      </h2>
      <div className="space-y-4">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Bạn chưa nhận được chứng chỉ nào
          </p>
        )}
      </div>
    </Card>
  );
}

function CertificateCard({ certificate }: { certificate: any }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-[#77E5C8]/10 to-transparent">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            {certificate.programName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Số chứng chỉ: {certificate.certificateNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            Cấp ngày: {certificate.issuedDate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#6085F0]">
            {certificate.hoursContributed} giờ
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2 bg-transparent"
            onClick={() => window.open(certificate.downloadUrl, '_blank')}
          >
            Tải xuống
          </Button>
        </div>
      </div>
    </div>
  );
}