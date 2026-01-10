import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Modal component with React Portal to overlay entire page
export const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEscapePress = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapePress);

        // Prevent scrolling on body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscapePress);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const getSizeClass = () => {
        switch (size) {
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            case 'xl': return 'max-w-xl';
            default: return 'max-w-md';
        }
    };

    if (!isOpen) return null;

    // Render modal in a portal at document body level to overlay entire page
    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto" dir="rtl">
            <div className="flex min-h-screen items-center justify-center px-4 py-8 text-center">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/70 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Modal panel */}
                <div
                    className={`relative inline-block w-full ${getSizeClass()} max-h-[80vh] no-scrollbar overflow-y-auto rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-right shadow-2xl transform transition-all flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex-shrink-0 px-6 py-4 bg-slate-700/50 border-b border-slate-700/50 flex items-center justify-between">
                        <button
                            type="button"
                            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-600/50"
                            onClick={onClose}
                        >
                            <span className="sr-only">إغلاق</span>
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-semibold leading-6 text-white">
                            {title}
                        </h3>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 bg-slate-800/50">
                        <div className="text-slate-200">{children}</div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
