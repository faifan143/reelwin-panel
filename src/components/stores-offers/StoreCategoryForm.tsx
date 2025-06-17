import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Tag, Trash, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { api } from "./api";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { StoreCategory } from "./types";
import { Input } from "./Input";
import { Button } from "./Button";
import { Card } from "./Card";
import { Modal } from "./Modal";

// Store Category Form Component
const StoreCategoryForm: React.FC<{
    category?: StoreCategory;
    onSuccess: () => void;
    onCancel?: () => void;
}> = ({ category, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        isActive: category?.isActive ?? true,
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { name: string; isActive: boolean }) => {
            if (category) {
                return api.updateStoreCategory(category.id, data);
            } else {
                return api.createStoreCategory(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['store-categories'] });
            setFormData({ name: '', isActive: true });
            onSuccess();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <Input
                label="اسم الفئة"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="مثال: مطاعم، ملابس، إلكترونيات"
            />

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        فئة نشطة
                    </span>
                </label>
            </div>

            <div className="flex gap-3 justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={mutation.isPending}
                    >
                        إلغاء
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    icon={<Plus size={18} className="mx-1" />}
                >
                    {mutation.isPending
                        ? (category ? 'جاري التحديث...' : 'جاري الإضافة...')
                        : (category ? 'تحديث الفئة' : 'إضافة فئة')}
                </Button>
            </div>

            {mutation.isError && (
                <p className="text-red-500 text-sm text-right">
                    {category ? 'فشل في تحديث الفئة' : 'فشل في إضافة الفئة'}
                </p>
            )}
        </form>
    );
};

// Main Store Categories Component
export const StoreCategoriesTab: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: categories, isLoading, isError } = useQuery<StoreCategory[]>({
        queryKey: ['store-categories'],
        queryFn: api.getStoreCategories
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteStoreCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['store-categories'] });
            queryClient.invalidateQueries({ queryKey: ['stores'] }); // Refresh stores too
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            api.updateStoreCategory(id, { isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['store-categories'] });
        }
    });

    const handleDeleteClick = (category: StoreCategory) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (category: StoreCategory) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleToggleStatus = (category: StoreCategory) => {
        toggleStatusMutation.mutate({
            id: category.id,
            isActive: !category.isActive
        });
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
                    <Tag className="mx-2 text-indigo-600" />
                    فئات المتاجر
                </h2>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    icon={showForm ? null : <Plus size={18} className="mx-1" />}
                    variant={showForm ? "secondary" : "primary"}
                >
                    {showForm ? 'إخفاء النموذج' : 'إضافة فئة جديدة'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
                        إضافة فئة متجر جديدة
                    </h3>
                    <StoreCategoryForm onSuccess={() => setShowForm(false)} />
                </Card>
            )}

            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <ErrorDisplay message="خطأ في تحميل فئات المتاجر" />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-gray-900">
                                        اسم الفئة
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                        الحالة
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                        عدد المتاجر
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                        تاريخ الإنشاء
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                        <span className="sr-only">الإجراءات</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 text-right">
                                                <div className="flex items-center justify-end">
                                                    <span>{category.name}</span>
                                                    <Tag className="w-4 h-4 mx-2 text-indigo-500" />
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {category.isActive ? 'نشط' : 'غير نشط'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                                {category.stores?.length || 0} متجر
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                                {new Date(category.createdAt).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                                                <div className="flex justify-start gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={category.isActive ? <EyeOff size={14} className="mx-1" /> : <Eye size={14} className="mx-1" />}
                                                        onClick={() => handleToggleStatus(category)}
                                                        disabled={toggleStatusMutation.isPending}
                                                    >
                                                        {category.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Edit size={14} className="mx-1" />}
                                                        onClick={() => handleEditClick(category)}
                                                    >
                                                        تعديل
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        icon={<Trash size={14} className="mx-1" />}
                                                        onClick={() => handleDeleteClick(category)}
                                                    >
                                                        حذف
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            لا توجد فئات متاجر
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
                                                className={`p-2 hover:bg-gray-50 rounded-full transition-colors duration-150 ${category.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                                onClick={() => handleToggleStatus(category)}
                                                disabled={toggleStatusMutation.isPending}
                                            >
                                                {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
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
                                        <div className="flex-1 text-right">
                                            <div className="flex items-center justify-end mb-2">
                                                <h3 className="font-medium text-gray-900">{category.name}</h3>
                                                <Tag className="w-4 h-4 mx-2 text-indigo-500" />
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center justify-end">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {category.isActive ? 'نشط' : 'غير نشط'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">عدد المتاجر:</span> {category.stores?.length || 0}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">تاريخ الإنشاء:</span> {new Date(category.createdAt).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-gray-500">
                                لا توجد فئات متاجر
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
                itemType="store_category"
                isDeleting={deleteMutation.isPending}
            />

            {/* Edit Category Modal */}
            {selectedCategory && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="تعديل فئة المتجر"
                >
                    <StoreCategoryForm
                        category={selectedCategory}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            setSelectedCategory(null);
                        }}
                        onCancel={() => setIsEditModalOpen(false)}
                    />
                </Modal>
            )}

            {/* Error Toast for Delete Operation */}
            {deleteMutation.isError && (
                <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-red-500 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">فشل في حذف الفئة</p>
                            <p className="text-sm">تعذر حذف فئة المتجر</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Toast for Toggle Status Operation */}
            {toggleStatusMutation.isError && (
                <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-red-500 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">فشل في تغيير حالة الفئة</p>
                            <p className="text-sm">تعذر تغيير حالة فئة المتجر</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};