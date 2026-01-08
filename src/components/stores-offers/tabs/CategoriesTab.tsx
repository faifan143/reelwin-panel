import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Tag, Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "../api";
import { CategoryEditForm } from "../CategoryEditForm";
import { CategoryForm } from "../CategoryForm";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ErrorDisplay } from "../ErrorDisplay";
import { LoadingSpinner } from "../LoadingSpinner";
import { translations } from "../translations";
import { Category } from "../types";
import { Button } from "../Button";
import { Card } from "../Card";
import { Modal } from "../Modal";

// Enhanced CategoriesTab component
export const CategoriesTab: React.FC = () => {
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
                <h2 className="text-xl font-semibold flex items-center text-white">
                    <Tag className="mx-2 text-purple-400" /> {translations.categoriesTitle}
                </h2>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    icon={showForm ? null : <Plus className="w-5 h-5" />}
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
                    <div className="hidden md:block overflow-hidden rounded-xl border border-slate-700/50 shadow-xl">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-800/60">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-slate-300">
                                        {translations.categoryName}
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                        <span className="sr-only">{translations.view}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                                            <td className="py-4 pl-6 pr-3 text-sm font-medium text-white text-right">
                                                {category.name}
                                            </td>
                                            <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                                                <div className="flex justify-start gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Edit className="w-5 h-5" />}
                                                        onClick={() => handleEditClick(category)}
                                                    >
                                                        {translations.edit}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        icon={<Trash className="w-5 h-5" />}
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
                                        <td colSpan={3} className="py-8 text-center text-slate-400">
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
                                <Card key={category.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium transition-all min-w-[100px]"
                                                onClick={() => handleEditClick(category)}
                                            >
                                                <Edit className="w-5 h-5" />
                                                <span className="text-sm">تعديل</span>
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 font-medium transition-all min-w-[100px]"
                                                onClick={() => handleDeleteClick(category)}
                                            >
                                                <Trash className="w-5 h-5" />
                                                <span className="text-sm">حذف</span>
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="font-medium text-white mb-1">{category.name}</h3>
                                            <p className="text-sm text-slate-400">{translations.id}: <span className="font-mono bg-slate-700/50 px-1.5 py-0.5 rounded text-xs text-slate-300">{category.id.substring(0, 8)}...</span></p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-slate-400">
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
                <div className="fixed bottom-4 right-4 bg-red-500/20 border-l-4 border-red-500/50 text-red-400 p-4 rounded-xl shadow-lg backdrop-blur-sm">
                    <div className="flex">
                        <div className="py-1"><svg className="h-6 w-6 text-red-400 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
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