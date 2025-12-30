import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileSidebarProps {
  user: any;
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl sticky top-4">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-6">
        Thông tin cá nhân
      </h3>
      <div className="space-y-4">
        <ProfileField label="Tên" value={user?.name} />
        <ProfileField label="Email" value={user?.email} />
        <ProfileField label="Số điện thoại" value={user?.phoneNumber} />
        <ProfileField label="Vai trò" value="Tình nguyện viên" />
        {user?.bio && (
          <div>
            <p className="text-sm text-muted-foreground">Mô tả</p>
            <p className="text-sm text-foreground mt-1">{user.bio}</p>
          </div>
        )}
      </div>
      <Button
        className="w-full mt-8 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-300"
        asChild
      >
        <Link href={`/volunteer/profile/${user.id}`}>Xem hồ sơ</Link>
      </Button>
      <Button
        variant="outline"
        className="w-full mt-4 border-[#77E5C8] text-[#6085F0] hover:bg-[#77E5C8]/10"
        asChild
      >
        <Link href={`/volunteer/profile/${user.id}/edit`}>Chỉnh sửa hồ sơ</Link>
      </Button>
    </Card>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}