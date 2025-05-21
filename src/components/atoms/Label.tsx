import React from 'react';

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ms-1">*</span>}
    </label>
  );
};

export default Label;