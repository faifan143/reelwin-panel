/* eslint-disable @typescript-eslint/no-explicit-any */
// RewardFormModal.tsx
import React from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import { GiftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Category, Reward } from "./types";

interface RewardFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  editingReward: Reward | null;
  form: any;
  categories: Category[];
  loadingCategories: boolean;
  isMobile: boolean;
}

const RewardFormModal: React.FC<RewardFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingReward,
  form,
  categories,
  loadingCategories,
  isMobile,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center">
          <GiftOutlined className="text-purple-500 ml-2" />
          <span className="text-base sm:text-lg">
            {editingReward ? "تعديل المكافأة" : "إضافة مكافأة جديدة"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isMobile ? "95%" : 600}
      destroyOnClose
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          isActive: true,
        }}
        className="mt-3"
      >
        <Form.Item
          name="title"
          label="العنوان"
          rules={[{ required: true, message: "العنوان مطلوب" }]}
        >
          <Input
            placeholder="أدخل عنوان المكافأة"
            prefix={<InfoCircleOutlined className="text-gray-400" />}
            size={isMobile ? "middle" : "large"}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="الوصف"
          rules={[{ required: true, message: "الوصف مطلوب" }]}
        >
          <Input.TextArea
            placeholder="أدخل وصف تفصيلي للمكافأة"
            rows={isMobile ? 3 : 4}
          />
        </Form.Item>

        <Form.Item
          name="pointsCost"
          label="عدد النقاط المطلوبة"
          rules={[
            { required: true, message: "عدد النقاط مطلوب" },
            {
              type: "number",
              min: 1,
              message: "يجب أن يكون عدد النقاط أكبر من صفر",
            },
          ]}
        >
          <InputNumber
            min={1}
            placeholder="أدخل عدد النقاط"
            className="w-full"
            addonAfter="نقطة"
            size={isMobile ? "middle" : "large"}
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="الفئة"
          rules={[{ required: true, message: "الفئة مطلوبة" }]}
        >
          <Select
            placeholder="اختر الفئة"
            className="w-full"
            loading={loadingCategories}
            size={isMobile ? "middle" : "large"}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
                {!category.isActive && " (غير نشط)"}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isActive" label="الحالة" valuePropName="checked">
          <Switch checkedChildren="نشط" unCheckedChildren="غير نشط" />
        </Form.Item>

        <Form.Item className="mb-0 flex flex-col sm:flex-row sm:justify-end">
          <Button
            onClick={onCancel}
            className="mb-2 sm:mb-0 sm:ml-2 w-full sm:w-auto"
            size={isMobile ? "middle" : "large"}
          >
            إلغاء
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            size={isMobile ? "middle" : "large"}
          >
            {editingReward ? "تحديث" : "إضافة"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RewardFormModal;
