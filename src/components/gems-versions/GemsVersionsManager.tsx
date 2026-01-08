import { Gift, Package, QrCode } from "lucide-react";
import React, { useState } from "react";
import TheHuntTab from "../the-hunt/TheHuntTab";
import GemsTab from "./tabs/GemsTab";
import QrCodeTab from "./tabs/QrCodeTab";
import VersionsTab from "./tabs/VersionsTab";

const GemsVersionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "gems" | "qr-codes" | "the-hunt" | "versions"
  >("gems");

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      <div className="w-full bg-slate-800/40 backdrop-blur-xl  border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Tabs Header - Dark Theme */}
        <div className="border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex overflow-x-auto">
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "gems"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("gems")}
            >
              <Gift size={18} className="text-inherit" />
              الجواهر
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "qr-codes"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("qr-codes")}
            >
              <QrCode size={18} className="text-inherit" />
              رموز QR
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "the-hunt"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("the-hunt")}
            >
              <QrCode size={18} className="text-inherit" />
              الرحلة
            </button>
            <button
              type="button"
              className={`px-6 py-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === "versions"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-700/30"
              }`}
              onClick={() => setActiveTab("versions")}
            >
              <Package size={18} className="text-inherit" />
              الإصدارات
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 bg-transparent min-h-[600px]">
          {activeTab === "gems" && <GemsTab />}
          {activeTab === "qr-codes" && <QrCodeTab />}
          {activeTab === "the-hunt" && <TheHuntTab />}
          {activeTab === "versions" && <VersionsTab />}
        </div>
      </div>
    </div>
  );
};

export default GemsVersionsManager;
