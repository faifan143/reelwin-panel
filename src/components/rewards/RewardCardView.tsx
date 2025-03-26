// RewardCardView.tsx
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Tag } from "antd";
import React from "react";
import { Category, Reward } from "./types";

interface RewardCardViewProps {
  rewards: Reward[];
  categories: Category[];
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
}

const RewardCardView: React.FC<RewardCardViewProps> = ({
  rewards,
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {rewards.map((reward) => {
        const category = categories.find((c) => c.id === reward.categoryId);

        return (
          <Card
            key={reward.id}
            className="w-full shadow-sm border-gray-200 hover:border-purple-300 transition-colors"
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div className="flex justify-between">
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {reward.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  <Tag color="blue">{reward.pointsCost} نقطة</Tag>
                  {category && <Tag color="purple">{category.name}</Tag>}
                  {reward.isActive ? (
                    <Tag color="green">نشط</Tag>
                  ) : (
                    <Tag color="red">غير نشط</Tag>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <Space direction="vertical" size="small">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => onEdit(reward)}
                    type="primary"
                    size="middle"
                    className="bg-blue-500 border-blue-500"
                  />
                  <Popconfirm
                    title="هل أنت متأكد من حذف هذه المكافأة؟"
                    onConfirm={() => onDelete(reward.id)}
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
        );
      })}
    </div>
  );
};

export default RewardCardView;
