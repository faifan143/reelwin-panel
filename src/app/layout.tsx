"use client";
import ContentManagementPage from "@/components/content/ContentManagementPage";
import useStore from "@/store"; // Import the Zustand store
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  DatabaseIcon,
  Tag01Icon,
  GiftIcon,
  Award01Icon,
  Store01Icon,
  UserCircleIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Drawer, Layout, Modal } from "antd";
import { useEffect, useState } from "react";
import AdminPage from "../components/AdminPage";
import LoginPage from "../components/LoginPage"; // Import the login page component
import ManageInterests from "../components/ManageInterests";
import "./globals.css";
import GemsVersionsManager from "@/components/gems-versions/GemsVersionsManager";
import RewardsManagementPage from "@/components/pages/RewardsAndCategoriesPage";
import StoresAndOffersPage from "@/components/pages/StoresAndOffersPage";
import { cn } from "@/lib/utils";
import { Tooltip as TooltipWrapper } from "@/components/ui/tooltip";

const { Content } = Layout;

import { StoreAuthProvider } from "@/components/stores-offers/StoreAuthContext";

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
      icon: PlayCircleIcon,
      label: "إضافة محتوى",
    },
    {
      key: "content-management", // New key for content management
      icon: DatabaseIcon,
      label: "إدارة المحتوى",
    },
    {
      key: "interests",
      icon: Tag01Icon,
      label: "إدارة الاهتمامات",
    },
    {
      key: "generate-gem",
      icon: GiftIcon,
      label: "الجواهر و الإصدارات",
    },
    {
      key: "rewards",
      icon: Award01Icon,
      label: "إدارة المكافآت",
    },
    {
      key: "stores",
      icon: Store01Icon,
      label: "إدارة المحلات و العروض",
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

  // // If not authenticated, render login page
  // Store owner login page (OTP-based)
  // TODO: Route to this page for store owners, or add a switch between admin/store login as needed
  // Example: if (storeLoginRoute) { ... }

  if (!isAuthenticated) {
    return (
      <html lang="ar" dir="rtl">
        <body>
          <QueryClientProvider client={queryClient}>
            <StoreAuthProvider>
              <LoginPage />
            </StoreAuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </body>
      </html>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl border-l border-slate-700/50">
      {/* Logo Section */}
      <div className="flex justify-center items-center h-24 border-b border-slate-700/50 px-6 bg-slate-800/50">
        {collapsed && !isMobile ? (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
        ) : (
          <div className="flex items-center w-full gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white m-0 tracking-tight">Radar</h1>
              <span className="text-sm font-medium text-slate-400">
                لوحة الإدارة
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Section with professional design */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          const isDisabled = isAddingContent && item.key !== activeTab;
          
          return (
            <button
              key={item.key}
              onClick={() => !isDisabled && handleMenuClick(item.key)}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-300 group",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className={cn(
                "transition-all duration-300 flex items-center pointer-events-none",
                isActive ? "scale-100" : "scale-95 group-hover:scale-100"
              )}>
                <HugeiconsIcon icon={item.icon} size={24} color="currentColor" />
              </span>
              {!collapsed && (
                <span className="flex-1 text-right text-base pointer-events-none">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="w-2 h-2 rounded-full bg-white pointer-events-none" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <HugeiconsIcon icon={UserCircleIcon} size={20} color="white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">
                  مدير النظام
                </span>
                <span className="text-slate-400 text-xs">مرحباً بك!</span>
              </div>
            )}
          </div>
          {/* Logout button with tooltip */}
          <TooltipWrapper
            content={
              isAddingContent
                ? "لا يمكن تسجيل الخروج أثناء إضافة المحتوى"
                : "تسجيل الخروج"
            }
            side="bottom"
          >
            <button
              onClick={handleLogout}
              disabled={isAddingContent}
              className={cn(
                "p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center",
                isAddingContent
                  ? "opacity-40 cursor-not-allowed text-slate-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-700 hover:scale-105"
              )}
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} color="currentColor" />
            </button>
          </TooltipWrapper>
        </div>
        {!collapsed && (
          <div className="text-slate-500 text-center text-xs mt-4 font-medium">
            Radar © 2025
          </div>
        )}
      </div>
    </div>
  );

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <QueryClientProvider client={queryClient}>
          <StoreAuthProvider>
            <Layout className="min-h-screen bg-transparent">
              {/* Modal for navigation warning using Ant Design (keeping for now) */}
              <Modal
                title={
                  <div className="text-right font-bold text-red-600">تحذير</div>
                }
                open={!!attemptedNavigation}
                onCancel={() => setAttemptedNavigation(null)}
                footer={[
                  <button
                    key="back"
                    onClick={() => setAttemptedNavigation(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    البقاء هنا
                  </button>,
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
                <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 h-16 flex items-center px-4 shadow-xl border-b border-slate-700/50">
                  <button
                    onClick={toggleMenu}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
                  >
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
                  </button>
                  <div className="flex items-center mx-4">
                    <div className="flex flex-col">
                      <h1 className="text-lg font-bold text-white m-0 leading-tight">
                        Radar
                      </h1>
                      <span className="text-xs font-medium text-slate-400">
                        لوحة الإدارة
                      </span>
                    </div>
                  </div>

                  {/* Show a loading indicator in the mobile header when content is being added */}
                  {isAddingContent && (
                    <div className="mx-auto flex items-center">
                      <div className="animate-pulse w-3 h-3 rounded-full bg-blue-500 mx-2"></div>
                      <span className="text-slate-300 text-xs">
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
                  styles={{
                    body: { padding: 0 },
                    header: { display: "none" }
                  }} className="sidebar-drawer"
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
                  background: "transparent",
                }}
              >
                <Content className="p-0 bg-transparent">
                  {activeTab === "content" && <AdminPage />}
                  {activeTab === "content-management" && (
                    <ContentManagementPage />
                  )}
                  {/* New content management tab */}
                  {activeTab === "interests" && <ManageInterests />}
                  {activeTab === "generate-gem" && <GemsVersionsManager />}
                  {activeTab === "rewards" && <RewardsManagementPage />}
                  {activeTab === "stores" && <StoresAndOffersPage />}
                </Content>
              </Layout>
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />

          </StoreAuthProvider>
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
