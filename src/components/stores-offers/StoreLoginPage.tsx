"use client";
import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useStoreAuth } from "./StoreAuthContext";
import { requestStoreOtp, verifyStoreOtp } from "./storeAuthApi";

const StoreLoginPage = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { login } = useStoreAuth();

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await requestStoreOtp(phone);
      message.success("تم إرسال رمز التحقق عبر واتساب");
      setStep("otp");
    } catch (e) {
      message.error("فشل إرسال رمز التحقق. تحقق من الرقم.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await verifyStoreOtp(phone, otp);
      const { token, store } = res.data;
      login(token, store);
      message.success("تم تسجيل الدخول بنجاح");
      // Redirect or update UI as needed
    } catch (e) {
      message.error("رمز التحقق غير صحيح أو منتهي الصلاحية.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            تسجيل دخول المتجر
          </h2>
          {step === "phone" && (
            <Form onFinish={handleRequestOtp} layout="vertical">
              <Form.Item name="phone" rules={[{ required: true, message: "الرجاء إدخال رقم الهاتف" }]}> 
                <Input
                  placeholder="رقم الهاتف"
                  size="large"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className="w-full h-12 text-lg rounded-lg">
                  إرسال رمز التحقق
                </Button>
              </Form.Item>
            </Form>
          )}
          {step === "otp" && (
            <Form onFinish={handleVerifyOtp} layout="vertical">
              <Form.Item name="otp" rules={[{ required: true, message: "الرجاء إدخال رمز التحقق" }]}> 
                <Input
                  placeholder="رمز التحقق"
                  size="large"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className="w-full h-12 text-lg rounded-lg">
                  تسجيل الدخول
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StoreLoginPage;
