/* eslint-disable @next/next/no-img-element */
"use client";
import useStore from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  Clock,
  Image,
  Tag,
  Upload,
  User,
  Video
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { FormSection } from "./content/FormSection";
import { MediaPreview } from "./content/MediaPreview";
import { MediaUploader } from "./content/MediaUploader";
import { StatusMessage } from "./content/StatusMessage";
import { ContentFormData, ContentOwnerType, Interest } from "./content/type";

// Import the react-phone-number-input components and styles
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Flag, Globe } from 'lucide-react';

interface Store {
  "id": string,
  "name": string,
  "phone": string,
  "city": string,
  "address": string,
  "image": string,
  "longitude": number,
  "latitude": number,
}

export default function AdminPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const setIsAddingContent = useStore((state) => state.setIsAddingContent);
  const token = useStore((state) => state.token);

  // Set default end validation date to today
  const today = new Date();
  const formattedDefaultDate = today.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm


  // Owner type state
  const [ownerType, setOwnerType] = useState<ContentOwnerType>("INDIVIDUAL");

  // Queries
  const { data: interests, isLoading: interestsLoading } = useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: async () => {
      const response = await axios.get("https://anycode-sy.com/radar/api/interests/list");
      return response.data;
    },
  });

  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get("https://anycode-sy.com/radar/api/stores");
      return response.data;
    },
  });

  // Mutation
  const {
    mutateAsync: addContent,
    isPending: addingContent,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axios.post("https://anycode-sy.com/radar/api/content", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // Form setup
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
      ownerType: "INDIVIDUAL",
      ownerName: "",
      ownerNumber: "",
      storeId: "",
      type: "REEL",
      intervalHours: 22,
      endValidationDate: formattedDefaultDate,
      interestIds: [],
    },
  });

  // File removal functions
  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideoFile = (index: number) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submission handler
  const onSubmit = async (data: ContentFormData) => {
    setIsAddingContent(true);
    const formData = new FormData();

    // Append core content data
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("ownerType", ownerType.toString());
    formData.append("type", "REEL");
    formData.append("intervalHours", data.intervalHours.toString());

    // Handle owner-specific data
    if (ownerType === "INDIVIDUAL") {
      formData.append("ownerName", data.ownerName || "");
      // Format phone number: remove + symbol and leading zeros
      const formattedPhone = data.ownerNumber ?
        data.ownerNumber.replace(/^\+/, "").replace(/^0+/, "") : "";
      formData.append("ownerNumber", formattedPhone);
    } else {
      formData.append("storeId", data.storeId || "");
    }

    // Format date
    const date = new Date(data.endValidationDate);
    formData.append("endValidationDate", date.toISOString());

    formData.append("interestIds", JSON.stringify(data.interestIds));

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
      setOwnerType("INDIVIDUAL");

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error("Content creation error:", error);
    } finally {
      setIsAddingContent(false);
    }
  };

  // Owner Section Render Method
  const renderOwnerSection = () => (
    <FormSection
      title="معلومات المالك"
      icon={<User className="h-5 w-5 text-green-600" />}
      bgColor="bg-green-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Type Selection */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-700 mb-2">
            نوع المالك
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={"INDIVIDUAL"}
                checked={ownerType === "INDIVIDUAL"}
                onChange={() => setOwnerType("INDIVIDUAL")}
                className="form-radio"
              />
              <span className="mx-2">فردي</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={"STORE"}
                checked={ownerType === "STORE"}
                onChange={() => setOwnerType("STORE")}
                className="form-radio"
              />
              <span className="mx-2">متجر</span>
            </label>
          </div>
        </div>

        {ownerType === "INDIVIDUAL" ? (
          <>
            <div>
              <label htmlFor="ownerName" className="block font-semibold text-gray-700 mb-2">
                اسم المالك
              </label>
              <input
                {...register("ownerName", {
                  required: ownerType === "INDIVIDUAL"
                })}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="أدخل اسم المالك"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-2">اسم المالك مطلوب</p>
              )}
            </div>
            <div>
              <label htmlFor="ownerNumber" className="block font-semibold text-gray-700 mb-2">
                رقم المالك
              </label>
              {/* Phone Input with Country Code Selector */}
              <div className="phone-input-rtl">
                <Controller
                  name="ownerNumber"
                  control={control}
                  rules={{
                    required: ownerType === "INDIVIDUAL",
                    validate: (value) => {
                      return value && value.length >= 9 || "رقم الهاتف غير صحيح";
                    }
                  }}
                  render={({ field }) => {
                    // Custom country selector implementation
                    const [isOpen, setIsOpen] = useState(false);
                    const [selectedCountry, setSelectedCountry] = useState({
                      code: "SY",
                      name: "سوريا",
                      dialCode: "+963"
                    });

                    // Flag component for better browser compatibility
                    const FlagIcon = ({ countryCode, className = "" }: { countryCode: string; className?: string }) => {
                      // Special handling for Syrian revolution flag (green, white, black horizontal stripes with 3 red stars)
                      if (countryCode === "SY") {
                        return (
                          <>
                            {/* CSS-based Syrian revolution flag fallback */}
                            <div className={`hidden inline-block ${className} relative overflow-hidden rounded-sm`}>
                              <div className="w-full h-1/3 bg-green-600"></div>
                              <div className="w-full h-1/3 bg-white relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex space-x-0.5">
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full h-1/3 bg-black"></div>
                            </div>
                          </>
                        );
                      }

                      return (
                        <>
                          <img
                            src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                            alt={`${countryCode} flag`}
                            className={`inline-block ${className}`}
                            onError={(e) => {
                              // Fallback to Flag icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                          <Flag className="w-4 h-4 text-gray-400 hidden" />
                        </>
                      );
                    };

                    // Country list with Arabic names
                    const countries = [
                      { code: "SY", name: "سوريا", dialCode: "+963" },
                      { code: "SA", name: "السعودية", dialCode: "+966" },
                      { code: "AE", name: "الإمارات العربية المتحدة", dialCode: "+971" },
                      { code: "QA", name: "قطر", dialCode: "+974" },
                      { code: "KW", name: "الكويت", dialCode: "+965" },
                      { code: "BH", name: "البحرين", dialCode: "+973" },
                      { code: "OM", name: "عُمان", dialCode: "+968" },
                      { code: "JO", name: "الأردن", dialCode: "+962" },
                      { code: "LB", name: "لبنان", dialCode: "+961" },
                      { code: "IQ", name: "العراق", dialCode: "+964" },
                      { code: "PS", name: "فلسطين", dialCode: "+970" },
                      { code: "YE", name: "اليمن", dialCode: "+967" },
                      { code: "EG", name: "مصر", dialCode: "+20" },
                      { code: "SD", name: "السودان", dialCode: "+249" },
                      { code: "DZ", name: "الجزائر", dialCode: "+213" },
                      { code: "MA", name: "المغرب", dialCode: "+212" },
                      { code: "TN", name: "تونس", dialCode: "+216" },
                      { code: "LY", name: "ليبيا", dialCode: "+218" },
                      { code: "TR", name: "تركيا", dialCode: "+90" },
                      { code: "DE", name: "ألمانيا", dialCode: "+49" },
                      { code: "FR", name: "فرنسا", dialCode: "+33" },
                      { code: "GB", name: "المملكة المتحدة", dialCode: "+44" },
                      { code: "IT", name: "إيطاليا", dialCode: "+39" },
                      { code: "ES", name: "إسبانيا", dialCode: "+34" },
                      { code: "NL", name: "هولندا", dialCode: "+31" },
                      { code: "CH", name: "سويسرا", dialCode: "+41" },
                      { code: "SE", name: "السويد", dialCode: "+46" },
                    ];

                    // Handle country selection
                    const handleCountrySelect = (country: { code: string; name: string; dialCode: string }) => {
                      setSelectedCountry(country);
                      setIsOpen(false);
                      // Update phone field with new country code
                      if (field.value) {
                        // Keep the local part of the number but change the country code
                        let localPart = field.value.replace(/^\+\d+/, "");
                        // Remove leading zeros from local part
                        localPart = localPart.replace(/^0+/, "");
                        field.onChange(country.dialCode + localPart);
                      } else {
                        field.onChange(country.dialCode);
                      }
                    };

                    const dropdownRef = useRef<HTMLDivElement>(null);

                    // Close dropdown when clicking outside
                    useEffect(() => {
                      const handleClickOutside = (event: MouseEvent) => {
                        if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
                          setIsOpen(false);
                        }
                      };

                      document.addEventListener("mousedown", handleClickOutside);
                      return () => {
                        document.removeEventListener("mousedown", handleClickOutside);
                      };
                    }, [dropdownRef]);

                    return (
                      <>
                        <div className="relative w-full" ref={dropdownRef}>
                          {/* Main phone input container */}
                          <div className="border border-gray-300 rounded-lg overflow-hidden  transition-all">
                            <div className="flex items-center h-12">
                              {/* Country selector area */}
                              <button
                                type="button"
                                className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 h-full focus:outline-none hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <div className="flex items-center mr-2">
                                  <FlagIcon countryCode={selectedCountry.code} className="w-6 h-4" />
                                </div>
                                <span className="text-sm font-medium">{selectedCountry.code}</span>
                                <svg className="h-4 w-4 text-gray-500 ml-2 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {/* Phone input field */}
                              <div className="flex-grow">
                                <input
                                  type="tel"
                                  value={field.value?.replace(selectedCountry.dialCode, "") || ""}
                                  onChange={(e) => {
                                    // Only allow numbers and remove leading zeros
                                    let value = e.target.value.replace(/[^0-9]/g, "");
                                    // Remove leading zeros
                                    value = value.replace(/^0+/, "");
                                    field.onChange(selectedCountry.dialCode + value);
                                  }}
                                  className="w-full h-full p-4 focus:outline-none text-base bg-transparent"
                                  dir="ltr"
                                  placeholder="مثال: 998419869"
                                />
                              </div>

                              {/* Country code display on the right */}
                              <div className="px-4 text-base font-medium text-gray-600">
                                {selectedCountry.dialCode}
                              </div>
                            </div>
                          </div>

                          {/* Custom dropdown */}
                          {isOpen && (
                            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                              {countries.map((country) => (
                                <div
                                  key={country.code}
                                  className={`flex items-center  justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${selectedCountry.code === country.code ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
                                  onClick={() => handleCountrySelect(country)}
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="flex items-center mr-3">
                                      <FlagIcon countryCode={country.code} className="w-6 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{country.name}</span>
                                      <span className="text-sm text-gray-500">{country.dialCode}</span>
                                    </div>
                                  </div>
                                  <span className="text-sm font-mono text-gray-400">{country.code}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>


                      </>
                    );
                  }}
                />
              </div>
              {errors.ownerNumber && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.ownerNumber.message || "رقم الهاتف مطلوب"}
                </p>
              )}

            </div>
          </>
        ) : (
          <div className="md:col-span-2">
            <label htmlFor="storeId" className="block font-semibold text-gray-700 mb-2">
              اختر المتجر
            </label>
            <Controller
              name="storeId"
              control={control}
              rules={{
                required: ownerType === "STORE"
              }}
              render={({ field }) => {
                const storeOptions = stores?.map(store => ({
                  value: store.id,
                  label: store.name
                })) || [];

                return (
                  <Select
                    {...field}
                    options={storeOptions}
                    placeholder="اختر المتجر"
                    isLoading={storesLoading}
                    value={
                      field.value
                        ? storeOptions.find(option => option.value === field.value)
                        : null
                    }
                    onChange={(
                      newValue: SingleValue<{ value: string; label: string }>,
                    ) => {
                      field.onChange(newValue ? newValue.value : '');
                    }}
                  />
                );
              }}
            />
            {errors.storeId && (
              <p className="text-red-500 text-sm mt-2">يجب اختيار متجر</p>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );

  // Main render method
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
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Basic Info Section */}
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
                  className=" font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 mx-1">*</span> العنوان
                </label>
                <div className="relative">
                  <input
                    id="title"
                    className={`w-full px-4 py-3 border ${errors.title ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="أدخل عنوان المحتوى"
                    {...register("title", { required: "العنوان مطلوب" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mx-1"
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
                  className=" font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 mx-1">*</span> الوصف
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={`w-full px-4 py-3 border ${errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="أدخل وصف المحتوى"
                  {...register("description", { required: "الوصف مطلوب" })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mx-1"
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


          {/* Owner Section */}
          {renderOwnerSection()}

          {/* Content Settings Section */}

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
                  className=" font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 mx-1">*</span> ساعات الفاصل
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="intervalHours"
                    className={`w-full px-4 py-3 pl-10 border ${errors.intervalHours ? "border-red-500" : "border-gray-300"
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
                        className="h-4 w-4 mx-1"
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
                  className="font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <span className="text-red-500 mx-1">*</span> تاريخ انتهاء الصلاحية
                </label>
                <div className="relative">
                  <Controller
                    name="endValidationDate"
                    control={control}
                    rules={{
                      required: "تاريخ انتهاء الصلاحية مطلوب",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
                        return selectedDate >= today || "لا يمكن اختيار تاريخ في الماضي";
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type="datetime-local"
                        id="endValidationDate"
                        className={`w-full px-4 py-3 pl-10 border ${errors.endValidationDate ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                        {...field}
                      />
                    )}
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  {errors.endValidationDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mx-1"
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
                  className=" font-semibold text-gray-700 mb-2 flex items-center"
                >
                  <Tag className="h-5 w-5 mx-2 text-gray-500" />
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
                    className="h-4 w-4 mx-1"
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

          {/* Media Section */}
          <FormSection
            title="الوسائط"
            icon={<Upload className="h-5 w-5 text-yellow-600" />}
            bgColor="bg-yellow-100"
          >
            {/* Image Upload */}
            <MediaUploader
              label="الصور"
              icon={<Image className="h-5 w-5 mx-2 text-gray-600" />}
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
              icon={<Video className="h-5 w-5 mx-2 text-gray-600" />}
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
                className="h-5 w-5 mx-2 mt-0.5 flex-shrink-0"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={addingContent}
            className={`w-full py-4 px-6 rounded-xl shadow-lg font-bold text-lg transition-all duration-300 transform hover:translate-y-0 flex items-center justify-center ${addingContent
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
              }`}
          >
            {addingContent ? (
              <>
                <svg
                  className="animate-spin mx-3 h-6 w-6 text-white"
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
                  className="h-6 w-6 mx-2"
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

          {/* Status Messages */}
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
        جميع الحقوق محفوظة © 2025 Radar
      </div>
    </div>
  );
}

