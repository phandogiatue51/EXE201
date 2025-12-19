"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mockRegistrations,
  mockChatMessages,
  mockPrograms,
} from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";

export default function VolunteerChatsPage() {
  const { user } = useAuth();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");

  // Get approved programs for this volunteer
  const approvedRegistrations = mockRegistrations.filter(
    (r) => r.volunteerId === user?.id && r.status === "approved",
  );

  // Get programs with chat access
  const programsWithChat = approvedRegistrations
    .map((reg) => {
      const program = mockPrograms.find((p) => p.id === reg.programId);
      return program;
    })
    .filter(Boolean);

  // Select first program by default
  useEffect(() => {
    if (programsWithChat.length > 0 && !selectedProgramId) {
      setSelectedProgramId(programsWithChat[0]?.id || null);
    }
  }, [programsWithChat, selectedProgramId]);

  const selectedProgram = mockPrograms.find((p) => p.id === selectedProgramId);
  const messages = selectedProgramId
    ? mockChatMessages.filter((m) => m.programId === selectedProgramId)
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // In a real app, this would send to backend
    alert("Tính năng gửi tin nhắn sẽ được cập nhật sớm!");
    setMessageText("");
  };

  if (!user || user.role !== "volunteer") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-muted-foreground">
            Vui lòng đăng nhập với tài khoản tình nguyện viên
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-[#77E5C8]/5 via-background to-[#A7CBDC]/5">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/volunteer/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#77E5C8] to-[#A7CBDC] bg-clip-text text-transparent mb-4">
              Tin nhắn
            </h1>
            <p className="text-xl text-muted-foreground">
              Giao tiếp với tổ chức về các chương trình bạn tham gia
            </p>
          </div>

          {programsWithChat.length === 0 ? (
            <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#6085F0]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Chưa có tin nhắn
              </h3>
              <p className="text-muted-foreground mb-6">
                Bạn cần được phê duyệt vào ít nhất một chương trình để có thể
                nhắn tin
              </p>
              <Button className="bg-[#6085F0] hover:opacity-90" asChild>
                <Link href="/programs">Khám phá chương trình</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Program List */}
              <div className="lg:col-span-1">
                <Card className="p-4 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <h3 className="font-bold text-foreground mb-4">
                    Chương trình
                  </h3>
                  <div className="space-y-2">
                    {programsWithChat.map(
                      (program) =>
                        program && (
                          <button
                            key={program.id}
                            onClick={() => setSelectedProgramId(program.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              selectedProgramId === program.id
                                ? "bg-[#77E5C8]/20 border-2 border-[#6085F0]"
                                : "bg-muted hover:bg-[#77E5C8]/10 border-2 border-transparent"
                            }`}
                          >
                            <p className="font-medium text-sm truncate">
                              {program.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {program.organizationName}
                            </p>
                          </button>
                        ),
                    )}
                  </div>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-border/50">
                    <h2 className="text-xl font-bold text-foreground">
                      {selectedProgram?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedProgram?.organizationName}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.userRole === "volunteer" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-4 rounded-2xl ${
                              msg.userRole === "volunteer"
                                ? "bg-[#6085F0] text-white"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.userName}
                            </p>
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-2 ${msg.userRole === "volunteer" ? "text-white/90" : "text-muted-foreground"}`}
                            >
                              {new Date(msg.timestamp).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Chưa có tin nhắn nào
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-border/50">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6085F0]"
                      />
                      <Button
                        type="submit"
                        className="bg-[#6085F0] hover:opacity-90 px-6"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Gửi
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
