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
  const { selectedRoomId, setSelectedRoomId, setSelectedRoom, refreshRooms, setRefreshRooms } = useChat();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (err: any) {
      showError(err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 当需要刷新房间列表时
  useEffect(() => {
    if (refreshRooms) {
      fetchRooms();
      setRefreshRooms(false);
    }
  }, [refreshRooms, setRefreshRooms]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id);
    setSelectedRoom(room);
  };

  return (
    <div className="flex flex-col h-full space-y-0">
      <div className="overflow-y-auto flex-1">
        <div className="text-black font-semibold mb-2">Chat List</div>
        
        {loading ? (
          <div className="text-gray-500 text-sm">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-500 text-sm">No rooms available</div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={clsx(
                "m-2 p-3 rounded-lg cursor-pointer transition-colors shadow-md mb-2",
                selectedRoomId === room.id
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              <div className="font-semibold text-black">{room.name}</div>
              <div className="text-sm text-gray-500 truncate">{room.lastMessage || "No messages yet"}</div>
              <div className="text-xs text-gray-400">{room.time}</div>
            </div>
          ))
        )}
      </div>

      <RoomManager onRoomCreated={fetchRooms} />
    </div>
  );
}