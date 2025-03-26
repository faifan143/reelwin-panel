// TabButton.tsx
import React, { ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  icon,
  label,
  onClick,
}) => {
  return (
    <div
      className={`tab-button flex-1 sm:flex-none py-2 sm:py-3 px-2 sm:px-6 text-sm sm:text-base font-semibold 
                 ${active ? "active-tab" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="ml-1 sm:ml-2">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default TabButton;
