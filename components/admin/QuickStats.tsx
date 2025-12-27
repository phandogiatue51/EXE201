import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react";

const stats = [
  { label: 'Tỷ lệ tham gia', value: '78%', change: '+5%', trend: 'up', icon: Users },
  { label: 'Mục tiêu hoàn thành', value: '92%', change: '+12%', trend: 'up', icon: Target },
  { label: 'Tỷ lệ giữ chân', value: '85%', change: '-2%', trend: 'down', icon: TrendingUp },
];

export default function QuickStats() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Icon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? 
                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                  <TrendingDown className="h-4 w-4 mr-1" />
                }
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}