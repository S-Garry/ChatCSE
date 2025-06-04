import { Message } from "./Message";

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  messages: Message[];
}