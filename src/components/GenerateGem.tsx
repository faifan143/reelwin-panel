import { useState } from "react";
import axios from "axios";
import { Button, Input, Card, message, Spin, Tag, Divider, Alert } from "antd";
import {
  CopyOutlined,
  SendOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export default function GenerateGemPage() {
  const [points, setPoints] = useState(9000);
  const [token, setToken] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateGem = async () => {
    if (!token) {
      message.error("الرجاء إدخال رمز الوصول أولا");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
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

        <Card title="معلومات الطلب" className="mb-6 shadow-md">
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2">
              <KeyOutlined className="mr-2" /> رمز الوصول (Bearer Token)
            </div>
            <Input.Password
              placeholder="أدخل رمز الوصول"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mb-2"
            />
            <div className="text-xs text-gray-500">
              مطلوب للمصادقة على الطلب
            </div>
          </div>

          <Divider />

          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2">النقاط</div>
            <Input
              type="number"
              placeholder="أدخل عدد النقاط"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="mb-2"
              min={1}
              addonAfter="نقطة"
            />
            <div className="text-xs text-gray-500">قيمة الجوهرة بالنقاط</div>
          </div>

          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2">
              عنوان الطلب (URL)
            </div>
            <Input
              value={`/reel-win/api/content/generate-gem?points=${points}`}
              readOnly
              className="text-gray-500"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleGenerateGem}
              loading={isSending}
              icon={<SendOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
              size="large"
            >
              إرسال الطلب
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
            <div className="flex items-center">
              <span>نتيجة الاستجابة</span>
              {response && (
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={copyResponseToClipboard}
                  className="mr-2 text-blue-600"
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
              <div className="mt-3 text-gray-500">جاري إرسال الطلب...</div>
            </div>
          ) : response ? (
            <div>
              <div className="mb-3 flex">
                <Tag color="green" className="text-sm">
                  <CheckCircleOutlined className="mr-1" /> تم بنجاح
                </Tag>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-80">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="mb-3 text-5xl opacity-30">🔍</div>
              <p>
                لم يتم إرسال أي طلب بعد. قم بإرسال الطلب للحصول على النتيجة.
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div className="font-semibold">معلومات الواجهة البرمجية</div>
          <div className="mt-1">
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
