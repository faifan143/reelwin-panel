import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "./api";
import { Button } from "./Button";
import { CustomSelect } from "./CustomSelect";
import { Input } from "./Input";
import { translations } from "./translations";
import { Category, Offer, Store } from "./types";

// OfferEditForm component
export const OfferEditForm: React.FC<{
    offer: Offer;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ offer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: offer.title,
        description: offer.description,
        price: String(offer.price),
        discount: String(offer.discount),
        storeId: offer.storeId,
        categoryId: offer.categoryId,
        contentId: offer.contentId || '',
        isActive: offer.isActive !== false, // Default to true if not specified
        startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
        endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
    });

    // Changed to array of Files for better manipulation
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // Keep track of existing images from the server
    const [existingImages, setExistingImages] = useState<string[]>(offer.images || []);

    const [selectedContent, setSelectedContent] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: api.getCategories
    });

    const { data: stores } = useQuery<Store[]>({
        queryKey: ['stores'],
        queryFn: api.getStores
    });

    const { data: content, isLoading: contentLoading } = useQuery<any[]>({
        queryKey: ["content"],
        queryFn: api.getContent,
    });

    // Load selected content if contentId exists
    useEffect(() => {
        if (content && offer.contentId) {
            const found = content.find(item => item.id === offer.contentId);
            if (found) {
                setSelectedContent(found);
            }
        }
    }, [content, offer.contentId]);

    // Generate image previews when new files are selected
    useEffect(() => {
        if (newFiles.length === 0) {
            setNewImagePreviews([]);
            return;
        }

        // Generate previews for each file
        const generatePreviews = async () => {
            const previews = await Promise.all(
                newFiles.map((file) => {
                    return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (e.target?.result) {
                                resolve(e.target.result as string);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                })
            );
            setNewImagePreviews(previews);
        };

        generatePreviews();
    }, [newFiles]);

    const mutation = useMutation({
        mutationFn: (data: FormData) => api.updateOffer(offer.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            onSuccess();
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        // Handle checkbox special case
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle selection of new images
    const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert FileList to array and add to existing new files
            const additionalFiles = Array.from(e.target.files);
            setNewFiles(prev => [...prev, ...additionalFiles]);

            // Important: Reset the file input value after processing
            // This allows the user to select the same file again if needed
            // and ensures the change event will fire even if selecting the same files
            e.target.value = '';
        }
    };

    // Remove all new images
    const handleRemoveAllNewImages = () => {
        setNewFiles([]);
        setNewImagePreviews([]);

        // Reset the file input
        const fileInput = document.getElementById('images-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Remove a single new image by index
    const handleRemoveSingleNewImage = (indexToRemove: number) => {
        setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Remove a single existing image by index
    const handleRemoveExistingImage = (indexToRemove: number) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleContentSelect = (option: any) => {
        setSelectedContent(option ? option.content : null);
        setFormData(prev => ({ ...prev, contentId: option ? option.content.id : '' }));
    };

    // Format content options for react-select
    const getSelectOptions = () => {
        return content?.map(item => ({
            value: item.id,
            label: item.title,
            content: item
        })) || [];
    };

    // Custom styles for react-select
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: '#d1d5db',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#9ca3af',
            }
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 50,
        }),
        option: (provided: any) => ({
            ...provided,
            padding: '8px 12px',
        }),
    };

    // Custom Option component
    const CustomOption = ({ innerProps, data, isSelected }: any) => {
        const contentItem = data.content;
        return (
            <div
                {...innerProps}
                className={`p-2 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
            >
                <div className="font-semibold">{contentItem.title}</div>
                <div className="text-gray-600 text-sm truncate">
                    {contentItem.description.length > 50
                        ? `${contentItem.description.substring(0, 50)}...`
                        : contentItem.description}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                    {contentItem.ownerType} • {contentItem.type}
                </div>
            </div>
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();

        // Add all form fields to FormData
        for (const [key, value] of Object.entries(formData)) {
            if (value !== undefined && value !== null && value !== '') {
                submitData.append(key, String(value));
            }
        }

        // Add existing images that weren't removed
        existingImages.forEach((imageUrl, index) => {
            submitData.append(`images[${index}]`, imageUrl);
        });

        // Add new images
        if (newFiles.length > 0) {
            newFiles.forEach(file => {
                submitData.append('images', file);
            });
        }

        mutation.mutate(submitData);
    };

    const categoryOptions = categories?.map(category => ({
        value: category.id,
        label: category.name
    })) || [];

    const storeOptions = stores?.map(store => ({
        value: store.id,
        label: store.name
    })) || [];

    return (
        <div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
                <Input
                    label={translations.title}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={translations.price}
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={translations.discount}
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                />
                <CustomSelect
                    label={translations.categoriesTitle}
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    options={categoryOptions}
                    placeholder={translations.selectCategory}
                    required
                />
                <CustomSelect
                    label={translations.storesTitle}
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleChange}
                    options={storeOptions}
                    placeholder={translations.selectStore}
                    required
                />

                {/* Content ID Selection */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.contentIdOptional}
                    </label>
                    <Select
                        options={getSelectOptions()}
                        isLoading={contentLoading}
                        isClearable
                        onChange={handleContentSelect}
                        placeholder="ابحث عن المحتوى..."
                        styles={customStyles}
                        filterOption={(option, inputValue) => {
                            const contentItem = option.data.content;
                            return (
                                contentItem.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                contentItem.description.toLowerCase().includes(inputValue.toLowerCase())
                            );
                        }}
                        components={{
                            DropdownIndicator: () => <Search size={16} className="mx-2 text-gray-400" />,
                            Option: CustomOption
                        }}
                        classNames={{
                            control: () => "min-h-10",
                            valueContainer: () => "px-2 py-1",
                        }}
                        value={selectedContent ? {
                            value: selectedContent.id,
                            label: selectedContent.title,
                            content: selectedContent
                        } : null}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        اختر محتوى معين أو اتركه فارغاً
                    </p>
                </div>

                <div className="sm:col-span-2 flex items-center justify-end">
                    <label className="inline-flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mx-2"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        {translations.active}
                    </label>
                </div>

                <Input
                    label={`${translations.startDate} (${translations.optional})`}
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                />

                <Input
                    label={`${translations.endDate} (${translations.optional})`}
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                />

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.description} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition-all duration-200 text-right"
                        required
                        dir="rtl"
                    />
                </div>

                {/* Current Images Display */}
                {existingImages.length > 0 && (
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            {translations.currentImages}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {existingImages.map((image, index) => (
                                <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                    <img
                                        src={image}
                                        alt={`Offer image ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        onClick={() => handleRemoveExistingImage(index)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images Section */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.addMoreImages}
                    </label>

                    {newImagePreviews.length > 0 ? (
                        <div className="mb-4">
                            <div className="relative">
                                {/* New Image Preview Gallery */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={preview}
                                                alt={`New image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Add button to remove individual new image */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                onClick={() => handleRemoveSingleNewImage(index)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Remove Button for all new images */}
                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllNewImages}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <X size={14} className="mx-1" />
                                        {translations.removeAll}
                                    </button>
                                    <p className="text-sm text-gray-600">
                                        {translations.selectedFiles}: {newFiles.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex justify-center text-sm text-gray-600">
                                <label
                                    htmlFor="images-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>{translations.uploadFile}</span>
                                    <input
                                        id="images-upload"
                                        name="images-upload"
                                        type="file"
                                        multiple
                                        className="sr-only"
                                        onChange={handleNewImagesChange}
                                        accept="image/*"
                                    />
                                </label>
                                <p className="pr-1">{translations.orDragDrop}</p>
                            </div>
                            <p className="text-xs text-gray-500">{translations.fileTypes}</p>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 gap-reverse mt-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        type="button"
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? translations.saving : translations.save}
                    </Button>
                </div>
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-3 text-sm text-right">{translations.updateFailed}</p>
            )}
        </div>
    );
};