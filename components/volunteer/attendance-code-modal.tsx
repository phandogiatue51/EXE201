"use client";

import { useState } from "react";
import { Check, X, Clock, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { attendanceAPI } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
export function AttendanceCodeModal() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || code.length !== 6) {
      toast({
        description: "Vui lòng nhập đúng mã 6 số",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await attendanceAPI.verifyCode({
        code,
        accountId: user?.accountId,
      });

      if (result.success) {
        toast({
          description: `✅ ${result.data.message}`,
          variant: "success",
          duration: 3000,
        });
        setOpen(false);
        setCode("");
      } else {
        toast({
          description: `❌ ${result.message}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        description: "Lỗi kết nối, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="border-[#77E5C8] hover:bg-[#77E5C8]/10"
      >
        <Check className="w-4 h-4 mr-2" />
        Nhập mã điểm danh
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-[#77E5C8]/20 rounded-full">
                <Clock className="w-5 h-5 text-[#77E5C8]" />
              </div>
              Điểm danh
            </DialogTitle>
            <DialogDescription>
              Nhập mã 6 số từ quản lý dự án để điểm danh vào/ra
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Code Input */}
              <div className="space-y-2">
                <Label htmlFor="code">Mã điểm danh</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(value);
                  }}
                  className="text-center text-xl tracking-widest font-mono h-12"
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center">
                  Mã gồm 6 chữ số, có hiệu lực trong 10 phút
                </p>
              </div>

              {code.length === 6 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Mã hợp lệ</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Nhấn "Xác nhận" để điểm danh
                  </p>
                </div>
              )}

              {code.length > 0 && code.length < 6 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Mã chưa đủ</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Vui lòng nhập đủ 6 số
                  </p>
                </div>
              )}

              <div className="border rounded-lg p-3 bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Hướng dẫn:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Xin mã từ quản lý dự án</li>
                  <li>• Mã check-in: để bắt đầu ghi giờ</li>
                  <li>• Mã check-out: để kết thúc và lưu giờ</li>
                  <li>• Mỗi mã chỉ dùng được một lần</li>
                </ul>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setCode("");
                }}
                disabled={loading}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex-1 bg-[#77E5C8] hover:bg-[#77E5C8]/90"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Xác nhận
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
