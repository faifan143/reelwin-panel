import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { translations } from '../translations';
import { StoreCategory } from '../types'; // Assuming you have a type for StoreCategory
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { Modal } from '../Modal';
import { StatusMessage } from '../../content/StatusMessage'; // Reusing StatusMessage

export const StoreCategoriesTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch store categories
    const { data: storeCategories, isLoading, isError, error } = useQuery<StoreCategory[]>({
        queryKey: ['storeCategories'],
        queryFn: api.getStoreCategories,
    });

    // Mutation for creating a category
    const createMutation = useMutation({
        mutationFn: api.createStoreCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeCategories'] });
            setNewCategoryName('');
            setStatusMessage({ type: 'success', message: translations.addCategorySuccess });
            setTimeout(() => setStatusMessage(null), 3000);
        },
        onError: (err) => {
            setStatusMessage({ type: 'error', message: translations.addCategoryError });
            console.error("Error creating store category:", err);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    });

    // Mutation for updating a category
    const updateMutation = useMutation({
        mutationFn: ({ id, name, isActive }: { id: string; name?: string; isActive?: boolean }) => api.updateStoreCategory(id, { name, isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeCategories'] });
            setEditingCategory(null);
            setStatusMessage({ type: 'success', message: translations.updateCategorySuccess });
            setTimeout(() => setStatusMessage(null), 3000);
        },
        onError: (err) => {
            setStatusMessage({ type: 'error', message: translations.updateCategoryError });
            console.error("Error updating store category:", err);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    });

    // Mutation for deleting a category
    const deleteMutation = useMutation({
        mutationFn: api.deleteStoreCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeCategories'] });
            setShowDeleteModal(false);
            setCategoryToDelete(null);
            setStatusMessage({ type: 'success', message: translations.deleteCategorySuccess });
            setTimeout(() => setStatusMessage(null), 3000);
        },
        onError: (err) => {
            setStatusMessage({ type: 'error', message: translations.deleteCategoryError });
            console.error("Error deleting store category:", err);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            createMutation.mutate({ name: newCategoryName });
        }
    };

    const handleUpdateSubmit = () => {
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, name: editingCategory.name, isActive: editingCategory.isActive });
        }
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete);
        }
    };

    if (isLoading) return <p>{translations.loading}</p>;
    if (isError) return <p>{translations.error}: {error?.message}</p>;

    return (
        <div className="space-y-6" dir="rtl">
            {statusMessage && (
                <StatusMessage type={statusMessage.type} message={statusMessage.message} />
            )}
            {/* Add New Store Category Form */}
            <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <h3 className="text-lg font-medium mb-4 text-white text-right">
                    {translations.addNewStoreCategory}
                </h3>
                <form onSubmit={handleCreateSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                        <Input
                            label={translations.categoryName}
                            name="newCategory" // Changed name for clarity
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={translations.categoryNamePlaceholder}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={createMutation.isPending} className="shrink-0 mt-auto">
                        {createMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {translations.addCategory}
                    </Button>
                </form>
            </Card>

            {/* Store Categories List */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <h3 className="text-lg font-medium mb-4 text-white text-right">
                    {translations.storeCategoriesTitle}
                </h3>
                {storeCategories && storeCategories.length === 0 ? (
                    <p className="text-slate-400 text-right">{translations.noStoreCategories}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-800/60">
                                <tr>

                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        {translations.name}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        {translations.status}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        {translations.actions}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                                {storeCategories?.map(category => (
                                    <tr key={category.id} className="hover:bg-slate-700/30 transition-colors">

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            {editingCategory?.id === category.id ? (
                                                <Input
                                                    name="editCategoryName"
                                                    value={editingCategory.name}
                                                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                    required
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {editingCategory?.id === category.id ? (
                                                <input
                                                    type="checkbox"
                                                    checked={editingCategory.isActive}
                                                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                                                    className="h-5 w-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                                                />
                                            ) : (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${category.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                                    {category.isActive ? translations.active : translations.inactive}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingCategory?.id === category.id ? (
                                                <div className="flex gap-2">
                                                    <Button onClick={handleUpdateSubmit} disabled={updateMutation.isPending} size="sm">
                                                        {updateMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Edit className="w-5 h-5" />}
                                                        {translations.save}
                                                    </Button>
                                                    <Button onClick={() => setEditingCategory(null)} variant="secondary" size="sm">
                                                        {translations.cancel}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button onClick={() => setEditingCategory(category)} variant="secondary" size="sm">
                                                        <Edit className="w-5 h-5" />
                                                        {translations.edit}
                                                    </Button>
                                                    <Button onClick={() => handleDeleteClick(category.id)} variant="danger" size="sm">
                                                        <Trash className="w-5 h-5" />
                                                        {translations.delete}
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={translations.confirmDelete}
            >
                <p className="text-slate-200 mb-4 text-right">
                    {translations.sureDelete} <span className="font-semibold">{storeCategories?.find(cat => cat.id === categoryToDelete)?.name}</span>?
                </p>
                <p className="text-red-400 text-sm mb-4 text-right">
                    {translations.deleteWarning}
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => setShowDeleteModal(false)}
                        variant="secondary"
                        disabled={deleteMutation.isPending}
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="danger"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash className="w-5 h-5" />}
                        {translations.delete}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}; 