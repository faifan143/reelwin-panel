// GemGenerationTab.tsx
import { CommonProps } from "@/types";
import {
  InfoCircleOutlined,
  LockOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Card, InputNumber, message } from "antd";
import axios from "axios";
import React, { useState } from "react";

type GemGenerationTabProps = CommonProps;

const GemGenerationTab: React.FC<GemGenerationTabProps> = ({
  token,
  setError,
}) => {
  const [points, setPoints] = useState<number | null>(9000);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateGem = async () => {
    if (!token) {
      message.error("رمز الوصول غير متوفر. الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await axios.post(
        `/reel-win/api/content/generate-gem?points=${points}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("تم إنشاء الجوهرة بنجاح");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error generating gem:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إنشاء الجوهرة");
      message.error("فشل إنشاء الجوهرة");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base flex items-center">
          <InfoCircleOutlined className="mr-2 text-blue-500" />
          قم بإنشاء جوهرة جديدة مع تحديد عدد النقاط المطلوبة
        </p>
      </div>

      <Card
        title="إنشاء جوهرة جديدة"
        className="mb-4 sm:mb-6 shadow-md"
        bodyStyle={{ padding: "16px" }}
        headStyle={{ padding: "12px 16px" }}
      >
        <div className="mb-4">
          <div className="font-semibold text-gray-700 mb-2">النقاط</div>
          <div className="flex items-center">
            <InputNumber
              placeholder="أدخل عدد النقاط"
              value={points}
              onChange={(value) => setPoints(value)}
              className="mb-2"
              min={1}
              style={{ width: "100%" }}
              size="large"
            />
            <span className="mr-2 text-gray-500">نقطة</span>
          </div>
          <div className="text-xs text-gray-500">قيمة الجوهرة بالنقاط</div>
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
            onClick={handleGenerateGem}
            loading={isSending}
            icon={<SendOutlined />}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            size="large"
          >
            إنشاء الجوهرة
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GemGenerationTab;
