// components/ChatList.tsx

"use client";


import clsx from "clsx";
import { useChat } from "./ChatContext";
import RoomManager from "./RoomManager";
import { useEffect, useState } from "react";
import { Room } from "@/types/Room";
import { getRooms } from "@/lib/api/chat";
import { showError } from "./ToastMessage";


export default function ChatList() {
  const { selectedRoomId, setSelectedRoomId } = useChat();
  const [rooms, setRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    getRooms().then(setRooms).catch((err) => showError(err.message))
  }, [])

  return (
    <div className="flex flex-col h-full space-y-0">
      <div className="overflow-y-auto flex-1">
        <div className="text-black">Chat List</div>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoomId(room.id)}
            className={clsx(
              "m-2 p-3 rounded-lg cursor-pointer transition-colors shadow-md rounded-lgmb-2",
              selectedRoomId === room.id
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            <div className="font-semibold text-black">{room.name}</div>
            <div className="text-sm text-gray-500 truncate">{room.lastMessage}</div>
            <div className="text-xs text-gray-400">{room.time}</div>
          </div>
        ))}
      </div>


      <RoomManager />
    </div>
  );
}
