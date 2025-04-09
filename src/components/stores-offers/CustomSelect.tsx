
// Select component
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
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    {label}
                    {required && <span className="text-red-500 mx-1">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-200 text-right"
                dir="rtl"
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
