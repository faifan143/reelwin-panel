import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { BulkOncePdfDto } from "../../types";
import { generateBulkOncePdf } from "../../api";

interface BulkOncePdfModalProps {
  onClose: () => void;
}

const BulkOncePdfModal: React.FC<BulkOncePdfModalProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkOncePdfDto>({
    defaultValues: {
      count: 120,
      rows: 5,
      cols: 4,
      namePrefix: "Event",
      description: "Entry pass",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: BulkOncePdfDto) => generateBulkOncePdf(payload),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const base = variables.namePrefix
        ? `${variables.namePrefix}-${variables.count}`
        : `qr-once-${variables.count}`;
      link.href = url;
      link.setAttribute("download", `${base}-${timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onClose();
    },
  });

  const onSubmit = (data: BulkOncePdfDto) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">توليد PDF لرموز مرة واحدة</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العدد الإجمالي<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("count", { required: true, min: 1 })}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.count && (
                  <p className="text-xs text-red-600 mt-1">مطلوب</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الأعمدة<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("cols", { required: true, min: 1 })}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.cols && (
                  <p className="text-xs text-red-600 mt-1">مطلوب</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الصفوف<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("rows", { required: true, min: 1 })}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.rows && (
                  <p className="text-xs text-red-600 mt-1">مطلوب</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  بادئة الاسم
                </label>
                <input
                  type="text"
                  {...register("namePrefix")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: Event"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <input
                  type="text"
                  {...register("description")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: Entry pass"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {mutation.isPending ? "جارٍ التوليد..." : "توليد وتحميل PDF"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkOncePdfModal;
