"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  mockRegistrations,
  mockChatMessages,
  mockPrograms,
} from "@/lib/mock-data";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { user } = useAuth();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );
  const [customMessages, setCustomMessages] = useState<any[]>([]);
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);
  const [customPrograms, setCustomPrograms] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom data from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem("customChatMessages");
    if (storedMessages) {
      setCustomMessages(JSON.parse(storedMessages));
    }
    
    const storedRegistrations = localStorage.getItem("programRegistrations");
    if (storedRegistrations) {
      setCustomRegistrations(JSON.parse(storedRegistrations));
    }
    
    const storedPrograms = localStorage.getItem("customPrograms");
    if (storedPrograms) {
      setCustomPrograms(JSON.parse(storedPrograms));
    }
  }, [isOpen]);

  // Close modal when user logs out
  useEffect(() => {
    if (!user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Get ALL registrations (both approved and completed) for this volunteer
  const combinedRegistrations = [...mockRegistrations, ...customRegistrations];
  const allRegistrations = combinedRegistrations.filter(
    (r) => r.volunteerId === user?.id,
  );

  // Get all programs
  const allPrograms = [...mockPrograms, ...customPrograms];

  const programsWithChat = allRegistrations
    .map((reg) => {
      const program = allPrograms.find((p) => p.id === reg.programId);
      return { program, registration: reg };
    })
    .filter((item) => item.program);

  // Reset selected program when user changes
  useEffect(() => {
    setSelectedProgramId(null);
  }, [user?.id]);

  // Auto-select first program
  useEffect(() => {
    if (programsWithChat.length > 0 && !selectedProgramId) {
      setSelectedProgramId(programsWithChat[0]?.program?.id || null);
    }
  }, [programsWithChat, selectedProgramId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedProgramId]);

  const selectedProgramData = programsWithChat.find(
    (item) => item.program?.id === selectedProgramId,
  );
  const selectedProgram = selectedProgramData?.program;
  const selectedRegistration = selectedProgramData?.registration;

  // Combine mock messages and custom messages
  const messages = selectedProgramId
    ? [
        ...mockChatMessages.filter((m) => m.programId === selectedProgramId),
        ...customMessages.filter((m) => m.programId === selectedProgramId),
      ]
    : [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[800px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 gradient-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Tin nhắn</h2>
              <p className="text-sm text-white/90">
                {programsWithChat.length} chương trình
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content - 2 Column Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Program List */}
          <div className="w-80 border-r border-border/50 bg-gray-50/50 overflow-y-auto">
            <div className="p-3">
              <p className="text-xs text-muted-foreground mb-3 px-2">
                Chương trình của bạn
              </p>
              {programsWithChat.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-[#6085F0]" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2 text-center">
                    Chưa có chương trình
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Đăng ký tham gia chương trình để nhận tin nhắn từ tổ chức
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {programsWithChat.map((item) => {
                    const program = item.program;
                    const registration = item.registration;
                    if (!program) return null;

                    const messageCount = mockChatMessages.filter(
                      (m) => m.programId === program.id,
                    ).length;
                    const isSelected = selectedProgramId === program.id;

                    return (
                      <button
                        key={program.id}
                        onClick={() => setSelectedProgramId(program.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#77E5C8]/20 to-[#77E5C8]/10 border-2 border-[#6085F0] shadow-sm"
                            : "bg-white hover:bg-[#77E5C8]/10 border border-border/50"
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm mb-1 truncate ${isSelected ? "text-[#6085F0]" : "text-foreground"}`}
                        >
                          {program.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {program.organizationName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              registration?.status === "approved"
                                ? "bg-[#77E5C8]/20 text-[#6085F0]"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {registration?.status === "approved"
                              ? "Đã duyệt"
                              : "Chờ duyệt"}
                          </span>
                          {messageCount > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {messageCount} tin
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right - Chat Area */}
          <div className="flex-1 flex flex-col">
            {programsWithChat.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50/30">
                <div className="text-center max-w-md px-6">
                  <div className="w-20 h-20 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-[#6085F0]" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Chưa có tin nhắn
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Bạn chưa đăng ký chương trình nào. Hãy tham gia các chương
                    trình tình nguyện để nhận tin nhắn từ tổ chức.
                  </p>
                  <button
                    onClick={onClose}
                    className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Khám phá chương trình
                  </button>
                </div>
              </div>
            ) : selectedProgram ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 bg-white">
                  <h3 className="font-bold text-foreground">
                    {selectedProgram.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProgram.organizationName}
                  </p>
                  {selectedRegistration && (
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                        selectedRegistration.status === "approved"
                          ? "bg-[#77E5C8]/20 text-[#6085F0]"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedRegistration.status === "approved"
                        ? "Đã duyệt"
                        : "Chờ duyệt"}
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-border/50 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {msg.userName.charAt(0)}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-foreground">
                              {msg.userName}
                            </p>
                            <span className="text-xs text-[#6085F0] bg-[#77E5C8]/20 px-2 py-0.5 rounded-full">
                              Tổ chức
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {msg.message}
                          </p>
                          <p className="text-xs mt-2 text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-[#6085F0]" />
                      </div>
                      <p className="text-muted-foreground">
                        Chưa có tin nhắn nào
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tổ chức sẽ gửi thông tin qua tin nhắn
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Info Footer */}
                <div className="p-4 border-t border-border/50 bg-blue-50">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    Chỉ tổ chức có thể gửi tin nhắn. Bạn sẽ nhận được thông báo
                    khi có tin nhắn mới.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#77E5C8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-[#6085F0]" />
                  </div>
                  <p className="text-muted-foreground">
                    Chọn chương trình để xem tin nhắn
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
