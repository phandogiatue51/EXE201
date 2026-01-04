"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, User, Building, FileText, X } from "lucide-react";
import { useState } from "react";

interface ApplicationFilterProps {
  organizationId: number | "all";
  projectId: number | "all";
  volunteerId: number | "all";
  statusFilter: number | "all";
  setStatusFilter: (value: number | "all") => void;
  filteredCount: number;
  onReset?: () => void; 
  uniqueStatuses: number[];
  applications: any[];
}

export function ApplicationFilter({
  statusFilter,
  setStatusFilter,
  organizationId,
  projectId,
  volunteerId,
  filteredCount,
  onReset,
  uniqueStatuses,
  applications,
}: ApplicationFilterProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <Card className="p-6 mb-8">
      <div className="space-y-6">
        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Status Filter */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as number | "all")}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">Tất cả trạng thái</option>
                {uniqueStatuses.map(status => {
                  const application = applications.find(app => app.status === status);
                  return (
                    <option key={status} value={status}>
                      {application?.statusName || `Trạng thái ${status}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Counter & Actions */}
          <div className="md:col-span-6 flex items-center justify-end gap-3">
            <span className="text-muted-foreground whitespace-nowrap">
              {filteredCount} đơn ứng tuyển
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              {isAdvancedOpen ? "Ẩn tìm kiếm nâng cao" : "Tìm kiếm nâng cao"}
            </Button>
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Đặt lại
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters (for future expansion) */}
        {isAdvancedOpen && (
          <div className="border-t pt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Tính năng tìm kiếm nâng cao sẽ được cập nhật trong phiên bản tiếp theo.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}