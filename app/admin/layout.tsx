"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Newspaper,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tổ chức", href: "/admin/organizations", icon: Building },
  { name: "Chương trình", href: "/admin/programs", icon: Calendar },
  { name: "Chứng chỉ", href: "/admin/certificates", icon: Award },
  { name: "Bài viết", href: "/admin/blogs", icon: Newspaper },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    user, 
    isAuthenticated, 
    logout, 
    hasRole, 
    loading: authLoading 
  } = useAuth();

  // Check admin authentication
  useEffect(() => {
    const checkAdminAccess = () => {
      if (authLoading) {
        // Still checking authentication
        return;
      }

      // If not authenticated at all
      if (!isAuthenticated()) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // If authenticated but not admin
      if (!hasRole("Admin")) {
        // Check what role they have and redirect accordingly
        if (hasRole("Staff")) {
          router.push("/organization");
        } else if (hasRole("Volunteer")) {
          router.push("/volunteer");
        } else {
          router.push("/");
        }
        return;
      }

      // User is authenticated and is an admin
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [router, pathname, isAuthenticated, hasRole, authLoading]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigateToHome = () => {
    router.push("/");
  };

  // Show loading state while checking authentication
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            <p className="text-sm text-gray-500 mt-1">Together Platform</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#6085F0] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#77E5C8] flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || localStorage.getItem("userEmail") || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navItems.find(item => 
                    pathname === item.href || 
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  )?.name || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý hệ thống Together
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Hệ thống hoạt động</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Together Platform. All rights reserved.</p>
            <p>Phiên bản 1.0.0</p>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}