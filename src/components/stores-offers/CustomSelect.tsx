import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Select component using shadcn/ui
export const CustomSelect: React.FC<{
    label?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    className?: string;
}> = ({
    label,
    name,
    value,
    onChange,
    options,
    placeholder,
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
            <Select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                dir="rtl"
                className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500"
            >
                {placeholder && (
                    <option value="" className="bg-slate-700">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-700">
                        {option.label}
                    </option>
                ))}
            </Select>
        </div>
    );
