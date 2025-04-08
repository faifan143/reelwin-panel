"use client";
import React, { useState } from "react";
import { AppstoreOutlined, ShopOutlined, TagsOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import CategoryManagementPage from "./stores/CategoryPage";
import OfferManagementPage from "./stores/OfferManagmentPage";
import StoreManagementPage from "./stores/StoreManagmentPage";

const { TabPane } = Tabs;

// Custom tab pane component
const CustomTabPane = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center">
    {icon}
    <span className="mr-2 text-sm">{label}</span>
  </div>
);

export default function StoresAndOffersPage() {
  const [activeTab, setActiveTab] = useState("offers");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h2 className="text-2xl font-bold text-white">إدارة المتاجر والعروض</h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs
          defaultActiveKey="offers"
          onChange={handleTabChange}
          type="card"
          size="large"
          className="mb-8"
          tabBarStyle={{
            marginBottom: "24px",
            borderBottom: "1px solid #e0e0e0",
            padding: "0 16px",
          }}
        >
          <TabPane
            tab={
              <CustomTabPane
                icon={<TagsOutlined style={{ fontSize: '18px' }} />}
                label="العروض"
              />
            }
            key="offers"
          >
            {activeTab === "offers" && <OfferManagementPage />}
          </TabPane>

          <TabPane
            tab={
              <CustomTabPane
                icon={<ShopOutlined style={{ fontSize: '18px' }} />}
                label="المتاجر"
              />
            }
            key="stores"
          >
            {activeTab === "stores" && <StoreManagementPage />}
          </TabPane>

          <TabPane
            tab={
              <CustomTabPane
                icon={<AppstoreOutlined style={{ fontSize: '18px' }} />}
                label="فئات العروض"
              />
            }
            key="categories"
          >
            {activeTab === "categories" && <CategoryManagementPage />}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}