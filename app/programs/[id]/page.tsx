"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { projectAPI } from "../../../services/api";
import { ProjectDetailCard } from "@/components/card/ProjectDetailCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; 
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectAPI.getById(parseInt(id));
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Không thể tải thông tin chương trình");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <LoadingState />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ErrorState
          message={error || "Không tìm thấy chương trình"}
          onRetry={fetchProject}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ProjectDetailCard
              project={project}
              showBackButton={true}
              backHref="/programs"
              showOrganizationLink={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}