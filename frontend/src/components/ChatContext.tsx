// components/ChatContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { Room } from "@/types/Room";

interface ChatContextType {
  selectedRoomId: string | null;
  selectedRoom: Room | null;
  setSelectedRoomId: (id: string) => void;
  setSelectedRoom: (room: Room | null) => void;
  refreshRooms: boolean;
  setRefreshRooms: (refresh: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
  selectedRoomId: null,
  selectedRoom: null,
  setSelectedRoomId: () => {},
  setSelectedRoom: () => {},
  refreshRooms: false,
  setRefreshRooms: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [refreshRooms, setRefreshRooms] = useState(false);

  const handleSetSelectedRoomId = (id: string) => {
    setSelectedRoomId(id);
  };

  return (
    <ChatContext.Provider value={{ 
      selectedRoomId, 
      selectedRoom,
      setSelectedRoomId: handleSetSelectedRoomId,
      setSelectedRoom,
      refreshRooms,
      setRefreshRooms
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}