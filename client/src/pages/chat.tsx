import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import { ArrowLeft, Send, Camera, MoreVertical } from "lucide-react";

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function Chat() {
  const [match, params] = useRoute("/chat/:matchId");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messageInput, setMessageInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const matchId = params?.matchId || "1";

  // Mock current user ID - in real app this would come from auth
  const currentUserId = "current-user";

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/matches", matchId, "messages"],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/matches/${matchId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ 
        queryKey: ["/api/matches", matchId, "messages"] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    sendMessageMutation.mutate(messageInput.trim());
  };

  // WebSocket connection for real-time messages
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log("WebSocket connected");
      setWs(websocket);
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' && data.matchId === matchId) {
          queryClient.invalidateQueries({ 
            queryKey: ["/api/matches", matchId, "messages"] 
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };
    
    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };
    
    return () => {
      websocket.close();
    };
  }, [matchId, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!match) {
    return <div>Chat not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Mock match data - in real app this would come from the match query
  const matchUser = {
    id: "match-user",
    name: "Jessica",
    avatar: "",
    isOnline: true,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <Link href="/matches">
          <Button variant="ghost" size="sm" className="mr-4" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src={matchUser.avatar} alt={matchUser.name} />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white font-semibold">
            {matchUser.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800" data-testid="text-chat-name">
            {matchUser.name}
          </h3>
          <p className="text-sm text-green-500" data-testid="text-chat-status">
            {matchUser.isOnline ? "Online" : "Offline"}
          </p>
        </div>
        
        <Button variant="ghost" size="sm" data-testid="button-chat-options">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Card className="p-6 mx-auto max-w-sm">
              <h3 className="text-lg font-semibold mb-2">Say Hello! 👋</h3>
              <p className="text-gray-600 mb-4">
                You matched with {matchUser.name}. Start the conversation!
              </p>
            </Card>
          </div>
        ) : (
          messages.map((message: Message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              senderAvatar={message.senderId === currentUserId ? "" : matchUser.avatar}
              senderName={message.senderId === currentUserId ? "You" : matchUser.name}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            data-testid="button-camera"
          >
            <Camera className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="pr-12 rounded-full"
              disabled={sendMessageMutation.isPending}
              data-testid="input-message"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-pink-500 hover:text-pink-600"
              disabled={!messageInput.trim() || sendMessageMutation.isPending}
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
