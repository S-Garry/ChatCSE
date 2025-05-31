import { Room } from "@/types/Room";
import { Message } from "@/types/Message";

export const emptyRoom: Room = {
  id: "empty",
  name: "Error",
  lastMessage: "",
  time: "00:00",
  inviteCode: "000000"
};

export const mockRooms: Room[] = [
  { id: "room-1", name: "Alice", lastMessage: "See you!", time: "10:01", inviteCode: "a3D78g" },
  { id: "room-2", name: "Project X", lastMessage: "Bye!", time: "09:01", inviteCode: "79DfgL" },
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

export const mockUsersByRoom: Record<string, { id: string; name: string; mail: string }[]> = {
  "room-1": [
    { id: "u1", name: "Alice", mail: "s" },
    { id: "u2", name: "You", mail: "s" },
  ],
  "room-2": [
    { id: "u3", name: "Bob", mail: "s" },
    { id: "u2", name: "You", mail: "s" },
  ],
};

export function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}