import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  error,
  fullWidth = true,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'block rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Error classes
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  // Icon padding
  const paddingClasses = leftIcon ? 'pl-10' : (rightIcon ? 'pr-10' : '');
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${widthClasses} ${errorClasses} ${disabledClasses} ${paddingClasses} ${className}`;
  
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {leftIcon}
        </div>
      )}
      
      <input 
        className={inputClasses} 
        disabled={disabled}
        {...props} 
      />
      
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {rightIcon}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;