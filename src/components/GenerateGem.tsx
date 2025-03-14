import { useState, useEffect } from "react";
import axios from "axios";
import { Button, InputNumber, Card, message, Spin, Tag, Alert } from "antd";
import {
  CopyOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";

export default function GenerateGemPage() {
  const [points, setPoints] = useState<number | null>(9000);
  const [token, setToken] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("reelWinToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleGenerateGem = async () => {
    if (!token) {
      message.error("رمز الوصول غير متوفر. الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Use the exact URL from Postman image
      const response = await axios.post(
        `/reel-win/api/content/generate-gem?points=${points}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(response.data);
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

  const copyResponseToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      message.success("تم نسخ الاستجابة إلى الحافظة");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">G</span>
            </div>
            <h2 className="text-2xl font-bold text-white">إنشاء جوهرة</h2>
          </div>
          <Tag color="orange" className="text-base px-3 py-1">
            POST
          </Tag>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <p className="text-gray-600 flex items-center">
            <InfoCircleOutlined className="mr-2 text-blue-500" />
            قم بإنشاء جوهرة جديدة مع تحديد عدد النقاط المطلوبة
          </p>
        </div>

        <Card title="إنشاء جوهرة جديدة" className="mb-6 shadow-md">
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

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center text-gray-500">
              <LockOutlined className="mr-2" />
              <span className="text-sm">تم إستخدام المصادقة التلقائية</span>
            </div>
            <Button
              type="primary"
              onClick={handleGenerateGem}
              loading={isSending}
              icon={<SendOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
              size="large"
            >
              إنشاء الجوهرة
            </Button>
          </div>
        </Card>

        {error && (
          <Alert
            message="خطأ"
            description={error}
            type="error"
            showIcon
            className="mb-6"
          />
        )}

        <Card
          title={
            <div className="flex items-center justify-between">
              <span>نتيجة الاستجابة</span>
              {response && (
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={copyResponseToClipboard}
                  className="text-blue-600"
                >
                  نسخ
                </Button>
              )}
            </div>
          }
          className="shadow-md"
        >
          {isSending ? (
            <div className="py-10 flex flex-col items-center justify-center">
              <Spin size="large" />
              <div className="mt-3 text-gray-500">جاري إنشاء الجوهرة...</div>
            </div>
          ) : response ? (
            <div>
              <div className="mb-3 flex">
                <Tag color="green" className="text-sm">
                  <CheckCircleOutlined className="mr-1" /> تم بنجاح
                </Tag>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="mb-3 text-5xl opacity-30">💎</div>
              <p>
                {`
                لم يتم إنشاء جوهرة بعد. قم بتحديد عدد النقاط وانقر على زر "إنشاء
                الجوهرة"
                `}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div className="flex items-center">
            <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">
              POST
            </span>
            <code className="text-xs">/reel-win/api/content/generate-gem</code>
          </div>
        </div>
      </div>
    </div>
  );
}
