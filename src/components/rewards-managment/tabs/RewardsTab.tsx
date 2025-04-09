// components/tabs/RewardsTab.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash, Plus, Award } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { getRewards, getCategories, createReward, updateReward, deleteReward } from '../api';
import { Reward, CreateRewardDto, UpdateRewardDto } from '../types';

const RewardsTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [formData, setFormData] = useState<CreateRewardDto | UpdateRewardDto>({
        title: '',
        description: '',
        pointsCost: 0,
        categoryId: '',
        isActive: true,
    });

    // Get all rewards and categories
    const { data: rewards = [], isLoading: isLoadingRewards } = useQuery({
        queryKey: ['rewards'],
        queryFn: () => getRewards(),
    });

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createReward,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            resetAndCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRewardDto }) =>
            updateReward(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            resetAndCloseModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReward,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
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
            });
        } else {
            setSelectedReward(null);
            setFormData({
                title: '',
                description: '',
                pointsCost: 0,
                categoryId: categories[0]?.id || '',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const resetAndCloseModal = () => {
        setSelectedReward(null);
        setFormData({
            title: '',
            description: '',
            pointsCost: 0,
            categoryId: '',
            isActive: true,
        });
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedReward) {
            updateMutation.mutate({ id: selectedReward.id, data: formData });
        } else {
            createMutation.mutate(formData as CreateRewardDto);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المكافأة؟')) {
            deleteMutation.mutate(id);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    if (isLoadingRewards || isLoadingCategories) {
        return <div className="text-center py-4">جاري التحميل...</div>;
    }

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">المكافآت</h2>
                <Button
                    onClick={() => handleOpenModal()}
                    icon={<Plus size={16} />}
                >
                    إضافة مكافأة
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                العنوان
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الوصف
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                التكلفة (النقاط)
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الفئة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rewards.map((reward) => (
                            <tr key={reward.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{reward.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500 line-clamp-2">{reward.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{reward.pointsCost}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{reward.category?.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reward.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {reward.isActive ? 'مفعل' : 'غير مفعل'}
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
                        <div className="flex justify-between">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${reward.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {reward.isActive ? 'مفعل' : 'غير مفعل'}
                            </span>
                            <h3 className="text-lg font-medium">{reward.title}</h3>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">{reward.description}</p>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center">
                                <Award size={16} className="text-blue-500 mx-1" />
                                <span className="text-sm font-medium">{reward.pointsCost} نقطة</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {reward.category?.name}
                            </div>
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
                title={selectedReward ? 'تعديل المكافأة' : 'إضافة مكافأة جديدة'}
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

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive as boolean}
                                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="mx-2 block text-sm text-gray-900">
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
                            ) : selectedReward ? (
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

export default RewardsTab;