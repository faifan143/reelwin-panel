/* eslint-disable @next/next/no-img-element */
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  Clock,
  Image,
  Phone,
  Tag,
  Upload,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

interface ContentFormData {
  title: string;
  description: string;
  ownerName: string;
  ownerNumber: string;
  intervalHours: number;
  endValidationDate: string;
  interestIds: string[];
  type: "REEL";
  mediaUrls: string[];
}

interface Interest {
  id: string;
  name: string;
}

export default function AdminPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      });
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
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h2 className="text-2xl font-bold text-white">إضافة محتوى جديد</h2>
          </div>
        </div>
      </div>

      {/* Content Form */}
      <div className="p-8">
        <div className="mb-8">
          <p className="text-gray-600 mt-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            أدخل تفاصيل المحتوى والوسائط المطلوبة
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              المعلومات الأساسية
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> العنوان
                </label>
                <div className="relative">
                  <input
                    id="title"
                    className={`w-full px-4 py-3 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="أدخل عنوان المحتوى"
                    {...register("title", { required: "العنوان مطلوب" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> الوصف
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={`w-full px-4 py-3 border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="أدخل وصف المحتوى"
                  {...register("description", { required: "الوصف مطلوب" })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <User className="h-5 w-5 text-green-600" />
              </div>
              معلومات المالك
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="ownerName"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> اسم المالك
                </label>
                <div className="relative">
                  <input
                    id="ownerName"
                    className={`w-full px-4 py-3 border ${
                      errors.ownerName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="أدخل اسم المالك"
                    {...register("ownerName", {
                      required: "اسم المالك مطلوب",
                    })}
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="ownerNumber"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> رقم المالك
                </label>
                <div className="relative">
                  <input
                    id="ownerNumber"
                    className={`w-full px-4 py-3 pr-10 border ${
                      errors.ownerNumber ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
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
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.ownerNumber && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.ownerNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              إعدادات المحتوى
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="intervalHours"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> ساعات الفاصل
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="intervalHours"
                    className={`w-full px-4 py-3 pl-10 border ${
                      errors.intervalHours
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
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
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.intervalHours && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.intervalHours.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="endValidationDate"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 ml-1">*</span> تاريخ انتهاء
                  الصلاحية
                </label>
                <div className="relative">
                  <Controller
                    name="endValidationDate"
                    control={control}
                    rules={{ required: "تاريخ انتهاء الصلاحية مطلوب" }}
                    render={({ field }) => (
                      <input
                        type="datetime-local"
                        id="endValidationDate"
                        className={`w-full px-4 py-3 pl-10 border ${
                          errors.endValidationDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        {...field}
                      />
                    )}
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.endValidationDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.endValidationDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="interestIds"
                  className="block font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <Tag className="h-5 w-5 ml-2 text-gray-500" />
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
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "#2563eb",
                            primary25: "#dbeafe",
                            primary50: "#bfdbfe",
                          },
                        })}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: "#e5e7eb",
                            padding: "2px",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#93c5fd",
                            },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#dbeafe",
                            borderRadius: "0.5rem",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "#1e40af",
                            padding: "2px 8px",
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: "#3b82f6",
                            ":hover": {
                              backgroundColor: "#bfdbfe",
                              color: "#1e3a8a",
                            },
                          }),
                        }}
                      />
                    );
                  }}
                />
                <p className="text-gray-500 text-xs mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  اختر الاهتمامات المتعلقة بالمحتوى لتحسين استهداف الجمهور
                </p>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <Upload className="h-5 w-5 text-yellow-600" />
              </div>
              الوسائط
            </h4>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-700 mb-3 flex items-center">
                <Image className="h-5 w-5 ml-2 text-gray-600" />
                الصور *
              </label>
              <div className="flex flex-col space-y-4">
                <label className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 group transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 rounded-full p-3 mb-3 group-hover:bg-blue-200 transition-colors">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-blue-700 font-semibold mb-1">
                      اضغط أو اسحب لإضافة صور
                    </span>
                    <span className="text-gray-500 text-sm">
                      PNG, JPG أو JPEG حتى 10MB
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                </label>

                {imageFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="p-2 bg-blue-50 rounded-lg mb-2 flex items-center">
                      <span className="text-blue-700 font-semibold mr-2">
                        {imageFiles.length} صورة مختارة
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imageFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <button
                              type="button"
                              onClick={() => removeImageFile(index)}
                              className="self-end bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                            >
                              <XCircle size={18} />
                            </button>
                            <p className="text-xs text-white truncate mt-1 px-1">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block font-semibold text-gray-700 mb-3 flex items-center">
                <Video className="h-5 w-5 ml-2 text-gray-600" />
                الفيديوهات *
              </label>
              <div className="flex flex-col space-y-4">
                <label className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:bg-purple-50 group transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-purple-100 rounded-full p-3 mb-3 group-hover:bg-purple-200 transition-colors">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-purple-700 font-semibold mb-1">
                      اضغط أو اسحب لإضافة فيديوهات
                    </span>
                    <span className="text-gray-500 text-sm">
                      MP4 أو MOV حتى 100MB
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoChange}
                    multiple
                  />
                </label>

                {videoFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="p-2 bg-purple-50 rounded-lg mb-2 flex items-center">
                      <span className="text-purple-700 font-semibold mr-2">
                        {videoFiles.length} فيديو مختار
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {videoFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                          <div className="aspect-video bg-gray-100 overflow-hidden">
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              controls
                            />
                          </div>
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={() => removeVideoFile(index)}
                              className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                          <div className="p-2 bg-white/90 text-xs truncate border-t">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm border border-blue-200 flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                يجب إضافة صورة أو فيديو واحد على الأقل. يمكنك إضافة عدة صور
                وفيديوهات معاً.
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={addingContent}
            className={`w-full py-4 px-6 rounded-xl shadow-lg font-bold text-lg transition-all duration-300 transform hover:translate-y-0 flex items-center justify-center ${
              addingContent
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
            }`}
          >
            {addingContent ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                جاري إنشاء المحتوى...
              </>
            ) : (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                إنشاء المحتوى
              </span>
            )}
          </button>

          {addingContent && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg
                    className="animate-pulse text-blue-600 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-blue-800 font-semibold">
                    يتم الآن معالجة المحتوى الخاص بك
                  </h4>
                  <p className="text-sm text-blue-600 mt-1">
                    قد يستغرق ذلك بين بضع ثوانٍ إلى 5 دقائق... يرجى الانتظار.
                  </p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 mt-3">
                <div className="bg-blue-600 h-2.5 rounded-full animate-progress-indeterminate"></div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {isSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-md text-green-700 flex items-center mt-6 animate-fade-in">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold">تم بنجاح!</h4>
                <p className="text-sm mt-1">
                  تم إنشاء المحتوى الخاص بك بنجاح وهو الآن جاهز للعرض.
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-md text-red-700 flex items-center mt-6 animate-fade-in">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold">حدث خطأ</h4>
                <p className="text-sm mt-1">
                  {error?.message ||
                    "حدث خطأ أثناء إنشاء المحتوى. يرجى المحاولة مرة أخرى."}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t text-center text-gray-500 text-sm">
        جميع الحقوق محفوظة © 2025 ReelWin
      </div>
    </div>
  );
}
