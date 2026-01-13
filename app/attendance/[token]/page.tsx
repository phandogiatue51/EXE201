"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { qrAPI } from "@/services/api";

export default function AttendancePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params?.token as string;
    const action = searchParams?.get("action") as "checkin" | "checkout";

    if (!token || !action) {
      router.push("/volunteer?error=invalid-qr");
      return;
    }

    processAttendance(token, action);
  }, [params, searchParams, router]);

  const processAttendance = async (
    token: string,
    action: "checkin" | "checkout"
  ) => {
    try {
      const formData = new FormData();
      formData.append("qrToken", token);
      formData.append("actionTime", new Date().toISOString());

      const response = await qrAPI.scan(formData);

      if (response.success) {
        const data = response.data;

        router.push(
          `/success?action=${action}&projectId=${
            data.projectId
          }&projectName=${encodeURIComponent(
            data.projectName
          )}&timestamp=${new Date().toISOString()}${
            action === "checkout" && data.hoursWorked
              ? `&hoursWorked=${data.hoursWorked}`
              : ""
          }`
        );
      } else {
        throw new Error(response.message || "Scan failed");
      }
    } catch (error: any) {
      console.error("Attendance error:", error);
      router.push(`/volunteer?error=${encodeURIComponent(error.message)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing attendance...</p>
      </div>
    </div>
  );
}
