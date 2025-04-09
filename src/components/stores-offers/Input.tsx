// Input component
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
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    {label}
                    {required && <span className="text-red-500 mx-1">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-right"
                dir="rtl"
            />
        </div>
    );

