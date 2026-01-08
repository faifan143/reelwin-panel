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
    // Desktop tab style - Dark Theme
    if (!mobileView) {
        return (
            <button
                onClick={onClick}
                type="button"
                className={`flex items-center px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border-0 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600/50'
                    }`}
                style={{ 
                    backgroundColor: isActive ? undefined : '#334155',
                    color: isActive ? 'white' : 'rgb(203, 213, 225)'
                }}
            >
                {label}
            </button>
        );
    }

    // Mobile menu-style tab - Dark Theme
    return (
        <button
            type="button"
            className={`flex items-center justify-start w-full gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 ${isActive
                ? 'bg-blue-500/20 text-blue-400 border-r-4 border-blue-500'
                : 'bg-slate-700/50 text-slate-300 hover:text-blue-400 hover:bg-slate-700/70 border-r-4 border-transparent'
                }`}
            onClick={onClick}
            style={{ 
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(51, 65, 85, 0.5)'
            }}
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
            {/* Mobile version with toggle button - Dark Theme */}
            {isMobile && (
                <div className="mb-6">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 bg-slate-700/40 text-slate-200 hover:bg-slate-700/60 w-full justify-between border border-slate-600/50"
                    >
                        <span>
                            {tabs.find(tab => tab.id === activeTab)?.label || 'القائمة'}
                        </span>
                        <Menu size={18} />
                    </button>

                    {isMobileMenuOpen && (
                        <div className="mt-2 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
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

            {/* Desktop version with horizontal tabs - Dark Theme */}
            {!isMobile && (
                <div className="overflow-x-auto pb-2 mb-6 bg-transparent">
                    <div className="flex gap-3 rtl:gap-reverse bg-transparent">
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
    return <div className="animate-fadeIn bg-transparent">{children}</div>;
};