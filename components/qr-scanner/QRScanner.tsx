'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import './qr-scanner.css';

interface QRScannerProps {
    onScan: (data: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
    mode?: 'check-in' | 'check-out';
}

export default function QRScanner({ onScan, onCancel, isLoading = false, mode = 'check-in' }: QRScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const initScanner = async () => {
            try {
                const { Html5QrcodeScanner } = await import('html5-qrcode');

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    rememberLastUsedCamera: true,
                    supportedScanTypes: [],
                };

                const scanner = new Html5QrcodeScanner(
                    "qr-reader",
                    config,
                    /* verbose= */ false
                );

                scanner.render(
                    (decodedText) => {
                        // Stop scanning once QR is detected
                        scanner.clear();
                        onScan(decodedText);
                    },
                    (errorMessage) => {
                        // Ignore errors like "No QR found" as they're common during scanning
                        if (!errorMessage.includes("No QR code")) {
                            setError(errorMessage);
                        }
                    }
                );

                scannerRef.current = scanner;
            } catch (error) {
                console.error("Error initializing QR scanner:", error);
                setError("Failed to initialize camera. Please check permissions.");
            }
        };

        initScanner();

        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [onScan]);

    return (
        <div className="qr-scanner-container">
            <div className="qr-scanner-header">
                <h2>Scan {mode === 'check-in' ? 'Check-In' : 'Check-Out'} QR Code</h2>
                <p className="subtitle">
                    Point your camera at the {mode === 'check-in' ? 'check-in' : 'check-out'} QR code
                </p>
            </div>

            <div id="qr-reader" className="qr-reader" />

            {error && (
                <div className="scanner-error">
                    <p>{error}</p>
                </div>
            )}

            <div className="scanner-controls">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>

                {isLoading && (
                    <div className="loading-indicator">
                        <span>Processing QR code...</span>
                    </div>
                )}
            </div>

            <div className="scanner-tips">
                <p className="tips-title">Tips:</p>
                <ul>
                    <li>Ensure good lighting</li>
                    <li>Hold steady</li>
                    <li>Position QR code within the frame</li>
                    <li>Make sure QR code is not blurry</li>
                </ul>
            </div>
        </div>
    );
}