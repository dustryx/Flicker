import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ photos, onPhotosChange, maxPhotos = 6 }: PhotoUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${maxPhotos} photos`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const newPhotos: string[] = [];
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "File too large",
            description: "Photos must be under 5MB",
            variant: "destructive",
          });
          continue;
        }

        // Convert to base64 for demo (in production, upload to cloud storage)
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newPhotos.push(base64);
      }

      onPhotosChange([...photos, ...newPhotos]);
      
      toast({
        title: "Photos uploaded!",
        description: `${newPhotos.length} photo(s) added successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {Array(maxPhotos).fill(0).map((_, index) => (
          <div key={index} className="aspect-square relative">
            {photos[index] ? (
              <div className="relative w-full h-full">
                <img 
                  src={photos[index]} 
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  onClick={() => removePhoto(index)}
                  data-testid={`remove-photo-${index}`}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <label className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-pink-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple={index === 0} // Only allow multiple on first slot
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                  data-testid={`photo-upload-${index}`}
                />
                <div className="text-center">
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-xs text-gray-500">
                    {index === 0 ? 'Add Photos' : 'Add Photo'}
                  </p>
                </div>
              </label>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-600">
          {photos.length} of {maxPhotos} photos • First photo will be your main picture
        </p>
      </div>
    </div>
  );
}