import useStore from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart4,
  Building,
  Edit,
  Eye,
  Filter,
  Menu,
  Package,
  Plus,
  ShoppingBag,
  Store,
  Tag,
  Trash
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Define the base URL and token retrieval
const API_BASE_URL = `https://anycode-sy.com/reel-win/api`;

// Arabic translations
const translations = {
  // General
  businessDashboard: 'لوحة تحكم المتاجر و العروض',
  manage: 'إدارة العروض والمتاجر والفئات',
  menu: 'القائمة',
  hideMenu: 'إخفاء القائمة',
  add: 'إضافة',
  edit: 'تعديل',
  delete: 'حذف',
  view: 'عرض',
  viewDetails: 'عرض التفاصيل',
  loading: 'جاري التحميل...',
  adding: 'جاري الإضافة...',
  error: 'حدث خطأ',
  noData: 'لا توجد بيانات',
  required: 'مطلوب',
  uploadFile: 'تحميل ملف',
  orDragDrop: 'أو اسحب وأفلت',
  fileTypes: 'PNG، JPG، GIF حتى 10MB',
  selectedFile: 'الملف المحدد',
  selectedFiles: 'الملفات المحددة',
  confirm: 'تأكيد',
  cancel: 'إلغاء',
  deleteConfirmation: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
  deleteSuccessful: 'تم الحذف بنجاح',
  deleteFailed: 'فشل الحذف',
  updateSuccessful: 'تم التحديث بنجاح',
  updateFailed: 'فشل التحديث',
  editCategory: 'تعديل الفئة',
  editStore: 'تعديل المتجر',
  editOffer: 'تعديل العرض',
  save: 'حفظ',
  saving: 'جاري الحفظ...',
  deleteWarning: 'هذا الإجراء لا يمكن التراجع عنه',
  deleteCategory: 'حذف الفئة',
  deleteStore: 'حذف المتجر',
  deleteOffer: 'حذف العرض',
  active: 'نشط',
  inactive: 'غير نشط',
  status: 'الحالة',
  startDate: 'تاريخ البدء',
  endDate: 'تاريخ الانتهاء',
  optional: 'اختياري',
  currentImages: 'الصور الحالية',
  addMoreImages: 'إضافة المزيد من الصور',
  confirmDelete: 'تأكيد الحذف',
  unableToDelete: 'غير قادر على الحذف. قد يكون هناك عناصر مرتبطة بهذا العنصر',
  sureDelete: 'هل أنت متأكد أنك تريد حذف',

  // Tabs
  offers: 'العروض',
  stores: 'المتاجر',
  categories: 'الفئات',

  // Categories
  categoriesTitle: 'الفئات',
  addCategory: 'إضافة فئة',
  hideForm: 'إخفاء النموذج',
  addNewCategory: 'إضافة فئة جديدة',
  categoryName: 'اسم الفئة',
  noCategories: 'لا توجد فئات',
  errorCategories: 'خطأ في تحميل الفئات',
  id: 'المعرف',

  // Stores
  storesTitle: 'المتاجر',
  addStore: 'إضافة متجر',
  addNewStore: 'إضافة متجر جديد',
  storeName: 'اسم المتجر',
  phone: 'الهاتف',
  city: 'المدينة',
  address: 'العنوان',
  longitude: 'خط الطول',
  latitude: 'خط العرض',
  storeImage: 'صورة المتجر',
  noStores: 'لا توجد متاجر',
  errorStores: 'خطأ في تحميل المتاجر',

  // Offers
  offersTitle: 'العروض',
  addOffer: 'إضافة عرض',
  addNewOffer: 'إضافة عرض جديد',
  title: 'العنوان',
  price: 'السعر',
  discount: 'الخصم',
  off: 'خصم',
  description: 'الوصف',
  images: 'الصور',
  contentId: 'معرف المحتوى',
  contentIdOptional: 'معرف المحتوى (اختياري)',
  selectCategory: 'اختر فئة',
  selectStore: 'اختر متجر',
  allCategories: 'جميع الفئات',
  noOffers: 'لا توجد عروض',
  errorOffers: 'خطأ في تحميل العروض',
};

// API functions
const api = {
  // Categories
  getCategories: async () => {
    const { token } = useStore.getState();
    const { data } = await axios.get(`${API_BASE_URL}/offer-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  getCategory: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.get(`${API_BASE_URL}/offer-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  createCategory: async (categoryData: { name: string }) => {
    const { token } = useStore.getState();
    const { data } = await axios.post(`${API_BASE_URL}/offer-categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  },

  deleteCategory: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.delete(`${API_BASE_URL}/offer-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  updateCategory: async (id: string, categoryData: { name: string }) => {
    const { token } = useStore.getState();
    const { data } = await axios.put(`${API_BASE_URL}/offer-categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  },

  // Stores
  getStores: async () => {
    const { token } = useStore.getState();
    const { data } = await axios.get(`${API_BASE_URL}/stores`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  getStore: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.get(`${API_BASE_URL}/stores/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  createStore: async (storeData: FormData) => {
    const { token } = useStore.getState();
    const { data } = await axios.post(`${API_BASE_URL}/stores`, storeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return data;
  },

  deleteStore: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.delete(`${API_BASE_URL}/stores/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  updateStore: async (id: string, storeData: FormData) => {
    const { token } = useStore.getState();
    const { data } = await axios.put(`${API_BASE_URL}/stores/${id}`, storeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  },

  // Offers
  getOffers: async (categoryId?: string) => {
    const { token } = useStore.getState();
    const url = categoryId
      ? `${API_BASE_URL}/offers?categoryId=${categoryId}`
      : `${API_BASE_URL}/offers`;

    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return Array.isArray(data) ? data : data.data || [];
  },

  getOffer: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.get(`${API_BASE_URL}/offers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  createOffer: async (offerData: FormData) => {
    const { token } = useStore.getState();
    const { data } = await axios.post(`${API_BASE_URL}/offers`, offerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return data;
  },

  deleteOffer: async (id: string) => {
    const { token } = useStore.getState();
    const { data } = await axios.delete(`${API_BASE_URL}/offers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  updateOffer: async (id: string, offerData: FormData) => {
    const { token } = useStore.getState();
    const { data } = await axios.put(`${API_BASE_URL}/offers/${id}`, offerData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  }
};

// Type definitions
interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Store {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  longitude: string;
  latitude: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  storeId: string;
  categoryId: string;
  contentId?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  store?: Store;
  category?: Category;
}

// Modal component for confirmations and forms
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'category' | 'store' | 'offer';
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName, itemType, isDeleting }) => {
  const typeTranslation =
    itemType === 'category'
      ? translations.categoriesTitle
      : itemType === 'store'
        ? translations.storesTitle
        : translations.offersTitle;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translations.confirmDelete}
    >
      <div className="text-right">
        <p className="text-red-600 font-medium mb-2">
          {translations.deleteWarning}
        </p>
        <p className="mb-6">
          {translations.sureDelete} {typeTranslation} "{itemName}"؟
        </p>
        <div className="flex justify-end gap-3 gap-reverse">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {translations.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : translations.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Tab component
const Tab: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  mobileView?: boolean;
}> = ({ active, icon, label, onClick, mobileView = false }) => {
  // For desktop view
  if (!mobileView) {
    return (
      <button
        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm rounded-t-lg transition-all duration-200 ${active
          ? 'bg-white text-indigo-600 border-t-2 border-l border-r border-indigo-500 shadow-sm'
          : 'bg-gray-50 text-gray-600 hover:text-indigo-500 hover:bg-gray-100'
          }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  // For mobile view
  return (
    <button
      className={`flex items-center justify-start w-full gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 ${active
        ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500'
        : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50 border-r-4 border-transparent'
        }`}
      onClick={onClick}
    >
      <span className="w-6">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Button component
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  type = "button"
}) => {
    const baseClasses = "flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200";

    const variantClasses = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      >
        {children}
        {icon}
      </button>
    );
  };

// Input component
const Input: React.FC<{
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = ""
}) => (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-right">
          {label}
          {required && <span className="text-red-500 mx-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-right"
        dir="rtl"
      />
    </div>
  );

// Select component
const Select: React.FC<{
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = ""
}) => (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-right">
          {label}
          {required && <span className="text-red-500 mx-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-200 text-right"
        dir="rtl"
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

// Loading Spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Error Display
const ErrorDisplay: React.FC<{ message?: string }> = ({ message = translations.error }) => (
  <div className="py-10 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg py-4 px-6 inline-block mx-auto">
      <p className="text-red-600">{message}</p>
    </div>
  </div>
);

// Card component
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

// CategoryForm component
const CategoryForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      onSuccess();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
        {translations.addNewCategory}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          disabled={mutation.isPending}
          icon={<Plus size={18} className="mx-1" />}
          className="sm:flex-shrink-0 order-2 sm:order-2"
        >
          {mutation.isPending ? translations.adding : translations.add}
        </Button>
        <Input
          name="name"
          placeholder={translations.categoryName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow order-1 sm:order-1"
          required
        />
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
      )}
    </Card>
  );
};

// CategoryEditForm component
const CategoryEditForm: React.FC<{
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category.name);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string }) => api.updateCategory(category.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={translations.categoryName}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 gap-reverse mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {translations.cancel}
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? translations.saving : translations.save}
          </Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.updateFailed}</p>
      )}
    </div>
  );
};

// StoreForm component
const StoreForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    longitude: '',
    latitude: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      setFormData({
        name: '',
        phone: '',
        city: '',
        address: '',
        longitude: '',
        latitude: '',
      });
      setImage(null);
      onSuccess();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      submitData.append(key, value);
    }

    if (image) {
      submitData.append('image', image);
    }

    mutation.mutate(submitData);
  };

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
        {translations.addNewStore}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
        <Input
          label={translations.storeName}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.phone}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.city}
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.address}
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.longitude}
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.latitude}
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />

        <div className="sm:col-span-2 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.storeImage} <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>{translations.uploadFile}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    required
                  />
                </label>
                <p className="pr-1">{translations.orDragDrop}</p>
              </div>
              <p className="text-xs text-gray-500">{translations.fileTypes}</p>
            </div>
          </div>
          {image && (
            <p className="mt-2 text-sm text-gray-600 text-right">{translations.selectedFile}: {image.name}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-3 mt-2 text-right">
          <Button
            type="submit"
            disabled={mutation.isPending}
            icon={<Plus size={18} className="mx-1" />}
          >
            {mutation.isPending ? translations.adding : translations.addStore}
          </Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
      )}
    </Card>
  );
};

// StoreEditForm component
const StoreEditForm: React.FC<{
  store: Store;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ store, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: store.name,
    phone: store.phone,
    city: store.city,
    address: store.address,
    longitude: store.longitude,
    latitude: store.latitude,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(store.image || null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.updateStore(store.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      onSuccess();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      submitData.append(key, value);
    }

    if (image) {
      submitData.append('image', image);
    }

    mutation.mutate(submitData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
        <Input
          label={translations.storeName}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.phone}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.city}
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.address}
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.longitude}
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.latitude}
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.storeImage}
          </label>

          {/* Show current image preview */}
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Store preview"
                className="h-40 w-auto object-contain mx-auto border border-gray-200 rounded"
              />
            </div>
          )}

          <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>{translations.uploadFile}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pr-1">{translations.orDragDrop}</p>
              </div>
              <p className="text-xs text-gray-500">{translations.fileTypes}</p>
            </div>
          </div>
          {image && (
            <p className="mt-2 text-sm text-gray-600 text-right">
              {translations.selectedFile}: {image.name}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 gap-reverse mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {translations.cancel}
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? translations.saving : translations.save}
          </Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.updateFailed}</p>
      )}
    </div>
  );
};

// OfferForm component
const OfferForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    storeId: '',
    categoryId: '',
    contentId: '',
  });
  const [images, setImages] = useState<FileList | null>(null);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { data: stores } = useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: api.getStores
  });

  const mutation = useMutation({
    mutationFn: api.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        storeId: '',
        categoryId: '',
        contentId: '',
      });
      setImages(null);
      onSuccess();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value)
        submitData.append(key, value);
    }

    if (images) {
      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    }

    mutation.mutate(submitData);
  };

  const categoryOptions = categories?.map(category => ({
    value: category.id,
    label: category.name
  })) || [];

  const storeOptions = stores?.map(store => ({
    value: store.id,
    label: store.name
  })) || [];

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
        {translations.addNewOffer}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
        <Input
          label={translations.title}
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.price}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.discount}
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
          required
        />
        <Select
          label={translations.categoriesTitle}
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          options={categoryOptions}
          placeholder={translations.selectCategory}
          required
        />
        <Select
          label={translations.storesTitle}
          name="storeId"
          value={formData.storeId}
          onChange={handleChange}
          options={storeOptions}
          placeholder={translations.selectStore}
          required
        />
        <Input
          label={translations.contentIdOptional}
          name="contentId"
          value={formData.contentId}
          onChange={handleChange}
        />

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.description} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition-all duration-200 text-right"
            required
            dir="rtl"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.images} <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="images-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>{translations.uploadFile}</span>
                  <input
                    id="images-upload"
                    name="images-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleImagesChange}
                    required
                  />
                </label>
                <p className="pr-1">{translations.orDragDrop}</p>
              </div>
              <p className="text-xs text-gray-500">{translations.fileTypes}</p>
            </div>
          </div>
          {images && images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 text-right">{translations.selectedFiles}: {images.length}</p>
          )}
        </div>

        <div className="sm:col-span-2 mt-2 text-right">
          <Button
            type="submit"
            disabled={mutation.isPending}
            icon={<Plus size={18} className="mx-1" />}
          >
            {mutation.isPending ? translations.adding : translations.addOffer}
          </Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
      )}
    </Card>
  );
};

// OfferEditForm component
const OfferEditForm: React.FC<{
  offer: Offer;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ offer, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: offer.title,
    description: offer.description,
    price: String(offer.price),
    discount: String(offer.discount),
    storeId: offer.storeId,
    categoryId: offer.categoryId,
    contentId: offer.contentId || '',
    isActive: offer.isActive !== false, // Default to true if not specified
    startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
    endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>(offer.images || []);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { data: stores } = useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: api.getStores
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.updateOffer(offer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      onSuccess();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle checkbox special case
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value !== undefined && value !== null && value !== '') {
        submitData.append(key, String(value));
      }
    }

    // Add current images
    currentImages.forEach(image => {
      submitData.append('existingImages[]', image);
    });

    // Add new images
    if (images) {
      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    }

    mutation.mutate(submitData);
  };

  const categoryOptions = categories?.map(category => ({
    value: category.id,
    label: category.name
  })) || [];

  const storeOptions = stores?.map(store => ({
    value: store.id,
    label: store.name
  })) || [];

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
        <Input
          label={translations.title}
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.price}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <Input
          label={translations.discount}
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
          required
        />
        <Select
          label={translations.categoriesTitle}
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          options={categoryOptions}
          placeholder={translations.selectCategory}
          required
        />
        <Select
          label={translations.storesTitle}
          name="storeId"
          value={formData.storeId}
          onChange={handleChange}
          options={storeOptions}
          placeholder={translations.selectStore}
          required
        />
        <Input
          label={translations.contentIdOptional}
          name="contentId"
          value={formData.contentId}
          onChange={handleChange}
        />

        <div className="sm:col-span-2 flex items-center justify-end">
          <label className="inline-flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mx-2"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            {translations.active}
          </label>
        </div>

        <Input
          label={`${translations.startDate} (${translations.optional})`}
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
        />

        <Input
          label={`${translations.endDate} (${translations.optional})`}
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
        />

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.description} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition-all duration-200 text-right"
            required
            dir="rtl"
          />
        </div>

        {/* Current Images Display */}
        {currentImages.length > 0 && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {translations.currentImages}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Offer image ${index + 1}`}
                    className="h-32 w-full object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => {
                      setCurrentImages(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            {translations.addMoreImages}
          </label>
          <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor="images-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>{translations.uploadFile}</span>
                  <input
                    id="images-upload"
                    name="images-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleImagesChange}
                  />
                </label>
                <p className="pr-1">{translations.orDragDrop}</p>
              </div>
              <p className="text-xs text-gray-500">{translations.fileTypes}</p>
            </div>
          </div>
          {images && images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 text-right">
              {translations.selectedFiles}: {images.length}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 gap-reverse mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
            type="button"
          >
            {translations.cancel}
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? translations.saving : translations.save}
          </Button>
        </div>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-3 text-sm text-right">{translations.updateFailed}</p>
      )}
    </div>
  );
};
// Enhanced CategoriesTab component
const CategoriesTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  });

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Tag className="mx-2 text-indigo-600" /> {translations.categoriesTitle}
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? null : <Plus size={18} className="mx-1" />}
          variant={showForm ? "secondary" : "primary"}
        >
          {showForm ? translations.hideForm : translations.addCategory}
        </Button>
      </div>

      {showForm && (
        <CategoryForm onSuccess={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorDisplay message={translations.errorCategories} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-gray-900">
                    {translations.categoryName}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6">
                    <span className="sr-only">{translations.view}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 text-right">
                        {category.name}
                      </td>
                      <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                        <div className="flex justify-start gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit size={14} className="mx-1" />}
                            onClick={() => handleEditClick(category)}
                          >
                            {translations.edit}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash size={14} className="mx-1" />}
                            onClick={() => handleDeleteClick(category)}
                          >
                            {translations.delete}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      {translations.noCategories}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                        onClick={() => handleEditClick(category)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{translations.id}: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{category.id.substring(0, 8)}...</span></p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-500">
                {translations.noCategories}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCategory?.name || ''}
        itemType="category"
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Category Modal */}
      {selectedCategory && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={translations.editCategory}
        >
          <CategoryEditForm
            category={selectedCategory}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }}
          />
        </Modal>
      )}

      {/* Error Toast for Delete Operation */}
      {deleteMutation.isError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1"><svg className="h-6 w-6 text-red-500 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div>
              <p className="font-bold">{translations.deleteFailed}</p>
              <p className="text-sm">{translations.unableToDelete}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced StoresTab component
const StoresTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: stores, isLoading, isError } = useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: api.getStores
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      setIsDeleteModalOpen(false);
      setSelectedStore(null);
    }
  });

  const handleDeleteClick = (store: Store) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStore) {
      deleteMutation.mutate(selectedStore.id);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Store className="mx-2 text-indigo-600" /> {translations.storesTitle}
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? null : <Plus size={18} className="mx-1" />}
          variant={showForm ? "secondary" : "primary"}
        >
          {showForm ? translations.hideForm : translations.addStore}
        </Button>
      </div>

      {showForm && (
        <StoreForm onSuccess={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorDisplay message={translations.errorStores} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-gray-900">
                    {translations.storeName}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.city}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.phone}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.address}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6">
                    <span className="sr-only">{translations.view}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stores && stores.length > 0 ? (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 text-right">
                        {store.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        {store.city}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        {store.phone}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        {store.address}
                      </td>
                      <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                        <div className="flex justify-start gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit size={14} className="mx-1" />}
                            onClick={() => handleEditClick(store)}
                          >
                            {translations.edit}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash size={14} className="mx-1" />}
                            onClick={() => handleDeleteClick(store)}
                          >
                            {translations.delete}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      {translations.noStores}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {stores && stores.length > 0 ? (
              stores.map((store) => (
                <Card key={store.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                        onClick={() => handleEditClick(store)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                        onClick={() => handleDeleteClick(store)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-medium text-gray-900 mb-2">{store.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-end text-gray-600">
                          <span>{store.city}</span>
                          <Building className="w-4 h-4 mx-2 mx-2" />
                        </div>
                        <div className="flex items-center justify-end text-gray-600">
                          <span>{store.address}</span>
                          <ShoppingBag className="w-4 h-4 mx-2 mx-2" />
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">{translations.phone}:</span> {store.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-500">
                {translations.noStores}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedStore?.name || ''}
        itemType="store"
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Store Modal */}
      {selectedStore && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={translations.editStore}
        >
          <StoreEditForm
            store={selectedStore}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedStore(null);
            }}
          />
        </Modal>
      )}

      {/* Error Toast for Delete Operation */}
      {deleteMutation.isError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1"><svg className="h-6 w-6 text-red-500 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div>
              <p className="font-bold">{translations.deleteFailed}</p>
              <p className="text-sm">{translations.unableToDelete}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced OffersTab component
const OffersTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { data: offers, isLoading, isError } = useQuery<Offer[]>({
    queryKey: ['offers', categoryFilter],
    queryFn: () => api.getOffers(categoryFilter)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setIsDeleteModalOpen(false);
      setSelectedOffer(null);
    }
  });

  // Prepare category options for the filter dropdown
  const categoryOptions = categories?.map(category => ({
    value: category.id,
    label: category.name
  })) || [];

  const handleDeleteClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsViewModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOffer) {
      deleteMutation.mutate(selectedOffer.id);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Package className="mx-2 text-indigo-600" /> {translations.offersTitle}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pr-10 pl-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-200 text-right"
              dir="rtl"
            >
              <option value="">{translations.allCategories}</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? null : <Plus size={18} className="mx-1" />}
            variant={showForm ? "secondary" : "primary"}
          >
            {showForm ? translations.hideForm : translations.addOffer}
          </Button>
        </div>
      </div>

      {showForm && (
        <OfferForm onSuccess={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorDisplay message={translations.errorOffers} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-gray-900">
                    {translations.title}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.price}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.discount}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.storesTitle}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                    {translations.categoriesTitle}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6">
                    <span className="sr-only">{translations.view}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {offers && offers.length > 0 ? (
                  offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 text-right">
                        {offer.title}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        <span className="font-medium">${offer.price}</span>
                      </td>
                      <td className="px-3 py-4 text-sm text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {translations.off} {offer.discount}%
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        {offer.store?.name || '—'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {offer.category?.name || '—'}
                        </span>
                      </td>
                      <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                        <div className="flex justify-start gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Eye size={14} className="mx-1" />}
                            onClick={() => handleViewClick(offer)}
                          >
                            {translations.view}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit size={14} className="mx-1" />}
                            onClick={() => handleEditClick(offer)}
                          >
                            {translations.edit}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash size={14} className="mx-1" />}
                            onClick={() => handleDeleteClick(offer)}
                          >
                            {translations.delete}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {translations.noOffers}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <Card key={offer.id}>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        <button
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                          onClick={() => handleEditClick(offer)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                          onClick={() => handleDeleteClick(offer)}
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 flex-1 text-right truncate">{offer.title}</h3>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded text-right">
                        <p className="text-xs text-gray-500 mb-1">{translations.price}</p>
                        <p className="font-semibold">${offer.price}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-right">
                        <p className="text-xs text-gray-500 mb-1">{translations.discount}</p>
                        <p className="font-semibold text-green-600">{translations.off} {offer.discount}%</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <p className="text-sm text-gray-600 flex items-center justify-end">
                        <span>{offer.store?.name || '—'}</span>
                        <Store className="w-3.5 h-3.5 mx-1.5 mx-1.5 text-gray-400" />
                      </p>
                      <p className="text-sm text-gray-600 flex items-center justify-end">
                        <span>{offer.category?.name || '—'}</span>
                        <Tag className="w-3.5 h-3.5 mx-1.5 mx-1.5 text-gray-400" />
                      </p>
                    </div>

                    <button
                      className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center justify-end"
                      onClick={() => handleViewClick(offer)}
                    >
                      {translations.viewDetails}
                      <Eye className="w-3.5 h-3.5 mx-1 mx-1" />
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-500">
                {translations.noOffers}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedOffer?.title || ''}
        itemType="offer"
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Offer Modal */}
      {selectedOffer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={translations.editOffer}
        >
          <OfferEditForm
            offer={selectedOffer}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedOffer(null);
            }}
          />
        </Modal>
      )}

      {/* View Offer Modal */}
      {selectedOffer && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={selectedOffer.title}
        >
          <div className="space-y-6">
            {/* Images Carousel */}
            {selectedOffer.images && selectedOffer.images.length > 0 && (
              <div className="mb-6">
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedOffer.images[0]}
                    alt={selectedOffer.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                {selectedOffer.images.length > 1 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {selectedOffer.images.map((image, index) => (
                      <div
                        key={index}
                        className="h-16 bg-gray-100 rounded border-2 border-transparent hover:border-indigo-500 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${selectedOffer.title} image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.price}</h4>
                <p className="text-xl font-semibold">${selectedOffer.price}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.discount}</h4>
                <p className="text-xl font-semibold text-green-600">{selectedOffer.discount}%</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.description}</h4>
              <p className="text-gray-800 whitespace-pre-line">{selectedOffer.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.storesTitle}</h4>
                <p className="text-gray-800">{selectedOffer.store?.name || '—'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.categoriesTitle}</h4>
                <p className="text-gray-800">{selectedOffer.category?.name || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.status}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedOffer.isActive !== false
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {selectedOffer.isActive !== false ? translations.active : translations.inactive}
                </span>
              </div>
              {selectedOffer.contentId && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.contentId}</h4>
                  <p className="text-gray-800 font-mono text-sm">{selectedOffer.contentId}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedOffer.startDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.startDate}</h4>
                  <p className="text-gray-800">
                    {new Date(selectedOffer.startDate).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              )}
              {selectedOffer.endDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">{translations.endDate}</h4>
                  <p className="text-gray-800">
                    {new Date(selectedOffer.endDate).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 gap-reverse mt-4">
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                {translations.cancel}
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditClick(selectedOffer);
                }}
                icon={<Edit size={16} className="mx-1" />}
              >
                {translations.edit}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Error Toast for Delete Operation */}
      {deleteMutation.isError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1"><svg className="h-6 w-6 text-red-500 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div>
              <p className="font-bold">{translations.deleteFailed}</p>
              <p className="text-sm">{translations.unableToDelete}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Page
const StoresAndOffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'stores' | 'categories'>('offers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(false);

  // Set up responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <BarChart4 className="mx-3 text-indigo-600" />
            {translations.businessDashboard}
          </h1>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="secondary"
              icon={<Menu size={18} className="mx-1" />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? translations.hideMenu : translations.menu}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Tabs for Desktop */}
          <div className="hidden md:flex overflow-x-auto border-b border-gray-200">
            <Tab
              active={activeTab === 'offers'}
              icon={<Package size={18} />}
              label={translations.offers}
              onClick={() => setActiveTab('offers')}
            />
            <Tab
              active={activeTab === 'stores'}
              icon={<Store size={18} />}
              label={translations.stores}
              onClick={() => setActiveTab('stores')}
            />
            <Tab
              active={activeTab === 'categories'}
              icon={<Tag size={18} />}
              label={translations.categories}
              onClick={() => setActiveTab('categories')}
            />
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-b border-gray-200`}>
            <div className="flex flex-col">
              <Tab
                active={activeTab === 'offers'}
                icon={<Package size={18} />}
                label={translations.offers}
                onClick={() => {
                  setActiveTab('offers');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
              <Tab
                active={activeTab === 'stores'}
                icon={<Store size={18} />}
                label={translations.stores}
                onClick={() => {
                  setActiveTab('stores');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
              <Tab
                active={activeTab === 'categories'}
                icon={<Tag size={18} />}
                label={translations.categories}
                onClick={() => {
                  setActiveTab('categories');
                  setIsMobileMenuOpen(false);
                }}
                mobileView={true}
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'offers' && <OffersTab />}
            {activeTab === 'stores' && <StoresTab />}
            {activeTab === 'categories' && <CategoriesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresAndOffersPage;