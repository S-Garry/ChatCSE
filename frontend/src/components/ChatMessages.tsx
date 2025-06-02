// components/ChatMessages.tsx
"use client"

import { Message } from "@/types/Message";
import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { sendMessage } from "@/lib/api/chat";
import { showError } from "./ToastMessage";

interface ChatMessagesProps {
  initialMessages: Message[];
  roomId: string;
  onMessagesUpdate?: (messages: Message[]) => void;
}

export default function ChatMessages({ initialMessages, roomId, onMessagesUpdate }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const messageText = input.trim();
    setInput("");
    setSending(true);

    try {
      const newMessage = await sendMessage(roomId, messageText);
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // 通知父组件消息已更新
      if (onMessagesUpdate) {
        onMessagesUpdate(updatedMessages);
      }
    } catch (err: any) {
      showError(err.message);
      // 恢复输入内容如果发送失败
      setInput(messageText);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 上方：訊息顯示區 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* 下方：輸入欄 */}
      <form onSubmit={handleSend} className="flex gap-2 p-2 border-t mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
          placeholder="Type a message"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className={`px-4 py-2 rounded text-white transition-colors ${
            sending || !input.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}