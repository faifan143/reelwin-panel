import React from 'react';
import Badge from '../atoms/Badge';
import { Interest } from '@/types/interests';

export interface InterestTagProps {
  interest: Interest;
  onRemove?: () => void;
  className?: string;
  clickable?: boolean;
  size?: 'sm' | 'md';
}

const InterestTag: React.FC<InterestTagProps> = ({
  interest,
  onRemove,
  className = '',
  clickable = false,
  size = 'sm',
}) => {
  return (
    <Badge
      variant="primary"
      size={size}
      className={`${className} ${
        clickable || onRemove ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
      }`}
    >
      <span>{interest.name}</span>
      
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mr-1 ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          &times;
        </button>
      )}
    </Badge>
  );
};

export default InterestTag;