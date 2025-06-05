import { Room } from "@/types/Room";
import { Message, DecryptedMessage } from "@/types/Message";
import { User } from "@/types/User";
// import { fetchWithAuth } from "../fetchWithAuth";
// import { mockRooms, mockMessagesByRoom, mockUsersByRoom, generateRandomString } from "../mockData";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

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

async function registerAES(messageID: String, encryptedAES: String) {
  try {
    const res = await fetch("localhost:4000/kms/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageID: messageID, encryptedAESKey: encryptedAES }),
    });
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch rooms');
  }
}

export async function fetchAES(messageID: String): Promise<String> {
  try {
    const res = await fetch("localhost:4000/kms/decrypt", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageID: messageID }),
    });

    const encryptedAES = await handleApiResponse<String>(res);

    return encryptedAES;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch rooms');
  }
}

export async function getRooms(): Promise<Room[]> {
  
  try {
    const res = await fetch(buildApiUrl("/api/channels"));
    const rooms = await handleApiResponse<Room[]>(res);
    
    // 可選：驗證數據格式
    if (!Array.isArray(rooms)) {
      throw new Error('Invalid rooms data format');
    }
    
    return rooms;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch rooms');
  }
}

/**
 * AES 解密，使用 AES-256-GCM 解密
 * @param encryptedText - 加密過的消息
 * @param aesKey - 解密 AES 密鑰
 * @param iv - 初始化向量（IV）
 * @param authTag - GCM 模式下的認證標籤
 * @returns 解密後的消息文本
 */
export function aesDecrypt(encryptedText: string, aesKey: Buffer, iv: string, authTag: string): string {
  try {
    // 將 base64 編碼的 encryptedText、iv 和 authTag 解碼
    const encryptedBuffer = Buffer.from(encryptedText, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const authTagBuffer = Buffer.from(authTag, 'base64');

    // 創建解密器
    const decipher = createDecipheriv('aes-256-gcm', aesKey, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    // 解密消息
    const decryptedBuffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

    // 返回解密後的文本（將 Buffer 轉為 UTF-8 字符串）
    return decryptedBuffer.toString('utf8');
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    throw new Error('Failed to decrypt message');
  }
}
export async function getMessages(roomId: string): Promise<DecryptedMessage[]> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }

  try {
    const res = await fetch(buildApiUrl(`/api/channels/${roomId}/messages`));
    const messages = await handleApiResponse<DecryptedMessage[]>(res);
    
    if (!Array.isArray(messages)) {
      throw new Error('Invalid messages data format');
    }

    // 解密所有的消息
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // 解密 AES 密鑰
      const aesKey = Buffer.from(await fetchAES(message.messageID))

      // 解密消息內容
      const decryptedText = aesDecrypt(message.encryptedText, aesKey, message.iv, message.authTag);

      // 將解密後的文本填入到消息中
      messages[i] = {
        ...message,
        decryptedText: decryptedText,  // 添加解密後的消息文本
      };
    }
    
    return messages;
  } catch (error) {
    console.error(`Failed to fetch messages for room ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch messages');
  }
}

export async function getUsers(roomId: string): Promise<User[]> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }

  try {
    const res = await fetch(buildApiUrl(`/api/channels/${roomId}/users`));
    const users = await handleApiResponse<User[]>(res);
    
    if (!Array.isArray(users)) {
      throw new Error('Invalid users data format');
    }
    
    return users;
  } catch (error) {
    console.error(`Failed to fetch users for room ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch users');
  }
}

export async function createRoom(name: string): Promise<Room> {
  if (!name?.trim()) {
    throw new Error('Room name is required');
  }

  try {
    const uid = localStorage.getItem('uid')
    // console.log('[user]', username)

    const res = await fetch(buildApiUrl("/api/channels"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), createdBy: uid }),
    });
    
    const room = await handleApiResponse<Room>(res);
    
    // 驗證返回的房間數據
    if (!room.id || !room.name) {
      throw new Error('Invalid room data received');
    }
    
    return room;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create room');
  }
}

export async function joinRoom(inviteCode: string): Promise<Room> {
  if (!inviteCode?.trim()) {
    throw new Error('Invite code is required');
  }

  try {
    const res = await fetch(buildApiUrl("/api/channels/join"), {
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

// Generate AES
const generateAESKey = (): Buffer => randomBytes(16);

// Encrypt Msg using AES
const aesEncrypt = (msg: string, aesKey: Buffer): { encryptedData: Buffer, iv: Buffer, authTag: Buffer } => {
  const iv = randomBytes(16);  // 初始化向量（IV）
  const cipher = createCipheriv('aes-256-gcm', aesKey, iv);
  const encryptedData = Buffer.concat([cipher.update(msg, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 認證標籤
  
  return { encryptedData, iv, authTag };
};

// Encrypte AES using KMS
// const encryptAesKeyWithKms = async (aesKey: Buffer, username: String): Promise<string> => {
//   const encryptedKey = await encryptWithKMS(aesKey, username);    // encryptWithKMS need to replace with actual KMS
//   return encryptedKey;
// };

export async function sendMessage(roomId: string, text: string): Promise<void> {
  if (!roomId?.trim()) {
    throw new Error('Room ID is required');
  }
  
  if (!text?.trim()) {
    throw new Error('Message text is required');
  }

  try {
    const aesKey = generateAESKey();
    const { encryptedData, iv, authTag } = aesEncrypt(text, aesKey);
    const uid = localStorage.getItem('uid') ?? "";
    // const encryptedAESKey = await encryptAesKeyWithKms(aesKey, username)


    const payload = {
      sender: uid,
      encryptedText: encryptedData.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    }

    const res = await fetch(buildApiUrl(`/api/channels/${roomId}/messages`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const messageID = await handleApiResponse<String>(res)
    registerAES(messageID, aesKey.toString())
  } catch (error) {
    console.error(`Failed to send message to room ${roomId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send message');
  }
}

export async function decryptLastMessage(messages?: Message[]): Promise<String> {
  if (!messages || messages.length <= 0)
    return "No messages yet"
  const encryptedMessage = messages[messages.length - 1]
  const aesKey = Buffer.from(await fetchAES(encryptedMessage.messageID))

  const message = aesDecrypt(encryptedMessage.encryptedText, aesKey, encryptedMessage.iv, encryptedMessage.authTag)
  return message
}

export function getLastMsgTime(messages?: Message[]): String {
  if (!messages || messages.length <= 0)
    return ""
  return messages[messages.length - 1].time
}