// pages/content-management.tsx
import React, { useState } from "react";
import { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Settings, Gem, Download, QrCode } from "lucide-react";
import GemsTab from "../gems-versions/tabs/GemsTab";
import VersionsTab from "../gems-versions/tabs/VersionsTab";
import QrCodeTab from "../gems-versions/tabs/QrCodeTab";
import TheHuntTab from "../the-hunt/TheHuntTab";
import { TabContent, Tabs } from "../rewards-managment/Tab";

// Create a client
const queryClient = new QueryClient();

const GemsVersionsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState("gems");

  const tabs = [
    {
      id: "gems",
      label: (
        <div className="flex items-center gap-2">
          <Gem size={18} className="text-inherit" />
          <span className="mr-1 rtl:mr-0 rtl:ml-1">الجواهر</span>
        </div>
      ),
    },
    {
      id: "qrcodes",
      label: (
        <div className="flex items-center gap-2">
          <QrCode size={18} className="text-inherit" />
          <span className="mr-1 rtl:mr-0 rtl:ml-1">رموز QR</span>
        </div>
      ),
    },
    {
      id: "the-hunt",
      label: (
        <div className="flex items-center gap-2">
          <QrCode size={18} className="text-inherit" />
          <span className="mr-1 rtl:mr-0 rtl:ml-1">الرحلة</span>
        </div>
      ),
    },
    {
      id: "versions",
      label: (
        <div className="flex items-center gap-2">
          <Download size={18} className="text-inherit" />
          <span className="mr-1 rtl:mr-0 rtl:ml-1">الإصدارات</span>
        </div>
      ),
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
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
                  إدارة الجواهر و الإصدارات
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  إدارة نظام المكافآت وإصدارات التطبيق
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
            <div className="p-4 sm:p-6" style={{ backgroundColor: 'transparent' }}>
              {/* Responsive tabs with mobile optimization */}
              <div className="mb-6 bg-transparent">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              </div>

              {/* Tab Contents */}
              <div className="mt-6 bg-transparent">
                <TabContent id="gems" activeTab={activeTab}>
                  <GemsTab />
                </TabContent>

                <TabContent id="qrcodes" activeTab={activeTab}>
                  <QrCodeTab />
                </TabContent>

                <TabContent id="the-hunt" activeTab={activeTab}>
                  <TheHuntTab />
                </TabContent>

                <TabContent id="versions" activeTab={activeTab}>
                  <VersionsTab />
                </TabContent>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-slate-800/40 backdrop-blur-xl border-t border-slate-700/50 mt-8 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
            <p>لوحة تحكم إدارة المحتوى © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default GemsVersionsPage;
