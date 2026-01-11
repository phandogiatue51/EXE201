"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectMatchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <section className="py-10 bg-gradient-to-br from-[#77E5C8] via-[#6085F0] to-[#A7CBDC]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                Tìm kiếm dự án phù hợp
              </h1>
              <p className="text-xl text-white/90">
                Tìm kiếm dự án phù hợp với bằng cấp và tài năng của bạn
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6085F0]"></div>
                <p className="mt-4 text-muted-foreground">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <Card className="p-8 max-w-md mx-auto border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="gradient-primary text-white"
                  >
                    Thử lại
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-[#6085F0]">
                  Hello from Project Match Page!
                </h2>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
