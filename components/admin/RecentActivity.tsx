import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, UserPlus } from "lucide-react";

const activities = [
  { id: 1, type: 'registration', user: 'Nguyễn Văn A', time: '10 phút trước', icon: UserPlus, color: 'text-blue-500' },
  { id: 2, type: 'program', user: 'Chương trình AI', time: '30 phút trước', icon: CheckCircle, color: 'text-green-500' },
  { id: 3, type: 'certificate', user: 'Đã cấp chứng chỉ', time: '1 giờ trước', icon: AlertCircle, color: 'text-amber-500' },
  { id: 4, type: 'approval', user: 'Tổ chức XYZ', time: '2 giờ trước', icon: Clock, color: 'text-purple-500' },
];

export default function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-')} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}