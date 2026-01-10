/* eslint-disable @next/next/no-img-element */
"use client";
import useStore from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Filter,
  Gem,
  Image,
  MessageCircle,
  Phone,
  Search,
  Store,
  ThumbsUp,
  Trash2,
  User,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { generateGem } from "../gems-versions/api";

// Types
interface Content {
  id: string;
  title: string;
  description: string;
  ownerName: string | null;
  ownerNumber: string | null;
  ownerType: "INDIVIDUAL" | "STORE";
  storeId: string | null;
  store?: {
    id: string;
    name: string;
  };
  type: "REEL";
  intervalHours: number;
  endValidationDate: string;
  mediaUrls: Array<{
    type: "IMAGE" | "VIDEO";
    url: string;
    poster?: string;
  }>;
  interests: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  _count?: {
    likedBy: number;
    viewedBy: number;
    whatsappedBy: number;
  };
}

interface ContentFormData {
  title: string;
  description: string;
  ownerType: "INDIVIDUAL" | "STORE";
  ownerName: string;
  ownerNumber: string;
  storeId: string;
  intervalHours: number;
  endValidationDate: string;
  interestIds: string[];
  type: "REEL";
}

interface Interest {
  id: string;
  name: string;
}

interface SearchFilters {
  ownerName?: string;
  ownerNumber?: string;
  type?: "REEL";
  interestId?: string;
}

export default function ContentManagementPage() {
  const token = useStore((state) => state.token);
  const queryClient = useQueryClient();

  // State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "IMAGE" | "VIDEO";
    url: string;
    poster?: string;
  } | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isGemModalOpen, setIsGemModalOpen] = useState(false);
  const [gemPoints, setGemPoints] = useState<number>(50);


  interface Store {
    id: string;
    name: string;
    phone: string;
    city: string;
    address: string;
    image: string;
    longitude: number;
    latitude: number;
  }

  // Add to state declarations
  const [ownerType, setOwnerType] = useState<"INDIVIDUAL" | "STORE">("INDIVIDUAL");

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get("https://anycode-sy.com/radar/api/stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data as Store[];
    },
  });


  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue
  } = useForm<ContentFormData>();

  const watchedOwnerType = watch("ownerType");

  // Add this function to handle owner type changes
  const handleOwnerTypeChange = (type: "INDIVIDUAL" | "STORE") => {
    setValue("ownerType", type);
    setOwnerType(type);
  };

  // Fetch content
  const {
    data: contentData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["content", filters, currentPage, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.ownerName) params.append("ownerName", filters.ownerName);
      if (filters.ownerNumber)
        params.append("ownerNumber", filters.ownerNumber);
      if (filters.type) params.append("type", filters.type);
      if (filters.interestId) params.append("interestId", filters.interestId);

      const response = await axios.get(
        "https://anycode-sy.com/radar/api/content?" + params.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as Content[];
    },
  });

  // Fetch interests
  const { data: interests } = useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const response = await axios.get("https://anycode-sy.com/radar/api/interests/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data as Interest[];
    },
  });

  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      // Prepare the data based on the owner type
      const { ownerType, ownerName, ownerNumber, storeId, ...otherData } = data;

      const updateData: any = {
        ...otherData,
        ownerType
      };

      if (ownerType === "INDIVIDUAL") {
        updateData.ownerName = ownerName;
        updateData.ownerNumber = ownerNumber;
        // Don't include storeId when owner type is INDIVIDUAL
      } else if (ownerType === "STORE") {
        updateData.storeId = storeId;
        // Don't include ownerName and ownerNumber when owner type is STORE
      }

      return axios.patch(`https://anycode-sy.com/radar/api/content/${selectedContent?.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      setIsEditModalOpen(false);
      alert("تم تحديث المحتوى بنجاح");
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("حدث خطأ أثناء تحديث المحتوى");
    },
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`https://anycode-sy.com/radar/api/content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      setIsDeleteModalOpen(false);
      alert("تم حذف المحتوى بنجاح");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert("حدث خطأ أثناء حذف المحتوى");
    },
  });

  // Generate gem mutation
  const generateGemMutation = useMutation({
    mutationFn: async ({
      contentId,
      points,
    }: {
      contentId: string;
      points: number;
    }) => {
      return generateGem({
        points,
        contentId
      })
    },
    onSuccess: (data) => {
      alert(`تم إنشاء جائزة بقيمة ${data.gem.points} نقطة`);
      setIsGemModalOpen(false);
    },
    onError: (error) => {
      console.error("Generate gem error:", error);
      alert("حدث خطأ أثناء إنشاء الجائزة");
    },
  });

  const handleEditClick = (content: Content) => {
    setSelectedContent(content);
    setOwnerType(content.ownerType);

    // Format date for datetime-local input
    const date = new Date(content.endValidationDate);
    const formattedDate = date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

    // Reset form with content data
    reset({
      title: content.title,
      description: content.description,
      ownerType: content.ownerType,  // Set the owner type correctly
      ownerName: content.ownerName || "",
      ownerNumber: content.ownerNumber || "",
      storeId: content.storeId || "",
      intervalHours: content.intervalHours,
      endValidationDate: formattedDate,
      interestIds: (content.interests || []).map((interest) => interest.id),
      type: content.type,
    });

    setIsEditModalOpen(true);
  };
  // Handle delete button click
  const handleDeleteClick = (content: Content) => {
    setSelectedContent(content);
    setIsDeleteModalOpen(true);
  };

  // Handle media click to preview
  const handleMediaClick = (media: {
    type: "IMAGE" | "VIDEO";
    url: string;
    poster?: string;
  }) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  // Handle gem generation click
  const handleGemClick = (content: Content) => {
    setSelectedContent(content);
    setGemPoints(50);
    setIsGemModalOpen(true);
  };

  // Handle form submission for edit
  const onSubmit = (data: ContentFormData) => {
    if (selectedContent) {
      updateMutation.mutate(data);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Pagination helpers
  const totalItems = contentData?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = contentData?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Eye className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">إدارة المحتوى</h1>
                <p className="text-slate-400 text-sm mt-0.5">عرض وتعديل وحذف المحتوى الموجود في النظام</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                {totalItems} محتوى
              </h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                {contentData?.length || 0} نتيجة
              </span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 transition-all font-medium text-sm"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  اسم المالك
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filters.ownerName || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, ownerName: e.target.value })
                  }
                  placeholder="البحث حسب اسم المالك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filters.ownerNumber || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, ownerNumber: e.target.value })
                  }
                  placeholder="09XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  الفئة
                </label>
                <select
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filters.interestId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, interestId: e.target.value })
                  }
                >
                  <option value="" className="bg-slate-800">جميع الفئات</option>
                  {interests?.map((interest) => (
                    <option key={interest.id} value={interest.id} className="bg-slate-800">
                      {interest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    refetch();
                    setCurrentPage(1);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Search className="h-4 w-4" />
                  بحث
                </button>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 transition-all font-medium text-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Content List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl">
            حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
          </div>
        ) : contentData && contentData.length > 0 ? (
          <>
            {/* Desktop Compact Table View */}
            <div className="hidden md:block bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/30">
                  <thead className="bg-gradient-to-r from-slate-800/90 to-slate-800/70 backdrop-blur-sm border-b-2 border-slate-700/50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider w-16">
                        #
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider min-w-[280px]">
                        المحتوى
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider w-24">
                        الوسائط
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider min-w-[160px]">
                        المالك
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider w-32">
                        الإعدادات
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider w-32">
                        الإحصائيات
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right text-xs font-bold text-slate-200 uppercase tracking-wider w-28">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 bg-slate-900/20">
                    {currentItems.map((content, index) => (
                      <tr 
                        key={content.id} 
                        className="hover:bg-slate-800/40 transition-colors duration-150 group"
                      >
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70 group-hover:bg-blue-400 transition-colors"></div>
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              {startIndex + index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                                  {content.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  {content.description}
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-600 font-mono bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50 flex-shrink-0">
                                {content.id.slice(0, 6)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(content.interests || []).slice(0, 3).map((interest, idx) => {
                                const colors = [
                                  "bg-blue-500/15 text-blue-400 border-blue-500/30",
                                  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                                  "bg-purple-500/15 text-purple-400 border-purple-500/30",
                                ];
                                const colorClass = colors[idx % colors.length];
                                return (
                                  <span
                                    key={interest.id}
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colorClass}`}
                                  >
                                    {interest.name}
                                  </span>
                                );
                              })}
                              {(content.interests || []).length > 3 && (
                                <span className="text-[10px] text-slate-500 px-1.5 py-0.5">
                                  +{(content.interests || []).length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex gap-1">
                            {content.mediaUrls.slice(0, 2).map((media, index) => (
                              <button
                                key={index}
                                onClick={() => handleMediaClick(media)}
                                className={`p-1.5 rounded-lg transition-all duration-150 hover:scale-110 ${
                                  media.type === "IMAGE"
                                    ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30"
                                    : "bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/30"
                                }`}
                                title={media.type === "IMAGE" ? "صورة" : "فيديو"}
                              >
                                {media.type === "IMAGE" ? (
                                  <Image className="h-3.5 w-3.5" />
                                ) : (
                                  <Video className="h-3.5 w-3.5" />
                                )}
                              </button>
                            ))}
                            {content.mediaUrls.length > 2 && (
                              <span className="text-[10px] text-slate-500 px-1 py-1">
                                +{content.mediaUrls.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {content.ownerType === "INDIVIDUAL" ? (
                              <>
                                <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                                  <User className="h-3 w-3 text-blue-400" />
                                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                                    {content.ownerName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Phone className="h-3 w-3" />
                                  <span className="font-mono">{content.ownerNumber}</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded border border-blue-500/30 inline-block w-fit font-semibold">
                                  فردي
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                                  <Store className="h-3 w-3 text-indigo-400" />
                                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                                    {content.store?.name || "متجر"}
                                  </span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/15 text-indigo-400 rounded border border-indigo-500/30 inline-block w-fit font-semibold">
                                  متجر
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                              <Clock className="h-3 w-3 text-amber-400" />
                              <span className="text-xs font-semibold text-white">{content.intervalHours}</span>
                              <span className="text-[10px] text-slate-500">س</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                              <Calendar className="h-3 w-3 text-cyan-400" />
                              <span className="text-[10px] font-medium text-slate-300">
                                {new Date(content.endValidationDate).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                              <Eye className="h-3 w-3 text-blue-400" />
                              <span className="text-xs font-bold text-blue-400">{content._count?.viewedBy || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                              <ThumbsUp className="h-3 w-3 text-emerald-400" />
                              <span className="text-xs font-bold text-emerald-400">{content._count?.likedBy || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                              <MessageCircle className="h-3 w-3 text-purple-400" />
                              <span className="text-xs font-bold text-purple-400">{content._count?.whatsappedBy || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleGemClick(content)}
                              className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-all duration-150 hover:scale-110"
                              title="إنشاء جائزة"
                            >
                              <Gem className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(content)}
                              className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 transition-all duration-150 hover:scale-110"
                              title="تعديل"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(content)}
                              className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 transition-all duration-150 hover:scale-110"
                              title="حذف"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Compact Card Grid View */}
            <div className="md:hidden grid grid-cols-1 gap-3">
              {currentItems.map((content) => (
                <div
                  key={content.id}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-6 hover:shadow-blue-500/10 transition-all duration-200"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="text-xs text-slate-500 font-mono font-medium bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                          {content.id.slice(0, 12)}...
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        {content.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGemClick(content)}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="إنشاء جائزة"
                      >
                        <Gem className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(content)}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/20 border border-blue-500/30 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="تعديل"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(content)}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400 hover:from-red-500/30 hover:to-red-600/20 border border-red-500/30 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-3">
                    {content.description}
                  </p>

                  {/* Tags/Interests */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(content.interests || []).map((interest, idx) => {
                      const colors = [
                        "bg-blue-500/10 text-blue-400 border-blue-500/30",
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                        "bg-purple-500/10 text-purple-400 border-purple-500/30",
                        "bg-amber-500/10 text-amber-400 border-amber-500/30",
                        "bg-pink-500/10 text-pink-400 border-pink-500/30",
                      ];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <span
                          key={interest.id}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${colorClass} shadow-sm`}
                        >
                          {interest.name}
                        </span>
                      );
                    })}
                  </div>

                  {/* Media, Owner, and Settings */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Media */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/50 p-3 rounded-xl shadow-lg">
                      <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        الوسائط
                      </div>
                      <div className="flex gap-2">
                        {content.mediaUrls.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => handleMediaClick(media)}
                            className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg ${
                              media.type === "IMAGE"
                                ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/20 border border-blue-500/30"
                                : "bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 hover:from-purple-500/30 hover:to-purple-600/20 border border-purple-500/30"
                            }`}
                          >
                            {media.type === "IMAGE" ? (
                              <Image className="h-4 w-4" />
                            ) : (
                              <Video className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/50 p-3 rounded-xl shadow-lg">
                      <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        المالك
                      </div>
                      {content.ownerType === "INDIVIDUAL" ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-blue-500/20">
                              <User className="h-3.5 w-3.5 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold text-white">{content.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone className="h-3.5 w-3.5 text-slate-500" />
                            <span className="font-mono">{content.ownerNumber}</span>
                          </div>
                          <div className="mt-2 text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-semibold inline-block border border-blue-500/30">
                            فردي
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-indigo-500/20">
                              <Store className="h-3.5 w-3.5 text-indigo-400" />
                            </div>
                            <span className="text-sm font-bold text-white">{content.store?.name || "متجر"}</span>
                          </div>
                          <div className="mt-2 text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg font-semibold inline-block border border-indigo-500/30">
                            متجر
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Settings and Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Settings */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/50 p-3 rounded-xl shadow-lg">
                      <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        الإعدادات
                      </div>
                      <div className="flex items-center gap-2 mb-2 bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-700/50">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-semibold text-white">{content.intervalHours}</span>
                        <span className="text-xs text-slate-400">ساعة</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-700/50">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-medium text-slate-300">
                          {new Date(content.endValidationDate).toLocaleDateString("ar")}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/50 p-3 rounded-xl shadow-lg">
                      <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        الإحصائيات
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-blue-500/10 px-2 py-1.5 rounded-lg border border-blue-500/20">
                          <Eye className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-sm font-bold text-blue-400">{content._count?.viewedBy || 0}</span>
                          <span className="text-xs text-slate-400">مشاهدة</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1.5 rounded-lg border border-emerald-500/20">
                          <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400">{content._count?.likedBy || 0}</span>
                          <span className="text-xs text-slate-400">إعجاب</span>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-500/10 px-2 py-1.5 rounded-lg border border-purple-500/20">
                          <MessageCircle className="h-3.5 w-3.5 text-purple-400" />
                          <span className="text-sm font-bold text-purple-400">{content._count?.whatsappedBy || 0}</span>
                          <span className="text-xs text-slate-400">تواصل</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 bg-slate-900/50 backdrop-blur-sm px-6 py-4 border-t border-slate-700/50 rounded-2xl shadow-xl">
              {/* Mobile pagination */}
              <div className="flex justify-between items-center w-full sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-xl transition-all ${currentPage === 1
                    ? "bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed"
                    : "bg-slate-800/50 text-slate-200 border-slate-600 hover:bg-slate-700/50"
                    }`}
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </button>
                <span className="text-sm text-slate-300 font-medium">
                  {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-xl transition-all ${currentPage === totalPages || totalPages === 0
                    ? "bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed"
                    : "bg-slate-800/50 text-slate-200 border-slate-600 hover:bg-slate-700/50"
                    }`}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Desktop pagination */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-300">
                    عرض <span className="font-semibold text-white">{startIndex + 1}</span>{" "}
                    إلى{" "}
                    <span className="font-semibold text-white">
                      {Math.min(endIndex, totalItems)}
                    </span>{" "}
                    من <span className="font-semibold text-white">{totalItems}</span> عنصر
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex gap-2"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-3 py-2 rounded-xl border text-sm font-medium transition-all ${currentPage === 1
                        ? "bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed"
                        : "bg-slate-800/50 text-slate-200 border-slate-600 hover:bg-slate-700/50"
                        }`}
                    >
                      <span className="sr-only">السابق</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 rounded-xl border text-sm font-medium transition-all ${currentPage === pageNumber
                            ? "z-10 bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50"
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`relative inline-flex items-center px-3 py-2 rounded-xl border text-sm font-medium transition-all ${currentPage === totalPages || totalPages === 0
                        ? "bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed"
                        : "bg-slate-800/50 text-slate-200 border-slate-600 hover:bg-slate-700/50"
                        }`}
                    >
                      <span className="sr-only">التالي</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl p-12 text-center">
            <div className="text-slate-400 my-8">
              <svg
                className="mx-auto h-16 w-16 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-white">
                لا يوجد محتوى
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                لم يتم العثور على أي محتوى يطابق معايير البحث.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setIsEditModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/70"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-slate-900 rounded-2xl text-right overflow-y-auto no-scrollbar shadow-2xl border border-slate-700/50 transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[80vh] flex flex-col">
              {/* Fixed Header */}
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    تعديل المحتوى
                  </h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  تعديل تفاصيل المحتوى (لا يمكن تعديل الوسائط)
                </p>
              </div>

              {/* Scrollable Content */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                id="edit-content-form"
                className="flex-1 flex flex-col overflow-auto"
              >
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-slate-200 mb-2"
                            >
                              العنوان
                            </label>
                            <input
                              type="text"
                              id="title"
                              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.title ? "border-red-500" : "border-slate-600"
                                }`}
                              {...register("title", {
                                required: "العنوان مطلوب",
                              })}
                            />
                            {errors.title && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-slate-200 mb-2"
                            >
                              الوصف
                            </label>
                            <textarea
                              id="description"
                              rows={4}
                              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.description ? "border-red-500" : "border-slate-600"
                                }`}
                              {...register("description", {
                                required: "الوصف مطلوب",
                              })}
                            />
                            {errors.description && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.description.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              نوع المالك
                            </label>
                            <div className="flex gap-6">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  value="INDIVIDUAL"
                                  checked={watchedOwnerType === "INDIVIDUAL"}
                                  onChange={() => handleOwnerTypeChange("INDIVIDUAL")}
                                  className="form-radio text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="mx-2 text-slate-200">فردي</span>
                              </label>
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  value="STORE"
                                  checked={watchedOwnerType === "STORE"}
                                  onChange={() => handleOwnerTypeChange("STORE")}
                                  className="form-radio text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="mx-2 text-slate-200">متجر</span>
                              </label>
                            </div>
                          </div>

                          {watchedOwnerType === "STORE" && (
                            <div className="md:col-span-2">
                              <label
                                htmlFor="storeId"
                                className="block text-sm font-medium text-slate-200 mb-2"
                              >
                                اختر المتجر
                              </label>
                              <Controller
                                name="storeId"
                                control={control}
                                rules={{
                                  required: watchedOwnerType === "STORE" ? "يجب اختيار متجر" : false,
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
                                      isLoading={!stores}
                                      value={
                                        field.value
                                          ? storeOptions.find(option => option.value === field.value)
                                          : null
                                      }
                                      onChange={(
                                        newValue: { value: string; label: string } | null,
                                      ) => {
                                        field.onChange(newValue ? newValue.value : '');
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                          ...theme.colors,
                                          primary: "#3b82f6",
                                          primary25: "#1e293b",
                                          primary50: "#334155",
                                          neutral0: "#1e293b",
                                          neutral80: "#f8fafc",
                                          neutral50: "#94a3b8",
                                          neutral40: "#64748b",
                                          neutral30: "#475569",
                                          neutral20: "#334155",
                                        },
                                      })}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          borderRadius: "0.75rem",
                                          borderColor: state.isFocused ? "#3b82f6" : "#475569",
                                          backgroundColor: "#1e293b80",
                                          padding: "0.5rem",
                                          boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
                                          "&:hover": {
                                            borderColor: "#3b82f6",
                                          },
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          backgroundColor: "#1e293b",
                                          borderRadius: "0.75rem",
                                          border: "1px solid #475569",
                                        }),
                                        option: (base, state) => ({
                                          ...base,
                                          backgroundColor: state.isSelected
                                            ? "#3b82f6"
                                            : state.isFocused
                                              ? "#334155"
                                              : "#1e293b",
                                          color: "#f8fafc",
                                        }),
                                        input: (base) => ({
                                          ...base,
                                          color: "#f8fafc",
                                        }),
                                        singleValue: (base) => ({
                                          ...base,
                                          color: "#f8fafc",
                                        }),
                                      }}
                                    />
                                  );
                                }}
                              />
                              {errors.storeId && (
                                <p className="mt-2 text-sm text-red-400">
                                  {errors.storeId.message}
                                </p>
                              )}
                            </div>
                          )}
                          {watchedOwnerType === "INDIVIDUAL" && (
                            <>
                              <div>
                                <label
                                  htmlFor="ownerName"
                                  className="block text-sm font-medium text-slate-200 mb-2"
                                >
                                  اسم المالك
                                </label>
                                <input
                                  type="text"
                                  id="ownerName"
                                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.ownerName ? "border-red-500" : "border-slate-600"}`}
                                  {...register("ownerName", {
                                    required: watchedOwnerType === "INDIVIDUAL" ? "اسم المالك مطلوب" : false,
                                  })}
                                />
                                {errors.ownerName && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {errors.ownerName.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="ownerNumber"
                                  className="block text-sm font-medium text-slate-200 mb-2"
                                >
                                  رقم الهاتف
                                </label>
                                <input
                                  type="text"
                                  id="ownerNumber"
                                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.ownerNumber ? "border-red-500" : "border-slate-600"}`}
                                  {...register("ownerNumber", {
                                    required: watchedOwnerType === "INDIVIDUAL" ? "رقم الهاتف مطلوب" : false,
                                    pattern: {
                                      value: /^09\d{8}$/,
                                      message: "يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)",
                                    },
                                  })}
                                />
                                {errors.ownerNumber && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {errors.ownerNumber.message}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                          <div>
                            <label
                              htmlFor="intervalHours"
                              className="block text-sm font-medium text-slate-200 mb-2"
                            >
                              ساعات الفاصل
                            </label>
                            <input
                              type="number"
                              id="intervalHours"
                              min={1}
                              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.intervalHours ? "border-red-500" : "border-slate-600"
                                }`}
                              {...register("intervalHours", {
                                required: "ساعات الفاصل مطلوبة",
                                min: {
                                  value: 1,
                                  message: "يجب أن تكون القيمة 1 على الأقل",
                                },
                              })}
                            />
                            {errors.intervalHours && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.intervalHours.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="endValidationDate"
                              className="block text-sm font-medium text-slate-200 mb-2"
                            >
                              تاريخ انتهاء الصلاحية
                            </label>
                            <input
                              type="datetime-local"
                              id="endValidationDate"
                              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.endValidationDate ? "border-red-500" : "border-slate-600"
                                }`}
                              {...register("endValidationDate", {
                                required: "تاريخ انتهاء الصلاحية مطلوب",
                              })}
                            />
                            {errors.endValidationDate && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.endValidationDate.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label
                              htmlFor="interestIds"
                              className="block text-sm font-medium text-slate-200 mb-2"
                            >
                              الاهتمامات
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

                                const selectStyles = {
                                  control: (base: any, state: any) => ({
                                    ...base,
                                    borderRadius: "0.75rem",
                                    borderColor: state.isFocused ? "#3b82f6" : "#475569",
                                    backgroundColor: "#1e293b80",
                                    padding: "0.5rem",
                                    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
                                  }),
                                  menu: (base: any) => ({
                                    ...base,
                                    backgroundColor: "#1e293b",
                                    borderRadius: "0.75rem",
                                    border: "1px solid #475569",
                                  }),
                                  option: (base: any, state: any) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#334155" : "#1e293b",
                                    color: "#f8fafc",
                                  }),
                                  multiValue: (base: any) => ({
                                    ...base,
                                    backgroundColor: "#334155",
                                    borderRadius: "0.5rem",
                                  }),
                                  multiValueLabel: (base: any) => ({
                                    ...base,
                                    color: "#f8fafc",
                                  }),
                                  multiValueRemove: (base: any) => ({
                                    ...base,
                                    color: "#94a3b8",
                                  }),
                                  input: (base: any) => ({
                                    ...base,
                                    color: "#f8fafc",
                                  }),
                                };

                                return (
                                  <Select
                                    {...field}
                                    isMulti
                                    options={options}
                                    classNamePrefix="react-select"
                                    placeholder="اختر الاهتمامات"
                                    noOptionsMessage={() =>
                                      "لا توجد خيارات متاحة"
                                    }
                                    loadingMessage={() => "جاري التحميل..."}
                                    value={options.filter((option) =>
                                      field.value?.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => {
                                      field.onChange(
                                        selectedOptions.map(
                                          (option) => option.value
                                        )
                                      );
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary: "#3b82f6",
                                        primary25: "#1e293b",
                                        primary50: "#334155",
                                        neutral0: "#1e293b",
                                        neutral80: "#f8fafc",
                                        neutral50: "#94a3b8",
                                        neutral40: "#64748b",
                                        neutral30: "#475569",
                                        neutral20: "#334155",
                                      },
                                    })}
                                    styles={selectStyles}
                                  />
                                );
                              }}
                            />
                          </div>
                        </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800 bg-slate-900 flex gap-3">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        جاري الحفظ...
                      </>
                    ) : (
                      "حفظ التغييرات"
                    )}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 inline-flex justify-center items-center rounded-xl border border-slate-600 bg-slate-800/50 text-base font-medium text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 transition-all"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/70"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-slate-900 rounded-2xl text-right overflow-hidden shadow-2xl border border-slate-700/50 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[80vh] flex flex-col">
              <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-900 px-6 pt-6 pb-4 sm:p-8">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Trash2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        تأكيد الحذف
                      </h3>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        هل أنت متأكد من رغبتك في حذف المحتوى <span className="text-white font-semibold">"{selectedContent?.title}"</span>؟ هذا الإجراء لا يمكن التراجع عنه.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 px-6 py-4 sm:px-8 flex gap-3">
                <button
                  type="button"
                  className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-base font-semibold text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (selectedContent) {
                      deleteMutation.mutate(selectedContent.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      نعم، حذف المحتوى
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="px-6 py-3 inline-flex justify-center items-center rounded-xl border border-slate-600 bg-slate-800/50 text-base font-medium text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 transition-all"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {isMediaModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-slate-900 rounded-2xl text-right overflow-hidden shadow-2xl border border-slate-700/50 transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full max-h-[80vh] flex flex-col">
              <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-white">
                    عرض الوسائط
                  </h3>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all"
                    onClick={() => setIsMediaModalOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2 bg-slate-800/50 rounded-lg overflow-hidden">
                  {selectedMedia?.type === "IMAGE" ? (
                    <img
                      src={selectedMedia.url}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={selectedMedia?.url}
                      poster={selectedMedia?.poster}
                      controls
                      autoPlay
                      className="w-full h-auto max-h-96"
                    />
                  )}
                </div>
                <div className="mt-4 text-center text-sm text-slate-400">
                  {selectedMedia?.type === "IMAGE" ? "صورة" : "فيديو"}
                </div>
              </div>
              <div className="bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-700/50">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-slate-600 shadow-sm px-4 py-2.5 bg-slate-800/50 text-base font-medium text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsMediaModalOpen(false)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gem Creation Modal */}
      {isGemModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setIsGemModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative inline-block align-bottom bg-slate-900 border border-slate-800 rounded-xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-800">
                <h3
                  className="text-xl font-bold text-white mb-2"
                  id="modal-title"
                >
                  إنشاء جائزة جديدة
                </h3>
                <p className="text-sm text-slate-400">
                  ستتم إضافة جائزة لهذا المحتوى يمكن للمستخدمين الحصول عليها
                </p>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="gemPoints"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      عدد النقاط
                    </label>
                    <input
                      type="number"
                      id="gemPoints"
                      min={1}
                      value={gemPoints}
                      onChange={(e) =>
                        setGemPoints(parseInt(e.target.value) || 0)
                      }
                      className="w-full h-12 px-4 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="أدخل عدد النقاط"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-11 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (selectedContent && gemPoints > 0) {
                      generateGemMutation.mutate({
                        contentId: selectedContent.id,
                        points: gemPoints,
                      });
                    }
                  }}
                  disabled={generateGemMutation.isPending || gemPoints <= 0}
                >
                  {generateGemMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin -mx-1 mx-3 h-5 w-5 text-white"
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
                      جاري إنشاء الجائزة...
                    </>
                  ) : (
                    "إنشاء جائزة"
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-11 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900"
                  onClick={() => setIsGemModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
