import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, X } from "lucide-react";
import { organizationAPI } from "@/services/api";
import { useState, useEffect } from "react";
import { Organization } from "@/lib/type";
import { useToast } from "@/hooks/use-toast";

export default function PendingApprovals() {
  const [pendingItems, setPendingItems] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPendingOrganizations = async () => {
      try {
        setLoading(true);
        const organizations = await organizationAPI.getAll();

        if (organizations && Array.isArray(organizations)) {
          const pending = organizations.filter((org: Organization) => org.status === 0);
          setPendingItems(pending.slice(0, 3));
        } else {
          setPendingItems([]);
        }
      } catch (error) {
        console.error("Error loading pending organizations:", error);
        setPendingItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadPendingOrganizations();
  }, []);

  const handleApprove = async (orgId: number) => {
    try {
      const response = await organizationAPI.verify(orgId, { status: 1 });
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      const organizations = await organizationAPI.getAll();
      if (organizations && Array.isArray(organizations)) {
        const pending = organizations.filter((org: Organization) => org.status === 0);
        setPendingItems(pending.slice(0, 3));
      }
    } catch (error: any) {
      console.error("Error approving organization:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleReject = async (orgId: number) => {
    try {
      const response = await organizationAPI.verify(orgId, { status: 2 });
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      const organizations = await organizationAPI.getAll();
      if (organizations && Array.isArray(organizations)) {
        const pending = organizations.filter((org: Organization) => org.status === 0);
        setPendingItems(pending.slice(0, 3));
      }
    } catch (error: any) {
      console.error("Error rejecting organization:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Chờ duyệt</h3>
        </div>
        <p className="text-gray-500 text-center py-4">Đang tải...</p>
      </Card>
    );
  }

  if (pendingItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Chờ duyệt</h3>
        </div>
        <p className="text-gray-500 text-center py-4">Không có yêu cầu chờ duyệt</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Chờ duyệt ({pendingItems.length})</h3>
      </div>
      <div className="space-y-4">
        {pendingItems.map((item) => (
          <div key={item.id} className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.email || 'Chưa có email'}</p>
              </div>
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                Chờ duyệt
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleApprove(item.id)}
              >
                <Check className="h-3 w-3 mr-1" />
                Duyệt
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => handleReject(item.id)}
              >
                <X className="h-3 w-3 mr-1" />
                Từ chối
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}