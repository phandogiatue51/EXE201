import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Award } from "lucide-react";

interface StatsCardsProps {
  registrations: any[];
  certificates: any[];
}

export function StatsCards({ registrations, certificates }: StatsCardsProps) {
  const totalHours = certificates.reduce(
    (sum, c) => sum + (c.hoursContributed || 0),
    0,
  );

  const stats = [
    {
      title: "Chương trình tham gia",
      value: registrations.length,
      icon: CheckCircle,
      color: "from-[#77E5C8] to-[#6085F0]",
    },
    {
      title: "Giờ tình nguyện",
      value: totalHours,
      icon: Clock,
      color: "from-[#77E5C8] to-[#6085F0]",
    },
    {
      title: "Chứng chỉ nhận được",
      value: certificates.length,
      icon: Award,
      color: "from-[#77E5C8] to-[#6085F0]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2 font-medium">
                {stat.title}
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent">
                {stat.value}
              </p>
            </div>
            <div
              className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}