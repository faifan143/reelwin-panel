// components/tabs/RewardsTab.tsx
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash, Plus, Award } from "lucide-react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import {
  getRewards,
  getCategories,
  createReward,
  updateReward,
  deleteReward,
  createRewardMultipart,
  updateRewardMultipart,
} from "../api";
import { Reward, CreateRewardDto, UpdateRewardDto } from "../types";

const RewardsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState<CreateRewardDto | UpdateRewardDto>({
    title: "",
    description: "",
    pointsCost: 0,
    categoryId: "",
    isActive: true,
    storeId: "",
    stock: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageMode, setImageMode] = useState<"append" | "replace">("append");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all rewards and categories
  const { data: rewards = [], isLoading: isLoadingRewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => getRewards(),
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // Fetch stores for the dropdown
  const { data: stores = [], isLoading: isLoadingStores } = useQuery({
    queryKey: ["stores"],
    queryFn: () =>
      import("../../stores-offers/api").then((m) => m.api.getStores()),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      resetAndCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRewardDto }) =>
      updateReward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      resetAndCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  // Handlers
  const handleOpenModal = (reward?: Reward) => {
    if (reward) {
      setSelectedReward(reward);
      setFormData({
        title: reward.title,
        description: reward.description,
        pointsCost: reward.pointsCost,
        categoryId: reward.categoryId,
        isActive: reward.isActive,
        stock: typeof reward.stock === "number" ? reward.stock : 0,
      });
      setExistingImages(reward.images || []);
      setImageMode("append");
      setSelectedFiles([]);
      setFilePreviews([]);
      setUploadErrors([]);
      setUploadProgress(null);
    } else {
      setSelectedReward(null);
      setFormData({
        title: "",
        description: "",
        pointsCost: 0,
        categoryId: categories[0]?.id || "",
        isActive: true,
        stock: 0,
      });
      setExistingImages([]);
      setSelectedFiles([]);
      setFilePreviews([]);
      setImageMode("append");
      setUploadErrors([]);
      setUploadProgress(null);
    }
    setIsModalOpen(true);
  };

  const resetAndCloseModal = () => {
    setSelectedReward(null);
    setFormData({
      title: "",
      description: "",
      pointsCost: 0,
      categoryId: "",
      isActive: true,
      stock: 0,
    });
    setExistingImages([]);
    setSelectedFiles([]);
    setFilePreviews([]);
    setImageMode("append");
    setUploadErrors([]);
    setUploadProgress(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const totalPlanned =
      (imageMode === "replace"
        ? existingImages.length
        : existingImages.length || 0) + selectedFiles.length;
    if (totalPlanned > 5) {
      setUploadErrors([
        `يمكنك رفع حتى 5 صور كحد أقصى. المختار: ${totalPlanned}`,
      ]);
      return;
    }

    setIsSubmitting(true);
    setUploadErrors([]);
    try {
      const normalized: any = { ...formData };
      if (!normalized.storeId) delete normalized.storeId;
      if (
        typeof normalized.stock !== "number" ||
        Number.isNaN(normalized.stock)
      ) {
        delete normalized.stock;
      }

      if (!selectedReward) {
        if (selectedFiles.length > 0) {
          const submitData = new FormData();
          selectedFiles.forEach((file) => submitData.append("images", file));
          submitData.append("title", String(normalized.title));
          submitData.append("description", String(normalized.description));
          submitData.append("pointsCost", String(normalized.pointsCost));
          submitData.append("categoryId", String(normalized.categoryId));
          submitData.append("isActive", String(!!normalized.isActive));
          if (normalized.storeId)
            submitData.append("storeId", String(normalized.storeId));
          if (typeof normalized.stock === "number")
            submitData.append("stock", String(normalized.stock));
          await createRewardMultipart(submitData, (evt) => {
            if (evt.total)
              setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          });
          await queryClient.invalidateQueries({ queryKey: ["rewards"] });
          resetAndCloseModal();
        } else {
          await createMutation.mutateAsync(normalized as CreateRewardDto);
        }
      } else {
        const id = selectedReward.id;
        if (imageMode === "replace") {
          await updateMutation.mutateAsync({
            id,
            data: { ...normalized, images: existingImages } as UpdateRewardDto,
          });
          if (selectedFiles.length > 0) {
            const submitData = new FormData();
            selectedFiles.forEach((file) => submitData.append("images", file));
            await updateRewardMultipart(id, submitData, (evt) => {
              if (evt.total)
                setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
            });
            await queryClient.invalidateQueries({ queryKey: ["rewards"] });
            resetAndCloseModal();
          }
        } else {
          if (selectedFiles.length > 0) {
            const submitData = new FormData();
            selectedFiles.forEach((file) => submitData.append("images", file));
            if (normalized.title)
              submitData.append("title", String(normalized.title));
            if (normalized.description)
              submitData.append("description", String(normalized.description));
            if (typeof normalized.pointsCost === "number")
              submitData.append("pointsCost", String(normalized.pointsCost));
            if (normalized.categoryId)
              submitData.append("categoryId", String(normalized.categoryId));
            if (typeof normalized.isActive === "boolean")
              submitData.append("isActive", String(!!normalized.isActive));
            if (normalized.storeId)
              submitData.append("storeId", String(normalized.storeId));
            if (typeof normalized.stock === "number")
              submitData.append("stock", String(normalized.stock));
            await updateRewardMultipart(id, submitData, (evt) => {
              if (evt.total)
                setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
            });
            await queryClient.invalidateQueries({ queryKey: ["rewards"] });
            resetAndCloseModal();
          } else {
            await updateMutation.mutateAsync({
              id,
              data: normalized as UpdateRewardDto,
            });
          }
        }
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "حدث خطأ أثناء الحفظ";
      setUploadErrors([String(message)]);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المكافأة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const errors: string[] = [];

    const filtered: File[] = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`نوع ملف غير مدعوم: ${file.name}`);
        continue;
      }
      if (file.size > maxSize) {
        errors.push(`الملف كبير جداً (أقصى 10MB): ${file.name}`);
        continue;
      }
      filtered.push(file);
    }

    const currentExisting =
      imageMode === "replace"
        ? existingImages.length
        : existingImages.length || 0;
    const availableSlots = Math.max(
      0,
      5 - currentExisting - selectedFiles.length
    );
    const toAdd = filtered.slice(0, availableSlots);
    if (filtered.length > toAdd.length) {
      errors.push("تم تجاوز الحد الأقصى لعدد الصور (5).");
    }

    const readers = toAdd.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(String(ev.target?.result || ""));
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((previews) => {
      setFilePreviews((prev) => [...prev, ...previews]);
    });

    setSelectedFiles((prev) => [...prev, ...toAdd]);
    setUploadErrors(errors);
    e.currentTarget.value = "";
  };

  const handleRemoveSingleSelected = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFilePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveAllSelected = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  if (isLoadingRewards || isLoadingCategories) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">المكافآت</h2>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={16} />}>
          إضافة مكافأة
        </Button>
      </div>

      {/* Removed the simple modal version to avoid duplication with the detailed one below */}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الصورة
              </th>
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
                الوصف
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                التكلفة (النقاط)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المخزون
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الفئة
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الحالة
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
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reward.images && reward.images.length > 0 ? (
                    <img
                      src={reward.images[0]}
                      alt={reward.title}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reward.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {reward.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reward.pointsCost}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {typeof reward.stock === "number" ? reward.stock : 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reward.category?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reward.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reward.isActive ? "مفعل" : "غير مفعل"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2 rtl:gap-reverse">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Edit size={16} />}
                      onClick={() => handleOpenModal(reward)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash size={16} />}
                      onClick={() => handleDelete(reward.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white p-4 rounded-lg shadow-md">
            {reward.images && reward.images.length > 0 && (
              <>
                <img
                  src={reward.images[0]}
                  alt={reward.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                {reward.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto mb-3">
                    {reward.images.slice(1).map((src, idx) => (
                      <img
                        key={`${reward.id}-thumb-${idx}`}
                        src={src}
                        alt={`${reward.title}-${idx + 2}`}
                        className="h-14 w-14 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  reward.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {reward.isActive ? "مفعل" : "غير مفعل"}
              </span>
              <h3 className="text-lg font-medium">{reward.title}</h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{reward.description}</p>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Award size={16} className="text-blue-500 mx-1" />
                <span className="text-sm font-medium">
                  {reward.pointsCost} نقطة
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {reward.category?.name}
              </div>
            </div>
            <div className="mt-2">
              {typeof reward.stock === "number" && reward.stock > 0 ? (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {reward.stock} متبقي
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                  غير متوفر
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-2 rtl:gap-reverse">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                icon={<Edit size={16} />}
                onClick={() => handleOpenModal(reward)}
              >
                تعديل
              </Button>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                icon={<Trash size={16} />}
                onClick={() => handleDelete(reward.id)}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetAndCloseModal}
        title={selectedReward ? "تعديل المكافأة" : "إضافة مكافأة جديدة"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50  py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50  py-2"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التكلفة (النقاط)
              </label>
              <input
                type="number"
                name="pointsCost"
                value={formData.pointsCost}
                onChange={handleInputChange}
                min={1}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50  py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المخزون
              </label>
              <input
                type="number"
                name="stock"
                value={(formData as any).stock ?? 0}
                onChange={handleInputChange}
                min={0}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50  py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50  py-2"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                المتجر (اختياري)
              </div>
              <select
                name="storeId"
                value={formData.storeId || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">بدون متجر (اختياري)</option>
                {stores.map((store: any) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive as boolean}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="mx-2 block text-sm text-gray-900"
              >
                مفعل
              </label>
            </div>

            {/* Images Uploader */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  الصور (حتى 5)
                </label>
                {selectedReward && (
                  <div className="text-sm">
                    <label className="mr-2">
                      <input
                        type="radio"
                        name="imageMode"
                        className="ml-1"
                        checked={imageMode === "append"}
                        onChange={() => setImageMode("append")}
                      />
                      إضافة صور
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="imageMode"
                        className="ml-1"
                        checked={imageMode === "replace"}
                        onChange={() => setImageMode("replace")}
                      />
                      استبدال الصور
                    </label>
                  </div>
                )}
              </div>

              {selectedReward &&
                imageMode === "replace" &&
                existingImages.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">
                      الصور الحالية
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="relative">
                          <img
                            src={src}
                            alt={`reward-${idx}`}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute -top-2 -left-2 bg-red-600 text-white text-xs rounded-full h-6 w-6"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {filePreviews.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">صور جديدة</div>
                  <div className="flex flex-wrap gap-2">
                    {filePreviews.map((src, idx) => (
                      <div key={`preview-${idx}`} className="relative">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSingleSelected(idx)}
                          className="absolute -top-2 -left-2 bg-red-600 text-white text-xs rounded-full h-6 w-6"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`${
                  filePreviews.length > 0
                    ? "border-2 border-dashed border-gray-300 rounded-lg p-4"
                    : "mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg"
                }`}
              >
                <div className="text-center">
                  <label
                    htmlFor="images-upload"
                    className="cursor-pointer inline-flex items-center px-3 py-2 bg-white text-sm font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50"
                  >
                    اختر صور
                  </label>
                  <input
                    id="images-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImagesChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                  />
                  {filePreviews.length > 0 && (
                    <button
                      type="button"
                      className="ml-3 text-sm text-red-600"
                      onClick={handleRemoveAllSelected}
                    >
                      إزالة الكل
                    </button>
                  )}
                  {uploadProgress !== null && (
                    <div className="mt-2 text-sm text-gray-600">
                      {uploadProgress}%
                    </div>
                  )}
                </div>
              </div>
              {uploadErrors.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc pr-6">
                  {uploadErrors.map((err, idx) => (
                    <li key={`err-${idx}`}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 rtl:gap-reverse">
            <Button
              type="button"
              variant="secondary"
              onClick={resetAndCloseModal}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "جاري الحفظ..."
                : selectedReward
                ? "تحديث"
                : "حفظ"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RewardsTab;
