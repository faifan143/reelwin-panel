// SectionHeader.tsx
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

interface SectionHeaderProps {
  title: string;
  addButtonLabel: string;
  onClick: () => void;
  isMobile: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  addButtonLabel,
  onClick,
  isMobile,
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">
        {title}
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onClick}
        className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        size={isMobile ? "middle" : "large"}
      >
        {addButtonLabel}
      </Button>
    </div>
  );
};

export default SectionHeader;
