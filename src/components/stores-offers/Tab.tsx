// Tab component
export const Tab: React.FC<{
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    mobileView?: boolean;
}> = ({ active, icon, label, onClick, mobileView = false }) => {
    // For desktop view
    if (!mobileView) {
        return (
            <button
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm rounded-t-lg transition-all duration-200 ${active
                    ? 'bg-white text-indigo-600 border-t-2 border-l border-r border-indigo-500 shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:text-indigo-500 hover:bg-gray-100'
                    }`}
                onClick={onClick}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    }

    // For mobile view
    return (
        <button
            className={`flex items-center justify-start w-full gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 ${active
                ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500'
                : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50 border-r-4 border-transparent'
                }`}
            onClick={onClick}
        >
            <span className="w-6">{icon}</span>
            <span>{label}</span>
        </button>
    );
};
