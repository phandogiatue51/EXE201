'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { qrAPI } from '@/services/api';
import QRScanner from '@/components/qr-scanner/QRScanner';
import { Button } from '@/components/ui/button';
import './attendance.css';
import { useToast } from '@/hooks/use-toast';
export default function CheckinPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            handleQRScan(token);
        }
    }, [searchParams]);

    const handleQRScan = async (token: string) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await qrAPI.scan({
                qrToken: token,
                actionTime: new Date().toISOString(),
            });

            if (response.success) {
                const actionData = response.data;

                if (actionData.action === 'checkin') {
                    const projectName = actionData.message?.match(/Checked in to (.+)/)?.[1] || 'Unknown Project';
                    toast({
                        description: "Checkin successfully!",
                        variant: "success",
                        duration: 3000,
                    });
                    router.push(`/success?project=${encodeURIComponent(projectName)}&action=check-in&timestamp=${Date.now()}`);


                } else {
                    setError('This is a check-out QR code. Please go to the check-out page.');
                }
            } else {
                throw new Error(response.message || 'Scan failed');
            }
        } catch (error: any) {
            console.error('QR scan error:', error);
            toast({
                description: error?.message || "Có lỗi xảy ra!",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setLoading(false);
            setShowScanner(false);
        }
    };

    if (showScanner) {
        return <QRScanner
            onScan={handleQRScan}
            onCancel={() => setShowScanner(false)}
            isLoading={loading}
            mode="check-in"
        />;
    }

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1>Check In</h1>
                <p className="subtitle">Scan QR code to check in</p>
            </div>

            <div className="checkin-status">
                <div className="status-card">
                    <h3>Status: Ready to Check In</h3>
                    <p>Scan the QR code provided by the project manager to start tracking your hours.</p>
                </div>
            </div>

            <div className="action-buttons">
                <Button
                    onClick={() => setShowScanner(true)}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Scan QR to Check In'}
                </Button>
            </div>
        </div>
    );
}