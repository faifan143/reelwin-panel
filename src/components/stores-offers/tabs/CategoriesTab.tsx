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