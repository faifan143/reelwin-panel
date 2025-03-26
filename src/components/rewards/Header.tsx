// Header.tsx
import React from "react";
import { GiftOutlined } from "@ant-design/icons";

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-3">
          <GiftOutlined className="text-white text-base sm:text-xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          إدارة المكافآت
        </h2>
      </div>
    </div>
  );
};

export default Header;
