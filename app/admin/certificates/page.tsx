"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { certificateAPI } from "../../../services/api";
import {
    Search,
    Filter,
    FileText,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    Award,
    Building,
} from "lucide-react";

export default function CertificatesPage() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [filteredCertificates, setFilteredCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<number | "all">("all");
    const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        filterCertificates();
    }, [certificates, search, statusFilter]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const data = await certificateAPI.getAll();
            setCertificates(data);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterCertificates = () => {
        let result = certificates;

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(cert =>
                cert.certificateName.toLowerCase().includes(searchLower) ||
                cert.issuingOrganization?.toLowerCase().includes(searchLower) ||
                cert.certificateNumber?.toLowerCase().includes(searchLower) ||
                cert.categoryName.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter(cert => cert.status === statusFilter);
        }

        setFilteredCertificates(result);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Quản lý chứng chỉ</h1>
                            <p className="text-muted-foreground mt-2">
                                Xem và duyệt chứng chỉ của người dùng
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng chứng chỉ</p>
                                    <p className="text-2xl font-bold">{certificates.length}</p>
                                </div>
                                <FileText className="w-8 h-8 text-blue-500" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {certificates.filter(c => c.status === 1 || c.status === undefined).length}
                                    </p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Đã duyệt</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {certificates.filter(c => c.status === 2).length}
                                    </p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Đã từ chối</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {certificates.filter(c => c.status === 3).length}
                                    </p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Search */}
                            <div className="md:col-span-6 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm chứng chỉ, tổ chức cấp, số chứng chỉ..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="md:col-span-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-muted-foreground" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as number | "all")}
                                        className="w-full px-3 py-2 border rounded-lg bg-background"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="1">Chờ duyệt</option>
                                        <option value="2">Đã duyệt</option>
                                        <option value="3">Đã từ chối</option>
                                    </select>
                                </div>
                            </div>

                            {/* Counter */}
                            <div className="md:col-span-2 flex items-center justify-end">
                                <span className="text-muted-foreground">
                                    {filteredCertificates.length} chứng chỉ
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Certificates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCertificates.map((cert) => (
                            <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Certificate Image */}
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                                    {cert.imageUrl ? (
                                        <img
                                            src={cert.imageUrl}
                                            alt={cert.certificateName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Award className="w-16 h-16 text-white/50" />
                                        </div>
                                    )}

                                    {/* Account ID Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-black/50 text-white text-xs font-semibold rounded-full">
                                            ID: {cert.accountId}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Title and Category */}
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                                            {cert.certificateName}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {cert.categoryName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Issuing Organization */}
                                    {cert.issuingOrganization && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Building className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground truncate">
                                                {cert.issuingOrganization}
                                            </span>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {cert.issueDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Ngày cấp</p>
                                                    <p className="text-sm text-foreground">
                                                        {new Date(cert.issueDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {cert.expiryDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Hạn đến</p>
                                                    <p className="text-sm text-foreground">
                                                        {new Date(cert.expiryDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Certificate Number */}
                                    {cert.certificateNumber && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Số chứng chỉ</p>
                                            <p className="text-sm font-mono text-foreground">{cert.certificateNumber}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setSelectedCertificate(cert)}
                                        >
                                            <Eye className="w-3 h-3 mr-1" />
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!loading && filteredCertificates.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Không tìm thấy chứng chỉ
                            </h3>
                            <p className="text-muted-foreground">
                                {search || statusFilter !== "all"
                                    ? "Thử thay đổi bộ lọc tìm kiếm"
                                    : "Chưa có chứng chỉ nào trong hệ thống"}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Certificate Detail Modal */}
            {selectedCertificate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-[#77E5C8] to-[#6085F0] p-6 flex items-center justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedCertificate.certificateName}
                                </h2>
                                <p className="text-white/90">Chi tiết chứng chỉ</p>
                            </div>
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Image */}
                                <div>
                                    <div className="rounded-lg overflow-hidden border">
                                        {selectedCertificate.imageUrl ? (
                                            <img
                                                src={selectedCertificate.imageUrl}
                                                alt={selectedCertificate.certificateName}
                                                className="w-full h-64 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                <Award className="w-16 h-16 text-white/50" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Details */}
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">Thông tin chứng chỉ</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Tên chứng chỉ</p>
                                                <p className="text-foreground font-medium">{selectedCertificate.certificateName}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Danh mục</p>
                                                <p className="text-foreground font-medium">{selectedCertificate.categoryName}</p>
                                            </div>

                                            {selectedCertificate.issuingOrganization && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Tổ chức cấp</p>
                                                    <p className="text-foreground font-medium">{selectedCertificate.issuingOrganization}</p>
                                                </div>
                                            )}

                                            {selectedCertificate.certificateNumber && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Số chứng chỉ</p>
                                                    <p className="text-foreground font-mono font-medium">{selectedCertificate.certificateNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">Thời hạn</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedCertificate.issueDate && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Ngày cấp</p>
                                                    <p className="text-foreground font-medium">
                                                        {new Date(selectedCertificate.issueDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedCertificate.expiryDate && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Hạn đến</p>
                                                    <p className="text-foreground font-medium">
                                                        {new Date(selectedCertificate.expiryDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {selectedCertificate.description && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-3">Mô tả</h3>
                                            <p className="text-muted-foreground whitespace-pre-line">
                                                {selectedCertificate.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Account Info */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h3 className="text-lg font-semibold text-foreground mb-3">Người sở hữu</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                UID
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Account ID: {selectedCertificate.accountId}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Liên kết tài khoản để xem thông tin chi tiết
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="ml-auto">
                                                <Link href={`/admin/users/${selectedCertificate.accountId}`}>
                                                    <User className="w-3 h-3 mr-1" />
                                                    Xem tài khoản
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}