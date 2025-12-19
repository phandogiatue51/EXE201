"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef } from "react";
import { Bell } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const logoUrl =
    user?.role === "organization"
      ? "/organization/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={logoUrl} className="flex items-center gap-3 group">
          <div>
            <img src="/logo.png" alt="Logo" className="w-13 h-13 rounded-xl" />
          </div>
          <span className="font-bold text-2xl text-gradient-primary">
            Together
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {(!user || user.role === "volunteer") && (
            <>
              <Link
                href="/"
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/")
                    ? "text-[#6085F0] font-semibold bg-[#77E5C8]/10"
                    : "text-foreground hover:text-[#6085F0] hover:bg-[#77E5C8]/10"
                }`}
              >
                Trang chủ
              </Link>
              <Link
                href="/programs"
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/programs")
                    ? "text-[#6085F0] font-semibold bg-[#77E5C8]/10"
                    : "text-foreground hover:text-[#6085F0] hover:bg-[#77E5C8]/10"
                }`}
              >
                Chương trình
              </Link>
              <Link
                href="/about"
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/about")
                    ? "text-[#6085F0] font-semibold bg-[#77E5C8]/10"
                    : "text-foreground hover:text-[#6085F0] hover:bg-[#77E5C8]/10"
                }`}
              >
                Về chúng tôi
              </Link>
              <Link
                href="/contact"
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/contact")
                    ? "text-[#6085F0] font-semibold bg-[#77E5C8]/10"
                    : "text-foreground hover:text-[#6085F0] hover:bg-[#77E5C8]/10"
                }`}
              >
                Liên hệ
              </Link>
              {!user && (
                <Link
                  href="/auth/signup?role=organization"
                  className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/auth/signup")
                      ? "text-[#6085F0] font-semibold bg-[#77E5C8]/10"
                      : "text-foreground hover:text-[#6085F0] hover:bg-[#77E5C8]/10"
                  }`}
                >
                  Dành cho tổ chức
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notification Bell */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (notificationTimeoutRef.current)
                    clearTimeout(notificationTimeoutRef.current);
                  setIsNotificationOpen(true);
                }}
                onMouseLeave={() => {
                  notificationTimeoutRef.current = setTimeout(
                    () => setIsNotificationOpen(false),
                    200,
                  );
                }}
              >
              <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-xl hover:bg-[#77E5C8]/10 transition-all duration-200 border border-transparent hover:border-[#77E5C8]"
                >
                  <Bell className="w-5 h-5 text-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border/50">
                      <h3 className="text-sm font-semibold text-foreground">
                        Thông báo
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {user.role === "volunteer" ? (
                        <>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Đơn đăng ký được duyệt
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Chúc mừng! Đơn đăng ký của bạn đã được chấp nhận.
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              2 giờ trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Tin nhắn mới từ tổ chức
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Bạn có tin nhắn mới trong chương trình "Khóa học AI cơ bản".
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              5 giờ trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Nhắc nhở hoạt động
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Buổi hoạt động sẽ diễn ra vào ngày mai lúc 14:00.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 ngày trước
                            </p>
                          </div>
                        </>
                      ) : user.role === "organization" ? (
                        <>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Đơn đăng ký mới
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Có 3 tình nguyện viên đăng ký chương trình "Khóa học AI cơ bản".
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              1 giờ trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Chương trình sắp bắt đầu
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Chương trình "Lập trình Python" sẽ bắt đầu trong 2 ngày.
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              3 giờ trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Cần xác nhận giờ tình nguyện
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              5 tình nguyện viên cần xác nhận giờ đóng góp.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 ngày trước
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Tổ chức mới đăng ký
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Có 2 tổ chức mới chờ phê duyệt.
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              30 phút trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer border-b border-border/30">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Báo cáo vi phạm
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Có 1 báo cáo vi phạm cần xem xét.
                            </p>
                            <p className="text-xs text-[#6085F0]">
                              2 giờ trước
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-[#77E5C8]/10 transition-colors cursor-pointer">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Thống kê hệ thống
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Báo cáo thống kê tháng 10 đã sẵn sàng.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 ngày trước
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-border/50 text-center">
                      <Link
                        href="/notifications"
                        className="text-sm text-[#6085F0] hover:text-[#6085F0] font-medium"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#77E5C8]/10 transition-all duration-200 border border-transparent hover:border-[#77E5C8] hover:shadow-sm"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#77E5C8] to-[#6085F0] rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                  <span className="text-foreground font-medium">
                    {user.name}
                  </span>
                <svg
                    className={`w-4 h-4 text-foreground transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
              </button>

                {/* Dropdown menu */}
              {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl z-50 pointer-events-auto animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-4 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs text-[#6085F0] bg-[#77E5C8]/10 rounded-full font-medium capitalize">
                        {user.role}
                      </span>
                  </div>

                  <div className="py-2">
                    <Link
                      href={
                        user.role === "volunteer"
                          ? "/volunteer/dashboard"
                          : user.role === "organization"
                            ? "/organization/dashboard"
                            : "/admin/dashboard"
                      }
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-[#77E5C8]/10 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                          />
                        </svg>
                        Bảng điều khiển
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-[#77E5C8]/10 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Cài đặt hồ sơ
                    </Link>
                    <button
                      onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                asChild
                className="border-[#77E5C8] hover:bg-[#77E5C8]/10 hover:border-[#77E5C8] transition-all duration-200"
              >
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:from-[#6085F0] hover:to-[#A7CBDC] shadow-lg hover:shadow-lg transition-all duration-200"
              >
                <Link href="/auth/signup">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
