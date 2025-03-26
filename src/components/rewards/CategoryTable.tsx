/* eslint-disable @typescript-eslint/no-explicit-any */
// CategoryTable.tsx (Updated)
import React from "react";
import { Card, Empty, Spin, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Category } from "./types";
import CategoryCardView from "./CategoryCardView";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const columns = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-medium">{text}</span>,
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
      render: (_: any, record: Category) => (
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

  if (categories.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <Empty
          description="لا توجد فئات متاحة"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (isMobile) {
    return (
      <CategoryCardView
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
        dataSource={categories.map((category) => ({
          ...category,
          key: category.id,
        }))}
        pagination={{ pageSize: 10 }}
        className="rtl-table"
        size="middle"
      />
    </Card>
  );
};

export default CategoryTable;
