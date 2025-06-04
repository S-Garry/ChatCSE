// components/ChatList.tsx
"use client";

import clsx from "clsx";
import { useChat } from "./ChatContext";
import RoomManager from "./RoomManager";
import { useEffect, useState } from "react";
import { Room } from "@/types/Room";
import { decryptLastMessage, getLastMsgTime, getRooms } from "@/lib/api/chat";
import { showError } from "./ToastMessage";
import { useLongPolling } from "@/hook/useLongPolling";

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

  // Long polling for rooms
  const { data: polledRooms, error: pollingError, restart: restartRoomsPolling } = useLongPolling<Room[]>({
    url: '/api/rooms',
    interval: 5000, // 每5秒輪詢一次房間列表
    enabled: true,
    onSuccess: (newRooms: Room[]) => {
      // 比較房間數據是否有變化
      const hasChanges = JSON.stringify(newRooms) !== JSON.stringify(rooms);
      if (hasChanges) {
        setRooms(newRooms);
        
        // 如果當前選中的房間信息有更新，同步更新選中房間
        if (selectedRoomId) {
          const updatedSelectedRoom = newRooms.find(room => room.id === selectedRoomId);
          if (updatedSelectedRoom) {
            setSelectedRoom(updatedSelectedRoom);
          }
        }
      }
    },
    onError: (err) => {
      console.error('Rooms polling error:', err);
      // 靜默處理錯誤，避免頻繁提示
    }
  });

  // 初始載入
  useEffect(() => {
    fetchRooms();
  }, []);

  // 當需要刷新房間列表時
  useEffect(() => {
    if (refreshRooms) {
      fetchRooms();
      restartRoomsPolling(); // 重新啟動輪詢
      setRefreshRooms(false);
    }
  }, [refreshRooms, setRefreshRooms, restartRoomsPolling]);

  // 監聽輪詢錯誤
  useEffect(() => {
    if (pollingError) {
      console.error('Room list polling error:', pollingError);
    }
  }, [pollingError]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id);
    setSelectedRoom(room);
  };

  const handleRoomCreated = () => {
    fetchRooms();
    restartRoomsPolling(); // 創建房間後重新啟動輪詢
  };

  return (
    <div className="flex flex-col h-full space-y-0">
      <div className="overflow-y-auto flex-1">
        <div className="text-black font-semibold mb-2 flex items-center justify-between">
          <span>Chat List</span>
          {pollingError && (
            <span className="text-red-500 text-xs" title="Connection error">
              ⚠️
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="text-gray-500 text-sm">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-500 text-sm">No rooms available</div>
        ) : (
          rooms.map(async (room) => (
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
              <div className="text-sm text-gray-500 truncate">{await decryptLastMessage(room.messages)}</div>
              <div className="text-xs text-gray-400">{getLastMsgTime(room.messages)}</div>
            </div>
          ))
        )}
      </div>

      <RoomManager onRoomCreated={handleRoomCreated} />
    </div>
  );
}