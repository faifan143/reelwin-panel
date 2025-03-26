// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 sm:px-8 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            إنشاء جوهرة وتحديث الإصدار
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
