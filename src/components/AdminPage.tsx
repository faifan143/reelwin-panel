/* eslint-disable @next/next/no-img-element */
"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useStore from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  Calendar,
  Clock,
  Image,
  Info,
  Store as StoreIcon,
  Tag,
  Upload,
  User,
  Video
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { MediaPreview } from "./content/MediaPreview";
import { MediaUploader } from "./content/MediaUploader";
import { StatusMessage } from "./content/StatusMessage";
import { ContentFormData, ContentOwnerType, Interest } from "./content/type";

// Import the react-phone-number-input components and styles
import { Flag } from 'lucide-react';
import 'react-phone-number-input/style.css';

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
      const response = await axios.get("https://anycode-sy.com/radar/api/interests/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  });

  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get("https://anycode-sy.com/radar/api/stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return Array.isArray(response.data) ? response.data : response.data.data || [];
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
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">معلومات المالك</h3>
          <p className="text-xs text-slate-400 mt-0.5">حدد نوع المالك والمعلومات</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Owner Type Selection */}
        <div className="space-y-3">
          <Label className="text-slate-200 font-medium text-sm">نوع المالك</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOwnerType("INDIVIDUAL")}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                ownerType === "INDIVIDUAL"
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">فردي</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setOwnerType("STORE")}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                ownerType === "STORE"
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <StoreIcon className="h-4 w-4" />
                <span className="font-medium">متجر</span>
              </div>
            </button>
          </div>
        </div>

        {ownerType === "INDIVIDUAL" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-slate-200 font-medium text-sm">اسم المالك</Label>
              <Input
                id="ownerName"
                {...register("ownerName", {
                  required: ownerType === "INDIVIDUAL"
                })}
                className={`bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-11 ${errors.ownerName ? "border-red-500" : ""}`}
                placeholder="الاسم الكامل"
              />
              {errors.ownerName && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  اسم المالك مطلوب
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerNumber" className="text-slate-200 font-medium text-sm">رقم الهاتف</Label>
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
                          <div className="border border-slate-600 bg-slate-700/50 rounded-lg overflow-hidden transition-all focus-within:border-blue-500">
                            <div className="flex items-center h-12">
                              {/* Country selector area */}
                              <button
                                type="button"
                                className="flex items-center gap-1 px-3 py-3 border-r border-slate-600 h-full focus:outline-none hover:bg-slate-600/50 transition-colors text-white"
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <div className="flex items-center mr-2">
                                  <FlagIcon countryCode={selectedCountry.code} className="w-6 h-4" />
                                </div>
                                <span className="text-sm font-medium text-white">{selectedCountry.code}</span>
                                <svg className="h-4 w-4 text-slate-400 ml-2 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                  className="w-full h-full p-4 focus:outline-none text-base bg-transparent text-white placeholder:text-slate-400"
                                  dir="ltr"
                                  placeholder="مثال: 998419869"
                                />
                              </div>

                              {/* Country code display on the right */}
                              <div className="px-4 text-base font-medium text-slate-300">
                                {selectedCountry.dialCode}
                              </div>
                            </div>
                          </div>

                          {/* Custom dropdown */}
                          {isOpen && (
                            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-slate-700 border border-slate-600 rounded-lg shadow-2xl">
                              {countries.map((country) => (
                                <div
                                  key={country.code}
                                  className={`flex items-center justify-between px-4 py-3 hover:bg-slate-600 cursor-pointer transition-colors ${selectedCountry.code === country.code ? 'bg-blue-600 text-white' : 'text-slate-200'}`}
                                  onClick={() => handleCountrySelect(country)}
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="flex items-center mr-3">
                                      <FlagIcon countryCode={country.code} className="w-6 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{country.name}</span>
                                      <span className="text-sm text-slate-400">{country.dialCode}</span>
                                    </div>
                                  </div>
                                  <span className="text-sm font-mono text-slate-400">{country.code}</span>
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
                <p className="text-red-400 text-sm mt-2">
                  {errors.ownerNumber.message || "رقم الهاتف مطلوب"}
                </p>
              )}

            </div>
          </>
        ) : (
          <div className="space-y-2 relative z-50">
            <Label htmlFor="storeId" className="text-slate-200 font-medium text-sm">
              اختر المتجر
            </Label>
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
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "لا توجد متاجر متاحة"}
                    loadingMessage={() => "جاري التحميل..."}
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
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "#3b82f6",
                        primary25: "#1e3a8a",
                        primary50: "#1e40af",
                        neutral0: "#334155",
                        neutral5: "#475569",
                        neutral10: "#64748b",
                        neutral20: "#475569",
                        neutral30: "#64748b",
                        neutral40: "#94a3b8",
                        neutral50: "#cbd5e1",
                        neutral60: "#e2e8f0",
                        neutral70: "#f1f5f9",
                        neutral80: "#ffffff",
                        neutral90: "#ffffff",
                      },
                    })}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        borderColor: state.isFocused ? "#3b82f6" : "#475569",
                        backgroundColor: "#334155",
                        padding: "2px",
                        boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
                        minHeight: "44px",
                        "&:hover": {
                          borderColor: "#3b82f6",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#334155",
                        border: "1px solid #475569",
                        borderRadius: "0.5rem",
                        zIndex: 9999,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected 
                          ? "#1e40af" 
                          : state.isFocused 
                          ? "#1e3a8a" 
                          : "#334155",
                        color: "#ffffff",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#1e40af",
                        },
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#94a3b8",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#ffffff",
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        backgroundColor: "#475569",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: "#94a3b8",
                        "&:hover": {
                          color: "#ffffff",
                        },
                      }),
                      clearIndicator: (base) => ({
                        ...base,
                        color: "#94a3b8",
                        "&:hover": {
                          color: "#ffffff",
                        },
                      }),
                      loadingIndicator: (base) => ({
                        ...base,
                        color: "#3b82f6",
                      }),
                    }}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                  />
                );
              }}
            />
            {errors.storeId && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                يجب اختيار متجر
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Main render method
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">إضافة محتوى جديد</h1>
                <p className="text-slate-400 text-sm mt-0.5">قم بإنشاء وإدارة المحتوى الخاص بك بسهولة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
              >
                مسودة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
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
                <div>
                  <h3 className="text-lg font-semibold text-white">المعلومات الأساسية</h3>
                  <p className="text-xs text-slate-400 mt-0.5">عنوان ووصف المحتوى</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <span className="text-red-400">*</span>
                    عنوان المحتوى
                  </Label>
                  <Input
                    id="title"
                    placeholder="مثال: عرض خاص على المنتجات"
                    className={`bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-11 ${errors.title ? "border-red-500" : ""}`}
                    {...register("title", { required: "العنوان مطلوب" })}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <span className="text-red-400">*</span>
                    وصف المحتوى
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    className={`bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none ${errors.description ? "border-red-500" : ""}`}
                    placeholder="اكتب وصفاً تفصيلياً للمحتوى..."
                    {...register("description", { required: "الوصف مطلوب" })}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>


          {/* Owner Section */}
          {renderOwnerSection()}

          {/* Content Settings Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
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
              <div>
                <h3 className="text-lg font-semibold text-white">إعدادات المحتوى</h3>
                <p className="text-xs text-slate-400 mt-0.5">الجدولة والاهتمامات</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="intervalHours" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-red-400">*</span>
                    ساعات الفاصل
                  </Label>
                  <Input
                    type="number"
                    id="intervalHours"
                    className={`bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-11 ${errors.intervalHours ? "border-red-500" : ""}`}
                    placeholder="22"
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
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.intervalHours.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endValidationDate" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-red-400">*</span>
                    تاريخ الانتهاء
                  </Label>
                  <Controller
                    name="endValidationDate"
                    control={control}
                    rules={{
                      required: "تاريخ انتهاء الصلاحية مطلوب",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selectedDate >= today || "لا يمكن اختيار تاريخ في الماضي";
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        id="endValidationDate"
                        className={`bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-11 ${errors.endValidationDate ? "border-red-500" : ""}`}
                        min={new Date().toISOString().slice(0, 16)}
                        {...field}
                      />
                    )}
                  />
                  {errors.endValidationDate && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.endValidationDate.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestIds" className="flex items-center gap-2 text-slate-200 font-medium text-sm">
                  <Tag className="h-4 w-4 text-slate-400" />
                  الاهتمامات (اختياري)
                </Label>
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
                            primary: "#3b82f6",
                            primary25: "#1e3a8a",
                            primary50: "#1e40af",
                            neutral0: "#334155",
                            neutral5: "#475569",
                            neutral10: "#64748b",
                            neutral20: "#475569",
                            neutral30: "#64748b",
                            neutral40: "#94a3b8",
                            neutral50: "#cbd5e1",
                            neutral60: "#e2e8f0",
                            neutral70: "#f1f5f9",
                            neutral80: "#ffffff",
                            neutral90: "#ffffff",
                          },
                        })}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: "#475569",
                            backgroundColor: "#334155",
                            padding: "2px",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#3b82f6",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#334155",
                            border: "1px solid #475569",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? "#1e3a8a" : "#334155",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#1e40af",
                            },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#1e40af",
                            borderRadius: "0.5rem",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "#ffffff",
                            padding: "2px 8px",
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: "#93c5fd",
                            ":hover": {
                              backgroundColor: "#1e3a8a",
                              color: "#ffffff",
                            },
                          }),
                          input: (base) => ({
                            ...base,
                            color: "#ffffff",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#94a3b8",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#ffffff",
                          }),
                        }}
                      />
                    );
                  }}
                />
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                  <Info className="h-3 w-3" />
                  اختر الاهتمامات لتحسين الاستهداف
                </p>
              </div>
            </div>
          </div>

          {/* Media Upload Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">الوسائط</h3>
                <p className="text-xs text-slate-400 mt-0.5">صور وفيديوهات المحتوى</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <MediaUploader
                  label="الصور"
                  icon={<Image className="h-5 w-5 mx-2 text-gray-600" />}
                  fileType="صور"
                  accept="PNG, JPG أو JPEG"
                  colorScheme={{
                    gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
                    border: "border-blue-300",
                    bg: "bg-blue-500",
                    hover: "hover:bg-blue-50",
                    text: "text-white",
                  }}
                  files={imageFiles}
                  onFilesChange={setImageFiles}
                />

                {imageFiles.length > 0 && (
                  <MediaPreview files={imageFiles} removeFile={removeImageFile} />
                )}
              </div>

              {/* Video Upload */}
              <div>
                <MediaUploader
                  label="الفيديوهات"
                  icon={<Video className="h-5 w-5 mx-2 text-gray-600" />}
                  fileType="فيديوهات"
                  accept="MP4 أو MOV"
                  colorScheme={{
                    gradient: "bg-gradient-to-br from-purple-50 to-purple-100",
                    border: "border-purple-300",
                    bg: "bg-purple-500",
                    hover: "hover:bg-purple-50",
                    text: "text-white",
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
              </div>

              <Alert variant="info" className="bg-blue-900/20 border-blue-500/30 text-blue-200">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200 text-sm">
                  يجب إضافة صورة أو فيديو واحد على الأقل
                </AlertDescription>
              </Alert>
            </div>
          </div>
          </div>

          {/* Right Sidebar - Quick Actions & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Submit Actions Card */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">نشر المحتوى</h3>
                
                <Button
                  type="submit"
                  disabled={addingContent}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                >
                  {addingContent ? (
                    <>
                      <Clock className="ml-2 h-5 w-5 animate-spin" />
                      جاري النشر...
                    </>
                  ) : (
                    <>
                      <Upload className="ml-2 h-5 w-5" />
                      نشر المحتوى
                    </>
                  )}
                </Button>

                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">الحالة</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                      جاهز للنشر
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">النوع</span>
                    <span className="text-white font-medium">REEL</span>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Info className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">نصائح للمحتوى</h4>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>استخدم عناوين واضحة وجذابة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>أضف وصفاً تفصيلياً للمحتوى</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>اختر الاهتمامات المناسبة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>استخدم صور عالية الجودة</span>
                </li>
              </ul>
            </div>
            </div>
          </div>

        </form>

        {/* Status Messages */}
        {addingContent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <StatusMessage
              type="loading"
              title="يتم الآن معالجة المحتوى الخاص بك"
              message="قد يستغرق ذلك بين بضع ثوانٍ إلى 5 دقائق... يرجى الانتظار."
            />
          </div>
        )}

        {isSuccess && (
          <div className="mt-6">
            <StatusMessage
              type="success"
              title="تم بنجاح!"
              message="تم إنشاء المحتوى الخاص بك بنجاح وهو الآن جاهز للعرض."
            />
          </div>
        )}

        {isError && (
          <div className="mt-6">
            <StatusMessage
              type="error"
              title="حدث خطأ"
              message="حدث خطأ أثناء إنشاء المحتوى. يرجى المحاولة مرة أخرى."
              error={error}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-400">
              جميع الحقوق محفوظة © 2025 Radar
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>الإصدار 1.0.0</span>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">الدعم</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

