"use client";

import { useChat } from "@/components/ChatContext";
import ChatMessages from "@/components/ChatMessages";
import ChatInfo from "@/components/ChatInfo";
import { useEffect, useState } from "react";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { getMessages, getUsers } from "@/lib/api/chat";
import { showError } from "@/components/ToastMessage";
import { useLongPolling } from "@/hook/useLongPolling";

export default function ChatPage() {
  const { selectedRoomId, selectedRoom } = useChat();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Long polling for users
  const { data: polledUsers, error: usersPollingError } = useLongPolling<User[]>({
    url: selectedRoomId ? `/api/rooms/${encodeURIComponent(selectedRoomId)}/users` : '',      // TODO: change to actual url
    interval: 10000, // 每10秒輪詢一次用戶列表（用戶變化較少）
    enabled: !!selectedRoomId,
    dependencies: [selectedRoomId],
    onSuccess: (newUsers) => {
      // 比較用戶列表是否有變化
      const hasChanges = JSON.stringify(newUsers) !== JSON.stringify(users);
      if (hasChanges) {
        setUsers(newUsers);
      }
    },
    onError: (err) => {
      console.error('Users polling error:', err);
    }
  });

  // 當選中房間變化時載入初始數據
  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      setUsers([]);
      return;
    }

    const fetchInitialData = async () => {
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

    fetchInitialData();
  }, [selectedRoomId]);

  // 處理消息更新
  const handleMessagesUpdate = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

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

  return (
    <div className="flex w-full h-full">
      {/* 聊天訊息區 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ChatMessages 
          initialMessages={messages} 
          roomId={selectedRoomId}
          onMessagesUpdate={handleMessagesUpdate}
        />
      </div>

      {/* 聊天資訊區 */}
      <div className="w-1/4 border-l border-gray-200 p-4 bg-white">
        <ChatInfo 
          room={selectedRoom} 
          users={users}
        />
        {usersPollingError && (
          <div className="text-red-500 text-xs mt-2">
            User sync error
          </div>
        )}
      </div>
    </div>
  );
}