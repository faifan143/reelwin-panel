import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  InputNumber,
  Card,
  message,
  Spin,
  Tag,
  Alert,
  Tabs,
  Input,
  Form,
} from "antd";
import {
  CopyOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UploadOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

interface VersionUpdateForm {
  version: string;
  isRequired: boolean;
}

export default function GenerateGemPage() {
  // Gem Generation States
  const [points, setPoints] = useState<number | null>(9000);
  const [token, setToken] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Version Update States
  const [versionForm] = Form.useForm();
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);
  const [versionResponse, setVersionResponse] = useState(null);
  const [versionError, setVersionError] = useState(null);

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

  const handleVersionUpdate = async (values: VersionUpdateForm) => {
    if (!token) {
      message.error("رمز الوصول غير متوفر. الرجاء تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsUpdatingVersion(true);
    setVersionError(null);

    try {
      const response = await axios.post(
        `/reel-win/api/admin/add-version-update`,
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

      setVersionResponse(response.data);
      message.success("تم تحديث الإصدار بنجاح");
      versionForm.resetFields();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error updating version:", err);
      setVersionError(
        err.response?.data?.message || "حدث خطأ أثناء تحديث الإصدار"
      );
      message.error("فشل تحديث الإصدار");
    } finally {
      setIsUpdatingVersion(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copyResponseToClipboard = (responseData: any) => {
    if (responseData) {
      navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
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
            <h2 className="text-2xl font-bold text-white">
              إنشاء جوهرة وتحديث الإصدار
            </h2>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Tabs defaultActiveKey="gem" className="mb-6">
          <TabPane
            tab={
              <span className="flex items-center">
                <AppstoreAddOutlined className="ml-1" />
                إنشاء جوهرة
              </span>
            }
            key="gem"
          >
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
                <div className="text-xs text-gray-500">
                  قيمة الجوهرة بالنقاط
                </div>
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
                      onClick={() => copyResponseToClipboard(response)}
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
                  <div className="mt-3 text-gray-500">
                    جاري إنشاء الجوهرة...
                  </div>
                </div>
              ) : response ? (
                <div>
                  <div className="mb-3 flex">
                    <Tag color="green" className="text-sm">
                      <CheckCircleOutlined className="mr-1" /> تم بنجاح
                    </Tag>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(response, null, 2)}
                  </pre>
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
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center">
                <UploadOutlined className="ml-1" />
                تحديث الإصدار
              </span>
            }
            key="version"
          >
            <div className="mb-6">
              <p className="text-gray-600 flex items-center">
                <InfoCircleOutlined className="mr-2 text-blue-500" />
                قم بتحديث إصدار التطبيق وتحديد ما إذا كان التحديث مطلوبًا
              </p>
            </div>

            <Card title="تحديث إصدار التطبيق" className="mb-6 shadow-md">
              <Form
                form={versionForm}
                onFinish={handleVersionUpdate}
                layout="vertical"
              >
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

                <div className="text-sm text-gray-500 mb-4 mr-6">
                  عند تفعيل هذا الخيار، سيجبر المستخدمين على تحديث التطبيق
                  للاستمرار في استخدامه
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center text-gray-500">
                    <LockOutlined className="mr-2" />
                    <span className="text-sm">
                      تم إستخدام المصادقة التلقائية
                    </span>
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdatingVersion}
                    icon={<UploadOutlined />}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    تحديث الإصدار
                  </Button>
                </div>
              </Form>
            </Card>

            {versionError && (
              <Alert
                message="خطأ"
                description={versionError}
                type="error"
                showIcon
                className="mb-6"
              />
            )}

            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>نتيجة الاستجابة</span>
                  {versionResponse && (
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => copyResponseToClipboard(versionResponse)}
                      className="text-blue-600"
                    >
                      نسخ
                    </Button>
                  )}
                </div>
              }
              className="shadow-md"
            >
              {isUpdatingVersion ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <Spin size="large" />
                  <div className="mt-3 text-gray-500">
                    جاري تحديث الإصدار...
                  </div>
                </div>
              ) : versionResponse ? (
                <div>
                  <div className="mb-3 flex">
                    <Tag color="green" className="text-sm">
                      <CheckCircleOutlined className="mr-1" /> تم بنجاح
                    </Tag>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(versionResponse, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-3 text-5xl opacity-30">🔄</div>
                  <p>
                    {`
                    لم يتم تحديث الإصدار بعد. قم بإدخال رقم الإصدار وانقر على زر "تحديث الإصدار"
                    `}
                  </p>
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t text-center text-gray-500 text-sm">
        جميع الحقوق محفوظة © 2025 ReelWin
      </div>
    </div>
  );
}
