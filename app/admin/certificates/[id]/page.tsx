"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { certificateAPI } from "../../../../services/api";
import {
    ArrowLeft,
    Award,
    Building,
    Calendar,
    User,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Mail,
    Phone,
    Globe,
} from "lucide-react";

export default function CertificateDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const certificateId = params.id;

    useEffect(() => {
        if (certificateId) {
            fetchCertificateDetail();
        }
    }, [certificateId]);

    const fetchCertificateDetail = async () => {
        try {
            setLoading(true);
            const data = await certificateAPI.getById(certificateId as string);
            setCertificate(data);
        } catch (error) {
            console.error("Error fetching certificate detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // const handleApprove = async () => {
    //     if (!certificateId) return;
        
    //     try {
    //         setUpdating(true);
    //         await certificateAPI.updateStatus(certificateId as string, 2); // Status 2: Approved
    //         await fetchCertificateDetail(); // Refresh data
    //     } catch (error) {
    //         console.error("Error approving certificate:", error);
    //     } finally {
    //         setUpdating(false);
    //     }
    // };

    // const handleReject = async () => {
    //     if (!certificateId) return;
        
    //     try {
    //         setUpdating(true);
    //         await certificateAPI.updateStatus(certificateId as string, 3); // Status 3: Rejected
    //         await fetchCertificateDetail(); // Refresh data
    //     } catch (error) {
    //         console.error("Error rejecting certificate:", error);
    //     } finally {
    //         setUpdating(false);
    //     }
    // };

    // const handleReturnToPending = async () => {
    //     if (!certificateId) return;
        
    //     try {
    //         setUpdating(true);
    //         await certificateAPI.updateStatus(certificateId as string, 1);
    //         await fetchCertificateDetail(); // Refresh data
    //     } catch (error) {
    //         console.error("Error returning certificate to pending:", error);
    //     } finally {
    //         setUpdating(false);
    //     }
    // };

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

    if (!certificate) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-foreground mb-4">Chứng chỉ không tồn tại</h1>
                        <p className="text-muted-foreground mb-6">
                            Không tìm thấy chứng chỉ với ID: {certificateId}
                        </p>
                        <Button onClick={() => router.push('/admin/certificates')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/certificates')}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại danh sách
                    </Button>

                    {/* Header */}
                    {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-foreground">
                                    {certificate.certificateName}
                                </h1>
                            </div>
                            <p className="text-muted-foreground">
                                ID: {certificate.id} • Cập nhật lần cuối: {new Date(certificate.updatedAt || certificate.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>

                        Action Buttons
                        <div className="flex gap-2">
                            {certificate.status === 1 && (
                                <>
                                    <Button
                                        variant="default"
                                        onClick={handleApprove}
                                        disabled={updating}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleReject}
                                        disabled={updating}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Từ chối
                                    </Button>
                                </>
                            )}
                            
                            {certificate.status === 2 && (
                                <Button
                                    variant="outline"
                                    onClick={handleReturnToPending}
                                    disabled={updating}
                                >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Chuyển về chờ duyệt
                                </Button>
                            )}
                            
                            {certificate.status === 3 && (
                                <Button
                                    variant="default"
                                    onClick={handleApprove}
                                    disabled={updating}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Duyệt lại
                                </Button>
                            )}
                        </div>
                    </div> */}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Certificate Image */}
                            <Card className="overflow-hidden">
                                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 relative">
                                    {certificate.imageUrl ? (
                                        <img
                                            src={certificate.imageUrl}
                                            alt={certificate.certificateName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Award className="w-24 h-24 text-white/50" />
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Certificate Details */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin chứng chỉ</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground">Tên chứng chỉ</label>
                                            <p className="text-foreground font-medium mt-1">{certificate.certificateName}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm text-muted-foreground">Danh mục</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Award className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-foreground font-medium">{certificate.categoryName}</p>
                                            </div>
                                        </div>
                                        
                                        {certificate.issuingOrganization && (
                                            <div>
                                                <label className="text-sm text-muted-foreground">Tổ chức cấp</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Building className="w-4 h-4 text-muted-foreground" />
                                                    <p className="text-foreground font-medium">{certificate.issuingOrganization}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {certificate.certificateNumber && (
                                            <div>
                                                <label className="text-sm text-muted-foreground">Số chứng chỉ</label>
                                                <p className="text-foreground font-mono font-medium mt-1">{certificate.certificateNumber}</p>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            {certificate.issueDate && (
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Ngày cấp</label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <p className="text-foreground font-medium">
                                                            {new Date(certificate.issueDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {certificate.expiryDate && (
                                                <div>
                                                    <label className="text-sm text-muted-foreground">Hạn đến</label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <p className="text-foreground font-medium">
                                                            {new Date(certificate.expiryDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                {certificate.description && (
                                    <div className="mt-6 pt-6 border-t">
                                        <label className="text-sm text-muted-foreground">Mô tả</label>
                                        <p className="text-foreground mt-2 whitespace-pre-line">{certificate.description}</p>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Right Column - Owner Info & Actions */}
                        <div className="space-y-6">
                            {/* Owner Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Người sở hữu</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                            UID
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Account ID: {certificate.accountId}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Tài khoản người dùng
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {certificate.userEmail && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{certificate.userEmail}</span>
                                            </div>
                                        )}
                                        
                                        {certificate.userPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{certificate.userPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Button asChild className="w-full">
                                        <Link href={`/admin/users/${certificate.accountId}`}>
                                            <User className="w-4 h-4 mr-2" />
                                            Xem tài khoản
                                        </Link>
                                    </Button>
                                </div>
                            </Card>

                            {/* Certificate Actions */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Hành động</h2>
                                <div className="space-y-3">
                                    {certificate.imageUrl && (
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={certificate.imageUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="w-4 h-4 mr-2" />
                                                Tải xuống hình ảnh
                                            </a>
                                        </Button>
                                    )}
                                    
                                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/certificates')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Quay lại danh sách
                                    </Button>
                                </div>
                            </Card>

                            {/* Metadata */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Thông tin hệ thống</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ID</span>
                                        <span className="text-sm font-mono">{certificate.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Ngày tạo</span>
                                        <span className="text-sm">{new Date(certificate.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cập nhật lần cuối</span>
                                        <span className="text-sm">{new Date(certificate.updatedAt || certificate.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}