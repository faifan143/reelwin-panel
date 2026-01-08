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
import { PriceTypeFilter } from "../PriceTypeFilter";
import { PriceTypeStatistics } from "../PriceTypeStatistics";
import { translations } from "../translations";
import { Category, Offer, CURRENCY_SYMBOLS } from "../types";

// Enhanced OffersTab component
export const OffersTab: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [priceTypeFilter, setPriceTypeFilter] = useState<string>(''); // Add price type filter
    const [showStats, setShowStats] = useState(false); // Add stats toggle
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
        queryKey: ['offers', categoryFilter, priceTypeFilter], // Add price type to query key
        queryFn: () => api.getOffers(categoryFilter, priceTypeFilter) // Pass both filters
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
                <h2 className="text-xl font-semibold flex items-center text-white">
                    <Package className="mx-2 text-purple-400" /> {translations.offersTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        onClick={() => setShowStats(!showStats)}
                        variant={showStats ? "primary" : "secondary"}
                        size="sm"
                    >
                        {showStats ? 'إخفاء الإحصائيات' : 'عرض الإحصائيات'}
                    </Button>
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="pr-10 pl-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 text-right"
                            dir="rtl"
                        >
                            <option value="" className="bg-slate-700">{translations.allCategories}</option>
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-slate-700">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <PriceTypeFilter
                        selectedPriceType={priceTypeFilter}
                        onPriceTypeChange={setPriceTypeFilter}
                    />
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        icon={showForm ? null : <Plus className="w-5 h-5" />}
                        variant={showForm ? "secondary" : "primary"}
                    >
                        {showForm ? translations.hideForm : translations.addOffer}
                    </Button>
                </div>
            </div>

            {showForm && (
                <OfferForm onSuccess={() => setShowForm(false)} />
            )}

            {showStats && (
                <div className="mb-6">
                    <PriceTypeStatistics />
                </div>
            )}

            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <ErrorDisplay message={translations.errorOffers} />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-hidden rounded-xl border border-slate-700/50 shadow-xl">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-800/60">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-right text-sm font-semibold text-slate-300">
                                        {translations.title}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.price}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.priceAfterDiscount}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.discountPercentage}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.storesTitle}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-300">
                                        {translations.categoriesTitle}
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                        <span className="sr-only">{translations.view}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
                                {offers && offers.length > 0 ? (
                                    offers.map((offer) => (
                                        <tr key={offer.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                                            <td className="py-4 pl-6 pr-3 text-sm font-medium text-white text-right">
                                                {offer.title}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-200 text-right">
                                                <span className="font-medium">
                                                    {offer.price} {CURRENCY_SYMBOLS[offer.priceType || 'SYP']}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-200 text-right">
                                                <span className="font-medium text-blue-400">
                                                    {offer.priceAfterDiscount !== undefined ? 
                                                        `${offer.priceAfterDiscount} ${CURRENCY_SYMBOLS[offer.priceType || 'SYP']}`
                                                        : `${offer.price} ${CURRENCY_SYMBOLS[offer.priceType || 'SYP']}`
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                    {offer.priceAfterDiscount !== undefined && offer.price > offer.priceAfterDiscount ? 
                                                        `${(((offer.price - offer.priceAfterDiscount) / offer.price) * 100).toFixed(1)}%`
                                                        : '0%'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-300 text-right">
                                                {offer.store?.name || '—'}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-300 text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                    {offer.category?.name || '—'}
                                                </span>
                                            </td>
                                            <td className="py-4 pl-3 pr-6 text-left text-sm font-medium">
                                                <div className="flex justify-start gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Eye className="w-5 h-5" />}
                                                        onClick={() => handleViewClick(offer)}
                                                    >
                                                        {translations.view}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Edit className="w-5 h-5" />}
                                                        onClick={() => handleEditClick(offer)}
                                                    >
                                                        {translations.edit}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        icon={<Trash className="w-5 h-5" />}
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
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
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
                                <Card key={offer.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium transition-all"
                                                    onClick={() => handleEditClick(offer)}
                                                >
                                                    <Edit className="w-5 h-5" />
                                                    <span className="text-sm">تعديل</span>
                                                </button>
                                                <button
                                                    className="px-3 py-2 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 font-medium transition-all"
                                                    onClick={() => handleDeleteClick(offer)}
                                                >
                                                    <Trash className="w-5 h-5" />
                                                    <span className="text-sm">حذف</span>
                                                </button>
                                            </div>
                                            <h3 className="font-medium text-white flex-1 text-right truncate">{offer.title}</h3>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            <div className="bg-slate-700/50 p-2 rounded-xl text-right border border-slate-600/50">
                                                <p className="text-xs text-slate-400 mb-1">{translations.price}</p>
                                                <p className="font-semibold text-slate-200">
                                                    {offer.price} {CURRENCY_SYMBOLS[offer.priceType || 'SYP']}
                                                </p>
                                            </div>
                                            <div className="bg-blue-500/20 p-2 rounded-xl text-right border border-blue-500/30">
                                                <p className="text-xs text-slate-400 mb-1">{translations.priceAfterDiscount}</p>
                                                <p className="font-semibold text-blue-400">
                                                    {offer.priceAfterDiscount !== undefined ? 
                                                        `${offer.priceAfterDiscount} ${CURRENCY_SYMBOLS[offer.priceType || 'SYP']}`
                                                        : `${offer.price} ${CURRENCY_SYMBOLS[offer.priceType || 'SYP']}`
                                                    }
                                                </p>
                                            </div>
                                            <div className="bg-green-500/20 p-2 rounded-xl text-right border border-green-500/30">
                                                <p className="text-xs text-slate-400 mb-1">{translations.discountPercentage}</p>
                                                <p className="font-semibold text-green-400">
                                                    {offer.priceAfterDiscount !== undefined && offer.price > offer.priceAfterDiscount ? 
                                                        `${(((offer.price - offer.priceAfterDiscount) / offer.price) * 100).toFixed(1)}%`
                                                        : '0%'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1.5">
                                            <p className="text-sm text-slate-300 flex items-center justify-end">
                                                <span>{offer.store?.name || '—'}</span>
                                                <StoreIcon className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
                                            </p>
                                            <p className="text-sm text-slate-300 flex items-center justify-end">
                                                <span>{offer.category?.name || '—'}</span>
                                                <Tag className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
                                            </p>
                                        </div>

                                        <button
                                            className="mt-3 px-3 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium transition-all w-full"
                                            onClick={() => handleViewClick(offer)}
                                        >
                                            <Eye className="w-5 h-5" />
                                            <span className="text-sm">{translations.viewDetails}</span>
                                        </button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-slate-400">
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
                                <div className="relative h-64 bg-slate-700/50 rounded-xl overflow-hidden border border-slate-600/50">
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
                                                className="h-16 bg-slate-700/50 rounded-xl border-2 border-transparent hover:border-blue-500 cursor-pointer overflow-hidden"
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

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.price}</h4>
                                <p className="text-xl font-semibold text-white">
                                    {selectedOffer.price} {CURRENCY_SYMBOLS[selectedOffer.priceType || 'SYP']}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.priceAfterDiscount}</h4>
                                <p className="text-xl font-semibold text-blue-400">
                                    {selectedOffer.priceAfterDiscount !== undefined ? 
                                        `${selectedOffer.priceAfterDiscount} ${CURRENCY_SYMBOLS[selectedOffer.priceType || 'SYP']}`
                                        : `${selectedOffer.price} ${CURRENCY_SYMBOLS[selectedOffer.priceType || 'SYP']}`
                                    }
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.discountPercentage}</h4>
                                <p className="text-xl font-semibold text-green-400">
                                    {selectedOffer.priceAfterDiscount !== undefined && selectedOffer.price > selectedOffer.priceAfterDiscount ? 
                                        `${(((selectedOffer.price - selectedOffer.priceAfterDiscount) / selectedOffer.price) * 100).toFixed(1)}%`
                                        : '0%'
                                    }
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.description}</h4>
                            <p className="text-slate-200 whitespace-pre-line">{selectedOffer.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.storesTitle}</h4>
                                <p className="text-white">{selectedOffer.store?.name || '—'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.categoriesTitle}</h4>
                                <p className="text-white">{selectedOffer.category?.name || '—'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.status}</h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedOffer.isActive !== false
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    }`}>
                                    {selectedOffer.isActive !== false ? translations.active : translations.inactive}
                                </span>
                            </div>
                            {selectedOffer.contentId && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.contentId}</h4>
                                    <p className="text-slate-300 font-mono text-sm">{selectedOffer.contentId}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {selectedOffer.startDate && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.startDate}</h4>
                                    <p className="text-white">
                                        {new Date(selectedOffer.startDate).toLocaleDateString('ar-EG')}
                                    </p>
                                </div>
                            )}
                            {selectedOffer.endDate && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-1">{translations.endDate}</h4>
                                    <p className="text-white">
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
                                icon={<Edit className="w-5 h-5" />}
                            >
                                {translations.edit}
                            </Button>
                        </div>
                    </div>
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
