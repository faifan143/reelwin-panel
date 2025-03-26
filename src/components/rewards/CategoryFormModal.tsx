/* eslint-disable @typescript-eslint/no-explicit-any */
// CategoryFormModal.tsx
import React from "react";
import { Button, Form, Input, Modal, Switch } from "antd";
import { TagOutlined } from "@ant-design/icons";
import { Category } from "./types";

interface CategoryFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  editingCategory: Category | null;
  form: any;
  isMobile: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingCategory,
  form,
  isMobile,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center">
          <TagOutlined className="text-purple-500 ml-2" />
          <span className="text-base sm:text-lg">
            {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isMobile ? "95%" : 500}
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
          name="name"
          label="اسم الفئة"
          rules={[{ required: true, message: "اسم الفئة مطلوب" }]}
        >
          <Input
            placeholder="أدخل اسم الفئة"
            prefix={<TagOutlined className="text-gray-400" />}
            size={isMobile ? "middle" : "large"}
          />
        </Form.Item>

        <Form.Item name="isActive" label="الحالة" valuePropName="checked">
          <Switch checkedChildren="نشط" unCheckedChildren="غير نشط" />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button
            onClick={onCancel}
            className="ml-2"
            size={isMobile ? "middle" : "large"}
          >
            إلغاء
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-purple-600 hover:bg-purple-700"
            size={isMobile ? "middle" : "large"}
          >
            {editingCategory ? "تحديث" : "إضافة"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
