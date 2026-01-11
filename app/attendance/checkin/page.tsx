"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { qrAPI } from "@/services/api";
import QRScanner from "@/components/qr-scanner/QRScanner";
import { Button } from "@/components/ui/button";
import "@/styles/attendance.css";
import { useToast } from "@/hooks/use-toast";

export default function CheckinPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const token = searchParams?.token;
    if (token) {
      handleQRScan(token);
    }
  }, [searchParams]);

  const handleQRScan = async (token: string) => {
    setLoading(true);
    setShowScanner(false);

    try {
      const formData = new FormData();
      formData.append("qrToken", token);
      formData.append("actionTime", new Date().toISOString());

      const response = await qrAPI.scan(formData);

      if (response.success) {
        const actionData = response.data;

        if (actionData.action === "checkin") {
          const projectId = actionData.projectId;
          const projectName = actionData.projectName;

          toast({
            description: "Checkin successfully!",
            variant: "success",
            duration: 3000,
          });

          router.push(
            `/attendance/success?projectId=${projectId}&projectName=${encodeURIComponent(
              projectName
            )}&action=check-in&timestamp=${Date.now()}`
          );
        } else if (actionData.action === "checkout") {
          const projectId = actionData.projectId;
          const projectName = actionData.projectName;
          const hoursWorked = actionData.hoursWorked || 0;

          toast({
            description: "Checkout successfully!",
            variant: "success",
            duration: 3000,
          });

          router.push(
            `/success?projectId=${projectId}&projectName=${encodeURIComponent(
              projectName
            )}&action=check-out&hours=${hoursWorked}`
          );
        }
      } else {
        throw new Error(response.message || "Scan failed");
      }
    } catch (error: any) {
      console.error("QR scan error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setShowScanner(false);
    }
  };

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleQRScan}
        onCancel={() => setShowScanner(false)}
        isLoading={loading}
        mode="check-in"
      />
    );
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Check In</h1>
        <p className="subtitle">Scan QR code to check in</p>
      </div>

      <div className="checkin-status">
        <div className="status-card">
          <h3>Status: Ready to Check In</h3>
          <p>
            Scan the QR code provided by the project manager to start tracking
            your hours.
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <Button onClick={() => setShowScanner(true)} disabled={loading}>
          {loading ? "Processing..." : "Scan QR to Check In"}
        </Button>
      </div>
    </div>
  );
}
