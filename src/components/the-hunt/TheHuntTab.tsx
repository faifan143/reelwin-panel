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
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
});
const formatISODate = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '-' : dateFmt.format(d);
};

const TheHuntTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6">جارٍ التحميل...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="mb-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
          {error instanceof Error
            ? error.message
            : (error as any)?.response?.data?.message || "تعذر تحميل الرحلات"}
        </div>
        <button
          className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["hunts"] })}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">إدارة الرحلة</h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={16} className="ml-2" />
            إضافة الرحلة
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفترة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((hunt: Hunt) => (
                <tr key={hunt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hunt.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {hunt.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(hunt.startsAt).toLocaleDateString("en")}
                    {" > "}
                    {new Date(hunt.endsAt).toLocaleDateString("en")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => downloadZip(hunt.id)}
                        className={`text-green-600 hover:text-green-900 ${
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
                            className="animate-spin h-4 w-4"
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
                      </button>
                      {hunt.status !== "ACTIVE" && (
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: hunt.id,
                              status: "ACTIVE",
                            })
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title="تفعيل"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {hunt.status === "ACTIVE" && (
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: hunt.id,
                              status: "DRAFT",
                            })
                          }
                          className="text-orange-600 hover:text-orange-900"
                          title="تعطيل"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(hunt.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف (مسودة فقط)"
                      >
                        <Trash2 size={18} />
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
