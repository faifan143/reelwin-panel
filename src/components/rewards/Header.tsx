// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          إدارة المكافآت
        </h2>
      </div>
    </div>
  );
};

export default Header;
