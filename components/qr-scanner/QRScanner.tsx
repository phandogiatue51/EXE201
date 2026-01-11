"use client";

import { Button } from "@/components/ui/button";
import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerProps {
  onScan: (data: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "check-in" | "check-out";
}

export default function QRScanner({
  onScan,
  onCancel,
  isLoading = false,
  mode = "check-in",
}: QRScannerProps) {
  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <h2>Scan {mode === "check-in" ? "Check-In" : "Check-Out"} QR Code</h2>
      </div>

      <div className="scanner-view">
        <Scanner
          onScan={(results) => {
            if (results && results.length > 0) {
              const text = results[0].rawValue; 
              onScan(text);
            }
          }}
          onError={(error) => {
            console.error("QR scanner error:", error);
          }}
          constraints={{
            facingMode: "environment", 
          }}
        />
      </div>

      <div className="scanner-controls">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}