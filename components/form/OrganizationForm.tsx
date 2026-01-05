"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrganizationStatusBadge } from "./../status-badge/OrganizationStatusBadge";
import { Organization as OrganizationType } from "@/lib/type";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";

interface OrganizationViewProps {
  organization: OrganizationType;
  loading?: boolean;
}

export function OrganizationView({
  organization,
  loading = false,
}: OrganizationViewProps) {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('vi-VN');
    } catch {
      return "Chưa có";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6085F0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {organization.logoUrl ? (
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-100 h-75 rounded-2xl object-cover border shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Building2 className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {organization.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {organization.typeName}
                  </Badge>
                  <OrganizationStatusBadge status={organization.status} />
                </div>
              </div>
            </div>

            {organization.description && (
              <div className="mb-6">
                <p className="text-foreground leading-relaxed">
                  {organization.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {organization.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${organization.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {organization.email}
                      </a>
                    </div>
                  </div>
                )}

                {organization.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Điện thoại</p>
                      <a
                        href={`tel:${organization.phoneNumber}`}
                        className="text-foreground hover:text-blue-600"
                      >
                        {organization.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {organization.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ</p>
                      <p className="text-foreground">{organization.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                    <p className="text-foreground">
                      {formatDate(organization.createAt)}
                    </p>
                  </div>
                </div>

                {organization.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {organization.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}