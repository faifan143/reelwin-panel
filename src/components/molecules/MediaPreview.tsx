import React from 'react';
import { Image, Video } from 'lucide-react';
import { MediaItem } from '@/types/content';

export interface MediaPreviewProps {
  media: MediaItem;
  onClick?: () => void;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  onClick,
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  // Icon size based on the size prop
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  // Button size based on the size prop
  const buttonSizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };
  
  // Media type styles
  const mediaTypeStyles = {
    IMAGE: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    VIDEO: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  };
  
  // If only showing the icon (compact mode)
  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${buttonSizes[size]} rounded-md ${mediaTypeStyles[media.type]} ${className}`}
        title={media.type === 'IMAGE' ? 'صورة' : 'فيديو'}
      >
        {media.type === 'IMAGE' ? (
          <Image className={iconSizes[size]} />
        ) : (
          <Video className={iconSizes[size]} />
        )}
      </button>
    );
  }
  
  // Show full preview
  return (
    <div className={`rounded-md overflow-hidden ${className}`}>
      {media.type === 'IMAGE' ? (
        <div
          className="relative cursor-pointer group"
          onClick={onClick}
        >
          <img
            src={media.url}
            alt="Media preview"
            className="w-full h-auto object-cover"
            style={{ maxHeight: size === 'sm' ? '100px' : size === 'md' ? '150px' : '200px' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
            <Image className={`${iconSizes[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        </div>
      ) : (
        <div
          className="relative cursor-pointer group"
          onClick={onClick}
        >
          <video
            src={media.url}
            poster={media.poster}
            className="w-full h-auto object-cover"
            style={{ maxHeight: size === 'sm' ? '100px' : size === 'md' ? '150px' : '200px' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
            <Video className={`${iconSizes[size]} text-white`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;