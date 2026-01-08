import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Eye, Trash2, Check, X, Plus } from "lucide-react";
import {
  listHunts,
  deleteHunt,
  downloadAllPdfsZip,
  updateHuntStatus,
} from "./api";
import type { Hunt, HuntStatus } from "./types";
import CreateHuntModal from "./CreateHuntModal";

// Minimal, efficient date formatting reused across rows
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});
const formatISODate = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : dateFmt.format(d);
};

const TheHuntTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hunts", currentPage],
    queryFn: () => listHunts(currentPage, 10),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHunt(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hunts"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: HuntStatus }) =>
      updateHuntStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hunts"] }),
  });

  const downloadZip = async (id: string) => {
    try {
      setDownloadingId(id);
      const blob = await downloadAllPdfsZip(id);
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `hunt-${id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setDownloadingId(null);
    }
  };

  const handleToggleStatus = async (id: string, nextStatus: HuntStatus) => {
    try {
      setStatusUpdatingId(id);
      await statusMutation.mutateAsync({ id, status: nextStatus });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, currentStatus: HuntStatus) => {
    if (currentStatus !== "DRAFT") return;
    const confirmed = window.confirm("هل أنت متأكد من الحذف؟ لا يمكن التراجع.");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="mb-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error instanceof Error
            ? error.message
            : (error as any)?.response?.data?.message || "تعذر تحميل الرحلات"}
        </div>
        <button
          className="px-4 py-2 text-sm rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["hunts"] })}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-800 p-4 rounded-2xl" dir="rtl">
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">إدارة الرحلة</h2>
              <p className="text-slate-400 text-sm mt-0.5">إدارة رحلات المستخدمين والجوائز</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 font-semibold"
          >
            <Plus size={18} />
            إضافة الرحلة
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  الاسم
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  الفترة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
              {data?.data.map((hunt: Hunt) => (
                <tr key={hunt.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {hunt.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      hunt.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : hunt.status === "DRAFT"
                        ? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {hunt.status === "ACTIVE" ? "نشط" : hunt.status === "DRAFT" ? "مسودة" : hunt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <span className="font-mono">
                      {formatISODate(hunt.endsAt)}
                      {" → "}
                      {formatISODate(hunt.startsAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex gap-2 rtl:gap-reverse flex-wrap">
                      <button
                        onClick={() => downloadZip(hunt.id)}
                        className={`px-3 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                          downloadingId === hunt.id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          downloadingId === hunt.id
                            ? "جارٍ التحميل..."
                            : "تحميل كل ملفات PDF"
                        }
                        disabled={downloadingId === hunt.id}
                      >
                        {downloadingId === hunt.id ? (
                          <svg
                            className="animate-spin h-5 w-5"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                        ) : (
                          <Download size={18} />
                        )}
                        <span>تحميل</span>
                      </button>
                      {hunt.status !== "ACTIVE" ? (
                        <button
                          onClick={() => handleToggleStatus(hunt.id, "ACTIVE")}
                          className={`px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                            statusUpdatingId === hunt.id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          title="تفعيل"
                          disabled={statusUpdatingId === hunt.id}
                        >
                          {statusUpdatingId === hunt.id ? (
                            <svg
                              className="animate-spin h-5 w-5"
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          ) : (
                            <Check size={18} />
                          )}
                          <span>تفعيل</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(hunt.id, "DRAFT")}
                          className={`px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                            statusUpdatingId === hunt.id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          title="تعطيل"
                          disabled={statusUpdatingId === hunt.id}
                        >
                          {statusUpdatingId === hunt.id ? (
                            <svg
                              className="animate-spin h-5 w-5"
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          ) : (
                            <X size={18} />
                          )}
                          <span>تعطيل</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(hunt.id, hunt.status)}
                        className={`px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                          hunt.status !== "DRAFT" || deletingId === hunt.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          hunt.status !== "DRAFT"
                            ? "الحذف متاح في وضع المسودة فقط"
                            : "حذف"
                        }
                        disabled={
                          hunt.status !== "DRAFT" || deletingId === hunt.id
                        }
                      >
                        {deletingId === hunt.id ? (
                          <svg
                            className="animate-spin h-5 w-5"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                        ) : (
                          <Trash2 size={18} />
                        )}
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <CreateHuntModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};

export default TheHuntTab;
