import {
  BarChart4,
  Menu,
  Package,
  Store,
  Tag,
  Building2
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { OffersTab } from '../stores-offers/tabs/OffersTab';
import { StoresTab } from '../stores-offers/tabs/StoresTab';
import { translations } from '../stores-offers/translations';
import { CategoriesTab } from '../stores-offers/tabs/CategoriesTab';
import { StoreCategoriesTab } from '../stores-offers/tabs/StoreCategoriesTab';

// Main Dashboard Page
const StoresAndOffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'stores' | 'categories' | 'storeCategories'>('offers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Professional Dark Header */}
      <header className="bg-slate-800/40 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              {/* Icon Badge */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <BarChart4 className="w-7 h-7 text-white" />
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {translations.businessDashboard}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  إدارة المتاجر والعروض والفئات
                </p>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700"
              >
                <Menu size={18} className="ml-1" />
                {isMobileMenuOpen ? translations.hideMenu : translations.menu}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            {/* Tabs for Desktop */}
            <div className="hidden md:block border-b border-slate-700/50 bg-slate-800/30">
              <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="offers"
                  className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300 px-6 py-4"
                >
                  <Package size={18} className="text-inherit" />
                  {translations.offers}
                </TabsTrigger>
                <TabsTrigger
                  value="stores"
                  className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300 px-6 py-4"
                >
                  <Store size={18} className="text-inherit" />
                  {translations.stores}
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300 px-6 py-4"
                >
                  <Tag size={18} className="text-inherit" />
                  {translations.categories}
                </TabsTrigger>
                <TabsTrigger
                  value="storeCategories"
                  className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300 px-6 py-4"
                >
                  <Building2 size={18} className="text-inherit" />
                  {translations.storeCategories}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-b border-slate-700/50 bg-slate-800/30`}>
              <TabsList className="w-full flex-col h-auto rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="offers"
                  className="w-full justify-start gap-2 rounded-none border-r-4 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package size={18} className="text-inherit" />
                  {translations.offers}
                </TabsTrigger>
                <TabsTrigger
                  value="stores"
                  className="w-full justify-start gap-2 rounded-none border-r-4 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store size={18} className="text-inherit" />
                  {translations.stores}
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="w-full justify-start gap-2 rounded-none border-r-4 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tag size={18} className="text-inherit" />
                  {translations.categories}
                </TabsTrigger>
                <TabsTrigger
                  value="storeCategories"
                  className="w-full justify-start gap-2 rounded-none border-r-4 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-slate-400 hover:text-slate-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Building2 size={18} className="text-inherit" />
                  {translations.storeCategories}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 sm:p-6 bg-transparent">
              <TabsContent value="offers" className="mt-0">
                <OffersTab />
              </TabsContent>
              <TabsContent value="stores" className="mt-0">
                <StoresTab />
              </TabsContent>
              <TabsContent value="categories" className="mt-0">
                <CategoriesTab />
              </TabsContent>
              <TabsContent value="storeCategories" className="mt-0">
                <StoreCategoriesTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default StoresAndOffersPage;