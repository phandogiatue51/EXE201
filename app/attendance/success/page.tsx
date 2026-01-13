"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import ExtraSimpleProjectCard from "@/components/card/ExtraSimpleProjectCard";
import { useRouter } from "next/navigation";
import { projectAPI } from "@/services/api";

type SuccessPageProps = {
  action: "checkin" | "checkout";
  projectId: number;
  projectName: string;
  hoursWorked?: number;
  timestamp: string | number | Date;
};

function SuccessPage({
  action,
  projectId,
  projectName,
  hoursWorked,
  timestamp,
}: SuccessPageProps) {
  const [project, setProject] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectAPI.getById(projectId);
        if (!res.ok) throw new Error("Failed to fetch project");
        setProject(res);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        {action === "checkin"
          ? `Điểm danh Checkin cho chương trình ${projectName} thành công!`
          : `Điểm danh Checkout cho chương trình ${projectName} thành công!`}
      </h1>
      <p className="text-gray-700 mb-2">
        {new Date(timestamp).toLocaleString()}
      </p>
      {action === "checkout" && hoursWorked !== undefined && (
        <p className="text-gray-700 mb-4">
          Giờ làm việc: {hoursWorked.toFixed(2)}
        </p>
      )}
      <div className="flex gap-4 w-full">
        {project && (
          <ExtraSimpleProjectCard
            project={project}
            showBackButton={false}
            showOrganizationLink={false}
            className="h-full flex-1"
          />
        )}
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => router.push("/volunteer")}
        >
          Trờ về
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
