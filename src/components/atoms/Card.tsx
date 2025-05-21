import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  compact?: boolean;
  raised?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  footer,
  compact = false,
  raised = false,
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Shadow classes
  const shadowClasses = raised ? 'shadow-md' : 'shadow-sm';
  
  // Border classes
  const borderClasses = 'border border-gray-200';
  
  // Combine classes
  const cardClasses = `${baseClasses} ${shadowClasses} ${borderClasses} ${className}`;
  
  // Padding classes for content
  const contentPadding = compact ? 'p-3' : 'p-5';
  
  return (
    <div className={cardClasses}>
      {header && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50">
          {header}
        </div>
      )}
      
      <div className={contentPadding}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 border-t border-gray-200 sm:px-6 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;