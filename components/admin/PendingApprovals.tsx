import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PendingApprovals() {
  const [pendingItems, setPendingItems] = useState<any[]>([]);

  useEffect(() => {
    // Load pending items from localStorage
    const orgRegistrations = JSON.parse(localStorage.getItem("orgRegistrations") || "[]");
    const pending = orgRegistrations.filter((r: any) => r.status === "pending");
    setPendingItems(pending.slice(0, 3));
  }, []);

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
                <p className="font-medium text-gray-900">{item.organizationName}</p>
                <p className="text-sm text-gray-500">{item.email}</p>
              </div>
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                Chờ duyệt
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Duyệt
              </Button>
              <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
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