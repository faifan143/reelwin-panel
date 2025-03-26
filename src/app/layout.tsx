"use client";
import {
  GiftOutlined,
  PlayCircleOutlined,
  TagsOutlined,
  TrophyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Button, Layout, Menu, Drawer, Avatar, Tooltip } from "antd";
import { useEffect, useState } from "react";
import AdminPage from "../components/AdminPage";
import GenerateGemPage from "../components/GenerateGem";
import ManageInterests from "../components/ManageInterests";
import RewardsManagement from "../components/RewardsManagement";
import "./globals.css";

const { Content } = Layout;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Check if viewport is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // For desktop - always expanded
      if (!mobile) {
        setCollapsed(false);
      } 
      // For mobile - collapsed when not in drawer mode
      else if (mobile && !drawerVisible) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [drawerVisible]);

  const menuItems = [
    {
      key: "content",
      icon: <PlayCircleOutlined />,
      label: "إدارة المحتوى",
    },
    {
      key: "interests",
      icon: <TagsOutlined />,
      label: "إدارة الاهتمامات",
    },
    {
      key: "generate-gem",
      icon: <GiftOutlined />,
      label: "الجواهر و الإصدارات",
    },
    {
      key: "rewards",
      icon: <TrophyOutlined />,
      label: "إدارة المكافآت",
    },
  ];

  const toggleMenu = () => {
    // Only for mobile - toggle drawer visibility
    if (isMobile) {
      setDrawerVisible(!drawerVisible);
    }
  };

  const handleMenuClick = (key:string) => {
    setActiveTab(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // If not authenticated, render login page or redirect
  if (!isAuthenticated) {
    return (
      <html lang="ar" dir="rtl">
        <body>
          <QueryClientProvider client={queryClient}>
            <div className="h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">
                  تم تسجيل الخروج بنجاح
                </h1>
                <Button
                  type="primary"
                  onClick={() => setIsAuthenticated(true)}
                  className="bg-blue-600"
                >
                  تسجيل الدخول مرة أخرى
                </Button>
              </div>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </body>
      </html>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-800 to-indigo-900">
      <div className="flex justify-center items-center h-20 border-b border-blue-700 px-4">
        {collapsed && !isMobile ? (
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl font-bold">R</span>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ml-3">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-white m-0 flex-1">
              ReelWin{" "}
              <span className="text-sm font-normal opacity-75">
                لوحة الإدارة
              </span>
            </h1>
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeTab]}
        onClick={({ key }) => handleMenuClick(key)}
        className="bg-transparent border-r-0 flex-1"
        items={menuItems}
        style={{ backgroundColor: "transparent" }}
      />

      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar size="small" className="bg-blue-400">U</Avatar>
            {!collapsed && <span className="text-white/90 mr-2 text-sm">مدير النظام</span>}
          </div>
          {/* Always show logout button regardless of collapsed state */}
            <Tooltip title="تسجيل الخروج" placement="bottom">
              <Button 
                type="text" 
                icon={<LogoutOutlined />} 
                onClick={() => setIsAuthenticated(false)}
                className="text-white/80 hover:text-white hover:bg-blue-700"
                size="small"
              />
            </Tooltip>
        </div>
        <div className="text-white/60 text-center text-xs mt-2">
          {!collapsed && "ReelWin © 2025"}
        </div>
      </div>
    </div>
  );

  return (
    <html lang="ar" dir="rtl">
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout className="min-h-screen">
            {/* Mobile Top Navbar */}
            {isMobile && (
              <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-blue-800 to-indigo-900 h-16 flex items-center px-4 shadow-md">
                <Button
                  type="text"
                  icon={drawerVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                  onClick={toggleMenu}
                  className="text-white text-xl"
                />
                <div className="flex items-center mr-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2">
                    <span className="text-white text-lg font-bold">R</span>
                  </div>
                  <h1 className="text-lg font-bold text-white m-0">
                    ReelWin{" "}
                    <span className="text-xs font-normal opacity-75">
                      لوحة الإدارة
                    </span>
                  </h1>
                </div>
              </div>
            )}

            {/* Mobile Drawer */}
            {isMobile ? (
              <Drawer
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={250}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ display: "none" }}
              >
                <Sidebar />
              </Drawer>
            ) : (
              /* Desktop Sidebar */
              <div
                className="fixed right-0 top-0 h-full transition-all duration-300 ease-in-out z-40"
                style={{ width: "250px" }} // Always use full width for desktop
              >
                <Sidebar />
              </div>
            )}

            {/* Main Content */}
            <Layout
              style={{
                marginRight: isMobile ? 0 : 250, // Always use full sidebar width for desktop
                marginTop: isMobile ? 64 : 0,
                transition: "margin 0.2s",
              }}
            >
              {/* Toggle Button only for Mobile */}

              <Content className="m-4 sm:m-6 p-4 bg-gray-50 rounded-xl">
                {activeTab === "content" && <AdminPage />}
                {activeTab === "interests" && <ManageInterests />}
                {activeTab === "generate-gem" && <GenerateGemPage />}
                {activeTab === "rewards" && <RewardsManagement />}
              </Content>
            </Layout>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}