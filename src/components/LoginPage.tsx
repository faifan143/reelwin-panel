"use client";
import { useState } from "react";
import { Button, Form, Input, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useStore from "@/store"; // Import the Zustand store
import axios from "axios";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const login = useStore((state) => state.login);

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);

    try {
      // Make an API call to authenticate the user
      // Replace with your actual authentication API endpoint
      const response = await axios.post("/reel-win/api/auth/login", {
        username: values.username,
        password: values.password,
      });

      // Get the token from the response
      const token = response.data.token;

      // Store the token in Zustand state
      login(token);

      // Success message
      message.success("تم تسجيل الدخول بنجاح");
    } catch (error) {
      // For demo purposes, allow login with any credentials
      if (process.env.NODE_ENV === "development") {
        // Generate a fake token
        const fakeToken = `fake_token_${Date.now()}`;
        // Store in Zustand
        login(fakeToken);
        message.success("تم تسجيل الدخول بنجاح (وضع التطوير)");
      } else {
        console.error("Login error:", error);
        message.error(
          "خطأ في تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border-0"
        cover={
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-8 px-6 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">R</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ReelWin</h1>
            <p className="text-blue-200 mt-2">لوحة الإدارة</p>
          </div>
        }
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            تسجيل الدخول
          </h2>

          <Form
            name="login_form"
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "الرجاء إدخال اسم المستخدم" }]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="اسم المستخدم"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "الرجاء إدخال كلمة المرور" }]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="كلمة المرور"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md border-0 hover:shadow-lg hover:from-blue-700 hover:to-indigo-800"
              >
                تسجيل الدخول
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              © ReelWin 2025 - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
