import type React from "react";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClientLayout } from "@/components/client-layout";
import { Toaster } from "@/components/toaster"; 
import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Together",
  description:
    "Nền tảng kết nối tình nguyện viên với các chương trình thiện nguyện",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <Toaster /> 
      </body>
    </html>
  );
}