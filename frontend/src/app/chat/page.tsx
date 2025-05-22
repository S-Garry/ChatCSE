"use client";

import { useChat } from "@/components/ChatContext";
import ChatMessages from "@/components/ChatMessages";
import ChatInfo from "@/components/ChatInfo";
import { mockMessagesByRoom, mockRooms, mockUsersByRoom } from "@/lib/mockData";

export default function ChatPage() {
  const { selectedRoomId } = useChat();
  const messages = selectedRoomId ? mockMessagesByRoom[selectedRoomId] ?? [] : [];
  const currentRoom = mockRooms.find((r) => r.id === selectedRoomId);
  const users = selectedRoomId ? mockUsersByRoom[selectedRoomId] ?? [] : [];

  return selectedRoomId ? (
    // <ChatMessages initialMessages={messages} />
    
    <div className="flex w-full h-full">
      {/* 聊天訊息區 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ChatMessages initialMessages={messages} />
      </div>

      {/* 聊天資訊區 */}
      <div className="w-1/4 border-l border-gray-200 p-4 bg-white">
        <ChatInfo roomName={currentRoom?.name ?? "Unknown"} users={users} />
      </div>
    </div>
  ) : (
    <div className="text-gray-500">Select a chat to begin</div>
  );
}
