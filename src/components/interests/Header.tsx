// Header.tsx
import React from "react";
import { Button } from "antd";
import {
  PlusCircleOutlined,
  UsergroupAddOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

interface HeaderProps {
  onAdd: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdd }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 border-b pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center mb-3 sm:mb-0">
          <UsergroupAddOutlined
            style={{ marginLeft: "12px", color: "#3b82f6" }}
          />
          إدارة الاهتمامات
        </h2>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0 rounded-lg hover:from-blue-700 hover:to-indigo-800 h-10 w-full sm:w-auto"
          size="large"
        >
          إضافة اهتمام جديد
        </Button>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg mb-4 sm:mb-6 text-blue-800 text-sm border border-blue-200 flex items-start">
        <InfoCircleOutlined style={{ marginLeft: "8px", fontSize: "16px" }} />
        <span>
          قم بإدارة الاهتمامات التي سيتم استخدامها لتصنيف المحتوى واستهداف
          المستخدمين المناسبين.
        </span>
      </div>
    </>
  );
};

export default Header;
