import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
}

export default function Matches() {
  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 mr-4"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Matches</h1>
        </div>
        <p className="opacity-90">Start conversations with your matches</p>
      </div>

      <div className="p-6 space-y-6">
        {/* New Matches Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">New Matches</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {/* Mock new matches */}
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-400 mb-2">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="" alt="Match" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white text-lg font-semibold">
                      {String.fromCharCode(65 + index)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm font-medium" data-testid={`match-name-${index}`}>
                  User {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <Card className="p-8 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">No matches yet</h3>
                <p className="text-gray-600 mb-4">
                  Start swiping to find your perfect match!
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                    Start Swiping
                  </Button>
                </Link>
              </Card>
            ) : (
              // Mock conversation list since we don't have actual conversation data
              Array(3).fill(0).map((_, index) => (
                <Link key={index} href={`/chat/${index}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" data-testid={`conversation-${index}`}>
                    <div className="flex items-center">
                      <Avatar className="w-14 h-14 mr-4">
                        <AvatarImage src="" alt="Match" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg font-semibold">
                          {String.fromCharCode(65 + index)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800" data-testid={`conversation-name-${index}`}>
                            User {index + 1}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {index === 0 ? "2h ago" : index === 1 ? "1d ago" : "3d ago"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600" data-testid={`conversation-preview-${index}`}>
                          {index === 0 && "Hey! How's your day going? 😊"}
                          {index === 1 && "Would love to grab coffee sometime!"}
                          {index === 2 && "Thanks for the match! What do you like to do for fun?"}
                        </p>
                      </div>
                      
                      {index === 0 && (
                        <Badge className="bg-pink-500 text-white ml-2">New</Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
