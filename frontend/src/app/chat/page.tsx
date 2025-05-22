"use client";

import { useChat } from "@/components/ChatContext";
import ChatMessages from "@/components/ChatMessages";
import { mockMessagesByRoom } from "@/lib/mockData";

export default function ChatPage() {
  const { selectedRoomId } = useChat();
  const messages = selectedRoomId ? mockMessagesByRoom[selectedRoomId] ?? [] : [];

  return selectedRoomId ? (
    <ChatMessages initialMessages={messages} />
  ) : (
    <div className="text-gray-500">Select a chat to begin</div>
  );
}
