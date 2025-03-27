/* eslint-disable @next/next/no-img-element */
"use client";
import useStore from "@/store";
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
} from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { FormSection } from "./content/FormSection";
import { MediaPreview } from "./content/MediaPreview";
import { MediaUploader } from "./content/MediaUploader";
import { StatusMessage } from "./content/StatusMessage";
import { ContentFormData, Interest } from "./content/type";

// Page Component
export default function AdminPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const setIsAddingContent = useStore((state) => state.setIsAddingContent);
  const token = useStore((state) => state.token);

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

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideoFile = (index: number) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContentFormData) => {
    setIsAddingContent(true);
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
    } finally {
      setIsAddingContent(false);
    }
  };

  // Conditional rendering for form sections
  const renderBasicInfoSection = () => (
    <FormSection
      title="المعلومات الأساسية"
      icon={
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
      }
      bgColor="bg-blue-100"
    >
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
    </FormSection>
  );

  const renderOwnerInfoSection = () => (
    <FormSection
      title="معلومات المالك"
      icon={<User className="h-5 w-5 text-green-600" />}
      bgColor="bg-green-100"
    >
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
                  message: "يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)",
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
    </FormSection>
  );

  const renderContentSettingsSection = () => (
    <FormSection
      title="إعدادات المحتوى"
      icon={
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
      }
      bgColor="bg-purple-100"
    >
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
                errors.intervalHours ? "border-red-500" : "border-gray-300"
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
            <span className="text-red-500 ml-1">*</span> تاريخ انتهاء الصلاحية
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
    </FormSection>
  );

  const renderMediaSection = () => (
    <FormSection
      title="الوسائط"
      icon={<Upload className="h-5 w-5 text-yellow-600" />}
      bgColor="bg-yellow-100"
    >
      {/* Image Upload */}
      <MediaUploader
        label="الصور"
        icon={<Image className="h-5 w-5 ml-2 text-gray-600" />}
        fileType="صور"
        accept="PNG, JPG أو JPEG"
        colorScheme={{
          gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
          border: "border-blue-300",
          bg: "bg-blue-100",
          hover: "hover:bg-blue-50",
          text: "text-blue-600",
        }}
        files={imageFiles}
        onFilesChange={setImageFiles}
      />

      {imageFiles.length > 0 && (
        <MediaPreview files={imageFiles} removeFile={removeImageFile} />
      )}

      {/* Video Upload */}
      <MediaUploader
        label="الفيديوهات"
        icon={<Video className="h-5 w-5 ml-2 text-gray-600" />}
        fileType="فيديوهات"
        accept="MP4 أو MOV"
        colorScheme={{
          gradient: "bg-gradient-to-br from-purple-50 to-purple-100",
          border: "border-purple-300",
          bg: "bg-purple-100",
          hover: "hover:bg-purple-50",
          text: "text-purple-600",
        }}
        files={videoFiles}
        onFilesChange={setVideoFiles}
      />

      {videoFiles.length > 0 && (
        <MediaPreview
          files={videoFiles}
          removeFile={removeVideoFile}
          isVideo={true}
        />
      )}

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
          يجب إضافة صورة أو فيديو واحد على الأقل. يمكنك إضافة عدة صور وفيديوهات
          معاً.
        </span>
      </div>
    </FormSection>
  );

  const renderSubmitButton = () => (
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
  );

  // Main component render
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
          {renderBasicInfoSection()}
          {renderOwnerInfoSection()}
          {renderContentSettingsSection()}
          {renderMediaSection()}

          {renderSubmitButton()}

          {addingContent && (
            <StatusMessage
              type="loading"
              title="يتم الآن معالجة المحتوى الخاص بك"
              message="قد يستغرق ذلك بين بضع ثوانٍ إلى 5 دقائق... يرجى الانتظار."
            />
          )}

          {isSuccess && (
            <StatusMessage
              type="success"
              title="تم بنجاح!"
              message="تم إنشاء المحتوى الخاص بك بنجاح وهو الآن جاهز للعرض."
            />
          )}

          {isError && (
            <StatusMessage
              type="error"
              title="حدث خطأ"
              message="حدث خطأ أثناء إنشاء المحتوى. يرجى المحاولة مرة أخرى."
              error={error}
            />
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
