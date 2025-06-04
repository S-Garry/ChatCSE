import { DecryptedMessage } from "@/types/Message";

export default function ChatBubble({ message }: { message: DecryptedMessage }) {
  const isSelf = message.sender === "You";

  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={
          `py-2 rounded shadow text-sm bg-white pl-2 pr-5 max-w-[70%]
          ${isSelf ? "self-end" : "self-start"}`
        }
      >
        {!isSelf && (
          <div className="text-xs font-semibold text-black mb-1">
            {message.sender}
          </div>
        )}
        <div className="text-sm text-black break-words whitespace-pre-wrap">{message.decryptedText}</div>
        <div className="text-[10px] text-gray-500 mt-1">
          {message.time}
        </div>
      </div>
    </div>
  );
}
