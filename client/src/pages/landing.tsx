import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, MessageCircle, Crown } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 text-white relative overflow-hidden">
      {/* Floating background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-20 left-10 text-white/20 w-8 h-8 animate-pulse" />
        <Heart className="absolute top-40 right-8 text-white/15 w-6 h-6 animate-bounce" />
        <Heart className="absolute bottom-32 left-6 text-white/25 w-7 h-7" />
        <Heart className="absolute top-60 left-1/2 text-white/10 w-5 h-5 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 text-white animate-pulse mr-3" />
            <h1 className="text-5xl font-bold">LoveConnect</h1>
          </div>
          <p className="text-xl opacity-90 mb-8">Find your perfect match today</p>
          <p className="text-lg opacity-75">Join millions finding love worldwide</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-white/80">Find compatible people based on your interests and preferences</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-white/80">Connect instantly with your matches through our chat system</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
              <p className="text-white/80">Unlock unlimited likes, super likes, and exclusive features</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="max-w-sm mx-auto space-y-4">
          <Button 
            onClick={() => window.location.href = '/terms-privacy'}
            size="lg"
            className="w-full bg-white text-pink-600 hover:bg-gray-50 font-semibold text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            data-testid="button-login"
          >
            <Heart className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          
          <p className="text-center text-sm opacity-75">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>

        {/* Stats */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm opacity-75">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm opacity-75">Daily Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm opacity-75">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
