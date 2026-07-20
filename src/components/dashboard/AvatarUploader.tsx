import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { apiRequest } from '@/services/api';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onAvatarUpdated: (newUrl: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  onAvatarUpdated,
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be smaller than 5MB.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    // Upload to FastAPI backend
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('campushub_token');
      const response = await fetch('http://localhost:8000/api/v1/users/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.data?.avatar_url) {
        onAvatarUpdated(data.data.avatar_url);
      } else {
        throw new Error(data.message || 'Avatar upload failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image to server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-accent border-2 border-border overflow-hidden flex items-center justify-center text-muted-foreground font-bold text-2xl shadow-sm">
          {preview ? (
            <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-semibold"
        >
          Change
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-1 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              leftIcon={
                isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )
              }
              className="cursor-pointer"
            >
              {isUploading ? 'Uploading...' : 'Upload New Photo'}
            </Button>
          </label>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Recommended: Square PNG or JPG, max 5MB.
        </p>
        {error && <p className="text-xs text-danger font-medium">{error}</p>}
      </div>
    </div>
  );
};
