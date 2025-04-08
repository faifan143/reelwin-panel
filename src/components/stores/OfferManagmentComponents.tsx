// components/offers/OffersList.tsx
interface OffersListProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
  isMobile: boolean;
}

export const OffersList: React.FC<OffersListProps> = ({
  offers,
  onEdit,
  onDelete,
  isMobile,
}) => {
  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    const finalPrice = price - (price * discount) / 100;
    return (
      <div>
        <span className="font-medium text-green-600">{finalPrice.toFixed(1)} ل.س</span>
        {discount > 0 && (
          <span className="line-through text-gray-400 text-xs mr-2">
            {price.toFixed(1)} ل.س
          </span>
        )}
      </div>
    );
  };

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "غير محدد";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar");
  };

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{offer.description}</p>
              </div>
              <div className="flex space-x-1 space-x-reverse mr-2">
                <button
                  onClick={() => onEdit(offer)}
                  className="text-indigo-600 hover:text-indigo-900 p-1"
                  title="تعديل"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(offer)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="حذف"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Images Preview */}
            {offer.images && offer.images.length > 0 && (
              <div className="flex space-x-2 space-x-reverse mb-3 overflow-x-auto py-2">
                {offer.images.map((image, index) => (
                  <div key={index} className="flex-shrink-0">
                    <ImagePreview src={image} className="w-16 h-16 object-cover rounded" />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-500 mb-1">السعر</div>
                <div className="text-sm">{formatPrice(offer.price, offer.discount)}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-500 mb-1">الخصم</div>
                <div className="text-sm flex items-center">
                  <Percent className="h-4 w-4 ml-1 text-green-500" />
                  {offer.discount}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="h-4 w-4 ml-1 text-gray-400" />
                {offer.category?.name || ""}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <StoreIcon className="h-4 w-4 ml-1 text-gray-400" />
                {offer.store?.name || ""}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center text-gray-500">
                <Calendar className="h-3 w-3 ml-1" />
                {formatDate(offer.endDate)}
              </div>
              <div className={`text-xs ${offer.isActive ? "text-green-600" : "text-red-600"}`}>
                {offer.isActive ? "نشط" : "غير نشط"}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              العرض
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              السعر
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الفئة والمتجر
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              التواريخ
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
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-start">
                  {offer.images && offer.images.length > 0 && (
                    <div className="flex-shrink-0 h-10 w-10 ml-3">
                      <ImagePreview 
                        src={offer.images[0]} 
                        alt={offer.title} 
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{offer.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  {formatPrice(offer.price, offer.discount)}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <Percent className="h-3 w-3 ml-1" />
                  خصم {offer.discount}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center mb-1">
                  <Tag className="h-4 w-4 ml-1 text-gray-400" />
                  {offer.category?.name || ""}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <StoreIcon className="h-4 w-4 ml-1 text-gray-400" />
                  {offer.store?.name || ""}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {offer.startDate && (
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 ml-1 text-gray-400" />
                    من: {formatDate(offer.startDate)}
                  </div>
                )}
                {offer.endDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                    إلى: {formatDate(offer.endDate)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    offer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {offer.isActive ? "نشط" : "غير نشط"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => onEdit(offer)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="تعديل"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(offer)}
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
  );
};

// components/offers/OfferForm.tsx
import { Calendar, Clock, Edit, Percent, StoreIcon, Tag, Trash2, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

interface OfferFormProps {
  initialData?: Offer;
  categories: OfferCategory[];
  stores: Store[];
  onSubmit: (data: OfferFormData, files: File[]) => void;
}

export const OfferForm: React.FC<OfferFormProps> = ({
  initialData,
  categories,
  stores,
  onSubmit,
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OfferFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      discount: initialData?.discount || 0,
      categoryId: initialData?.categoryId || "",
      storeId: initialData?.storeId || "",
      isActive: initialData?.isActive ?? true,
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: OfferFormData) => {
    // Combine form data with existing images
    const formData = {
      ...data,
      existingImages,
    };
    
    onSubmit(formData, imageFiles);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            عنوان العرض <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "العنوان مطلوب" })}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            وصف العرض <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description", { required: "الوصف مطلوب" })}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.description ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            السعر <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ل.س</span>
            </div>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register("price", {
                required: "السعر مطلوب",
                min: { value: 0, message: "يجب أن يكون السعر أكبر من 0" },
              })}
              className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-4 sm:text-sm border-gray-300 rounded-md ${
                errors.price ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            الخصم (%)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="discount"
              min="0"
              max="100"
              {...register("discount", {
                min: { value: 0, message: "يجب أن يكون الخصم بين 0 و 100" },
                max: { value: 100, message: "يجب أن يكون الخصم بين 0 و 100" },
              })}
              className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 sm:text-sm border-gray-300 rounded-md ${
                errors.discount ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.discount && (
            <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            الفئة <span className="text-red-500">*</span>
          </label>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "الفئة مطلوبة" }}
            render={({ field }) => (
              <Select
                id="categoryId"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                placeholder="اختر الفئة"
                onChange={(option) => field.onChange(option?.value)}
                value={categories
                  .map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))
                  .find((option) => option.value === field.value)}
                classNamePrefix="select"
                className={errors.categoryId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Store */}
        <div>
          <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
            المتجر <span className="text-red-500">*</span>
          </label>
          <Controller
            name="storeId"
            control={control}
            rules={{ required: "المتجر مطلوب" }}
            render={({ field }) => (
              <Select
                id="storeId"
                options={stores.map((store) => ({
                  value: store.id,
                  label: `${store.name} (${store.city})`,
                }))}
                placeholder="اختر المتجر"
                onChange={(option) => field.onChange(option?.value)}
                value={stores
                  .map((store) => ({
                    value: store.id,
                    label: `${store.name} (${store.city})`,
                  }))
                  .find((option) => option.value === field.value)}
                classNamePrefix="select"
                className={errors.storeId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.storeId && (
            <p className="mt-1 text-sm text-red-600">{errors.storeId.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ البدء
          </label>
          <input
            type="datetime-local"
            id="startDate"
            {...register("startDate")}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ الانتهاء
          </label>
          <input
            type="datetime-local"
            id="endDate"
            {...register("endDate")}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        {/* Active Status */}
        <div>
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="mr-2 block text-sm text-gray-700">
              نشط
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            العروض النشطة فقط هي التي ستظهر للمستخدمين
          </p>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            صور العرض
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>رفع الصور</span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pr-1">أو سحب وإفلات</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</p>
            </div>
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصور الحالية
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <ImagePreview src={imageUrl} className="w-full h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {imageFiles.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصور الجديدة
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

// components/offers/OfferFilters.tsx
import { Search } from "lucide-react";
import { ImagePreview } from "./SharedComponents";
import { Offer, OfferCategory, Store, OfferFormData, OfferFilterData } from "./store.type";

interface OfferFiltersProps {
  filters: OfferFilterData;
  onFilterChange: (filters: OfferFilterData) => void;
  onReset: () => void;
  onSearch: () => void;
  categories: OfferCategory[];
  stores: Store[];
}

export const OfferFilters: React.FC<OfferFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch,
  categories,
  stores,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      onFilterChange({ ...filters, [name]: checkbox.checked });
    } else if (
      ["minPrice", "maxPrice", "minDiscount", "maxDiscount"].includes(name) &&
      value !== ""
    ) {
      onFilterChange({ ...filters, [name]: parseFloat(value) });
    } else {
      onFilterChange({ ...filters, [name]: value });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الفئة
        </label>
        <select
          name="categoryId"
          value={filters.categoryId || ""}
          onChange={handleInputChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">جميع الفئات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Store Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المتجر
        </label>
        <select
          name="storeId"
          value={filters.storeId || ""}
          onChange={handleInputChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">جميع المتاجر</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} ({store.city})
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المدينة
        </label>
        <input
          type="text"
          name="city"
          value={filters.city || ""}
          onChange={handleInputChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="البحث حسب المدينة"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نطاق السعر
        </label>
        <div className="flex space-x-2 space-x-reverse rtl">
          <div className="flex-1">
            <input
              type="number"
              name="minPrice"
              min="0"
              value={filters.minPrice || ""}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="من"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              name="maxPrice"
              min="0"
              value={filters.maxPrice || ""}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="إلى"
            />
          </div>
        </div>
      </div>

      {/* Discount Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نسبة الخصم (%)
        </label>
        <div className="flex space-x-2 space-x-reverse rtl">
          <div className="flex-1">
            <input
              type="number"
              name="minDiscount"
              min="0"
              max="100"
              value={filters.minDiscount || ""}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="من"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              name="maxDiscount"
              min="0"
              max="100"
              value={filters.maxDiscount || ""}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="إلى"
            />
          </div>
        </div>
      </div>

      {/* Active Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الحالة
        </label>
        <div className="flex items-center space-x-4 space-x-reverse mt-2">
          <div className="flex items-center">
            <input
              id="all-status"
              name="isActive"
              type="radio"
              checked={filters.isActive === undefined}
              onChange={() => onFilterChange({ ...filters, isActive: undefined })}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="all-status" className="mr-2 block text-sm text-gray-700">
              الجميع
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="active-status"
              name="isActive"
              type="radio"
              checked={filters.isActive === true}
              onChange={() => onFilterChange({ ...filters, isActive: true })}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="active-status" className="mr-2 block text-sm text-gray-700">
              نشط
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="inactive-status"
              name="isActive"
              type="radio"
              checked={filters.isActive === false}
              onChange={() => onFilterChange({ ...filters, isActive: false })}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="inactive-status" className="mr-2 block text-sm text-gray-700">
              غير نشط
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="md:col-span-3 flex justify-end space-x-2 space-x-reverse">
        <button
          onClick={onSearch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Search className="h-4 w-4 ml-2" />
          بحث
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4 ml-2" />
          مسح
        </button>
      </div>
    </div>
  );
};