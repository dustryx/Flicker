import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  senderAvatar?: string;
  senderName: string;
}

export default function ChatMessage({ 
  message, 
  isOwnMessage, 
  senderAvatar, 
  senderName 
}: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  return (
    <div 
      className={`flex items-end space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.id}`}
    >
      {!isOwnMessage && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white text-sm font-semibold">
            {senderName[0]}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm" data-testid={`message-content-${message.id}`}>
            {message.content}
          </p>
        </div>
        
        <div className={`mt-1 text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          <span data-testid={`message-time-${message.id}`}>
            {timeAgo}
          </span>
          {isOwnMessage && (
            <span className="ml-2" data-testid={`message-status-${message.id}`}>
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
      
      {isOwnMessage && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm font-semibold">
            Y
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
