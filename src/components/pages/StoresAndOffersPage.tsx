import {
  BarChart4,
  Menu,
  Package,
  Store,
  Tag
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CategoriesTab from '../rewards-managment/tabs/CategoriesTab';
import { Button } from '../stores-offers/Button';
import { Tab } from '../stores-offers/Tab';
import { OffersTab } from '../stores-offers/tabs/OffersTab';
import { StoresTab } from '../stores-offers/tabs/StoresTab';
import { translations } from '../stores-offers/translations';

// Main Dashboard Page
const StoresAndOffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'stores' | 'categories'>('offers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect mobile view
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

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <BarChart4 className="mx-3 text-indigo-600" />
            {translations.businessDashboard}
          </h1>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="secondary"
              icon={<Menu size={18} className="mx-1" />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? translations.hideMenu : translations.menu}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Tabs for Desktop */}
          <div className="hidden md:flex overflow-x-auto border-b border-gray-200">
            <Tab
              active={activeTab === 'offers'}
              icon={<Package size={18} />}
              label={translations.offers}
              onClick={() => setActiveTab('offers')}
            />
            <Tab
              active={activeTab === 'stores'}
              icon={<Store size={18} />}
              label={translations.stores}
              onClick={() => setActiveTab('stores')}
            />
            <Tab
              active={activeTab === 'categories'}
              icon={<Tag size={18} />}
              label={translations.categories}
              onClick={() => setActiveTab('categories')}
            />
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-b border-gray-200`}>
            <div className="flex flex-col">
              <Tab
                active={activeTab === 'offers'}
                icon={<Package size={18} />}
                label={translations.offers}
                onClick={() => {
                  setActiveTab('offers');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
              <Tab
                active={activeTab === 'stores'}
                icon={<Store size={18} />}
                label={translations.stores}
                onClick={() => {
                  setActiveTab('stores');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
              <Tab
                active={activeTab === 'categories'}
                icon={<Tag size={18} />}
                label={translations.categories}
                onClick={() => {
                  setActiveTab('categories');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'offers' && <OffersTab />}
            {activeTab === 'stores' && <StoresTab />}
            {activeTab === 'categories' && <CategoriesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresAndOffersPage;