import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateHuntDto } from "./types";
import { createHunt } from "./api";
import { api as storesApi } from "../stores-offers/api";
import type { Store } from "../stores-offers/types";
import { X } from "lucide-react";

interface CreateHuntModalProps {
  onClose: () => void;
}

const CreateHuntModal: React.FC<CreateHuntModalProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateHuntDto>();

  const {
    data: storesData,
    isLoading: storesLoading,
    isError: storesError,
    error: storesErr,
  } = useQuery({
    queryKey: ["stores-list"],
    queryFn: async () => (await storesApi.getStores()) as Store[],
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateHuntDto) => createHunt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hunts"] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      const data = err?.response?.data;
      const message = data?.message || err?.message || "حدث خطأ";
      setError("root" as any, { type: "server", message });
      if (data?.errors && typeof data.errors === "object") {
        Object.entries(data.errors).forEach(([field, msgs]) => {
          const text = Array.isArray(msgs) ? msgs.join(". ") : String(msgs);
          setError(field as any, { type: "server", message: text });
        });
      }
    },
  });

  const onSubmit = (data: any) => {
    const imageFiles: FileList | undefined = data.image as unknown as FileList;
    const imageFile = imageFiles && imageFiles[0];
    if (!imageFile) {
      setError("image" as any, { type: "manual", message: "الصورة مطلوبة" });
      return;
    }

    const payload: CreateHuntDto = {
      storeId: data.storeId,
      image: imageFile,
      name: data.name,
      winnersTarget: Number(data.winnersTarget),
      gridRows: Number(data.gridRows),
      gridCols: Number(data.gridCols),
      codesPerTile: Number(data.codesPerTile),
      startsAt: new Date(data.startsAt).toISOString(),
      endsAt: new Date(data.endsAt).toISOString(),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700/50 max-h-[80vh] flex flex-col">
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-700/50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">إنشاء الرحلة جديدة</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-4">
            {errors.root?.message && (
              <div className="mb-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                {errors.root.message}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  المتجر
                </label>
                <select
                  {...register("storeId", { required: "هذا الحقل مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white ${
                    errors.storeId ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-slate-700">
                    {storesLoading ? "جارٍ التحميل..." : "اختر المتجر"}
                  </option>
                  {!storesLoading &&
                    Array.isArray(storesData) &&
                    (storesData as Store[]).map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-700">
                        {s.name}
                      </option>
                    ))}
                </select>
                {storesError && (
                  <p className="text-xs text-red-400 mt-1">
                    {(storesErr as any)?.response?.data?.message ||
                      (storesErr as Error)?.message ||
                      "فشل تحميل قائمة المتاجر"}
                  </p>
                )}
                {errors.storeId && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.storeId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  اسم الرحلة
                </label>
                <input
                  type="text"
                  {...register("name", { required: "هذا الحقل مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder:text-slate-400 ${
                    errors.name ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                الصورة
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image" as any)}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white ${
                  errors.image ? "border-red-500" : "border-slate-600/50"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30`}
              />
              {errors.image && (
                <p className="text-xs text-red-400 mt-1">
                  {String(errors.image.message)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  عدد الفائزين
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("winnersTarget", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder:text-slate-400 ${
                    errors.winnersTarget ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.winnersTarget && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.winnersTarget.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  صفوف الشبكة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("gridRows", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder:text-slate-400 ${
                    errors.gridRows ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.gridRows && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.gridRows.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  أعمدة الشبكة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("gridCols", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder:text-slate-400 ${
                    errors.gridCols ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.gridCols && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.gridCols.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  أكواد لكل لوحة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("codesPerTile", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder:text-slate-400 ${
                    errors.codesPerTile ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.codesPerTile && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.codesPerTile.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  تبدأ في
                </label>
                <input
                  type="datetime-local"
                  {...register("startsAt", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white ${
                    errors.startsAt ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.startsAt && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.startsAt.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  تنتهي في
                </label>
                <input
                  type="datetime-local"
                  {...register("endsAt", { required: "مطلوب" })}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white ${
                    errors.endsAt ? "border-red-500" : "border-slate-600/50"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.endsAt && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.endsAt.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-slate-700/50">
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
              {mutation.isPending ? "جارٍ الإنشاء..." : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHuntModal;
