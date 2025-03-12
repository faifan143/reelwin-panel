// File: components/LoginPage.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

interface LoginFormData {
  phone: string;
  password: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Mock credentials for demo
    if (
      data.phone === "9912345678" &&
      data.password === "anyCode2024@admin123"
    ) {
      onLogin("mockToken123");
      return;
    }

    try {
      // API call using axios
      const response = await axios.post(
        "http://anycode-sy.com/reel-win/api/auth/signin",
        data
      );

      if (response.data?.token) {
        onLogin(response.data.token);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowError(true);
    }
  };

  return (
    <div
      className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow-md"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        تسجيل الدخول لـ ReelWin
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="phone" className="block font-bold mb-2">
            رقم الهاتف
          </label>
          <input
            id="phone"
            className={`w-full px-3 py-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="أدخل رقم الهاتف"
            {...register("phone", { required: "رقم الهاتف مطلوب" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            كلمة المرور
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="أدخل كلمة المرور"
            {...register("password", { required: "كلمة المرور مطلوبة" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          تسجيل الدخول
        </button>
        {showError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            خطأ في تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.
          </div>
        )}
      </form>
    </div>
  );
}
