import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, User, Image, Bell, Shield, Crown, LogOut, ChevronRight } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [maxDistance, setMaxDistance] = useState([25]);
  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
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
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="opacity-90">Manage your preferences and account</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/profile-setup">
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto p-4"
                data-testid="button-edit-profile"
              >
                <div className="flex items-center">
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-4"
              data-testid="button-manage-photos"
            >
              <div className="flex items-center">
                <Image className="w-4 h-4 mr-3 text-gray-600" />
                <span>Manage Photos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </CardContent>
        </Card>

        {/* Discovery Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Discovery Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Age Range</Label>
                <span className="text-gray-600" data-testid="text-age-range">
                  {ageRange[0]} - {ageRange[1]}
                </span>
              </div>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                min={18}
                max={50}
                step={1}
                className="w-full"
                data-testid="slider-age-range"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Maximum Distance</Label>
                <span className="text-gray-600" data-testid="text-max-distance">
                  {maxDistance[0]} km
                </span>
              </div>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                min={1}
                max={100}
                step={1}
                className="w-full"
                data-testid="slider-max-distance"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="matches-notifications">New Matches</Label>
              <Switch
                id="matches-notifications"
                checked={notifications.matches}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, matches: checked }))
                }
                data-testid="switch-matches-notifications"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="messages-notifications">New Messages</Label>
              <Switch
                id="messages-notifications"
                checked={notifications.messages}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, messages: checked }))
                }
                data-testid="switch-messages-notifications"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="likes-notifications">Someone Likes You</Label>
              <Switch
                id="likes-notifications"
                checked={notifications.likes}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, likes: checked }))
                }
                data-testid="switch-likes-notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* Premium */}
        {!(user as any)?.isPremium && (
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <Link href="/premium">
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg"
                  data-testid="button-upgrade-premium"
                >
                  <Crown className="w-5 h-5 mr-3" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-4"
              data-testid="button-privacy-safety"
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-3 text-gray-600" />
                <span>Privacy & Safety</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
            
            <Separator />
            
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <div className="flex items-center">
                <LogOut className="w-4 h-4 mr-3" />
                <span>Sign Out</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
