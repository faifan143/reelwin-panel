// VersionUpdateTab.tsx
import { CommonProps, VersionUpdateForm } from "@/components/gems/types";
import {
  InfoCircleOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import React, { useState } from "react";

type VersionUpdateTabProps = CommonProps;

const VersionUpdateTab: React.FC<VersionUpdateTabProps> = ({
  token,
  setError,
}) => {
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleVersionUpdate = async (values: VersionUpdateForm) => {
    if (!token) {
      message.error("رمز الوصول غير متوفر. الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await axios.post(
        `https://anycode-sy.com/reel-win/api/users/add-update`,
        {
          version: values.version,
          isRequired: values.isRequired,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("تم تحديث الإصدار بنجاح");
      form.resetFields();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error updating version:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحديث الإصدار");
      message.error("فشل تحديث الإصدار");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base flex items-center">
          <InfoCircleOutlined className="mr-2 text-blue-500" />
          قم بتحديث إصدار التطبيق وتحديد ما إذا كان التحديث مطلوبًا
        </p>
      </div>

      <Card
        title="تحديث إصدار التطبيق"
        className="mb-4 sm:mb-6 shadow-md"
        bodyStyle={{ padding: "16px" }}
        headStyle={{ padding: "12px 16px" }}
      >
        <Form form={form} onFinish={handleVersionUpdate} layout="vertical">
          <Form.Item
            label="رقم الإصدار"
            name="version"
            rules={[
              { required: true, message: "الرجاء إدخال رقم الإصدار" },
              {
                pattern: /^\d+\.\d+$/,
                message: "يجب أن يكون الإصدار بتنسيق X.Y (مثال: 1.0)",
              },
            ]}
          >
            <Input
              placeholder="أدخل رقم الإصدار (مثال: 1.5)"
              size="large"
              className="mb-2"
            />
          </Form.Item>

          <Form.Item
            name="isRequired"
            valuePropName="checked"
            initialValue={false}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="font-semibold text-gray-700">
                تحديث إلزامي للمستخدمين
              </span>
            </div>
          </Form.Item>

          <div className="text-xs sm:text-sm text-gray-500 mb-4 mr-6">
            عند تفعيل هذا الخيار، سيجبر المستخدمين على تحديث التطبيق للاستمرار
            في استخدامه
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6">
            <div className="flex items-center text-gray-500 mb-3 sm:mb-0">
              <LockOutlined className="mr-2" />
              <span className="text-xs sm:text-sm">
                تم إستخدام المصادقة التلقائية
              </span>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              icon={<UploadOutlined />}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              size="large"
            >
              تحديث الإصدار
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default VersionUpdateTab;
