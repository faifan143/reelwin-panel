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
  XCircle,
} from "lucide-react";
import { ChangeEvent, useRef, useState, FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";


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


        </div>

    </div>

    </FormSection>

          )



          return <></>
        }