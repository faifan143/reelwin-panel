// components/Modal.tsx
import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}) => {
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

    if (!isOpen) return null;

    const getSizeClass = () => {
        switch (size) {
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            case 'xl': return 'max-w-xl';
            default: return 'max-w-md';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/50 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Modal panel */}
                <div
                    className={`inline-block w-full ${getSizeClass()} my-8 overflow-hidden rounded-lg bg-white text-right shadow-xl transform transition-all`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            onClick={onClose}
                        >
                            <span className="sr-only">إغلاق</span>
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {title}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};