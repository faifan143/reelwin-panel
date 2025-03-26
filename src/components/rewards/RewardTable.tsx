/* eslint-disable @typescript-eslint/no-explicit-any */
// RewardTable.tsx (Updated)
import React from "react";
import { Card, Empty, Spin, Table, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Category, Reward } from "./types";
import RewardCardView from "./RewardCardView";

interface RewardTableProps {
  rewards: Reward[];
  categories: Category[];
  loading: boolean;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const RewardTable: React.FC<RewardTableProps> = ({
  rewards,
  categories,
  loading,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const columns = [
    {
      title: "العنوان",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "الوصف",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: "النقاط",
      dataIndex: "pointsCost",
      key: "pointsCost",
      render: (points: number) => <Tag color="blue">{points} نقطة</Tag>,
    },
    {
      title: "الفئة",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : "غير معروف";
      },
    },
    {
      title: "الحالة",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">نشط</Tag>
        ) : (
          <Tag color="red">غير نشط</Tag>
        ),
    },
    {
      title: "الإجراءات",
      key: "action",
      width: 120,
      render: (_: any, record: Reward) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(record)}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
          >
            <EditOutlined />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(record.id);
            }}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="w-full shadow-sm">
        <div className="flex justify-center items-center py-10 sm:py-20">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (rewards.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <Empty
          description="لا توجد مكافآت متاحة"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (isMobile) {
    return (
      <RewardCardView
        rewards={rewards}
        categories={categories}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <Table
        columns={columns}
        dataSource={rewards.map((reward) => ({
          ...reward,
          key: reward.id,
        }))}
        pagination={{ pageSize: 10 }}
        className="rtl-table"
        size="middle"
      />
    </Card>
  );
};

export default RewardTable;
