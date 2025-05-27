// components/ChatContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext<{
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string) => void;
}>({
  selectedRoomId: null,
  setSelectedRoomId: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ selectedRoomId, setSelectedRoomId }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
