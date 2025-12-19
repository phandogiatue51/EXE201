"use client";

import { FloatingChatButton } from "./floating-chat-button";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingChatButton />
    </>
  );
}
