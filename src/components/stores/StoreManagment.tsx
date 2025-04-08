// components/stores/StoresList.tsx
import { Edit, MapPin, Phone, Trash2 } from "lucide-react";
import React from "react";

interface StoresListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  isMobile: boolean;
}

export const StoresList: React.FC<StoresListProps> = ({
  stores,
  onEdit,
  onDelete,
  isMobile,
}) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                {store.image && (
                  <div className="mr-3">
                    <ImagePreview src={store.image} alt={store.name} />
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
              </div>
              <div className="flex space-x-1 space-x-reverse">
                <button
                  onClick={() => onEdit(store)}
                  className="text-indigo-600 hover:text-indigo-900 p-1"
                  title="تعديل"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(store)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="حذف"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 flex items-center mb-2">
              <Phone className="h-4 w-4 ml-1 text-gray-400" />
              {store.phone}
            </div>
            
            <div className="text-sm text-gray-600 flex items-center mb-2">
              <MapPin className="h-4 w-4 ml-1 text-gray-400" />
              {store.city}, {store.address}
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-3 border-t pt-2">
              <div>العروض: {store._count?.offers || 0}</div>
              <div>المحتوى: {store._count?.contents || 0}</div>
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
              المتجر
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الاتصال
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الموقع
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الإحصائيات
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
          {stores.map((store) => (
            <tr key={store.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {store.image && (
                    <div className="flex-shrink-0 h-10 w-10 ml-3">
                      <ImagePreview src={store.image} alt={store.name} />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 ml-1 text-gray-400" />
                  {store.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 ml-1 text-gray-400" />
                  {store.city}, {store.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-4 space-x-reverse">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{store._count?.offers || 0}</span> عروض
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{store._count?.contents || 0}</span> محتوى
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => onEdit(store)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="تعديل"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(store)}
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

// components/stores/StoreForm.tsx
import { useState } from "react";

interface StoreFormProps {
  initialData?: Store;
  onSubmit: (data: StoreFormData, file: File | null) => void;
}

export const StoreForm: React.FC<StoreFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    city: initialData?.city || "",
    address: initialData?.address || "",
    longitude: initialData?.longitude || 0,
    latitude: initialData?.latitude || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value === "" ? 0 : parseFloat(value) 
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "اسم المتجر مطلوب";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^(09|01)\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }
    
    if (isNaN(formData.longitude) || formData.longitude === 0) {
      newErrors.longitude = "خط الطول مطلوب";
    }
    
    if (isNaN(formData.latitude) || formData.latitude === 0) {
      newErrors.latitude = "خط العرض مطلوب";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, imageFile);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            اسم المتجر <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.phone ? "border-red-500" : ""
            }`}
            placeholder="09xxxxxxxx"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            المدينة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.city ? "border-red-500" : ""
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.address ? "border-red-500" : ""
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Coordinates */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الإحداثيات <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="longitude" className="block text-xs text-gray-500 mb-1">
                خط الطول
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                value={formData.longitude || ""}
                onChange={handleCoordinateChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.longitude ? "border-red-500" : ""
                }`}
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
              )}
            </div>
            <div>
              <label htmlFor="latitude" className="block text-xs text-gray-500 mb-1">
                خط العرض
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                value={formData.latitude || ""}
                onChange={handleCoordinateChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.latitude ? "border-red-500" : ""
                }`}
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <MapPin className="h-3 w-3 ml-1" />
            يمكنك الحصول على الإحداثيات من خرائط جوجل
          </p>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            صورة المتجر
          </label>
          <div className="mt-1 flex items-center space-x-4 space-x-reverse">
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="معاينة" 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {imagePreview ? "تغيير الصورة" : "اختر صورة"}
              </label>
              <p className="mt-1 text-xs text-gray-500">JPG، PNG أو GIF. الحد الأقصى 10 ميجابايت</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// components/stores/StoreFilters.tsx
import { Search, X } from "lucide-react";
import { Store, StoreFilterData, StoreFormData } from "./store.type";
import { ImagePreview } from "./SharedComponents";

interface StoreFiltersProps {
  filters: StoreFilterData;
  onFilterChange: (filters: StoreFilterData) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const StoreFilters: React.FC<StoreFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم المتجر
        </label>
        <input
          type="text"
          name="name"
          value={filters.name || ""}
          onChange={handleInputChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="البحث حسب اسم المتجر"
        />
      </div>

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

      <div className="flex items-end space-x-2 space-x-reverse">
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