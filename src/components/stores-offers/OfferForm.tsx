import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "./api";
import { Button } from "./Button";
import { Card } from "./Card";
import { CustomSelect } from "./CustomSelect";
import { Input } from "./Input";
import { translations } from "./translations";
import { Category, Store, PriceType, CURRENCY_SYMBOLS, CURRENCY_NAMES } from "./types";

// OfferForm component
export const OfferForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        priceType: PriceType.SYP, // Add price type with default
        discount: '',
        storeId: '',
        categoryId: '',
        contentId: '',
    });

    // Changed to array of Files instead of FileList for better manipulation
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: api.getCategories
    });

    const { data: stores } = useQuery<Store[]>({
        queryKey: ['stores'],
        queryFn: api.getStores
    });

    const mutation = useMutation({
        mutationFn: api.createOffer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            setFormData({
                title: '',
                description: '',
                price: '',
                priceType: PriceType.SYP, // Reset to default
                discount: '',
                storeId: '',
                categoryId: '',
                contentId: '',
            });
            setSelectedFiles([]);
            setImagePreviews([]);
            onSuccess();
        }
    });

    // Add these interfaces to your component or import them
    interface Content {
        id: string;
        title: string;
        description: string;
        ownerType: 'INDIVIDUAL' | 'STORE';
        type: string;
        mediaUrls: Array<{
            type: string;
            url: string;
            poster?: string;
        }>;
    }

    interface ContentOption {
        value: string;
        label: string;
        content: Content;
    }

    // Add this inside your OfferForm component
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);

    const { data: content, isLoading: contentLoading } = useQuery<Content[]>({
        queryKey: ["content"],
        queryFn: api.getContent,
    });

    // Generate image previews whenever selectedFiles changes
    useEffect(() => {
        // Clear previews if no files
        if (selectedFiles.length === 0) {
            setImagePreviews([]);
            return;
        }

        // Generate previews for each file
        const generatePreviews = async () => {
            const previews = await Promise.all(
                selectedFiles.map((file) => {
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
            setImagePreviews(previews);
        };

        generatePreviews();
    }, [selectedFiles]);

    // Add these functions to your component
    const handleContentSelect = (option: ContentOption | null) => {
        setSelectedContent(option ? option.content : null);
        setFormData(prev => ({ ...prev, contentId: option ? option.content.id : '' }));
    };

    // Format content options for react-select
    const getSelectOptions = (): ContentOption[] => {
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
        option: (provided: any, state: any) => ({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Improved image handling - adds new files to existing selection
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert FileList to array and add to existing files
            const newFiles = Array.from(e.target.files);

            // Add new files to existing selection
            setSelectedFiles(prevFiles => {
                // Create a new array with all files
                const combinedFiles = [...prevFiles, ...newFiles];

                // Optional: You could check for duplicates here if needed
                // This would require comparing file names, sizes, etc.

                return combinedFiles;
            });
        }
    };

    // Remove a single image by index
    const handleRemoveSingleImage = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Clear all selected images
    const handleRemoveAllImages = () => {
        setSelectedFiles([]);
        setImagePreviews([]);

        // Reset the file input
        const fileInput = document.getElementById('images-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            if (value)
                submitData.append(key, value);
        }

        // Append all selected files
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
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

    // Price type options for dropdown
    const priceTypeOptions = Object.values(PriceType).map(type => ({
        value: type,
        label: `${CURRENCY_NAMES[type]} (${CURRENCY_SYMBOLS[type]})`
    }));

    return (
        <Card className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
                {translations.addNewOffer}
            </h3>
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
                <CustomSelect
                    label={translations.priceType}
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleChange}
                    options={priceTypeOptions}
                    placeholder={translations.selectPriceType}
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

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        {translations.images} <span className="text-red-500">*</span>
                    </label>

                    {/* Image previews (always show if there are any) */}
                    {imagePreviews.length > 0 && (
                        <div className="mb-4">
                            <div className="relative">
                                {/* Image Gallery */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                            {/* Added ability to remove individual images */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                onClick={() => handleRemoveSingleImage(index)}
                                            >
                                                <X size={14} />
                                            </button>

                                        </div>
                                    ))}
                                </div>

                                {/* Image count and remove button */}
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllImages}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <X size={14} className="mx-1" />
                                        {translations.removeAll}
                                    </button>
                                    <p className="text-sm text-gray-600">
                                        {translations.selectedFiles}: {selectedFiles.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Always show the upload button/area */}
                    <div className={`${imagePreviews.length > 0 ? 'border-2 border-dashed border-gray-300 rounded-lg p-4' : 'mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg'}`}>
                        <div className="space-y-1 text-center">
                            {imagePreviews.length === 0 ? (
                                // Full upload UI when no images are selected
                                <>
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
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-ring-indigo-500"
                                        >
                                            <span>{translations.uploadFile}</span>
                                            <input
                                                id="images-upload"
                                                name="images-upload"
                                                type="file"
                                                multiple
                                                className="sr-only"
                                                onChange={handleImagesChange}
                                                required={selectedFiles.length === 0}
                                                accept="image/*"
                                            />
                                        </label>
                                        <p className="pr-1">{translations.orDragDrop}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{translations.fileTypes}</p>
                                </>
                            ) : (
                                // Compact upload button when images are already selected
                                <div className="flex justify-center">
                                    <label
                                        htmlFor="images-upload"
                                        className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Upload size={16} className="ml-2" />
                                        {translations.addMoreImages}
                                        <input
                                            id="images-upload"
                                            name="images-upload"
                                            type="file"
                                            multiple
                                            className="sr-only"
                                            onChange={handleImagesChange}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2 mt-2 text-right">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        icon={<Plus size={18} className="mx-1" />}
                    >
                        {mutation.isPending ? translations.adding : translations.addOffer}
                    </Button>
                </div>
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
            )}
        </Card>
    );
};