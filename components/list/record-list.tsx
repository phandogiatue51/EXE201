"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hourAPI } from "@/services/api";
import { formatDateTime } from "@/lib/date";
import SimpleUserCard from "@/components/card/SimpleUserCard";
import {
  Clock,
  Calendar,
  User,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function ProjectRecordList({
  projectId,
  projectTitle,
  showHeader = true,
  compact = false,
}: ProjectRecordListProps) {
  const [records, setRecords] = useState<ViewRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await hourAPI.getByProjectId(projectId);
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRecords();
    }
  }, [projectId]);

  const filteredRecords = records.filter((record) => {
    if (dateFilter) {
      const recordDate = record.checkIn
        ? new Date(record.checkIn).toISOString().split("T")[0]
        : "";
      if (recordDate !== dateFilter) return false;
    }

    if (statusFilter === "checked-in" && record.checkOut) return false;
    if (statusFilter === "checked-out" && !record.checkOut) return false;

    return true;
  });

  const totalHours = filteredRecords.reduce(
    (sum, record) => sum + record.hours,
    0
  );
  const checkedInCount = filteredRecords.filter((r) => !r.checkOut).length;
  const checkedOutCount = filteredRecords.filter((r) => r.checkOut).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-muted-foreground">Đang tải lịch sử điểm danh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Lịch sử điểm danh
            </h1>
            {projectTitle && (
              <p className="text-muted-foreground mt-1">
                Dự án: {projectTitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecords}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Tổng giờ tình nguyện
              </p>
              <p className="text-2xl font-bold">{totalHours.toFixed(2)} giờ</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã điểm danh</p>
              <p className="text-2xl font-bold">{checkedInCount} người</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
              <p className="text-2xl font-bold">{checkedOutCount} người</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm theo tên tình nguyện viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="checked-in">Đã checkin</SelectItem>
                <SelectItem value="checked-out">Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setDateFilter("");
                setStatusFilter("all");
                setSearchTerm("");
              }}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card className="p-8 text-center">
          <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Không có bản ghi điểm danh
          </h3>
          <p className="text-muted-foreground">
            {records.length === 0
              ? "Chưa có ai điểm danh cho dự án này"
              : "Không tìm thấy bản ghi phù hợp với bộ lọc"}
          </p>
        </Card>
      ) : compact ? (
        // Compact View
        <div className="space-y-2">
          {filteredRecords.map((record) => (
            <Card key={record.recordId} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {record.volunteer?.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.checkIn
                          ? formatDateTime(record.checkIn)
                          : "Chưa check-in"}
                      </span>
                      {record.checkOut && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(record.checkOut)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    {record.hours.toFixed(2)}h
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      record.checkOut
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.checkOut ? "Đã hoàn thành" : "Đã checkin"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.recordId} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tình nguyện viên
                  </p>
                  {record.volunteer ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={record.volunteer.profileImageUrl}
                          alt={record.volunteer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">
                            {record.volunteer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.volunteer.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.volunteer.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No volunteer info available
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Thời gian
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.checkIn ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="font-medium">Check-in: </span>
                      <span>
                        {record.checkIn
                          ? formatDateTime(record.checkIn)
                          : "Chưa check-in"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.checkOut ? "bg-red-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="font-medium">Check-out: </span>
                      <span>
                        {record.checkOut
                          ? formatDateTime(record.checkOut)
                          : "Chưa check-out"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tổng kết</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tổng giờ:</span>
                      <span className="text-xl font-bold">
                        {record.hours.toFixed(2)}h
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                        record.checkOut
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.checkOut ? "✅ Đã hoàn thành" : "⏳ Đã checkin"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredRecords.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredRecords.length} trên tổng số {records.length}{" "}
              bản ghi
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Tổng giờ: </span>
                <span className="font-bold">{totalHours.toFixed(2)} giờ</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
