// components/ChatList.tsx

"use client";


import clsx from "clsx";
import { useChat } from "./ChatContext";
import { mockRooms } from "@/lib/mockData";



// const mockRooms = [
//   { id: "room1", name: "General", lastMessage: "Hello there!", time: "10:24 AM" },
//   { id: "room2", name: "Project X", lastMessage: "Did you push the code?", time: "9:12 AM" },
//   { id: "room3", name: "Random", lastMessage: "Lunch today?", time: "Yesterday" },
// ];
// const mockRooms: Room[] = [
//   { id: "room-1", name: "Alice", lastMessage: "See you!", time: "10:01" },
//   { id: "room-2", name: "Bob", lastMessage: "Bye!", time: "09:01" },
// ];

export default function ChatList() {
  const {selectedRoomId, setSelectedRoomId} = useChat();
  // const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // const router = useRouter();

  // const handleSelect = (roomId: string) => {
  //   setSelectedRoom(roomId);
  //   // router.push(`/chat/${roomId}`);
  //   console.log(roomId)
  // };

  return (
    <div className="flex flex-col space-y-0">
        <div className="text-black">Chat List</div>
      {mockRooms.map((room) => (
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
  );
}
