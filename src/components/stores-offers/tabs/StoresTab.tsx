import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building, Edit, Plus, ShoppingBag, Store as StoreIcon, Trash, Tag, Filter } from "lucide-react";
import { useState } from "react";
import { api } from "../api";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ErrorDisplay } from "../ErrorDisplay";
import { LoadingSpinner } from "../LoadingSpinner";
import { StoreEditForm } from "../StoreEditForm";
import { StoreForm } from "../StoreForm";
import { translations } from "../translations";
import { Category, Store, StoreCategory } from "../types";
import { Button } from "../Button";
import { Card } from "../Card";
import { Modal } from "../Modal";

// Enhanced StoresTab component with categories
export const StoresTab: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');

    const queryClient = useQueryClient();

    const { data: stores, isLoading, isError } = useQuery<Store[]>({
        queryKey: ['stores'],
        queryFn: api.getStores
    });

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['store-categories'],
        queryFn: api.getCategories
    });

    console.log("stores are : ", stores);

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

    // Filter stores by category
    const filteredStores = stores?.filter(store => {
        if (!selectedCategoryFilter) return true;
        return store.categoryId === selectedCategoryFilter;
    });

    // Get category name helper function
    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId || !categories) return 'غير محدد';
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || 'غير محدد';
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center text-white">
                    <StoreIcon className="mx-2 text-blue-400" /> {translations.storesTitle}
                </h2>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    icon={showForm ? null : <Plus className="w-5 h-5" />}
                    variant={showForm ? "secondary" : "primary"}
                >
                    {showForm ? translations.hideForm : translations.addStore}
                </Button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-slate-300">
                        <Filter className="w-4 h-4 mx-2" />
                        <span className="text-sm font-medium">تصفية حسب الفئة:</span>
                    </div>
                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dir="rtl"
                    >
                        <option value="" className="bg-slate-700">جميع الفئات</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id} className="bg-slate-700">
                                {category.name}
                            </option>
                        ))}
                        <option value="uncategorized" className="bg-slate-700">غير مصنف</option>
                    </select>
                    {selectedCategoryFilter && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedCategoryFilter('')}
                        >
                            إزالة التصفية
                        </Button>
                    )}
                </div>
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
                    <div className="hidden md:block overflow-hidden rounded-xl border border-slate-700/50 shadow-xl">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-800/60">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-slate-300">
                                        {translations.storeName}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        الفئة
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.city}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.phone}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.address}
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                        <span className="sr-only">{translations.view}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
                                {filteredStores && filteredStores.length > 0 ? (
                                    filteredStores.map((store) => (
                                        <tr key={store.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                                            <td className="py-4 pl-6 pr-3 text-sm font-medium text-white text-right">
                                                {store.name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-right">
                                                <div className="flex items-center justify-end">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${store.categoryId
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                                        }`}>
                                                        <Tag className="w-3 h-3 ml-1" />
                                                        {getCategoryName(store.categoryId ?? "")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-300 text-right">
                                                {store.city}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-300 text-right">
                                                {store.phone}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-300 text-right">
                                                {store.address}
                                            </td>
                                            <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                                                <div className="flex justify-start gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Edit className="w-5 h-5" />}
                                                        onClick={() => handleEditClick(store)}
                                                    >
                                                        {translations.edit}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        icon={<Trash className="w-5 h-5" />}
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
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            {selectedCategoryFilter ? 'لا توجد متاجر في هذه الفئة' : translations.noStores}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {filteredStores && filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                                <Card key={store.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium transition-all min-w-[100px]"
                                                onClick={() => handleEditClick(store)}
                                            >
                                                <Edit className="w-5 h-5" />
                                                <span className="text-sm">تعديل</span>
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 font-medium transition-all min-w-[100px]"
                                                onClick={() => handleDeleteClick(store)}
                                            >
                                                <Trash className="w-5 h-5" />
                                                <span className="text-sm">حذف</span>
                                            </button>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <h3 className="font-medium text-white mb-2">{store.name}</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center justify-end mb-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${store.categoryId
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                                        }`}>
                                                        <Tag className="w-3 h-3 ml-1" />
                                                        {getCategoryName(store.categoryId ?? "")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-end text-slate-300">
                                                    <span>{store.city}</span>
                                                    <Building className="w-4 h-4 mx-2 text-slate-400" />
                                                </div>
                                                <div className="flex items-center justify-end text-slate-300">
                                                    <span>{store.address}</span>
                                                    <ShoppingBag className="w-4 h-4 mx-2 text-slate-400" />
                                                </div>
                                                <p className="text-slate-300">
                                                    <span className="font-medium">{translations.phone}:</span> {store.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-slate-400">
                                {selectedCategoryFilter ? 'لا توجد متاجر في هذه الفئة' : translations.noStores}
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