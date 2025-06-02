export interface Message {
  sender: string;
  encryptedText: string;
  encryptedAES: string;
  iv: string;
  authTag: string;
  time: string;
}

export interface DecryptedMessage extends Message {
  decryptedText: string;
}
