"use client";

import { User } from "@/types/User";

interface ChatInfoProps {
  roomName: string;
  users: User[];
}

export default function ChatInfo({ roomName, users }: ChatInfoProps) {
  return (
    <div className="h-full">
      {/* Chat Room Name */}
      <div className="text-lg font-bold mb-2 text-black">{roomName}</div>

      {/* Divider */}
      <hr className="mb-4 border-gray-400" />

      {/* User Cards */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-2 bg-white rounded shadow text-sm flex items-center gap-2 ${user.name === "You" ? "border-2 border-black" : ""}`}
          >
            <span className="text-gray-600">👤</span>
            <span className="text-black">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
