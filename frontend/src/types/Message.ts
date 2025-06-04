export interface Message {
  messageID: string;
  sender: string;
  encryptedText: string;
  iv: string;
  authTag: string;
  time: string;
}

export interface DecryptedMessage extends Message {
  decryptedText: string;
}
