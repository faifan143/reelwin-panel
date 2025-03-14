"use client";
import {
  DashboardOutlined,
  GiftOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  TagsOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Button, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import AdminPage from "../components/AdminPage";
import GenerateGemPage from "../components/GenerateGem";
import ManageInterests from "../components/ManageInterests";
import RewardsManagement from "../components/RewardsManagement";
import "./globals.css";

const { Sider, Content } = Layout;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo

  // Check if viewport is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "لوحة التحكم",
    },
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
      label: "إنشاء جوهرة",
    },
    {
      key: "rewards",
      icon: <TrophyOutlined />,
      label: "إدارة المكافآت",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "الإعدادات",
    },
  ];

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

  return (
    <html lang="ar" dir="rtl">
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout className="min-h-screen">
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className="bg-gradient-to-b from-blue-800 to-indigo-900"
              width={250}
              collapsedWidth={isMobile ? 0 : 80}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: "auto",
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
              }}
            >
              <div className="flex justify-center items-center h-20 border-b border-blue-700">
                <div
                  className={`text-white ${
                    collapsed && !isMobile ? "w-12 h-12" : "px-4 py-2"
                  } flex items-center justify-center`}
                >
                  {collapsed && !isMobile ? (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">R</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ml-3">
                        <span className="text-white text-xl font-bold">R</span>
                      </div>
                      <h1 className="text-xl font-bold text-white m-0">
                        ReelWin{" "}
                        <span className="text-sm font-normal opacity-75">
                          لوحة الإدارة
                        </span>
                      </h1>
                    </div>
                  )}
                </div>
              </div>

              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[activeTab]}
                onClick={({ key }) => setActiveTab(key)}
                className="bg-transparent border-r-0"
                items={menuItems}
                style={{ backgroundColor: "transparent" }}
              />
              <div className="p-4 absolute bottom-0 left-0 right-0 border-t border-blue-700">
                <div className="text-white/80 text-center text-xs">
                  {!collapsed && "ReelWin © 2025"}
                </div>
              </div>
            </Sider>
            <Layout
              style={{
                marginRight: collapsed ? (isMobile ? 0 : 80) : 250,
                transition: "margin-right 0.2s",
              }}
            >
              <Content className="m-4 sm:m-6 p-4 bg-gray-50 rounded-xl">
                {activeTab === "content" && <AdminPage />}
                {activeTab === "interests" && <ManageInterests />}
                {activeTab === "generate-gem" && <GenerateGemPage />}
                {activeTab === "rewards" && <RewardsManagement />}
                {activeTab === "dashboard" && (
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      لوحة التحكم
                    </h1>
                    <p className="text-gray-600">
                      مرحباً بك في لوحة تحكم ReelWin. اختر أحد الخيارات من
                      القائمة الجانبية.
                    </p>
                  </div>
                )}
                {activeTab === "settings" && (
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      إعدادات النظام
                    </h1>
                    <p className="text-gray-600">
                      يمكنك تعديل إعدادات النظام من هنا.
                    </p>
                  </div>
                )}
              </Content>
            </Layout>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
