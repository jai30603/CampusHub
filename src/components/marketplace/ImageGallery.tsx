import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="w-full h-80 sm:h-96 bg-card border border-border rounded-2xl overflow-hidden relative shadow-md">
        <img
          src={images[selectedIndex]}
          alt={`${title} - image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-border opacity-70 hover:opacity-100'
              )}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
