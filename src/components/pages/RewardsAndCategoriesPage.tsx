
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
            {/* Professional Dark Header */}
            <header className="bg-slate-800/40 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        {/* Icon Badge */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Settings className="w-7 h-7 text-white" />
                        </div>
                        
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                إدارة المكافآت
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                إدارة المكافآت والفئات وطلبات المستخدمين
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                    <div className="p-4 sm:p-6 bg-transparent">
                        {/* Tabs */}
                        <Tabs
                            tabs={tabs.map(tab => ({
                                id: tab.id,
                                label: (
                                    <div className="flex items-center gap-2">
                                        <span className="text-inherit">{tab.icon}</span>
                                        <span className="mx-1">{tab.label}</span>
                                    </div>
                                ) as unknown as string, // Type assertion needed due to JSX in label
                            }))}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />

                        {/* Tab Contents */}
                        <div className="mt-6 bg-transparent">
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
                </div>
            </main>
        </div>
    );
};

export default RewardsManagementPage;