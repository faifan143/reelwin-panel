import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Filter, Package, Plus, Store as StoreIcon, Tag, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "../api";
import { Button } from "../Button";
import { Card } from "../Card";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { ErrorDisplay } from "../ErrorDisplay";
import { LoadingSpinner } from "../LoadingSpinner";
import { Modal } from "../Modal";
import { OfferEditForm } from "../OfferEditForm";
import { OfferForm } from "../OfferForm";
import { translations } from "../translations";
import { Category, Offer } from "../types";

// Enhanced OffersTab component
export const OffersTab: React.FC = () => {
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
                                                <span className="font-medium">{offer.price} ليرة</span>
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
                                                <StoreIcon className="w-3.5 h-3.5 mx-1.5  text-gray-400" />
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center justify-end">
                                                <span>{offer.category?.name || '—'}</span>
                                                <Tag className="w-3.5 h-3.5  mx-1.5 text-gray-400" />
                                            </p>
                                        </div>

                                        <button
                                            className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center justify-end"
                                            onClick={() => handleViewClick(offer)}
                                        >
                                            {translations.viewDetails}
                                            <Eye className="w-3.5 h-3.5 mx-1 " />
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
