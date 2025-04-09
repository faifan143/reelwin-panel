// components/Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    icon,
    className = '',
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'secondary':
                return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'warning':
                return 'bg-yellow-500 hover:bg-yellow-600 text-white';
            default:
                return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'py-1 px-2 text-xs';
            case 'md':
                return 'py-2 px-4 text-sm';
            case 'lg':
                return 'py-2 px-6 text-base';
            default:
                return 'py-2 px-4 text-sm';
        }
    };

    const baseClasses = 'rounded-md font-medium focus:outline-none transition-colors duration-200 flex items-center justify-center';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${disabledClasses} ${widthClass} ${className}`}
        >
            {icon && <span className="mx-2 rtl:mx-2 rtl:mx-0">{icon}</span>}
            {children}
        </button>
    );
};