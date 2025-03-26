/* eslint-disable @typescript-eslint/no-explicit-any */
// InterestTableView.tsx
import React from "react";
import { Table, Tag, Button, Tooltip, Space, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Interest } from "./types";

interface InterestTableViewProps {
  interests: Interest[] | undefined;
  onEdit: (interest: Interest) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const InterestTableView: React.FC<InterestTableViewProps> = ({
  interests,
  onEdit,
  onDelete,
  isLoading,
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

  const columns = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "الجنس المستهدف",
      dataIndex: "targetedGender",
      key: "targetedGender",
      render: (gender: string | null | undefined) => (
        <Tag color={getGenderTagColor(gender)}>
          {getGenderDisplayText(gender)}
        </Tag>
      ),
    },
    {
      title: "العمر",
      key: "ageRange",
      render: (_: any, record: Interest) => (
        <div className="flex items-center">
          <CalendarOutlined style={{ color: "#6b7280", marginLeft: "6px" }} />
          <span>
            {record.minAge} - {record.maxAge} سنة
          </span>
        </div>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: Interest) => (
        <Space size="small">
          <Tooltip title="تعديل">
            <Button
              onClick={() => onEdit(record)}
              icon={<EditOutlined />}
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 border-0"
            />
          </Tooltip>
          <Popconfirm
            title="تأكيد الحذف"
            description="هل أنت متأكد من رغبتك في حذف هذا الاهتمام؟"
            onConfirm={() => onDelete(record.id)}
            okText="نعم"
            cancelText="لا"
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={interests}
      loading={isLoading}
      rowKey="id"
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        locale: { items_per_page: "/ صفحة" },
      }}
      locale={{
        emptyText: (
          <div className="py-8 text-center">
            <div className="text-gray-400 text-lg mb-2">لا توجد بيانات</div>
            <div className="text-gray-500">
              لم يتم العثور على أي اهتمامات، يمكنك إضافة اهتمامات جديدة
            </div>
          </div>
        ),
      }}
      columns={columns}
    />
  );
};

export default InterestTableView;
