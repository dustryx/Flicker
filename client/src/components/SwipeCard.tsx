import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, X, Star } from "lucide-react";

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

interface SwipeCardProps {
  profile: Profile;
  index: number;
  onSwipe: (action: 'like' | 'pass' | 'super-like') => void;
  isActive: boolean;
}

export default function SwipeCard({ profile, index, onSwipe, isActive }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mock photo if none provided
  const photos = profile.photos?.length > 0 ? profile.photos : [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
  ];

  const handlePhotoClick = (e: React.MouseEvent) => {
    if (isDragging) return; // Don't change photo when swiping
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const cardWidth = rect.width;
    
    if (clickX > cardWidth / 2) {
      setCurrentPhotoIndex(prev => 
        prev < photos.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentPhotoIndex(prev => 
        prev > 0 ? prev - 1 : photos.length - 1
      );
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipe('like');
      } else {
        onSwipe('pass');
      }
    } else if (deltaY < -threshold) {
      onSwipe('super-like');
    }
    
    // Reset position
    setDragOffset({ x: 0, y: 0 });
  };

  // Calculate rotation and scale based on drag
  const rotation = dragOffset.x * 0.1;
  const scale = isDragging ? 1.05 : 1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300);

  // Show action indicators
  const showLike = dragOffset.x > 50;
  const showPass = dragOffset.x < -50;
  const showSuperLike = dragOffset.y < -50;

  return (
    <Card 
      ref={cardRef}
      className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 select-none ${
        isActive ? 'z-30 cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isDragging ? 'transition-none' : ''}`}
      style={{
        zIndex: 30 - index,
        transform: `scale(${scale * (1 - index * 0.05)}) translateY(${index * 10}px) translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: isActive ? opacity : 1,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={`swipe-card-${profile.id}`}
    >
      {/* Action Indicators */}
      {isActive && (
        <>
          {showLike && (
            <div className="absolute top-16 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg border-4 border-white shadow-lg rotate-12">
              <Heart className="w-6 h-6 inline mr-2" />LIKE
            </div>
          )}
          {showPass && (
            <div className="absolute top-16 left-6 z-50 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg border-4 border-white shadow-lg -rotate-12">
              <X className="w-6 h-6 inline mr-2" />NOPE
            </div>
          )}
          {showSuperLike && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg border-4 border-white shadow-lg">
              <Star className="w-6 h-6 inline mr-2" />SUPER LIKE
            </div>
          )}
        </>
      )}
      
      {/* Photo Section */}
      <div className="relative h-96" onClick={handlePhotoClick}>
        <img 
          src={photos[currentPhotoIndex]} 
          alt="Profile photo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600";
          }}
        />
        
        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex space-x-1">
            {photos.map((_, photoIndex) => (
              <div
                key={photoIndex}
                className={`flex-1 h-1 rounded-full transition-all ${
                  photoIndex === currentPhotoIndex 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold" data-testid={`profile-name-${profile.id}`}>
              {profile.userId ? profile.userId.split('-')[2] || 'User' : 'User'}, {profile.age}
            </h2>
            {profile.location && (
              <div className="flex items-center text-sm opacity-90">
                <MapPin className="w-4 h-4 mr-1" />
                <span data-testid={`profile-location-${profile.id}`}>
                  {profile.location}
                </span>
              </div>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-sm mb-3 opacity-90" data-testid={`profile-bio-${profile.id}`}>
              {profile.bio}
            </p>
          )}
          
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 3).map(interest => (
                <Badge 
                  key={interest}
                  variant="secondary" 
                  className="text-xs bg-white/20 text-white border-white/30"
                  data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-white/20 text-white border-white/30"
                >
                  +{profile.interests.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
