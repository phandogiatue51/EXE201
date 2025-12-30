import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DashboardShell } from "../../components/volunteer/dashboard-shell";

export const metadata: Metadata = {
  title: "Tình Nguyện Viên - Bảng điều khiển",
  description: "Quản lý tình nguyện và theo dõi tiến độ",
};

export default function VolunteerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <DashboardShell>{children}</DashboardShell>
      <Footer />
    </div>
  );
}