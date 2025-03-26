// CustomTabPane.tsx
import React, { ReactNode } from "react";

interface CustomTabPaneProps {
  icon: ReactNode;
  label: string;
}

const CustomTabPane: React.FC<CustomTabPaneProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center justify-center w-full">
      {icon && <span className="mr-1 sm:mr-2">{icon}</span>}
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  );
};

export default CustomTabPane;
