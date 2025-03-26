// GenerateGemPage.tsx
import {
  AppstoreAddOutlined,
  ClearOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import CustomTabPane from "./gems/CustomTabPane";
import GemGenerationTab from "./gems/GemGenerationTab";
import VersionUpdateTab from "./gems/VersionUpdateTab";
import ClearUpdatesTab from "./gems/ClearUpdatesTab";
import ErrorDisplay from "./gems/ErrorDisplay";
import Footer from "./layout/Footer";

const { TabPane } = Tabs;

const GenerateGemPage: React.FC = () => {
  // States
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [versionError, setVersionError] = useState<string | null>(null);
  const [clearError, setClearError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gem");

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("reelWinToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle error clearing when changing tabs
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setError(null);
    setVersionError(null);
    setClearError(null);
  };

  // Determine which error to show based on active tab
  const getCurrentError = () => {
    switch (activeTab) {
      case "gem":
        return error;
      case "version":
        return versionError;
      case "clear":
        return clearError;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      {/* Header */}
      <Header />

      <div className="p-4 sm:p-8">
        {/* Custom tab bar */}
        <Tabs
          defaultActiveKey="gem"
          className="mb-4 sm:mb-6"
          type="card"
          size="large"
          onChange={handleTabChange}
          tabBarStyle={{
            marginBottom: "16px",
            borderBottom: "1px solid #e0e0e0",
            padding: "0 8px",
            overflowX: "auto",
            flexWrap: "nowrap",
            display: "flex",
          }}
          tabBarGutter={8}
        >
          <TabPane
            tab={
              <CustomTabPane
                icon={<AppstoreAddOutlined />}
                label="إنشاء جوهرة"
              />
            }
            key="gem"
          >
            <GemGenerationTab token={token} setError={setError} />
          </TabPane>

          <TabPane
            tab={
              <CustomTabPane icon={<UploadOutlined />} label="تحديث الإصدار" />
            }
            key="version"
          >
            <VersionUpdateTab token={token} setError={setVersionError} />
          </TabPane>

          <TabPane
            tab={
              <CustomTabPane icon={<ClearOutlined />} label="مسح التحديثات" />
            }
            key="clear"
          >
            <ClearUpdatesTab token={token} setError={setClearError} />
          </TabPane>
        </Tabs>

        {/* Error Display */}
        <ErrorDisplay error={getCurrentError()} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GenerateGemPage;
