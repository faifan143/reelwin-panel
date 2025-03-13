/* eslint-disable @next/next/no-img-element */
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { XCircle } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import ProgressBar from "./ProgressBar";

interface AdminPageProps {
  onLogout: () => void;
}

interface ContentFormData {
  title: string;
  description: string;
  ownerName: string;
  ownerNumber: string;
  intervalHours: number;
  endValidationDate: string;
  interestIds: string[];
  type: "REEL";
  mediaUrls: string[]; // This will be populated by the backend
}

interface Interest {
  id: string;
  name: string;
}

export default function AdminPage({ onLogout }: AdminPageProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Set default end validation date
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);
  const formattedDefaultDate = defaultDate.toISOString().slice(0, 16);

  const { data: interests, isLoading: interestsLoading } = useQuery<Interest[]>(
    {
      queryKey: ["interests"],
      queryFn: async () => {
        const response = await axios.get("/reel-win/api/interests/list");
        return response.data;
      },
    }
  );

  const {
    mutateAsync: addContent,
    isPending: addingContent,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("reelWinToken");
      await axios.post("/reel-win/api/content", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      // Reset progress when done
      setUploadProgress(0);
    },
  });

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
      intervalHours: 22,
      endValidationDate: formattedDefaultDate,
      interestIds: [],
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Reset input to allow selecting the same file again
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setVideoFiles((prev) => [...prev, ...newFiles]);

      // Reset input to allow selecting the same file again
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideoFile = (index: number) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContentFormData) => {
    const formData = new FormData();

    // Append form fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("ownerName", data.ownerName);
    formData.append("ownerNumber", data.ownerNumber);
    formData.append("intervalHours", data.intervalHours.toString());
    formData.append("type", "REEL");

    // Format date
    const date = new Date(data.endValidationDate);
    formData.append("endValidationDate", date.toISOString());

    // Handle interest IDs
    if (Array.isArray(data.interestIds)) {
      data.interestIds.forEach((id) => formData.append("interestIds[]", id));
    }

    // Append files
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    videoFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await addContent(formData);

      // Reset form
      reset();
      setImageFiles([]);
      setVideoFiles([]);

      if (formRef.current) {
        formRef.current.reset();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Content creation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              لوحة إدارة ReelWin
            </h2>
            <button
              className="text-white hover:text-red-200 transition-colors flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              onClick={onLogout}
            >
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 px-6 py-3 border-b">
          <ul className="flex space-x-4 space-x-reverse">
            <li>
              <a
                className="bg-white inline-block py-2 px-6 text-blue-600 font-semibold rounded-t-lg shadow-sm border-b-2 border-blue-600"
                href="#"
              >
                إضافة محتوى
              </a>
            </li>
            <li>
              <a
                className="inline-block py-2 px-6 text-gray-600 hover:text-blue-600 font-medium"
                href="#"
              >
                عرض المحتوى
              </a>
            </li>
          </ul>
        </div>

        {/* Content Form */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              إضافة محتوى جديد
            </h3>
            <p className="text-gray-600 mt-2">
              أدخل تفاصيل المحتوى والوسائط المطلوبة
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">
                المعلومات الأساسية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    العنوان *
                  </label>
                  <input
                    id="title"
                    className={`w-full px-4 py-2 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل عنوان المحتوى"
                    {...register("title", { required: "العنوان مطلوب" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    الوصف *
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className={`w-full px-4 py-2 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل وصف المحتوى"
                    {...register("description", { required: "الوصف مطلوب" })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">
                معلومات المالك
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ownerName"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    اسم المالك *
                  </label>
                  <input
                    id="ownerName"
                    className={`w-full px-4 py-2 border ${
                      errors.ownerName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل اسم المالك"
                    {...register("ownerName", { required: "اسم المالك مطلوب" })}
                  />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ownerNumber"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    رقم المالك *
                  </label>
                  <input
                    id="ownerNumber"
                    className={`w-full px-4 py-2 border ${
                      errors.ownerNumber ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل رقم المالك (09XXXXXXXX)"
                    {...register("ownerNumber", {
                      required: "رقم المالك مطلوب",
                      pattern: {
                        value: /^09\d{8}$/,
                        message:
                          "يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)",
                      },
                    })}
                  />
                  {errors.ownerNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">
                إعدادات المحتوى
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="intervalHours"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    ساعات الفاصل *
                  </label>
                  <input
                    type="number"
                    id="intervalHours"
                    className={`w-full px-4 py-2 border ${
                      errors.intervalHours
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="أدخل عدد ساعات الفاصل"
                    min={1}
                    {...register("intervalHours", {
                      required: "ساعات الفاصل مطلوبة",
                      min: {
                        value: 1,
                        message: "يجب أن يكون الحد الأدنى 1 ساعة",
                      },
                    })}
                  />
                  {errors.intervalHours && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.intervalHours.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="endValidationDate"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    تاريخ انتهاء الصلاحية *
                  </label>
                  <Controller
                    name="endValidationDate"
                    control={control}
                    rules={{ required: "تاريخ انتهاء الصلاحية مطلوب" }}
                    render={({ field }) => (
                      <input
                        type="datetime-local"
                        id="endValidationDate"
                        className={`w-full px-4 py-2 border ${
                          errors.endValidationDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

                <div className="md:col-span-2">
                  <label
                    htmlFor="interestIds"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    الاهتمامات (اختياري)
                  </label>
                  <Controller
                    name="interestIds"
                    control={control}
                    render={({ field }) => {
                      const options = interests
                        ? interests.map((interest) => ({
                            value: interest.id,
                            label: interest.name,
                          }))
                        : [];
                      return (
                        <Select
                          {...field}
                          isMulti
                          options={options}
                          classNamePrefix="react-select"
                          placeholder="اختر الاهتمامات المتعلقة بالمحتوى"
                          noOptionsMessage={() => "لا توجد خيارات متاحة"}
                          loadingMessage={() => "جاري التحميل..."}
                          isLoading={interestsLoading}
                          value={options.filter((option) =>
                            field.value?.includes(option.value)
                          )}
                          onChange={(selectedOptions) => {
                            field.onChange(
                              selectedOptions.map((option) => option.value)
                            );
                          }}
                        />
                      );
                    }}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    اختر الاهتمامات المتعلقة بالمحتوى
                  </p>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">الوسائط</h4>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">
                  الصور *
                </label>
                <div className="flex items-center">
                  <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <span>إضافة صور</span>
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                    />
                  </label>
                  <span className="text-gray-500 text-sm mr-3">
                    {imageFiles.length > 0
                      ? `تم اختيار ${imageFiles.length} صورة`
                      : "لم يتم اختيار أي صورة"}
                  </span>
                </div>

                {imageFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImageFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  الفيديوهات *
                </label>
                <div className="flex items-center">
                  <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <span>إضافة فيديوهات</span>
                    <input
                      type="file"
                      ref={videoInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                      multiple
                    />
                  </label>
                  <span className="text-gray-500 text-sm mr-3">
                    {videoFiles.length > 0
                      ? `تم اختيار ${videoFiles.length} فيديو`
                      : "لم يتم اختيار أي فيديو"}
                  </span>
                </div>

                {videoFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {videoFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideoFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-gray-500 text-sm mt-4">
                <p>* يجب إضافة صورة أو فيديو واحد على الأقل</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={addingContent}
              className={`w-full py-3 px-6 ${
                addingContent
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold rounded-lg transition-colors flex items-center justify-center`}
            >
              {addingContent ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري الإنشاء...
                </>
              ) : (
                "إنشاء المحتوى"
              )}
            </button>

            {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}

            {/* Status Messages */}
            {isSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center mt-4">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                تم إنشاء المحتوى بنجاح!
              </div>
            )}

            {isError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center mt-4">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error.message || "حدث خطأ أثناء إنشاء المحتوى."}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
