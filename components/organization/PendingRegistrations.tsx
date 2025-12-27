import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Registration {
  id: string;
  volunteerName: string;
  programName: string;
  appliedDate: string;
}

interface PendingRegistrationsProps {
  registrations: Registration[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingRegistrations({
  registrations,
  onApprove,
  onReject,
}: PendingRegistrationsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Đơn đăng ký chờ duyệt</h3>
        <Link href="#" className="text-sm text-[#6085F0] hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="space-y-4">
        {registrations.length > 0 ? (
          registrations.map((reg) => (
            <div
              key={reg.id}
              className="p-4 border border-gray-200 rounded-lg bg-yellow-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {reg.volunteerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {reg.programName}
                  </p>
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-white px-3 py-1 rounded-full">
                  Chờ duyệt
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Đăng ký: {reg.appliedDate}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#6085F0] hover:opacity-90"
                  onClick={() => onApprove(reg.id)}
                >
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(reg.id)}
                >
                  Từ chối
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            Không có đơn đăng ký chờ duyệt
          </p>
        )}
      </div>
    </Card>
  );
}