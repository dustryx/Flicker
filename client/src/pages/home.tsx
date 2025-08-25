import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import SwipeCard from "@/components/SwipeCard";
import { Settings, MessageCircle, Heart, X, Star, Filter } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Profile {
  id: string;
  userId: string;
  bio: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  photos: string[];
}

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 35,
    location: '',
    gender: ''
  });

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/discover", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.ageMin) params.append('ageMin', filters.ageMin.toString());
      if (filters.ageMax) params.append('ageMax', filters.ageMax.toString());
      if (filters.gender) params.append('gender', filters.gender);
      
      const response = await fetch(`/api/discover?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch profiles');
      return response.json();
    },
    retry: false,
  });

  const swipeMutation = useMutation({
    mutationFn: async (data: { swipedId: string; isLike: boolean; isSuperLike?: boolean }) => {
      const response = await apiRequest("POST", "/api/swipe", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isMatch) {
        toast({
          title: "It's a Match! 💕",
          description: "You and this person liked each other!",
        });
      }
      
      // Move to next card
      setCurrentCardIndex(prev => prev + 1);
      
      // Refetch profiles if running low
      if (currentCardIndex >= profiles.length - 2) {
        queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to process swipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSwipe = (action: 'like' | 'pass' | 'super-like') => {
    const currentProfile = profiles[currentCardIndex];
    if (!currentProfile) return;

    const swipeData = {
      swipedId: currentProfile.userId,
      isLike: action === 'like' || action === 'super-like',
      isSuperLike: action === 'super-like',
    };

    swipeMutation.mutate(swipeData);
  };

  useEffect(() => {
    // Redirect to profile setup if user hasn't completed profile
    // This would be implemented based on user data from auth
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <LoadingSpinner size="lg" text="Finding amazing people for you..." />
      </div>
    );
  }

  const currentProfile = profiles[currentCardIndex];
  const hasMoreProfiles = currentCardIndex < profiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-filters"
          >
            <Filter className="w-6 h-6 text-gray-600" />
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" data-testid="button-settings">
              <Settings className="w-6 h-6 text-gray-600" />
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center">
          <Heart className="w-8 h-8 text-red-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">LoveConnect</h1>
        </div>
        
        <Link href="/matches">
          <Button variant="ghost" size="icon" className="relative" data-testid="button-matches">
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </Link>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mx-4 mb-4 bg-white border border-gray-200">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)}
                data-testid="button-close-filters"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location-filter">Location</Label>
                <Input
                  id="location-filter"
                  placeholder="Enter city"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  data-testid="input-location-filter"
                />
              </div>
              
              <div>
                <Label htmlFor="gender-filter">Looking for</Label>
                <Select 
                  value={filters.gender} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger data-testid="select-gender-filter">
                    <SelectValue placeholder="Any gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any gender</SelectItem>
                    <SelectItem value="male">Men</SelectItem>
                    <SelectItem value="female">Women</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Age Range</Label>
                <span className="text-sm text-gray-600" data-testid="text-age-range">
                  {filters.ageMin} - {filters.ageMax}
                </span>
              </div>
              <Slider
                value={[filters.ageMin, filters.ageMax]}
                onValueChange={([min, max]) => setFilters(prev => ({ ...prev, ageMin: min, ageMax: max }))}
                min={18}
                max={65}
                step={1}
                className="w-full"
                data-testid="slider-age-filter"
              />
            </div>
            
            <Button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
                setCurrentCardIndex(0);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white"
              data-testid="button-apply-filters"
            >
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
        {hasMoreProfiles ? (
          <div className="relative w-full max-w-sm">
            {/* Card Stack */}
            <div className="relative h-96">
              {profiles.slice(currentCardIndex, currentCardIndex + 3).map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  index={index}
                  onSwipe={handleSwipe}
                  isActive={index === 0}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-8 mt-8">
              <Button
                onClick={() => handleSwipe('pass')}
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-4 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                disabled={swipeMutation.isPending}
                data-testid="button-pass"
              >
                <X className="w-8 h-8 text-gray-500" />
              </Button>

              <Button
                onClick={() => handleSwipe('super-like')}
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full border-4 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                disabled={swipeMutation.isPending}
                data-testid="button-super-like"
              >
                <Star className="w-6 h-6 text-blue-500" />
              </Button>

              <Button
                onClick={() => handleSwipe('like')}
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-4 border-green-300 hover:border-green-400 hover:bg-green-50"
                disabled={swipeMutation.isPending}
                data-testid="button-like"
              >
                <Heart className="w-8 h-8 text-green-500" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center max-w-sm">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No more profiles</h3>
            <p className="text-gray-600 mb-4">
              You've seen everyone in your area. Check back later for new profiles!
            </p>
            <Button 
              onClick={() => {
                setCurrentCardIndex(0);
                queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
              }}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white"
              data-testid="button-refresh"
            >
              Refresh
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
