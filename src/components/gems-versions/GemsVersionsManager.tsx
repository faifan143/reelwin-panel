import React, { useState } from 'react';
import GemsTab from './tabs/GemsTab';
import VersionsTab from './tabs/VersionsTab';
import QrCodeTab from './tabs/QrCodeTab';
import { QrCode, Gift, Package } from 'lucide-react';

const GemsVersionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gems' | 'qr-codes' | 'versions'>('gems');

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs Header */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'gems'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('gems')}
            >
              <Gift size={18} className="ml-2" />
              الجواهر
            </button>
            <button
              className={`px-6 py-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'qr-codes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('qr-codes')}
            >
              <QrCode size={18} className="ml-2" />
              رموز QR
            </button>
            <button
              className={`px-6 py-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'versions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('versions')}
            >
              <Package size={18} className="ml-2" />
              الإصدارات
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'gems' && <GemsTab />}
          {activeTab === 'qr-codes' && <QrCodeTab />}
          {activeTab === 'versions' && <VersionsTab />}
        </div>
      </div>
    </div>
  );
};

export default GemsVersionsManager;