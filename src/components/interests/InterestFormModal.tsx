/* eslint-disable @typescript-eslint/no-explicit-any */
// InterestFormModal.tsx
import React from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Interest } from "./types";

const { Option } = Select;

interface InterestFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingInterest: Interest | null;
  form: any;
  isPending: boolean;
  isMobile: boolean;
}

const InterestFormModal: React.FC<InterestFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingInterest,
  form,
  isPending,
  isMobile,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center text-lg font-bold text-blue-700 border-b pb-3">
          {editingInterest ? (
            <>
              <EditOutlined style={{ marginLeft: "8px" }} />
              تعديل الاهتمام
            </>
          ) : (
            <>
              <PlusCircleOutlined style={{ marginLeft: "8px" }} />
              إضافة اهتمام جديد
            </>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      style={{ direction: "rtl" }}
      maskClosable={false}
      destroyOnClose
      width={isMobile ? "95%" : 500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4"
        validateMessages={{
          required: "${label} مطلوب",
          types: {
            number: "${label} يجب أن يكون رقماً",
          },
          number: {
            min: "${label} يجب أن يكون أكبر من أو يساوي ${min}",
            max: "${label} يجب أن يكون أقل من أو يساوي ${max}",
          },
        }}
      >
        <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
          <Input
            placeholder="أدخل اسم الاهتمام"
            className="py-2"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="targetedGender"
          label="الجنس المستهدف"
          initialValue={null}
        >
          <Select
            placeholder="اختر الجنس المستهدف"
            className="w-full text-right"
            size={isMobile ? "middle" : "large"}
          >
            <Option value={null}>الكل</Option>
            <Option value="MALE">ذكر</Option>
            <Option value="FEMALE">أنثى</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="minAge"
            label="العمر الأدنى"
            rules={[{ required: true }, { type: "number", min: 13, max: 100 }]}
            initialValue={0}
            normalize={(value) => (value === "" ? 0 : Number(value))}
          >
            <InputNumber
              min={0}
              max={100}
              className="w-full"
              size={isMobile ? "middle" : "large"}
              controls={{
                upIcon: <span className="ant-input-number-handler-up-inner" />,
                downIcon: (
                  <span className="ant-input-number-handler-down-inner" />
                ),
              }}
            />
          </Form.Item>

          <Form.Item
            name="maxAge"
            label="العمر الأقصى"
            rules={[{ required: true }, { type: "number", min: 0, max: 100 }]}
            initialValue={100}
            normalize={(value) => (value === "" ? 100 : Number(value))}
          >
            <InputNumber
              min={0}
              max={100}
              className="w-full"
              size={isMobile ? "middle" : "large"}
              controls={{
                upIcon: <span className="ant-input-number-handler-up-inner" />,
                downIcon: (
                  <span className="ant-input-number-handler-down-inner" />
                ),
              }}
            />
          </Form.Item>
        </div>

        {/* Custom form buttons */}
        <Form.Item className="mt-6 flex flex-col sm:flex-row sm:justify-end">
          <Button
            className="mb-2 sm:mb-0 sm:mx-2 w-full sm:w-auto"
            onClick={onCancel}
            size={isMobile ? "middle" : "large"}
          >
            إلغاء
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0 w-full sm:w-auto"
            loading={isPending}
            size={isMobile ? "middle" : "large"}
          >
            {editingInterest ? "تحديث" : "إضافة"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InterestFormModal;
