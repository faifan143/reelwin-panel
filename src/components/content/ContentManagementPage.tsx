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
  ThumbsUp,
  Trash2,
  User,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

// Types
interface Content {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerNumber: string;
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
  ownerName: string;
  ownerNumber: string;
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

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContentFormData>();

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
        "https://anycode-sy.com/reel-win/api/content?" + params.toString(),
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
      const response = await axios.get("https://anycode-sy.com/reel-win/api/interests/list");
      return response.data as Interest[];
    },
  });

  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      return axios.patch(`https://anycode-sy.com/reel-win/api/content/${selectedContent?.id}`, data, {
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
      return axios.delete(`https://anycode-sy.com/reel-win/api/content/${id}`, {
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
      return axios.post(
        `https://anycode-sy.com/reel-win/api/content/generate-gem`,
        {
          contentId,
          points,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      alert(`تم إنشاء جائزة بقيمة ${data.data.gem.points} نقطة`);
      setIsGemModalOpen(false);
    },
    onError: (error) => {
      console.error("Generate gem error:", error);
      alert("حدث خطأ أثناء إنشاء الجائزة");
    },
  });

  // Handle edit button click
  const handleEditClick = (content: Content) => {
    setSelectedContent(content);

    // Format date for datetime-local input
    const date = new Date(content.endValidationDate);
    const formattedDate = date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

    // Reset form with content data
    reset({
      title: content.title,
      description: content.description,
      ownerName: content.ownerName,
      ownerNumber: content.ownerNumber,
      intervalHours: content.intervalHours,
      endValidationDate: formattedDate,
      interestIds: content.interests.map((interest) => interest.id),
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white">إدارة المحتوى</h1>
        <p className="mt-2 text-blue-100">
          عرض وتعديل وحذف المحتوى الموجود في النظام
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {totalItems} محتوى
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 ml-2" />
              {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المالك
                </label>
                <input
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.ownerName || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, ownerName: e.target.value })
                  }
                  placeholder="البحث حسب اسم المالك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.ownerNumber || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, ownerNumber: e.target.value })
                  }
                  placeholder="09XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفئة
                </label>
                <select
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.interestId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, interestId: e.target.value })
                  }
                >
                  <option value="">جميع الفئات</option>
                  {interests?.map((interest) => (
                    <option key={interest.id} value={interest.id}>
                      {interest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end space-x-2 space-x-reverse">
                <button
                  onClick={() => {
                    refetch();
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Search className="h-4 w-4 ml-2" />
                  بحث
                </button>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <X className="h-4 w-4 ml-2" />
                  مسح
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Content List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
          </div>
        ) : contentData && contentData.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        العنوان
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الوسائط
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        المالك
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الإعدادات
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الإحصائيات
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((content) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {content.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {content.description}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {content.interests.map((interest) => (
                                <span
                                  key={interest.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {interest.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1 space-x-reverse">
                            {content.mediaUrls.map((media, index) => (
                              <button
                                key={index}
                                onClick={() => handleMediaClick(media)}
                                className={`p-1 rounded-md ${media.type === "IMAGE"
                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                  }`}
                              >
                                {media.type === "IMAGE" ? (
                                  <Image className="h-5 w-5" />
                                ) : (
                                  <Video className="h-5 w-5" />
                                )}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <User className="h-4 w-4 ml-1 text-gray-400" />
                              {content.ownerName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-4 w-4 ml-1 text-gray-400" />
                              {content.ownerNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 ml-1 text-gray-400" />
                              {content.intervalHours} ساعة
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                              {new Date(
                                content.endValidationDate
                              ).toLocaleDateString("ar")}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm text-gray-600 flex items-center">
                              <Eye className="h-4 w-4 ml-1 text-gray-400" />
                              {content._count?.viewedBy || 0} مشاهدة
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <ThumbsUp className="h-4 w-4 ml-1 text-gray-400" />
                              {content._count?.likedBy || 0} إعجاب
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <MessageCircle className="h-4 w-4 ml-1 text-gray-400" />
                              {content._count?.whatsappedBy || 0} تواصل
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleGemClick(content)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="إنشاء جائزة"
                            >
                              <Gem className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(content)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="تعديل"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(content)}
                              className="text-red-600 hover:text-red-900"
                              title="حذف"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Grid View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {currentItems.map((content) => (
                <div
                  key={content.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {content.title}
                    </h3>
                    <div className="flex space-x-1 space-x-reverse">
                      <button
                        onClick={() => handleGemClick(content)}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="إنشاء جائزة"
                      >
                        <Gem className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(content)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="تعديل"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(content)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {content.description}
                  </p>

                  {/* Tags/Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {content.interests.map((interest) => (
                      <span
                        key={interest.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>

                  {/* Media, Owner, and Settings */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Media */}
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        الوسائط
                      </div>
                      <div className="flex space-x-1 space-x-reverse">
                        {content.mediaUrls.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => handleMediaClick(media)}
                            className={`p-1 rounded-md ${media.type === "IMAGE"
                                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                              }`}
                          >
                            {media.type === "IMAGE" ? (
                              <Image className="h-5 w-5" />
                            ) : (
                              <Video className="h-5 w-5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        المالك
                      </div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <User className="h-4 w-4 ml-1 text-gray-400" />
                        {content.ownerName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 ml-1 text-gray-400" />
                        {content.ownerNumber}
                      </div>
                    </div>
                  </div>

                  {/* Settings and Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Settings */}
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        الإعدادات
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 ml-1 text-gray-400" />
                        {content.intervalHours} ساعة
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                        {new Date(content.endValidationDate).toLocaleDateString(
                          "ar"
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        الإحصائيات
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-xs text-center">
                          <div className="flex justify-center">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>{content._count?.viewedBy || 0}</div>
                        </div>
                        <div className="text-xs text-center">
                          <div className="flex justify-center">
                            <ThumbsUp className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>{content._count?.likedBy || 0}</div>
                        </div>
                        <div className="text-xs text-center">
                          <div className="flex justify-center">
                            <MessageCircle className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>{content._count?.whatsappedBy || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
              {/* Mobile pagination */}
              <div className="flex justify-between w-full sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  السابق
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  التالي
                </button>
              </div>

              {/* Desktop pagination */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    عرض <span className="font-medium">{startIndex + 1}</span>{" "}
                    إلى{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, totalItems)}
                    </span>{" "}
                    من <span className="font-medium">{totalItems}</span> عنصر
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
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
          <div className="bg-white p-6 text-center rounded-lg shadow-sm">
            <div className="text-gray-500 my-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                لا يوجد محتوى
              </h3>
              <p className="mt-1 text-sm text-gray-500">
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

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      تعديل المحتوى
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        تعديل تفاصيل المحتوى (لا يمكن تعديل الوسائط)
                      </p>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              العنوان
                            </label>
                            <input
                              type="text"
                              id="title"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? "border-red-500" : ""
                                }`}
                              {...register("title", {
                                required: "العنوان مطلوب",
                              })}
                            />
                            {errors.title && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              الوصف
                            </label>
                            <textarea
                              id="description"
                              rows={3}
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? "border-red-500" : ""
                                }`}
                              {...register("description", {
                                required: "الوصف مطلوب",
                              })}
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="ownerName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              اسم المالك
                            </label>
                            <input
                              type="text"
                              id="ownerName"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.ownerName ? "border-red-500" : ""
                                }`}
                              {...register("ownerName", {
                                required: "اسم المالك مطلوب",
                              })}
                            />
                            {errors.ownerName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.ownerName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="ownerNumber"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              رقم الهاتف
                            </label>
                            <input
                              type="text"
                              id="ownerNumber"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.ownerNumber ? "border-red-500" : ""
                                }`}
                              {...register("ownerNumber", {
                                required: "رقم الهاتف مطلوب",
                                pattern: {
                                  value: /^09\d{8}$/,
                                  message:
                                    "يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)",
                                },
                              })}
                            />
                            {errors.ownerNumber && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.ownerNumber.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="intervalHours"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              ساعات الفاصل
                            </label>
                            <input
                              type="number"
                              id="intervalHours"
                              min={1}
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.intervalHours ? "border-red-500" : ""
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
                              <p className="mt-1 text-sm text-red-600">
                                {errors.intervalHours.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="endValidationDate"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              تاريخ انتهاء الصلاحية
                            </label>
                            <input
                              type="datetime-local"
                              id="endValidationDate"
                              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.endValidationDate ? "border-red-500" : ""
                                }`}
                              {...register("endValidationDate", {
                                required: "تاريخ انتهاء الصلاحية مطلوب",
                              })}
                            />
                            {errors.endValidationDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.endValidationDate.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label
                              htmlFor="interestIds"
                              className="block text-sm font-medium text-gray-700 mb-1"
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
                                        primary: "#4f46e5",
                                        primary25: "#eef2ff",
                                      },
                                    })}
                                  />
                                );
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                          >
                            {updateMutation.isPending ? (
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
                                جاري الحفظ...
                              </>
                            ) : (
                              "حفظ التغييرات"
                            )}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setIsEditModalOpen(false)}
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
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

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      تأكيد الحذف
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {`    هل أنت متأكد من رغبتك في حذف المحتوى "
                        ${selectedContent?.title}"؟ هذا الإجراء لا يمكن التراجع
                        عنه.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
                      جاري الحذف...
                    </>
                  ) : (
                    "نعم، حذف المحتوى"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    عرض الوسائط
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsMediaModalOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2 bg-gray-100 rounded-lg overflow-hidden">
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
                <div className="mt-4 text-center text-sm text-gray-500">
                  {selectedMedia?.type === "IMAGE" ? "صورة" : "فيديو"}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      إنشاء جائزة جديدة
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        ستتم إضافة جائزة لهذا المحتوى يمكن للمستخدمين الحصول
                        عليها
                      </p>

                      <div className="mb-4">
                        <label
                          htmlFor="gemPoints"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          عدد النقاط
                        </label>
                        <input
                          type="number"
                          id="gemPoints"
                          min={1}
                          value={gemPoints}
                          onChange={(e) =>
                            setGemPoints(parseInt(e.target.value))
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (selectedContent && gemPoints > 0) {
                      generateGemMutation.mutate({
                        contentId: selectedContent.id,
                        points: gemPoints,
                      });
                    }
                  }}
                  disabled={generateGemMutation.isPending}
                >
                  {generateGemMutation.isPending ? (
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
                      جاري إنشاء الجائزة...
                    </>
                  ) : (
                    "إنشاء جائزة"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
