import React, { useState } from "react";
import {
  QrCode,
  Package,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Gift,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Users,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  QrCodeType,
  QrStatus,
  QrCodeWithScans,
  CreateQrCodeDto,
} from "../types";
import {
  getAllQrCodes,
  activateQrCode,
  deactivateQrCode,
  deleteQrCode,
  selectRandomWinner,
  generateQrCodePdf,
} from "../api";
// Modal imports removed - modals are now rendered at page level

interface QrCodeTabProps {
  onOpenCreate?: () => void;
  onOpenDetails?: (qrCode: QrCodeWithScans) => void;
  onOpenBulk?: () => void;
}

const QrCodeTab: React.FC<QrCodeTabProps> = ({ 
  onOpenCreate, 
  onOpenDetails, 
  onOpenBulk 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["qrCodes", currentPage],
    queryFn: () => getAllQrCodes(currentPage, 10),
  });

  // Mutations
  const activateMutation = useMutation({
    mutationFn: (id: string) => activateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] });
    },
  });

  const lotteryMutation = useMutation({
    mutationFn: (id: string) => selectRandomWinner(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["qrCodes"] });
      alert(`The winner is: ${data.winner.name}`);
    },
  });

  const pdfMutation = useMutation({
    mutationFn: (id: string) => generateQrCodePdf(id),
    onSuccess: (data, id) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `qr-code-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateQrCode = () => {
    onOpenCreate?.();
  };

  const handleOpenBulkModal = () => {
    onOpenBulk?.();
  };

  const handleViewDetails = (qrCode: QrCodeWithScans) => {
    onOpenDetails?.(qrCode);
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDeactivate = (id: string) => {
    deactivateMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف رمز QR هذا؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLottery = (id: string) => {
    if (
      window.confirm(
        "هل أنت متأكد من تحديد فائز عشوائي؟ سيتم تعطيل رمز QR هذا بعد ذلك."
      )
    ) {
      lotteryMutation.mutate(id);
    }
  };

  const handleDownloadPdf = (id: string) => {
    pdfMutation.mutate(id);
  };

  // Render status badge - Dark Theme
  const renderStatusBadge = (status: QrStatus) => {
    switch (status) {
      case QrStatus.ACTIVE:
        return (
          <span className="px-3 py-1.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center font-medium">
            <Check size={14} className="ml-1" />
            نشط
          </span>
        );
      case QrStatus.INACTIVE:
        return (
          <span className="px-3 py-1.5 text-xs rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center font-medium">
            <X size={14} className="ml-1" />
            غير نشط
          </span>
        );
      case QrStatus.COMPLETED:
        return (
          <span className="px-3 py-1.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center font-medium">
            <Check size={14} className="ml-1" />
            مكتمل
          </span>
        );
      default:
        return null;
    }
  };

  // Render type badge - Dark Theme
  const renderTypeBadge = (type: QrCodeType) => {
    switch (type) {
      case QrCodeType.PERMANENT:
        return (
          <span className="px-3 py-1.5 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
            دائم
          </span>
        );
      case QrCodeType.ONCE:
        return (
          <span className="px-3 py-1.5 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
            مرة واحدة
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state - Dark Theme
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">جاري تحميل رموز QR...</p>
        </div>
      </div>
    );
  }

  // Error state - Dark Theme
  if (isError) {
    return (
      <div className="w-full p-8 bg-red-500/10 rounded-xl border border-red-500/30 text-red-400">
        <h3 className="text-lg font-bold mb-2">حدث خطأ</h3>
        <p>
          {error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل رموز QR"}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 border border-red-500/30 transition-all"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["qrCodes"] })
          }
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-800 p-4 rounded-2xl" dir="rtl">
      {/* Header Section - Dark Theme */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">إدارة رموز QR</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              إنشاء وإدارة رموز QR التي يمكن للمستخدمين مسحها للحصول على نقاط
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center border-t border-slate-700/50 pt-4 gap-4">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCreateQrCode}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 font-semibold"
            >
              <Plus size={18} />
              إنشاء رمز QR جديد
            </button>
            <button
              onClick={handleOpenBulkModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center gap-2 font-semibold"
            >
              <Download size={18} />
              توليد PDF لرموز مرة واحدة
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث..."
                className="pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
            </div>
            <button className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 rounded-xl border border-slate-600/50 flex items-center gap-2 transition-all">
              <Filter size={16} />
              فلترة
            </button>
            <button
              className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 rounded-xl border border-slate-600/50 flex items-center gap-2 transition-all"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["qrCodes"] })
              }
            >
              <RefreshCw size={16} />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* QR Codes Table - Dark Theme */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  الاسم
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  النوع
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  المسح
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  تاريخ الإنشاء
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
              {data?.data.map((qrCode) => (
                <tr key={qrCode.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <QrCode size={20} className="ml-2 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {qrCode.name}
                        </div>
                        {qrCode.description && (
                          <div className="text-xs text-slate-400 max-w-xs truncate">
                            {qrCode.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderTypeBadge(qrCode.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(qrCode.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center text-slate-300">
                      <Users size={16} className="ml-1 text-slate-400" />
                      <span>{qrCode.scansCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(qrCode.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex gap-2 rtl:gap-reverse flex-wrap">
                      <button
                        onClick={() => handleViewDetails(qrCode)}
                        className="px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-2 text-sm font-medium"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                        <span>عرض</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(qrCode.id)}
                        className="px-3 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all flex items-center gap-2 text-sm font-medium"
                        title="تنزيل PDF"
                      >
                        <Download size={18} />
                        <span>PDF</span>
                      </button>
                      {qrCode.status === QrStatus.ACTIVE ? (
                        <button
                          onClick={() => handleDeactivate(qrCode.id)}
                          className="px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-all flex items-center gap-2 text-sm font-medium"
                          title="تعطيل"
                        >
                          <X size={18} />
                          <span>تعطيل</span>
                        </button>
                      ) : qrCode.status === QrStatus.INACTIVE ? (
                        <button
                          onClick={() => handleActivate(qrCode.id)}
                          className="px-3 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all flex items-center gap-2 text-sm font-medium"
                          title="تفعيل"
                        >
                          <Check size={18} />
                          <span>تفعيل</span>
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleLottery(qrCode.id)}
                        className="px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        title="اختيار فائز عشوائي"
                        disabled={qrCode.scansCount === 0}
                      >
                        <Gift size={18} />
                        <span>فائز</span>
                      </button>
                      <button
                        onClick={() => handleDelete(qrCode.id)}
                        className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        title="حذف"
                        disabled={qrCode.scansCount > 0}
                      >
                        <Trash2 size={18} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Dark Theme */}
        {data && data.pagination.pages > 1 && (
          <div className="bg-slate-700/30 px-4 py-3 flex items-center justify-between border-t border-slate-700/50 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-300">
                  عرض{" "}
                  <span className="font-medium text-white">
                    {(data.pagination.page - 1) * data.pagination.limit + 1}
                  </span>{" "}
                  إلى{" "}
                  <span className="font-medium text-white">
                    {Math.min(
                      data.pagination.page * data.pagination.limit,
                      data.pagination.total
                    )}
                  </span>{" "}
                  من{" "}
                  <span className="font-medium text-white">{data.pagination.total}</span>{" "}
                  عنصر
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-xl border border-slate-600/50 bg-slate-700/50 text-sm font-medium transition-all ${
                      currentPage === 1
                        ? "text-slate-500 cursor-not-allowed opacity-50"
                        : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    السابق
                  </button>

                  {/* Page numbers */}
                  {[...Array(data.pagination.pages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all ${
                        currentPage === index + 1
                          ? "z-10 bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "border-slate-600/50 bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(
                        Math.min(data.pagination.pages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === data.pagination.pages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-xl border border-slate-600/50 bg-slate-700/50 text-sm font-medium transition-all ${
                      currentPage === data.pagination.pages
                        ? "text-slate-500 cursor-not-allowed opacity-50"
                        : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    التالي
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default QrCodeTab;
