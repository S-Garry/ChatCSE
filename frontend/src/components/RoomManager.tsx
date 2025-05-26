"use client";

import { useState } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { mockRooms } from "@/lib/mockData";
import { useChat } from "./ChatContext";
import { showError } from "./ToastMessage";

export default function RoomManager() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [input, setInput] = useState("");
  const { setSelectedRoomId } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === "create") {
      const newId = uuidv4().slice(0, 8);
      const newRoom = {
        id: newId,
        name: input,
        lastMessage: "",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      mockRooms.push(newRoom);
      setSelectedRoomId(newId);
    } else {
      const existing = mockRooms.find((r) => r.id === input.trim());
      if (existing) {
        setSelectedRoomId(existing.id);
      } else {
        showError("Room ID not found.");
      }
    }

    setInput("");
  };

  return (
    <div className="mt-4 p-4 border-t border-gray-300">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode("create")}
          className={clsx(
            "px-3 py-1 rounded text-sm",
            mode === "create" ? "bg-blue-500 text-white" : "bg-gray-200"
          )}
        >
          Create
        </button>
        <button
          onClick={() => setMode("join")}
          className={clsx(
            "px-3 py-1 rounded text-sm",
            mode === "join" ? "bg-blue-500 text-white" : "bg-gray-200"
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
          placeholder={mode === "create" ? "Enter room name" : "Enter room ID"}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          {mode === "create" ? "Create" : "Join"}
        </button>
      </form>
    </div>
  );
}
