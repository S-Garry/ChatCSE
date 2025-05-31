"use client";

import { useState } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
// import { mockRooms, generateRandomString } from "@/lib/mockData";
import { useChat } from "./ChatContext";
import { showSuccess, showError } from "./ToastMessage";
import { createRoom, joinRoom } from "@/lib/api/chat";

export default function RoomManager() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [input, setInput] = useState("");
  const { setSelectedRoomId } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (mode === "create") {
      if (!input.trim()) {
        showError("Room name can't be empty.")
        return;
      }
      // const newId = uuidv4().slice(0, 8);
      // const newRoom = {
      //   id: newId,
      //   name: input,
      //   lastMessage: "",
      //   time: new Date().toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //     hour12: false,
      //   }),
      //   inviteCode: generateRandomString(),
      // };
      // mockRooms.push(newRoom);
      try {
        const res = await createRoom(input)
        showSuccess("Successfully create the chat room.")
        setSelectedRoomId(res.id);
      }
      catch (err: any) {
        showError(err.message)
      }
    } else {
      if (!input.trim()) {
        showError("Invite Code can't be empty.")
        return;
      }
      try {
        // const existing = mockRooms.find((r) => r.inviteCode === input.trim());
        // TODO: check has joined or not
        const res = await joinRoom(input)
        showSuccess("Successfully join the chat room.")
        setSelectedRoomId(res.id);
      }
      catch (err: any) {
        showError(err.message)
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
            mode === "create" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
          )}
        >
          Create
        </button>
        <button
          onClick={() => setMode("join")}
          className={clsx(
            "px-3 py-1 rounded text-sm",
            mode === "join" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
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
