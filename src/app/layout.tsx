"use client";
import useStore from "@/store"; // Import the Zustand store
import {
  DatabaseOutlined,
  GiftOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  TagsOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Avatar, Button, Drawer, Layout, Menu, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import AdminPage from "../components/AdminPage";
import GenerateGemPage from "../components/GenerateGem";
import LoginPage from "../components/LoginPage"; // Import the login page component
import ManageInterests from "../components/ManageInterests";
import RewardsManagement from "../components/RewardsManagement";
import "./globals.css";
import ContentManagementPage from "@/components/content/ContentManagementPage";
import { StoreIcon } from "lucide-react";
import StoresAndOffersPage from "@/components/StoresAndOffersPage";

const { Content } = Layout;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [attemptedNavigation, setAttemptedNavigation] = useState<string | null>(
    null
  );

  // Get state and actions from the Zustand store
  const {
    isAuthenticated,
    logout,
    isAddingContent,
    setIsAddingContent,
    activeTab,
    setActiveTab,
  } = useStore();

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

  // Reset the loading state on component mount (if it was left in a loading state)
  useEffect(() => {
    return () => {
      if (isAddingContent) {
        setIsAddingContent(false);
      }
    };
  }, [isAddingContent, setIsAddingContent]);

  const menuItems = [
    {
      key: "content",
      icon: <PlayCircleOutlined />,
      label: "إضافة محتوى",
    },
    {
      key: "content-management", // New key for content management
      icon: <DatabaseOutlined />,
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
    {
      key: "stores",
      icon: <StoreIcon />,
      label: "إدارة المحلات",
    },
  ];

  const toggleMenu = () => {
    // Only for mobile - toggle drawer visibility
    if (isMobile) {
      setDrawerVisible(!drawerVisible);
    }
  };

  const handleMenuClick = (key: string) => {
    // If adding content, show warning and prevent navigation
    if (isAddingContent && key !== activeTab) {
      setAttemptedNavigation(key);
      return;
    }

    setActiveTab(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    if (!isAddingContent) {
      logout();
    }
  };

  // If not authenticated, render login page
  if (!isAuthenticated) {
    return (
      <html lang="ar" dir="rtl">
        <body>
          <QueryClientProvider client={queryClient}>
            <LoginPage />
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
          className: `my-1 mx-2 rounded-lg transition-all !text-base ${
            isAddingContent && item.key !== activeTab
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`,
          style: {
            backgroundColor:
              activeTab === item.key
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            margin: "4px 8px",
          },
          disabled: isAddingContent && item.key !== activeTab,
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
          <Tooltip
            title={
              isAddingContent
                ? "لا يمكن تسجيل الخروج أثناء إضافة المحتوى"
                : "تسجيل الخروج"
            }
            placement="bottom"
          >
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={`text-white/80 hover:text-white hover:bg-blue-700/50 rounded-lg ${
                isAddingContent ? "opacity-50 cursor-not-allowed" : ""
              }`}
              size="middle"
              disabled={isAddingContent}
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
            {/* Modal for navigation warning */}
            <Modal
              title={
                <div className="text-right font-bold text-red-600">تحذير</div>
              }
              open={!!attemptedNavigation}
              onCancel={() => setAttemptedNavigation(null)}
              footer={[
                <Button
                  key="back"
                  onClick={() => setAttemptedNavigation(null)}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  البقاء هنا
                </Button>,
              ]}
              centered
            >
              <div className="text-right">
                <p className="text-lg">جاري إضافة المحتوى...</p>
                <p className="text-gray-600">
                  لا يمكنك الانتقال إلى صفحة أخرى حتى يتم الانتهاء من العملية.
                </p>
              </div>
            </Modal>

            {/* Mobile Top Navbar */}
            {isMobile && (
              <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-blue-900 to-indigo-950 h-16 flex items-center px-4 shadow-lg">
                <Button
                  type="text"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <line x1="4" y1="6" x2="20" y2="6"></line>
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                      <line x1="4" y1="18" x2="20" y2="18"></line>
                    </svg>
                  }
                  onClick={toggleMenu}
                  className={`p-2 text-white hover:bg-blue-800/50 hover:text-blue-200 transition-all rounded-lg ${
                    isAddingContent ? "opacity-50" : ""
                  }`}
                  disabled={isAddingContent}
                />
                <div className="flex items-center mr-4">
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-white m-0 leading-tight">
                      ReelWin
                    </h1>
                    <span className="text-xs font-normal text-blue-200">
                      لوحة الإدارة
                    </span>
                  </div>
                </div>

                {/* Show a loading indicator in the mobile header when content is being added */}
                {isAddingContent && (
                  <div className="mr-auto flex items-center">
                    <div className="animate-pulse w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="text-yellow-200 text-xs">
                      جاري الإضافة...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Drawer with improved animation */}
            {isMobile ? (
              <Drawer
                placement="right"
                onClose={() => {
                  if (!isAddingContent) {
                    setDrawerVisible(false);
                  }
                }}
                open={drawerVisible}
                width={280}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ display: "none" }}
                className="sidebar-drawer"
                maskClosable={!isAddingContent}
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
              <Content className="m-4 sm:m-6 p-6 bg-white rounded-xl shadow-sm">
                {activeTab === "content" && <AdminPage />}
                {activeTab === "content-management" && (
                  <ContentManagementPage />
                )}
                {/* New content management tab */}
                {activeTab === "interests" && <ManageInterests />}
                {activeTab === "generate-gem" && <GenerateGemPage />}
                {activeTab === "rewards" && <RewardsManagement />}
                {activeTab === "stores" && <StoresAndOffersPage />}
              </Content>
            </Layout>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
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

          .ant-menu-item.opacity-50:hover {
            background-color: transparent !important;
            cursor: not-allowed;
          }

          @keyframes pulse-width {
            0%,
            100% {
              width: 15%;
            }
            50% {
              width: 85%;
            }
          }

          .animate-pulse-width {
            animation: pulse-width 2s ease-in-out infinite;
          }
        `}</style>
      </body>
    </html>
  );
}
