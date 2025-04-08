// ClearUpdatesTab.tsx
import React, { useState } from "react";
import { Alert, Button, Card, Popconfirm, message } from "antd";
import { InfoCircleOutlined, ClearOutlined } from "@ant-design/icons";
import axios from "axios";
import { CommonProps } from "@/components/gems/types";

type ClearUpdatesTabProps = CommonProps;

const ClearUpdatesTab: React.FC<ClearUpdatesTabProps> = ({
  token,
  setError,
}) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearUpdates = async () => {
    if (!token) {
      message.error("رمز الوصول غير متوفر. الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsClearing(true);
    setError(null);

    try {
      await axios.post(
        `https://anycode-sy.com/reel-win/api/users/clear-update`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("تم مسح التحديثات بنجاح");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error clearing updates:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء مسح التحديثات");
      message.error("فشل مسح التحديثات");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base flex items-center">
          <InfoCircleOutlined className="mr-2 text-red-500" />
          مسح جميع التحديثات المخزنة للتطبيق
        </p>
      </div>

      <Card
        title="مسح تحديثات التطبيق"
        className="mb-4 sm:mb-6 shadow-md"
        bodyStyle={{ padding: "16px" }}
        headStyle={{ padding: "12px 16px" }}
      >
        <div className="mb-4">
          <div className="font-semibold text-gray-700 mb-2">تنبيه</div>
          <Alert
            message="تحذير: هذا الإجراء لا يمكن التراجع عنه"
            description="سيؤدي مسح التحديثات إلى إزالة جميع إشعارات التحديث المخزنة من قاعدة البيانات."
            type="warning"
            showIcon
            className="mb-4"
          />
        </div>

        <div className="flex justify-end items-center mt-4 sm:mt-6">
          <Popconfirm
            title="مسح التحديثات"
            description="هل أنت متأكد من رغبتك في مسح جميع التحديثات؟"
            onConfirm={handleClearUpdates}
            okText="نعم، متأكد"
            cancelText="إلغاء"
            okButtonProps={{
              className: "bg-red-600 hover:bg-red-700 border-red-600",
            }}
          >
            <Button
              danger
              loading={isClearing}
              icon={<ClearOutlined />}
              size="large"
              className="w-full sm:w-auto"
            >
              مسح جميع التحديثات
            </Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  );
};

export default ClearUpdatesTab;
