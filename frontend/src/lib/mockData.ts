import { Room } from "@/types/Room";
import { Message } from "@/types/Message";

export const mockRooms: Room[] = [
  { id: "room-1", name: "Alice", lastMessage: "See you!", time: "10:01" },
  { id: "room-2", name: "Project X", lastMessage: "Bye!", time: "09:01" },
];

export const mockMessagesByRoom: Record<string, Message[]> = {
  "room-1": [
    { sender: "Alice", text: "Hi!", time: "10:00" },
    { sender: "You", text: "Hello!", time: "10:01" },
  ],
//   "room-2": [
//     { id: "m3", sender: "Bob", text: "Good morning", timestamp: "09:00" },
//     { id: "m4", sender: "You", text: "Hi Bob!", timestamp: "09:01" },
//   ],
};

export const mockUsersByRoom: Record<string, { id: string; name: string }[]> = {
  "room-1": [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "You" },
  ],
  "room-2": [
    { id: "u3", name: "Bob" },
    { id: "u2", name: "You" },
  ],
};

