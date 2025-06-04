// components/ChatMessages.tsx
"use client"

import { DecryptedMessage, Message } from "@/types/Message";
import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { sendMessage, getMessages, aesDecrypt, fetchAES } from "@/lib/api/chat";
import { showError } from "./ToastMessage";
import { useLongPolling } from "@/hook/useLongPolling";

interface ChatMessagesProps {
  initialMessages: DecryptedMessage[];
  roomId: string;
  onMessagesUpdate?: (messages: DecryptedMessage[]) => void;
}

export default function ChatMessages({ initialMessages, roomId, onMessagesUpdate }: ChatMessagesProps) {
  const [messages, setMessages] = useState<DecryptedMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const lastMessageCountRef = useRef(0);

  // Long polling for messages
  const { data: polledMessages, error: pollingError, restart: restartPolling } = useLongPolling<Message[]>({
    url: `/api/rooms/${roomId}/messages`,       // TODO: change url to actual url
    interval: 3000, // 每3秒輪詢一次
    enabled: !!roomId,
    dependencies: [roomId], // roomId 變化時重新開始輪詢
    onSuccess: async (newMessages: Message[]) => {
      // 只有當消息數量發生變化時才更新
      if (newMessages.length !== lastMessageCountRef.current) {
        lastMessageCountRef.current = newMessages.length;
        const decryptedMessages: DecryptedMessage[] = [];

        for (const message of newMessages) {
          try {
            const aesKey = Buffer.from(await fetchAES(message.messageID));
            const decryptedText = aesDecrypt(message.encryptedText, aesKey, message.iv, message.authTag);

            decryptedMessages.push({
              ...message,
              decryptedText,
            });
          } catch (error) {
            showError('Failed to decrypt message: ' + error);
          }
        }
        
        setMessages(decryptedMessages);
        
        if (onMessagesUpdate) {
          onMessagesUpdate(decryptedMessages);
        }
      }
    },
    onError: (err) => {
      console.error('Message polling error:', err);
      // 可以選擇是否顯示錯誤提示
      // showError('Failed to sync messages');
    }
  });

  // 初始化消息
  useEffect(() => {
    setMessages(initialMessages);
    lastMessageCountRef.current = initialMessages.length;
  }, [initialMessages]);

  // 自動滾動到底部
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 監聽輪詢錯誤
  useEffect(() => {
    if (pollingError) {
      console.error('Long polling error:', pollingError);
    }
  }, [pollingError]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const messageText = input.trim();
    setInput("");
    setSending(true);

    try {
      await sendMessage(roomId, messageText);
      
      // 發送成功後立即輪詢新消息
      restartPolling();
    } catch (err: any) {
      showError(err.message);
      // 恢復輸入內容如果發送失敗
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
            <ChatBubble key={`${msg.time}-${i}`} message={msg} />
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