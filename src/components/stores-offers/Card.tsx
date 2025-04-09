// Card component
export const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-5 ${className}`}>
        {children}
    </div>
);
