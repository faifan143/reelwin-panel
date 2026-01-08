// components/tabs/CategoriesTab.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash, Plus, Package } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import {

    Category, CreateCategoryDto, UpdateCategoryDto
} from '../types';
import { getCategories, createCategory, updateCategory, deleteCategory, deleteCategoryAndRewards } from '../api';

const CategoriesTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CreateCategoryDto | UpdateCategoryDto>({
        name: '',
        isActive: true,
    });

    // Get all categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            resetAndCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            resetAndCloseModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Handlers
    const handleOpenModal = (category?: Category) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                isActive: category.isActive,
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const resetAndCloseModal = () => {
        setSelectedCategory(null);
        setFormData({
            name: '',
            isActive: true,
        });
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            updateMutation.mutate({ id: selectedCategory.id, data: formData });
        } else {
            createMutation.mutate(formData as CreateCategoryDto);
        }
    };

    const handleDelete = (id: string) => {
        const category = categories.find((cat) => cat.id === id);
        if (!category) return;
        if (category.rewards && category.rewards.length > 0) {
            if (window.confirm('هذه الفئة تحتوي على مكافآت. هل أنت متأكد أنك تريد حذف الفئة وجميع مكافآتها؟')) {
                deleteCategoryAndRewards(category).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                });
            }
        } else {
            if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
                deleteCategory(id);
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = e.target.checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    if (isLoading) {
        return <div className="text-center py-4 text-slate-300">جاري التحميل...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">فئات المكافآت</h2>
                <Button
                    onClick={() => handleOpenModal()}
                    icon={<Plus size={16} />}
                >
                    إضافة فئة
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden shadow-xl rounded-xl border border-slate-700/50">
                <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-slate-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                الاسم
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                عدد المكافآت
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{category.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-200 font-semibold">{category.rewards?.length || 0}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${category.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                        {category.isActive ? 'مفعل' : 'غير مفعل'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-2 rtl:gap-reverse">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={<Edit size={16} />}
                                            onClick={() => handleOpenModal(category)}
                                        >
                                            تعديل
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={<Trash size={16} />}
                                            onClick={() => handleDelete(category.id)}
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
                {categories.map((category) => (
                    <div key={category.id} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-xl">
                        <div className="flex justify-between">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${category.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                {category.isActive ? 'مفعل' : 'غير مفعل'}
                            </span>
                            <h3 className="text-lg font-medium text-white">{category.name}</h3>
                        </div>
                        <div className="mt-3 flex items-center">
                            <Package size={16} className="text-blue-400 mx-1" />
                            <span className="text-sm font-medium text-slate-200">{category.rewards?.length || 0} مكافأة</span>
                        </div>
                        <div className="mt-4 flex gap-2 rtl:gap-reverse">
                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth
                                icon={<Edit size={16} />}
                                onClick={() => handleOpenModal(category)}
                            >
                                تعديل
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                fullWidth
                                icon={<Trash size={16} />}
                                onClick={() => handleDelete(category.id)}
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
                title={selectedCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1">
                                الاسم
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="py-2 px-3 w-full rounded-xl border border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive as boolean}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700/50 rounded"
                            />
                            <label htmlFor="isActive" className="mx-2 block text-sm text-slate-200">
                                مفعل
                            </label>
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
                            {createMutation.isPending || updateMutation.isPending ? (
                                'جاري الحفظ...'
                            ) : selectedCategory ? (
                                'تحديث'
                            ) : (
                                'حفظ'
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CategoriesTab;