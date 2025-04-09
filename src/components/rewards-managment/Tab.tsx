// components/Tabs.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

interface TabProps {
    label: ReactNode | string;
    isActive: boolean;
    onClick: () => void;
    mobileView?: boolean;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, mobileView = false }) => {
    // Desktop tab style
    if (!mobileView) {
        return (
            <button
                onClick={onClick}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
            >
                {label}
            </button>
        );
    }

    // Mobile menu-style tab
    return (
        <button
            className={`flex items-center justify-start w-full gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 ${isActive
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 border-r-4 border-transparent'
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

interface TabsProps {
    tabs: {
        id: string;
        label: ReactNode | string;
        icon?: ReactNode;
    }[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Set up responsive detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTabChange = (tabId: string) => {
        onChange(tabId);
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Mobile version with toggle button */}
            {isMobile && (
                <div className="mb-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 w-full justify-between"
                    >
                        <span>
                            {tabs.find(tab => tab.id === activeTab)?.label || 'القائمة'}
                        </span>
                        <Menu size={18} />
                    </button>

                    {isMobileMenuOpen && (
                        <div className="mt-2 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.id}
                                    label={tab.label}
                                    isActive={activeTab === tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    mobileView={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Desktop version with horizontal tabs */}
            {!isMobile && (
                <div className="overflow-x-auto pb-2 mb-4">
                    <div className="flex gap-2 rtl:gap-reverse">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                label={tab.label}
                                isActive={activeTab === tab.id}
                                onClick={() => handleTabChange(tab.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

interface TabContentProps {
    id: string;
    activeTab: string;
    children: ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({
    id,
    activeTab,
    children,
}) => {
    if (id !== activeTab) return null;
    return <div className="animate-fadeIn">{children}</div>;
};