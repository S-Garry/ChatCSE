"use client";

import { useState } from "react";
import clsx from "clsx";
import { useChat } from "./ChatContext";
import { showSuccess, showError } from "./ToastMessage";
import { createRoom, joinRoom } from "@/lib/api/chat";

interface RoomManagerProps {
  onRoomCreated?: () => void;
}

export default function RoomManager({ onRoomCreated }: RoomManagerProps) {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const { setSelectedRoomId, setSelectedRoom, setRefreshRooms } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (processing) return;

    if (mode === "create") {
      if (!input.trim()) {
        showError("Room name can't be empty.");
        return;
      }
      
      setProcessing(true);
      try {
        const newRoom = await createRoom(input.trim());
        showSuccess("Successfully created the chat room.");
        setSelectedRoomId(newRoom.id);
        setSelectedRoom(newRoom);
        setRefreshRooms(true); // 触发房间列表刷新
        
        if (onRoomCreated) {
          onRoomCreated();
        }
      } catch (err: any) {
        showError(err.message);
      } finally {
        setProcessing(false);
      }
    } else {
      // Join mode
      if (!input.trim()) {
        showError("Invite code can't be empty.");
        return;
      }
      
      setProcessing(true);
      try {
        const joinedRoom = await joinRoom(input.trim());
        showSuccess("Successfully joined the chat room.");
        setSelectedRoomId(joinedRoom.id);
        setSelectedRoom(joinedRoom);
        setRefreshRooms(true); // 触发房间列表刷新
        
        if (onRoomCreated) {
          onRoomCreated();
        }
      } catch (err: any) {
        showError(err.message);
      } finally {
        setProcessing(false);
      }
    }

    setInput("");
  };

  return (
    <div className="mt-4 p-4 border-t border-gray-300">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode("create")}
          disabled={processing}
          className={clsx(
            "px-3 py-1 rounded text-sm transition-colors",
            mode === "create" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-400",
            processing && "opacity-50 cursor-not-allowed"
          )}
        >
          Create
        </button>
        <button
          onClick={() => setMode("join")}
          disabled={processing}
          className={clsx(
            "px-3 py-1 rounded text-sm transition-colors",
            mode === "join" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-400",
            processing && "opacity-50 cursor-not-allowed"
          )}
        >
          Join
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-3/4 border rounded px-2 py-1 text-sm text-black"
          placeholder={mode === "create" ? "Enter room name" : "Enter invite code"}
          disabled={processing}
        />
        <button
          type="submit"
          disabled={processing || !input.trim()}
          className={clsx(
            "px-3 py-1 rounded text-sm text-white transition-colors",
            processing || !input.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          )}
        >
          {processing 
            ? (mode === "create" ? "Creating..." : "Joining...") 
            : (mode === "create" ? "Create" : "Join")
          }
        </button>
      </form>
    </div>
  );
}

//   return (
//     <div className="mt-4 p-4 border-t border-gray-300">
//       <div className="flex gap-2 mb-2">
//         <button
//           onClick={() => setMode("create")}
//           className={clsx(
//             "px-3 py-1 rounded text-sm",
//             mode === "create" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
//           )}
//         >
//           Create
//         </button>
//         <button
//           onClick={() => setMode("join")}
//           className={clsx(
//             "px-3 py-1 rounded text-sm",
//             mode === "join" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
//           )}
//         >
//           Join
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="w-3/4 border rounded px-2 py-1 text-sm text-black"
//           placeholder={mode === "create" ? "Enter room name" : "Enter room ID"}
//         />
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//         >
//           {mode === "create" ? "Create" : "Join"}
//         </button>
//       </form>
//     </div>
//   );
// }
