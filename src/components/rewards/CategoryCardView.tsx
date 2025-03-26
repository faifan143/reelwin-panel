// CategoryCardView.tsx
import React from "react";
import { Card, Button, Tag, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Category } from "./types";

interface CategoryCardViewProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryCardView: React.FC<CategoryCardViewProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="w-full shadow-sm border-gray-200 hover:border-purple-300 transition-colors"
          bodyStyle={{ padding: "12px 16px" }}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                {category.name}
              </h3>
              {category.isActive ? (
                <Tag color="green">نشط</Tag>
              ) : (
                <Tag color="red">غير نشط</Tag>
              )}
            </div>

            <div className="flex">
              <Space size="small">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onEdit(category)}
                  type="primary"
                  size="middle"
                  className="bg-blue-500 border-blue-500"
                />
                <Popconfirm
                  title="هل أنت متأكد من حذف هذه الفئة؟"
                  onConfirm={() => onDelete(category.id)}
                  okText="نعم"
                  cancelText="لا"
                  placement="left"
                >
                  <Button icon={<DeleteOutlined />} danger size="middle" />
                </Popconfirm>
              </Space>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CategoryCardView;
