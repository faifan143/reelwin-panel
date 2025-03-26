"use client";
import {
  GiftOutlined,
  PlayCircleOutlined,
  TagsOutlined,
  TrophyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Button, Layout, Menu, Drawer, Avatar, Tooltip, Badge } from "antd";
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

  const handleMenuClick = (key: string) => {
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
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">R</span>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                  تم تسجيل الخروج بنجاح
                </h1>
                <Button
                  type="primary"
                  onClick={() => setIsAuthenticated(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0 h-10 px-6 shadow-md hover:shadow-lg transition-all"
                  size="large"
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
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-900 to-indigo-950 shadow-xl">
      {/* Logo Section */}
      <div className="flex justify-center items-center h-20 border-b border-blue-800/50 px-4">
        {collapsed && !isMobile ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">R</span>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg ml-3">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white m-0">ReelWin</h1>
              <span className="text-sm font-normal text-blue-200 opacity-90">
                لوحة الإدارة
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Section with hover effects */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeTab]}
        onClick={({ key }) => handleMenuClick(key)}
        className="bg-transparent border-r-0 flex-1 py-4"
        items={menuItems.map((item) => ({
          ...item,
          className: "my-1 mx-2 rounded-lg transition-all !text-base",
          style: {
            backgroundColor:
              activeTab === item.key
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            margin: "4px 8px",
          },
        }))}
        style={{
          backgroundColor: "transparent",
        }}
      />

      {/* User Profile Section */}
      <div className="p-4 border-t border-blue-800/50 bg-blue-900/30">
        <div className="flex items-center justify-between bg-blue-800/20 rounded-lg p-3">
          <div className="flex items-center">
            <Avatar
              size="default"
              className="bg-gradient-to-r from-blue-400 to-indigo-500 shadow-md"
              icon={<UserOutlined />}
            />
            {!collapsed && (
              <div className="flex flex-col mr-3">
                <span className="text-white text-sm font-medium">
                  مدير النظام
                </span>
                <span className="text-blue-300 text-xs">مرحباً بك!</span>
              </div>
            )}
          </div>
          {/* Always show logout button regardless of collapsed state */}
          <Tooltip title="تسجيل الخروج" placement="bottom">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => setIsAuthenticated(false)}
              className="text-white/80 hover:text-white hover:bg-blue-700/50 rounded-lg"
              size="middle"
            />
          </Tooltip>
        </div>
        <div className="text-blue-300/80 text-center text-xs mt-3">
          {!collapsed && "ReelWin © 2025"}
        </div>
      </div>
    </div>
  );

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100">
        <QueryClientProvider client={queryClient}>
          <Layout className="min-h-screen">
            {/* Mobile Top Navbar */}
            {isMobile && (
              <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-blue-900 to-indigo-950 h-16 flex items-center px-4 shadow-lg">
                <Button
                  type="text"
                  icon={
                    drawerVisible ? (
                      <MenuFoldOutlined />
                    ) : (
                      <MenuUnfoldOutlined />
                    )
                  }
                  onClick={toggleMenu}
                  className="text-white text-xl hover:bg-blue-800/50 hover:text-blue-200 transition-all rounded-lg"
                />
                <div className="flex items-center mr-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mr-3 shadow-md">
                    <span className="text-white text-lg font-bold">R</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-white m-0 leading-tight">
                      ReelWin
                    </h1>
                    <span className="text-xs font-normal text-blue-200">
                      لوحة الإدارة
                    </span>
                  </div>

                  {/* Mobile notification and user avatar */}
                  <div className="flex-1 flex justify-end">
                    <Tooltip title="الإشعارات" placement="bottom">
                      <Badge count={3} className="mr-4">
                        <Button
                          type="text"
                          icon={<AppstoreOutlined />}
                          className="text-white hover:bg-blue-800/50 rounded-lg"
                        />
                      </Badge>
                    </Tooltip>
                    <Tooltip title="الملف الشخصي" placement="bottom">
                      <Avatar
                        size="small"
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 mr-2"
                        icon={<UserOutlined />}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Drawer with improved animation */}
            {isMobile ? (
              <Drawer
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={280}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ display: "none" }}
                className="sidebar-drawer"
              >
                <Sidebar />
              </Drawer>
            ) : (
              /* Desktop Sidebar with subtle shadow and smoother transition */
              <div
                className="fixed right-0 top-0 h-full transition-all duration-300 ease-in-out z-40 shadow-xl"
                style={{ width: "280px" }} // Always use full width for desktop
              >
                <Sidebar />
              </div>
            )}

            {/* Main Content with improved styling */}
            <Layout
              style={{
                marginRight: isMobile ? 0 : 280, // Increased width for desktop
                marginTop: isMobile ? 64 : 0,
                transition: "margin 0.3s ease",
                background: "#f5f7fa",
              }}
            >
              {/* Desktop header with breadcrumb and quick actions */}
              {!isMobile && (
                <div className="bg-white h-16 shadow-sm px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <DashboardOutlined className="text-blue-800 text-lg" />
                    <span className="text-gray-800 mr-2 text-lg font-medium">
                      {activeTab === "content" && "إدارة المحتوى"}
                      {activeTab === "interests" && "إدارة الاهتمامات"}
                      {activeTab === "generate-gem" && "الجواهر و الإصدارات"}
                      {activeTab === "rewards" && "إدارة المكافآت"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Tooltip title="الإشعارات" placement="bottom">
                      <Badge count={3} className="ml-4">
                        <Button
                          type="text"
                          icon={<AppstoreOutlined />}
                          className="text-gray-600 hover:bg-gray-100 rounded-lg"
                        />
                      </Badge>
                    </Tooltip>
                    <div className="mr-4 flex items-center bg-gray-50 py-1 px-3 rounded-lg">
                      <Avatar
                        size="small"
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 ml-2"
                        icon={<UserOutlined />}
                      />
                      <span className="text-gray-800 text-sm">مدير النظام</span>
                    </div>
                  </div>
                </div>
              )}

              <Content className="m-4 sm:m-6 p-6 bg-white rounded-xl shadow-sm">
                {activeTab === "content" && <AdminPage />}
                {activeTab === "interests" && <ManageInterests />}
                {activeTab === "generate-gem" && <GenerateGemPage />}
                {activeTab === "rewards" && <RewardsManagement />}
              </Content>
            </Layout>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />

          {/* Global styles for better animations */}
          <style jsx global>{`
            .sidebar-drawer .ant-drawer-content-wrapper {
              box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
            }

            .ant-menu-item:hover {
              background-color: rgba(59, 130, 246, 0.1) !important;
            }

            .ant-menu-item-selected {
              background: linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.2),
                rgba(79, 70, 229, 0.15)
              ) !important;
              border-right: 3px solid #3b82f6 !important;
            }
          `}</style>
        </QueryClientProvider>
      </body>
    </html>
  );
}
