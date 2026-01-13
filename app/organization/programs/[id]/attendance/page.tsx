"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { attendanceAPI, projectAPI } from "@/services/api";
import { ProjectRecordList } from "@/components/list/record-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw, Copy, Check, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ProgramAttendancePage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [copied, setCopied] = useState<"checkin" | "checkout" | null>(null);

  const [attendanceCodes, setAttendanceCodes] = useState<{
    checkin: {
      code: string | null;
      expiresAt: string | null;
      generatedAt: string | null;
    };
    checkout: {
      code: string | null;
      expiresAt: string | null;
      generatedAt: string | null;
    };
  }>({
    checkin: {
      code: null,
      expiresAt: null,
      generatedAt: null,
    },
    checkout: {
      code: null,
      expiresAt: null,
      generatedAt: null,
    },
  });

  const [selectedTab, setSelectedTab] = useState("generate");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await projectAPI.getById(projectId);
        setProjectData(data);
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          description: "Không thể tải thông tin dự án",
          variant: "destructive",
        });
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, toast]);

  const handleGenerateCode = async (action: "checkin" | "checkout") => {
    setLoading(true);
    try {
      const response = await attendanceAPI.generateCode({
        projectId,
        actionType: action,
      });

      if (response.success) {
        const data = response.data;
        setAttendanceCodes((prev) => ({
          ...prev,
          [action]: {
            code: data.code,
            expiresAt: data.expiresAt,
            generatedAt: new Date().toISOString(),
          },
        }));

        toast({
          description: `Tạo mã ${action} thành công!`,
          variant: "success",
          duration: 3000,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        description: error.message || "Tạo mã thất bại!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string, type: "checkin" | "checkout") => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(type);
      toast({
        description: `Đã sao chép mã ${type === "checkin" ? "vào" : "ra"}`,
        variant: "success",
        duration: 2000,
      });

      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        description: "Không thể sao chép mã",
        variant: "destructive",
      });
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return "Đã hết hạn";

    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return `Còn ${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
  };

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/organization/programs`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Trở về
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý điểm danh
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý điểm danh cho dự án:{" "}
            <span className="font-semibold">{projectData.title}</span>
          </p>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="generate">Tạo mã điểm danh</TabsTrigger>
          <TabsTrigger value="records">Lịch sử điểm danh</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Generate Buttons */}
            <div className="space-y-6">
              <Card className="p-6">
                <h1 className="mb-6 text-center text-3xl font-bold">
                  Tạo mã điểm danh
                </h1>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Mã điểm danh vào
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="default"
                        onClick={() => handleGenerateCode("checkin")}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      >
                        {loading && !attendanceCodes.checkin.code
                          ? "Đang tạo..."
                          : attendanceCodes.checkin.code
                          ? "Tạo mã mới"
                          : "Tạo mã Check-In"}
                      </Button>

                      {attendanceCodes.checkin.code && (
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleCopyCode(
                                attendanceCodes.checkin.code!,
                                "checkin"
                              )
                            }
                            className="w-full"
                          >
                            {copied === "checkin" ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Đã sao chép
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Sao chép mã
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Mã điểm danh ra
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="default"
                        onClick={() => handleGenerateCode("checkout")}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                      >
                        {loading && !attendanceCodes.checkout.code
                          ? "Đang tạo..."
                          : attendanceCodes.checkout.code
                          ? "Tạo mã mới"
                          : "Tạo mã Check-Out"}
                      </Button>

                      {attendanceCodes.checkout.code && (
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleCopyCode(
                                attendanceCodes.checkout.code!,
                                "checkout"
                              )
                            }
                            className="w-full"
                          >
                            {copied === "checkout" ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Đã sao chép
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Sao chép mã
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Hướng dẫn sử dụng
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Bước 1:</strong> Nhấn "Tạo mã Check-In" để tạo mã
                      điểm danh vào
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Bước 2:</strong> Đọc mã 6 số cho tình nguyện viên
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Bước 3:</strong> Nhấn "Tạo mã Check-Out" khi kết
                      thúc
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Mỗi mã có hiệu lực 10 phút</strong> và chỉ dùng
                      được một lần
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="space-y-6">
              {attendanceCodes.checkin.code && (
                <Card className="p-6 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">
                        Mã Check-In hiện tại
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tạo lúc:{" "}
                        {new Date(
                          attendanceCodes.checkin.generatedAt!
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTimeRemaining(
                          attendanceCodes.checkin.expiresAt!
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-5xl font-bold tracking-widest text-blue-700 mb-4">
                      {attendanceCodes.checkin.code}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Tình nguyện viên nhập mã này để điểm danh vào
                    </p>
                  </div>
                </Card>
              )}

              {attendanceCodes.checkout.code && (
                <Card className="p-6 border-l-4 border-l-orange-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700">
                        Mã Check-Out hiện tại
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tạo lúc:{" "}
                        {new Date(
                          attendanceCodes.checkout.generatedAt!
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTimeRemaining(
                          attendanceCodes.checkout.expiresAt!
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-5xl font-bold tracking-widest text-orange-700 mb-4">
                      {attendanceCodes.checkout.code}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Tình nguyện viên nhập mã này để điểm danh ra
                    </p>
                  </div>
                </Card>
              )}

              {!attendanceCodes.checkin.code &&
                !attendanceCodes.checkout.code && (
                  <Card className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300">
                    <Users className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Chưa có mã nào được tạo
                    </h3>
                    <p className="text-gray-600">
                      Nhấn nút "Tạo mã Check-In" hoặc "Tạo mã Check-Out" để bắt
                      đầu tạo mã điểm danh
                    </p>
                  </Card>
                )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <ProjectRecordList
            projectId={projectId}
            projectTitle={projectData.title}
            showHeader={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}