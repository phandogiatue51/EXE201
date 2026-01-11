"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { qrAPI, projectAPI } from "@/services/api";
import QRDisplay from "@/components/qr-scanner/QRDisplay";
import { ProjectRecordList } from "@/components/list/record-list";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProgramAttendancePage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectData, setProjectData] = useState<any>(null);

  const [qrData, setQrData] = useState<{
    qrImage: string | null;
    expiresAt: string | null;
    action: "checkin" | "checkout" | null;
  }>({
    qrImage: null,
    expiresAt: null,
    action: null,
  });

  const [selectedTab, setSelectedTab] = useState("generate");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await projectAPI.getById(projectId);

        setProjectData(data);
      } catch (error) {
        console.error("Error loading project:", error);
        setError("Failed to load project data");
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const handleGenerateQR = async (action: "checkin" | "checkout") => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      if (action === "checkin") {
        response = await qrAPI.generateCheckin(projectId);
      } else {
        response = await qrAPI.generateCheckout(projectId);
      }

      if (response) {
        setQrData({
          qrImage: response.qrImageBase64,
          expiresAt: response.expiresAt,
          action: action,
        });
        setSuccess(
          `${
            action === "checkin" ? "Check-in" : "Check-out"
          } QR code generated successfully!`
        );

        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (error: any) {
      console.error("Error generating QR:", error);
      setError(error.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQR = () => {
    if (qrData.action) {
      handleGenerateQR(qrData.action);
    }
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
      {/* Header */}
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

      {success && (
        <Alert
          variant="success"
          onClose={() => setSuccess("")}
          className="mb-6"
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="error" onClose={() => setError("")} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="generate">Tạo mã QR</TabsTrigger>
          <TabsTrigger value="records">Lịch sử điểm danh</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - QR Generation */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tạo mã QR</h2>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="default"
                      onClick={() => handleGenerateQR("checkin")}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 hover:from-blue-200 hover:to-blue-400"
                    >
                      {loading && qrData.action === "checkin"
                        ? "Đang tạo..."
                        : "Tạo mã QR Checkin"}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleGenerateQR("checkout")}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-orange-100 to-orange-300 text-orange-800 hover:from-orange-200 hover:to-orange-400"
                    >
                      {loading && qrData.action === "checkout"
                        ? "Đang tạo..."
                        : "Tạo mã QR Checkout"}
                    </Button>
                  </div>

                  {/* QR Display */}
                  {qrData.qrImage && qrData.action && (
                    <div className="mt-6">
                      <QRDisplay
                        qrImage={qrData.qrImage}
                        expiresAt={qrData.expiresAt}
                        action={qrData.action}
                        onRefresh={handleRefreshQR}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Cách sử dụng mã QR
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Mã QR Check-In:</strong> Tình nguyện viên quét để
                      bắt đầu ghi nhận giờ làm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Mã QR Check-Out:</strong> Tình nguyện viên quét để
                      kết thúc và lưu lại giờ làm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-1.5"></span>
                    <span>
                      <strong>Mã QR Check-Out hết hạn</strong> sau 2 giờ để đảm
                      bảo an toàn
                    </span>
                  </li>
                </ul>
              </Card>
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
