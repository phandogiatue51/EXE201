"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPrograms, mockRegistrations } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function ProgramsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allPrograms, setAllPrograms] = useState(mockPrograms);
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const customPrograms = JSON.parse(
      localStorage.getItem("customPrograms") || "[]",
    );
    setAllPrograms([...mockPrograms, ...customPrograms]);
    
    const storedRegs = localStorage.getItem("programRegistrations");
    if (storedRegs) {
      setCustomRegistrations(JSON.parse(storedRegs));
    }
  }, []);

  const allRegistrations = [...mockRegistrations, ...customRegistrations];
  
  // Helper to check if user registered for a program
  const getUserRegistration = (programId: string) => {
    if (!user) return null;
    return allRegistrations.find((r) => r.programId === programId && r.volunteerId === user.id);
  };

  const categories = Array.from(new Set(allPrograms.map((p) => p.category)));
  const filteredPrograms = selectedCategory
    ? allPrograms.filter((p) => p.category === selectedCategory)
    : allPrograms;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-6">
              Tất cả chương trình
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tìm chương trình giáo dục AI phù hợp với bạn và giúp trẻ em vùng cao tiếp cận công nghệ
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:opacity-90 shadow-lg"
                  : "border-[#77E5C8] hover:bg-[#77E5C8]/10 hover:border-[#6085F0]"
              }`}
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#77E5C8] to-[#6085F0] hover:opacity-90 shadow-lg"
                    : "border-[#77E5C8] hover:bg-[#77E5C8]/10 hover:border-[#6085F0]"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Card
                key={program.id}
                className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className="aspect-video bg-muted overflow-hidden relative">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* International diagonal badge */}
                  {program.isInternational && (
                    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-6 -left-8 w-32 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold py-1 text-center transform -rotate-45 shadow-lg">
                        Quốc tế
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-white bg-[#6085F0] px-3 py-1 rounded-full shadow-lg">
                      {program.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-[#6085F0] transition-colors duration-200">
                    {program.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>
                  <div className="space-y-3 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      📍 {program.location}
                    </div>
                    <div className="flex items-center gap-2">
                      📅 {program.startDate} - {program.endDate}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        👥 {program.volunteersJoined}/{program.volunteersNeeded}
                      </span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#77E5C8] to-[#6085F0] transition-all duration-500"
                          style={{
                            width: `${(program.volunteersJoined / program.volunteersNeeded) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {user?.role === "volunteer" && getUserRegistration(program.id) && (
                    <div className="mb-2 px-3 py-2 rounded-lg text-sm font-medium text-center"
                      style={{
                        backgroundColor: getUserRegistration(program.id)?.status === "approved" 
                          ? "#d1fae5" 
                          : "#fef3c7",
                        color: getUserRegistration(program.id)?.status === "approved"
                          ? "#065f46"
                          : "#92400e"
                      }}
                    >
                      {getUserRegistration(program.id)?.status === "approved" 
                        ? "✓ Đang tham gia" 
                        : "⏳ Chờ duyệt"
                      }
                    </div>
                  )}
                  <Button
                    className="w-full gradient-primary hover:opacity-90 shadow-lg hover:shadow-lg transition-all duration-300"
                    asChild
                  >
                    <Link href={`/programs/${program.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
