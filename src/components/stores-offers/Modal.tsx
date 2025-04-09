
// Modal component for confirmations and forms
export const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};
