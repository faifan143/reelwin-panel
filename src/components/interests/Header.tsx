// Header.tsx
import React from "react";
import { Button } from "antd";
import { Users, PlusCircle, Info } from "lucide-react";

interface HeaderProps {
  onAdd: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdd }) => {
  return (
    <>
      {/* Professional Dark Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
          <div className="flex items-start gap-4">
            {/* Icon Badge */}
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-7 h-7 text-white" />
            </div>
            
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
          إدارة الاهتمامات
              </h1>
              <p className="text-slate-400 text-sm">
                إدارة تصنيف المحتوى واستهداف المستخدمين المناسبين
              </p>
            </div>
          </div>

          {/* Add Button */}
        <Button
          type="primary"
          onClick={onAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-blue-500/20 w-full sm:w-auto flex items-center justify-center gap-2"
          size="large"
        >
            <PlusCircle className="w-5 h-5" />
            <span>إضافة اهتمام جديد</span>
        </Button>
      </div>

        {/* Info Banner */}
        <div className="p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            قم بإدارة الاهتمامات التي سيتم استخدامها لتصنيف المحتوى واستهداف المستخدمين المناسبين.
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
