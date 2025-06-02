import { Room } from "@/types/Room";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { fetchWithAuth } from "../fetchWithAuth";
import { mockRooms, mockMessagesByRoom, mockUsersByRoom, generateRandomString } from "../mockData";

const simulateNetworkDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 可選：配置 API 基礎路徑
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

// 輔助函數：構建完整的 API URL
function buildApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

// 輔助函數：處理 API 響應
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // 如果無法解析 JSON，使用默認錯誤消息
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse response data');
  }
}

export async function getRooms(): Promise<Room[]> {
  // ================= mock ==================
  await simulateNetworkDelay(500)
  return mockRooms
  // ================= mock ==================
  
  // try {
  //   const res = await fetchWithAuth(buildApiUrl("/api/rooms"));
  //   const rooms = await handleApiResponse<Room[]>(res);
    
  //   // 可選：驗證數據格式
  //   if (!Array.isArray(rooms)) {
  //     throw new Error('Invalid rooms data format');
  //   }
    
  //   return rooms;
  // } catch (error) {
  //   console.error('Failed to fetch rooms:', error);
  //   throw new Error(error instanceof Error ? error.message : 'Failed to fetch rooms');
  // }
}

export async function getMessages(roomId: string): Promise<Message[]> {
  // ================= mock ==================
  await simulateNetworkDelay(500);
  if (!(roomId in mockMessagesByRoom)) {
    throw new Error('Chat room not found');
  }
  return mockMessagesByRoom[roomId];
  // ================= mock ==================
  // if (!roomId?.trim()) {
  //   throw new Error('Room ID is required');
  // }

  // try {
  //   const res = await fetchWithAuth(buildApiUrl(`/api/rooms/${encodeURIComponent(roomId)}/messages`));
  //   const messages = await handleApiResponse<Message[]>(res);
    
  //   if (!Array.isArray(messages)) {
  //     throw new Error('Invalid messages data format');
  //   }
    
  //   return messages;
  // } catch (error) {
  //   console.error(`Failed to fetch messages for room ${roomId}:`, error);
  //   throw new Error(error instanceof Error ? error.message : 'Failed to fetch messages');
  // }
}

export async function getUsers(roomId: string): Promise<User[]> {
  await simulateNetworkDelay(300);
  return mockUsersByRoom[roomId] ?? [];
  // if (!roomId?.trim()) {
  //   throw new Error('Room ID is required');
  // }

  // try {
  //   const res = await fetchWithAuth(buildApiUrl(`/api/rooms/${encodeURIComponent(roomId)}/users`));
  //   const users = await handleApiResponse<User[]>(res);
    
  //   if (!Array.isArray(users)) {
  //     throw new Error('Invalid users data format');
  //   }
    
  //   return users;
  // } catch (error) {
  //   console.error(`Failed to fetch users for room ${roomId}:`, error);
  //   throw new Error(error instanceof Error ? error.message : 'Failed to fetch users');
  // }
}

export async function createRoom(name: string): Promise<Room> {
  await simulateNetworkDelay(400);
  const newId = `room-${mockRooms.length + 1}`;
  const inviteCode = generateRandomString();
  const newRoom: Room = {
    id: newId,
    name,
    lastMessage: '',
    time: '00:00',
    inviteCode,
  };
  mockRooms.push(newRoom);
  mockMessagesByRoom[newId] = [];
  mockUsersByRoom[newId] = [];
  return newRoom;

  // if (!name?.trim()) {
  //   throw new Error('Room name is required');
  // }

  // try {
  //   const res = await fetchWithAuth(buildApiUrl("/api/rooms"), {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ name: name.trim() }),
  //   });
    
  //   const room = await handleApiResponse<Room>(res);
    
  //   // 驗證返回的房間數據
  //   if (!room.id || !room.name) {
  //     throw new Error('Invalid room data received');
  //   }
    
  //   return room;
  // } catch (error) {
  //   console.error('Failed to create room:', error);
  //   throw new Error(error instanceof Error ? error.message : 'Failed to create room');
  // }
}

export async function joinRoom(inviteCode: string): Promise<Room> {
  if (!inviteCode?.trim()) {
    throw new Error('Invite code is required');
  }

  try {
    const res = await fetchWithAuth(buildApiUrl("/api/rooms/join"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: inviteCode.trim() }),
    });
    
    const room = await handleApiResponse<Room>(res);
    
    if (!room.id || !room.name) {
      throw new Error('Invalid room data received');
    }
    
    return room;
  } catch (error) {
    console.error('Failed to join room:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to join room');
  }
}

export async function sendMessage(roomId: string, text: string): Promise<Message> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }
  
  if (!text?.trim()) {
    throw new Error('Message text is required');
  }

  try {
    const res = await fetchWithAuth(buildApiUrl(`/api/rooms/${encodeURIComponent(roomId)}/messages`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });
    
    const message = await handleApiResponse<Message>(res);
    
    // 驗證返回的消息數據
    if (!message.sender || !message.text) {
      throw new Error('Invalid message data received');
    }
    
    return message;
  } catch (error) {
    console.error(`Failed to send message to room ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send message');
  }
}

// 可選：添加一些額外的實用函數

// 獲取房間詳細信息
export async function getRoomDetails(roomId: string): Promise<Room> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }

  try {
    const res = await fetchWithAuth(buildApiUrl(`/api/rooms/${encodeURIComponent(roomId)}`));
    const room = await handleApiResponse<Room>(res);
    
    if (!room.id || !room.name) {
      throw new Error('Invalid room data received');
    }
    
    return room;
  } catch (error) {
    console.error(`Failed to fetch room details for ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch room details');
  }
}

// 離開房間
export async function leaveRoom(roomId: string): Promise<void> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }

  try {
    const res = await fetchWithAuth(buildApiUrl(`/api/rooms/${encodeURIComponent(roomId)}/leave`), {
      method: "POST",
    });
    
    await handleApiResponse<void>(res);
  } catch (error) {
    console.error(`Failed to leave room ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to leave room');
  }
}