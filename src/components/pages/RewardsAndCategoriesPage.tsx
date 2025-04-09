
// pages/rewards-management.tsx
import { QueryClient } from '@tanstack/react-query';
import { Award, Package, Settings, Users } from 'lucide-react';
import { NextPage } from 'next';
import { useState } from 'react';
import { TabContent, Tabs } from '../rewards-managment/Tab';
import CategoriesTab from '../rewards-managment/tabs/CategoriesTab';
import RewardsTab from '../rewards-managment/tabs/RewardsTab';
import UserRequestsTab from '../rewards-managment/tabs/UserRequestsTab';

// Create a client
const queryClient = new QueryClient();

const RewardsManagementPage: NextPage = () => {
    const [activeTab, setActiveTab] = useState('rewards');

    const tabs = [
        { id: 'rewards', label: 'المكافآت', icon: <Award size={18} /> },
        { id: 'categories', label: 'الفئات', icon: <Package size={18} /> },
        { id: 'requests', label: 'طلبات المستخدمين', icon: <Users size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Settings className="inline mx-2" size={24} />
                            إدارة المكافآت
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 sm:p-6">
                        {/* Tabs */}
                        <Tabs
                            tabs={tabs.map(tab => ({
                                id: tab.id,
                                label: (
                                    <div className="flex items-center">
                                        {tab.icon}
                                        <span className="mx-1">{tab.label}</span>
                                    </div>
                                ) as unknown as string, // Type assertion needed due to JSX in label
                            }))}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />

                        {/* Tab Contents */}
                        <TabContent id="rewards" activeTab={activeTab}>
                            <RewardsTab />
                        </TabContent>

                        <TabContent id="categories" activeTab={activeTab}>
                            <CategoriesTab />
                        </TabContent>

                        <TabContent id="requests" activeTab={activeTab}>
                            <UserRequestsTab />
                        </TabContent>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RewardsManagementPage;