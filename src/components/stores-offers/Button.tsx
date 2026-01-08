import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Button component wrapper for shadcn/ui
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
        const variantMap = {
            primary: "default" as const,
            secondary: "outline" as const,
            danger: "destructive" as const,
        };

        const sizeMap = {
            sm: "sm" as const,
            md: "default" as const,
            lg: "lg" as const,
        };

        // Custom dark theme classes for each variant
        const getVariantClasses = () => {
            switch (variant) {
                case 'primary':
                    return 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 border-0';
                case 'secondary':
                    return 'bg-slate-700/60 hover:bg-slate-700/80 text-slate-200 border border-slate-600/50 shadow-sm';
                case 'danger':
                    return 'bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-500/20 border-0';
                default:
                    return '';
            }
        };

        return (
            <ShadcnButton
                onClick={onClick}
                disabled={disabled}
                type={type}
                variant={variantMap[variant]}
                size={sizeMap[size]}
                className={cn("gap-2 transition-all duration-200", getVariantClasses(), className)}
            >
                {children}
                {icon}
            </ShadcnButton>
        );
    };
