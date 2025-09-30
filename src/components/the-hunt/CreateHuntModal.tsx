import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateHuntDto } from "./types";
import { createHunt } from "./api";
import { api as storesApi } from "../stores-offers/api";
import type { Store } from "../stores-offers/types";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">إنشاء الرحلة جديدة</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {errors.root?.message && (
            <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المتجر
                </label>
                <select
                  {...register("storeId", { required: "هذا الحقل مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.storeId ? "border-red-500" : "border-gray-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {storesLoading ? "جارٍ التحميل..." : "اختر المتجر"}
                  </option>
                  {!storesLoading &&
                    Array.isArray(storesData) &&
                    (storesData as Store[]).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
                {storesError && (
                  <p className="text-xs text-red-600 mt-1">
                    {(storesErr as any)?.response?.data?.message ||
                      (storesErr as Error)?.message ||
                      "فشل تحميل قائمة المتاجر"}
                  </p>
                )}
                {errors.storeId && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.storeId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الرحلة
                </label>
                <input
                  type="text"
                  {...register("name", { required: "هذا الحقل مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الصورة
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image" as any)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.image && (
                <p className="text-xs text-red-600 mt-1">
                  {String(errors.image.message)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الفائزين
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("winnersTarget", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.winnersTarget ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.winnersTarget && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.winnersTarget.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صفوف الشبكة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("gridRows", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.gridRows ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.gridRows && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.gridRows.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  أعمدة الشبكة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("gridCols", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.gridCols ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.gridCols && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.gridCols.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  أكواد لكل لوحة
                </label>
                <input
                  type="number"
                  min={1}
                  {...register("codesPerTile", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.codesPerTile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.codesPerTile && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.codesPerTile.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تبدأ في
                </label>
                <input
                  type="datetime-local"
                  {...register("startsAt", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.startsAt ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startsAt && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.startsAt.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تنتهي في
                </label>
                <input
                  type="datetime-local"
                  {...register("endsAt", { required: "مطلوب" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.endsAt ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endsAt && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.endsAt.message}
                  </p>
                )}
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
                {mutation.isPending ? "جارٍ الإنشاء..." : "إنشاء"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHuntModal;
