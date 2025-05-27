// components/ChatMessages.tsx
// interface Message {
//   id: string;
//   sender: string;
//   text: string;
//   timestamp: string;
// }
"use client"

import { Message } from "@/types/Message";
import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

interface ChatMessagesProps {
  initialMessages: Message[];
  onSendMessage?: (message: Message) => void;
}
// rgb(221, 238, 255)
// #e9f4ff
export default function ChatMessages({ initialMessages, onSendMessage }: ChatMessagesProps) {

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      sender: "You",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    if (onSendMessage) {
      onSendMessage(newMsg);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 上方：訊息顯示區 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 下方：輸入欄 */}
      <form onSubmit={handleSend} className="flex gap-2 p-2 border-t mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
