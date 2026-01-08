import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Input component wrapper for shadcn/ui
export const Input: React.FC<{
    label?: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
}> = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    className = ""
}) => (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label htmlFor={name} className="text-right text-slate-300">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </Label>
            )}
            <ShadcnInput
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                dir="rtl"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
    );

