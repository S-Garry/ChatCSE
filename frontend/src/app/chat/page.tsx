"use client";

import { useChat } from "@/components/ChatContext";
import ChatMessages from "@/components/ChatMessages";
import ChatInfo from "@/components/ChatInfo";
// import { mockMessagesByRoom, mockRooms, mockUsersByRoom } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { getMessages, getUsers } from "@/lib/api/chat";
import { showError } from "@/components/ToastMessage";

export default function ChatPage() {
  const { selectedRoomId, selectedRoom } = useChat();
  // const messages = selectedRoomId ? mockMessagesByRoom[selectedRoomId] ?? [] : [];
  // const currentRoom = mockRooms.find((r) => r.id === selectedRoomId);
  // const users = selectedRoomId ? mockUsersByRoom[selectedRoomId] ?? [] : [];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      setUsers([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [messagesData, usersData] = await Promise.all([
          getMessages(selectedRoomId),
          getUsers(selectedRoomId)
        ]);
        setMessages(messagesData);
        setUsers(usersData);
      } catch (err: any) {
        showError(err.message);
        setMessages([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRoomId]);

  if (!selectedRoomId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to begin
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  // return selectedRoomId ? (
  //   <div className="flex w-full h-full">
  //     {/* 聊天訊息區 */}
  //     <div className="flex-1 p-4 overflow-y-auto">
  //       <ChatMessages initialMessages={messages} />
  //     </div>

  //     {/* 聊天資訊區 */}
  //     <div className="w-1/4 border-l border-gray-200 p-4 bg-white">
  //       <ChatInfo room={currentRoom} users={users} />
  //     </div>
  //   </div>
  // ) : (
  //   <div className="text-gray-500">Select a chat to begin</div>
  // );
  return (
    <div className="flex w-full h-full">
      {/* 聊天訊息區 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ChatMessages 
          initialMessages={messages} 
          roomId={selectedRoomId}
          onMessagesUpdate={setMessages}
        />
      </div>

      {/* 聊天資訊區 */}
      <div className="w-1/4 border-l border-gray-200 p-4 bg-white">
        <ChatInfo room={selectedRoom} users={users} />
      </div>
    </div>
  );
}
