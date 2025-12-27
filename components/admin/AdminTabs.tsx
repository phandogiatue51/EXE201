import { Users, BarChart3, Tag } from "lucide-react";

type TabType = "overview" | "statistics" | "tags";

interface AdminTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  return (
    <div className="flex gap-2 mb-8 border-b border-border">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-6 py-3 font-medium transition-all ${
          activeTab === "overview"
            ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
            : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
        }`}
      >
        <Users className="w-4 h-4 inline mr-2" />
        Tổng quan
      </button>
      <button
        onClick={() => setActiveTab("statistics")}
        className={`px-6 py-3 font-medium transition-all ${
          activeTab === "statistics"
            ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
            : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
        }`}
      >
        <BarChart3 className="w-4 h-4 inline mr-2" />
        Thống kê
      </button>
      <button
        onClick={() => setActiveTab("tags")}
        className={`px-6 py-3 font-medium transition-all ${
          activeTab === "tags"
            ? "text-[#6085F0] border-b-2 border-[#6085F0] bg-[#77E5C8]/10"
            : "text-muted-foreground hover:text-foreground hover:bg-[#77E5C8]/5"
        }`}
      >
        <Tag className="w-4 h-4 inline mr-2" />
        Quản lý Tags
      </button>
    </div>
  );
}