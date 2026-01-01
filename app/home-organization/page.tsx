"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { organizationAPI } from "../../services/api";
import { Organization } from "../../lib/type";
import {  OrganizationStatusBadge } from "@/components/organization/OrganizationStatusBadge";
import {
  Eye,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

export default function OrganizationsPage() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState<number | "all">("all");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationAPI.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.email?.toLowerCase().includes(search.toLowerCase()) ||
      org.phoneNumber?.includes(search);

    const isActive = org.status === 1;

    return matchesSearch && isActive;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <section className="py-10 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC]">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-white mb-6">Tổ chức</h1>
                <p className="text-xl text-white/90">
                  Tìm kiếm các tổ chức đang hoạt động tại Together
                </p>
              </div>
            </div>
          </section>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </Card>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            /* Organizations Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map((org) => (
                <Card
                  key={org.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3
                            className="font-semibold text-foreground truncate"
                            title={org.name}
                          >
                            {org.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <OrganizationStatusBadge status={org.status} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {org.typeName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Ngày thành lập: {new Date(org.createAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-6 space-y-3">
                    {org.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`mailto:${org.email}`}
                          className="text-blue-600 hover:underline truncate"
                          title={org.email}
                        >
                          {org.email}
                        </a>
                      </div>
                    )}

                    {org.phoneNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`tel:${org.phoneNumber}`}
                          className="text-foreground hover:text-blue-600 truncate"
                          title={org.phoneNumber}
                        >
                          {org.phoneNumber}
                        </a>
                      </div>
                    )}

                    {org.address && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span
                          className="text-muted-foreground truncate"
                          title={org.address}
                        >
                          {org.address}
                        </span>
                      </div>
                    )}

                    {org.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                          title={org.website}
                        >
                          {org.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/home-organization/${org.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy tổ chức
              </h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Chưa có tổ chức nào trong hệ thống"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
