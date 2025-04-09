import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building, Edit, Plus, ShoppingBag, Store as StoreIcon, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "../api";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ErrorDisplay } from "../ErrorDisplay";
import { LoadingSpinner } from "../LoadingSpinner";
import { StoreEditForm } from "../StoreEditForm";
import { StoreForm } from "../StoreForm";
import { translations } from "../translations";
import { Store } from "../types";
import { Button } from "../Button";
import { Card } from "../Card";
import { Modal } from "../Modal";

// Enhanced StoresTab component
export const StoresTab: React.FC = () => {
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
                    <StoreIcon className="mx-2 text-indigo-600" /> {translations.storesTitle}
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
                                                    <Building className="w-4 h-4 mx-2 " />
                                                </div>
                                                <div className="flex items-center justify-end text-gray-600">
                                                    <span>{store.address}</span>
                                                    <ShoppingBag className="w-4 h-4  mx-2" />
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
