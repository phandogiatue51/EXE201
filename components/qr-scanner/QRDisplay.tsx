"use client";

import { Button } from "@/components/ui/button";

type QRDisplayProps = {
  qrImage: string | null;
  expiresAt?: string | null;
  action: "checkin" | "checkout";
  onRefresh?: () => void;
};

export default function QRDisplay({
  qrImage,
  expiresAt,
  action,
  onRefresh,
}: QRDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold">
        {action === "checkin" ? "Check-In QR Code" : "Check-Out QR Code"}
      </h2>

      {!qrImage ? (
        <p className="text-gray-500">No QR code available</p>
      ) : (
        <>
          <img
            src={qrImage}
            alt={`${action} QR Code`}
            className="w-64 h-64 border rounded"
          />
          {expiresAt && (
            <p className="text-gray-600">
              Expires at: {new Date(expiresAt).toLocaleString()}
            </p>
          )}
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              Refresh QR
            </Button>
          )}
        </>
      )}
    </div>
  );
}