"use client";

import { useEffect, useState } from "react"; // Import useState
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { qrAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";

export default function AttendancePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      console.log("Auth still loading...");
      return;
    }

    console.log("Auth check complete. User:", user);

    if (!user) {
      console.log("No user found, redirecting to login");
      const token = params?.token as string;
      const action = searchParams?.get("action");
      const redirectUrl = `/attendance/${token}?action=${action}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    const token = params?.token as string;
    const action = searchParams?.get("action") as "checkin" | "checkout";

    console.log("Token:", token, "Action:", action);

    if (!token || !action) {
      setError("Invalid QR code");
      setLoading(false);
      return;
    }

    processAttendance(token, action);
  }, [params, searchParams, user, authLoading, router]);

  const processAttendance = async (
    token: string,
    action: "checkin" | "checkout"
  ) => {
    try {
      console.log("Starting attendance processing...");
      console.log("User ID:", user?.accountId);

      const formData = new FormData();
      formData.append("QrToken", token);
      formData.append("ActionTime", new Date().toISOString());

      if (user?.accountId) {
        formData.append("AccountId", user.accountId.toString());
      }

      console.log("Calling qrAPI.scan...");
      const response = await qrAPI.scan(formData);
      console.log("API Response:", response);

      if (response.success) {
        const data = response.data;
        console.log("Success! Data:", data);

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
        console.log("API returned success=false");
        throw new Error(response.message || "Scan failed");
      }
    } catch (error: any) {
      console.error("Attendance error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });

      setError(error?.message || "An error occurred");
      setLoading(false);

      setTimeout(() => {
        router.push(
          `/volunteer?error=${encodeURIComponent(
            error.message || "Scan failed"
          )}`
        );
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">✗</div>
          <h1 className="text-xl font-semibold text-red-700 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang điểm danh...</p>
          <p className="text-sm text-gray-500">
            {authLoading ? "Kiểm tra đăng nhập..." : "Đang xác minh mã QR..."}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
