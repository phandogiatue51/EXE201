"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { mockRegistrations } from "@/lib/mock-data";
import { ChatModal } from "./chat-modal";

export function FloatingChatButton() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customRegistrations, setCustomRegistrations] = useState<any[]>([]);

  // Close chat when user logs out
  useEffect(() => {
    if (!user) {
      setIsChatOpen(false);
    }
  }, [user]);

  // Load custom registrations
  useEffect(() => {
    const stored = localStorage.getItem("programRegistrations");
    if (stored) {
      setCustomRegistrations(JSON.parse(stored));
    }
  }, [user?.id]);

  // Only show for volunteers
  if (!user || user.role !== "volunteer") {
    return null;
  }

  const allRegistrations = [...mockRegistrations, ...customRegistrations];
  const userRegistrations = allRegistrations.filter(
    (r) => r.volunteerId === user.id,
  );

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="group relative flex items-center justify-center w-16 h-16 gradient-primary rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white" />

          {/* Unread badge - only show if there are registrations */}
          {userRegistrations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg">
              {userRegistrations.length}
            </span>
          )}

          {/* Tooltip */}
          {isExpanded && (
            <div className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap animate-in slide-in-from-right-2 duration-200">
              {userRegistrations.length > 0
                ? `Tin nhắn (${userRegistrations.length} chương trình)`
                : "Tin nhắn"}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900"></div>
            </div>
          )}
        </button>

        {/* Ripple effect */}
        <div className="absolute inset-0 w-16 h-16 bg-[#77E5C8] rounded-full opacity-20 animate-ping pointer-events-none"></div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
