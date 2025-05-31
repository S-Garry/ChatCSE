import { Room } from "@/types/Room";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { fetchWithAuth } from "../fetchWithAuth";

export async function getRooms(): Promise<Room[]> {
  const res = await fetchWithAuth("/api/rooms");
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

export async function getMessages(roomId: string): Promise<Message[]> {
  const res = await fetchWithAuth(`/api/rooms/${roomId}/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function getUsers(roomId: string): Promise<User[]> {
  const res = await fetchWithAuth(`/api/rooms/${roomId}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createRoom(name: string): Promise<Room> {
  const res = await fetchWithAuth("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

export async function joinRoom(inviteCode: string): Promise<Room> {
  const res = await fetchWithAuth("/api/rooms/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteCode }),
  });
  if (!res.ok) throw new Error("Failed to join room");
  return res.json();
}

export async function sendMessage(roomId: string, text: string): Promise<Message> {
  const res = await fetchWithAuth(`/api/rooms/${roomId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}