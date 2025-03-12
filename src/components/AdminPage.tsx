// File: components/AdminPage.tsx
"use client";

import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface AdminPageProps {
  onLogout: () => void;
}

interface ContentFormData {
  title: string;
  description: string;
  ownerName: string;
  ownerNumber: string;
  type: string;
  intervalHours: string;
  endValidationDate: string;
  interestIds: string;
}

export default function AdminPage({ onLogout }: AdminPageProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Set default end validation date
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);
  const formattedDefaultDate = defaultDate.toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContentFormData>({
    defaultValues: {
      title: "",
      description: "",
      ownerName: "",
      ownerNumber: "",
      type: "REEL",
      intervalHours: "22",
      endValidationDate: formattedDefaultDate,
      interestIds: "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    const formData = new FormData();

    // Append form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "endValidationDate") {
        const date = new Date(value);
        formData.append(key, date.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    // Append files
    if (imageFile) {
      formData.append("files", imageFile);
    }

    if (videoFile) {
      formData.append("files", videoFile);
    }

    // For demo, simulate success
    setShowSuccess(true);
    setShowError(false);

    // Reset form
    reset();
    setImageFile(null);
    setVideoFile(null);

    if (formRef.current) {
      formRef.current.reset();
    }

    // Reset success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Uncomment for actual API integration
    try {
      const token = localStorage.getItem("reelWinToken");
      const response = await axios.post(
        "http://anycode-sy.com/reel-win/api/content",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setShowError(false);

        // Reset form
        reset();
        setImageFile(null);
        setVideoFile(null);

        if (formRef.current) {
          formRef.current.reset();
        }

        // Reset success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Content creation error:", error);
      setShowError(true);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">لوحة إدارة ReelWin</h2>
        <span
          className="text-red-600 cursor-pointer hover:text-red-800"
          onClick={onLogout}
        >
          تسجيل الخروج
        </span>
      </div>

      <ul className="flex border-b mb-6">
        <li className="mr-1">
          <a
            className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold border-l border-t border-r rounded-t"
            href="#"
          >
            إضافة محتوى
          </a>
        </li>
      </ul>

      <div>
        <h3 className="text-xl font-bold mb-4">إضافة محتوى جديد</h3>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-bold mb-2">
              العنوان
            </label>
            <input
              id="title"
              className={`w-full px-3 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل عنوان المحتوى"
              {...register("title", { required: "العنوان مطلوب" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-2">
              الوصف
            </label>
            <textarea
              id="description"
              rows={3}
              className={`w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل وصف المحتوى"
              {...register("description", { required: "الوصف مطلوب" })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="ownerName" className="block font-bold mb-2">
              اسم المالك
            </label>
            <input
              id="ownerName"
              className={`w-full px-3 py-2 border ${
                errors.ownerName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل اسم المالك"
              {...register("ownerName", { required: "اسم المالك مطلوب" })}
            />
            {errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="ownerNumber" className="block font-bold mb-2">
              رقم المالك
            </label>
            <input
              id="ownerNumber"
              className={`w-full px-3 py-2 border ${
                errors.ownerNumber ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل رقم المالك"
              {...register("ownerNumber", { required: "رقم المالك مطلوب" })}
            />
            {errors.ownerNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerNumber.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block font-bold mb-2">
              النوع
            </label>
            <input
              id="type"
              className={`w-full px-3 py-2 border ${
                errors.type ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل نوع المحتوى"
              {...register("type", { required: "النوع مطلوب" })}
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="intervalHours" className="block font-bold mb-2">
              ساعات الفاصل
            </label>
            <input
              type="number"
              id="intervalHours"
              className={`w-full px-3 py-2 border ${
                errors.intervalHours ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل عدد ساعات الفاصل"
              {...register("intervalHours", {
                required: "ساعات الفاصل مطلوبة",
              })}
            />
            {errors.intervalHours && (
              <p className="text-red-500 text-sm mt-1">
                {errors.intervalHours.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="endValidationDate" className="block font-bold mb-2">
              تاريخ انتهاء الصلاحية
            </label>
            <Controller
              name="endValidationDate"
              control={control}
              rules={{ required: "تاريخ انتهاء الصلاحية مطلوب" }}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  id="endValidationDate"
                  className={`w-full px-3 py-2 border ${
                    errors.endValidationDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...field}
                />
              )}
            />
            {errors.endValidationDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endValidationDate.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="interestIds" className="block font-bold mb-2">
              معرفات الاهتمامات (اختياري)
            </label>
            <input
              id="interestIds"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل معرفات الاهتمامات"
              {...register("interestIds")}
            />
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <label htmlFor="imageFile" className="block font-bold mb-2">
                صورة
              </label>
              <input
                type="file"
                id="imageFile"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            <div>
              <label htmlFor="videoFile" className="block font-bold mb-2">
                فيديو
              </label>
              <input
                type="file"
                id="videoFile"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="video/*"
                onChange={handleVideoChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            إنشاء المحتوى
          </button>

          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              تم إنشاء المحتوى بنجاح!
            </div>
          )}

          {showError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              حدث خطأ أثناء إنشاء المحتوى.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
