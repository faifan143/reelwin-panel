import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { BulkOncePdfDto } from "../../types";
import { generateBulkOncePdf } from "../../api";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-700/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">توليد PDF لرموز مرة واحدة</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  العدد الإجمالي<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("count", { required: true, min: 1 })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.count && (
                  <p className="text-xs text-red-400 mt-1">مطلوب</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  الأعمدة<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("cols", { required: true, min: 1 })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.cols && (
                  <p className="text-xs text-red-400 mt-1">مطلوب</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  الصفوف<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("rows", { required: true, min: 1 })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.rows && (
                  <p className="text-xs text-red-400 mt-1">مطلوب</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  بادئة الاسم
                </label>
                <input
                  type="text"
                  {...register("namePrefix")}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="مثال: Event"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  الوصف
                </label>
                <input
                  type="text"
                  {...register("description")}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="مثال: Entry pass"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-700/50 text-slate-200 rounded-xl hover:bg-slate-700/70 border border-slate-600/50 transition-all font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold disabled:opacity-50"
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
