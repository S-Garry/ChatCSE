"use client";

import { User } from "@/types/User";
import { Room } from "@/types/Room";

interface ChatInfoProps {
  room: Room | null;
  users: User[];
}

export default function ChatInfo({ room, users }: ChatInfoProps) {
  const roomName = room?.name ?? "Unknown";
  const inviteCode = room?.inviteCode ?? "000000";
  return (
    <div className="h-full">
      {/* Chat Room Name */}
      <div className="text-lg font-bold mb-2 text-black">{roomName}</div>
      <div className="text-sm text-gray-500">Invite Code: {inviteCode}</div> 

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
