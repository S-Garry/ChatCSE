// app/chat/layout.tsx

import "@/app/globals.css"; // 確保通用樣式
import ChatList from "@/components/ChatList";
import { ChatProvider } from "@/components/ChatContext";
import React from "react";
// #fffcf3
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-[#fdf8e6]">
        {/* 左邊：聊天室列表 */}
        <aside className="w-1/5 border-r border-gray-200 p-4 bg-[#fff6d6]">
          <ChatList/>
        </aside>

        {/* 中間：訊息顯示視窗 */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>

        {/* 右邊：聊天室成員或資訊 */}
        <aside className="w-1/5 border-l border-gray-200 p-4 bg-[#fff6d6]">
          <div className="font-bold mb-4">Room Info</div>
          {/* 之後可替換為 <ChatSidebar /> */}
        </aside>
      </div>
    </ChatProvider>
  );
}
