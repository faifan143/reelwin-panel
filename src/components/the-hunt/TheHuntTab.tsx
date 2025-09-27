import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Eye, Trash2, Check, X } from "lucide-react";
import {
  listHunts,
  deleteHunt,
  downloadAllPdfsZip,
  updateHuntStatus,
} from "./api";
import type { Hunt, HuntStatus } from "./types";

const TheHuntTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
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
    const blob = await downloadAllPdfsZip(id);
    const url = URL.createObjectURL(new Blob([blob]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `hunt-${id}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (isLoading) {
    return <div className="p-6">جارٍ التحميل...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">تعذر تحميل الرحلات</div>;
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    {new Date(hunt.startsAt).toLocaleDateString("ar-SA")} -{" "}
                    {new Date(hunt.endsAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => downloadZip(hunt.id)}
                        className="text-green-600 hover:text-green-900"
                        title="تحميل كل ملفات PDF"
                      >
                        <Download size={18} />
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
    </div>
  );
};

export default TheHuntTab;
