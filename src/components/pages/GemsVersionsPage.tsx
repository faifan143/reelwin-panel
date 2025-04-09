// pages/content-management.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Settings, Gem, Download } from 'lucide-react';
import GemsTab from '../gems-versions/tabs/GemsTab';
import VersionsTab from '../gems-versions/tabs/VersionsTab';
import { TabContent, Tabs } from '../rewards-managment/Tab';

// Create a client
const queryClient = new QueryClient();

const GemsVersionsPage: NextPage = () => {
    const [activeTab, setActiveTab] = useState('gems');

    const tabs = [
        {
            id: 'gems',
            label: (
                <div className="flex items-center">
                    <Gem size={18} />
                    <span className="mr-1 rtl:mr-0 rtl:ml-1">إدارة الجواهر</span>
                </div>
            )
        },
        {
            id: 'versions',
            label: (
                <div className="flex items-center">
                    <Download size={18} />
                    <span className="mr-1 rtl:mr-0 rtl:ml-1">إدارة الإصدارات</span>
                </div>
            )
        },
    ];

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-100" dir="rtl">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Settings className="inline ml-2" size={24} />
                                إدارة الجواهر و الإصدارات
                            </h1>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-4 sm:p-6">
                            {/* Responsive tabs with mobile optimization */}
                            <Tabs
                                tabs={tabs}
                                activeTab={activeTab}
                                onChange={setActiveTab}
                            />

                            {/* Tab Contents */}
                            <TabContent id="gems" activeTab={activeTab}>
                                <GemsTab />
                            </TabContent>

                            <TabContent id="versions" activeTab={activeTab}>
                                <VersionsTab />
                            </TabContent>
                        </div>
                    </div>
                </main>

                <footer className="bg-white shadow-inner mt-8 py-4">
                    <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                        <p>لوحة تحكم إدارة المحتوى © {new Date().getFullYear()}</p>
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    );
};

export default GemsVersionsPage;