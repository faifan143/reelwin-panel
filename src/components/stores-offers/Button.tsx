// Button component
export const Button: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    type?: "button" | "submit" | "reset";
}> = ({
    children,
    onClick,
    className = '',
    disabled = false,
    variant = 'primary',
    size = 'md',
    icon,
    type = "button"
}) => {
        const baseClasses = "flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200";

        const variantClasses = {
            primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300",
            secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
        };

        const sizeClasses = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2.5 text-sm",
            lg: "px-6 py-3 text-base"
        };

        const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                type={type}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            >
                {children}
                {icon}
            </button>
        );
    };
