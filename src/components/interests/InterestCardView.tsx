// InterestCardView.tsx
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Tag, Tooltip } from "antd";
import React from "react";
import { Interest } from "./types";

interface InterestCardViewProps {
  interests: Interest[] | undefined;
  onEdit: (interest: Interest) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean; // Made optional to avoid the warning
}

const InterestCardView: React.FC<InterestCardViewProps> = ({
  interests,
  onEdit,
  onDelete,
}) => {
  const getGenderDisplayText = (gender: string | null | undefined) => {
    if (gender === "MALE") return "ذكر";
    if (gender === "FEMALE") return "أنثى";
    return "الكل";
  };

  const getGenderTagColor = (gender: string | null | undefined) => {
    if (gender === "MALE") return "blue";
    if (gender === "FEMALE") return "magenta";
    return "default";
  };

  if (!interests || interests.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-400 text-lg mb-2">لا توجد بيانات</div>
        <div className="text-gray-500">
          لم يتم العثور على أي اهتمامات، يمكنك إضافة اهتمامات جديدة
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {interests.map((interest) => (
        <Card
          key={interest.id}
          className="w-full shadow-sm border-gray-200 hover:border-blue-300 transition-colors"
          bodyStyle={{ padding: "16px" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                {interest.name}
              </h3>

              <div className="flex items-center mb-2">
                <Tag
                  color={getGenderTagColor(interest.targetedGender)}
                  className="ml-3"
                >
                  {getGenderDisplayText(interest.targetedGender)}
                </Tag>

                <div className="flex items-center">
                  <CalendarOutlined
                    style={{ color: "#6b7280", marginLeft: "6px" }}
                  />
                  <span>
                    {interest.minAge} - {interest.maxAge} سنة
                  </span>
                </div>
              </div>
            </div>

            <Space direction="vertical" size="small">
              <Tooltip title="تعديل">
                <Button
                  onClick={() => onEdit(interest)}
                  icon={<EditOutlined />}
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600 border-0"
                />
              </Tooltip>
              <Popconfirm
                title="تأكيد الحذف"
                description="هل أنت متأكد من رغبتك في حذف هذا الاهتمام؟"
                onConfirm={() => onDelete(interest.id)}
                okText="نعم"
                cancelText="لا"
                placement="left"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InterestCardView;
