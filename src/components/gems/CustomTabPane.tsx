// CustomTabPane.tsx
import React, { ReactNode } from "react";

interface CustomTabPaneProps {
  icon: ReactNode;
  label: string;
}

const CustomTabPane: React.FC<CustomTabPaneProps> = ({ icon, label }) => {
  const tabStyles = {
    fontSize: "16px",
    padding: "12px 16px",
  };

  return (
    <div style={tabStyles} className="flex items-center justify-center">
      {icon && <span className="ml-2">{icon}</span>}
      <span className="text-sm sm:text-base">{label}</span>
    </div>
  );
};

export default CustomTabPane;
