"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { certificateAPI, categoryAPI } from "../../../services/api";
import { Certificate, Category, Account } from "@/lib/type";
import { CertificateFilterDto } from "@/lib/filter-type";
import {
    Search,
    Filter,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    Award,
    Building,
    Eye,
    User as UserIcon,
    FolderOpen,
    Hash,
} from "lucide-react";

export default function CertificatesPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(false);
    
    const [filters, setFilters] = useState<CertificateFilterDto>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingFilters(true);
                const categoriesData = await categoryAPI.getAll();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchCategories();
    }, []); 

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);

                // Prepare filter object
                const apiFilters: CertificateFilterDto = { 
                    accountId: filters.accountId,
                    categoryId: filters.categoryId,
                    certificateName: filters.certificateName
                };
                
                // Remove undefined/null/empty values
                (Object.keys(apiFilters) as Array<keyof CertificateFilterDto>).forEach(key => {
                    if (apiFilters[key] === undefined || 
                        apiFilters[key] === null ||
                        apiFilters[key] === "") {
                        delete apiFilters[key];
                    }
                });

                // Fetch certificates with filters
                const data = await certificateAPI.filter(apiFilters);
                setCertificates(data);
                setFilteredCertificates(data);
                    
            } catch (error) {
                console.error("Error fetching certificates:", error);
                try {
                    const allData = await certificateAPI.getAll();
                    setCertificates(allData);
                    setFilteredCertificates(allData);
                } catch (fallbackError) {
                    console.error("Fallback fetch error:", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [filters]); 

    const handleFilterChange = (key: keyof CertificateFilterDto, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === "all" || value === "" ? undefined : value
        }));
    };

    const handleViewDetail = (certificateId: string | number) => {
        router.push(`/admin/certificates/${certificateId}`);
    };

    const clearAllFilters = () => {
        setFilters({});
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

                    {/* Filters */}
                    <Card className="p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                            {/* Search by Certificate Number */}
                            <div className="md:col-span-3 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Số chứng chỉ..."
                                    value={filters.certificateName  || ""}
                                    onChange={(e) => handleFilterChange("certificateName", e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Search by Account ID */}
                            <div className="md:col-span-3 relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Account ID..."
                                    value={filters.accountId?.toString() || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || /^\d+$/.test(value)) {
                                            handleFilterChange("accountId", value ? parseInt(value) : undefined);
                                        }
                                    }}
                                    className="pl-9"
                                    type="number"
                                    min="0"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <Select
                                    value={filters.categoryId?.toString() || "all"}
                                    onValueChange={(value) => handleFilterChange("categoryId", value !== "all" ? parseInt(value) : undefined)}
                                    disabled={loadingFilters || categories.length === 0}
                                >
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="w-4 h-4" />
                                            {loadingFilters ? (
                                                <span className="text-muted-foreground">Đang tải...</span>
                                            ) : (
                                                <SelectValue placeholder={categories.length > 0 ? "Tất cả danh mục" : "Không có danh mục"} />
                                            )}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-3">
                                <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                    disabled={!filters.accountId && !filters.categoryId && !filters.certificateName}
                                    className="w-full"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        </div>

                        {/* Active filters display */}
                        {(filters.accountId || filters.categoryId || filters.certificateName) && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Bộ lọc đang áp dụng:</p>
                                <div className="flex flex-wrap gap-2">
                                    {filters.accountId && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            Account ID: {filters.accountId}
                                        </span>
                                    )}
                                    {filters.categoryId && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                                            <FolderOpen className="w-3 h-3" />
                                            Danh mục: {categories.find(c => c.id === filters.categoryId)?.name || filters.categoryId}
                                        </span>
                                    )}
                                    {filters.certificateName && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1">
                                            <Search className="w-3 h-3" />
                                            Tên chứng chỉ: {filters.certificateName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-muted-foreground">
                            Hiển thị <span className="font-semibold text-foreground">{filteredCertificates.length}</span> chứng chỉ
                        </p>
                    </div>

                    {/* Certificates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCertificates.map((cert) => (
                            <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow border">
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
                                        <span className="px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded-full">
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
                                            onClick={() => handleViewDetail(cert.id)}
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
                    {filteredCertificates.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {Object.keys(filters).length > 0 ? "Không tìm thấy chứng chỉ phù hợp" : "Chưa có chứng chỉ nào"}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {Object.keys(filters).length > 0 
                                    ? "Thử thay đổi bộ lọc tìm kiếm" 
                                    : "Chưa có chứng chỉ nào trong hệ thống"}
                            </p>
                            {Object.keys(filters).length > 0 && (
                                <Button variant="outline" onClick={clearAllFilters}>
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}