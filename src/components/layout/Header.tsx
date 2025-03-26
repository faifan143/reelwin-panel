// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 sm:px-8 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-3">
            <span className="text-white text-base sm:text-xl font-bold">G</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            إنشاء جوهرة وتحديث الإصدار
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
