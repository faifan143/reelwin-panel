import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Search, Gift, Send, X } from 'lucide-react';
import { api } from '../api';
import { useQuery, useMutation } from '@tanstack/react-query';

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

interface GemGenerationResponse {
    success: boolean;
    message: string;
    gem: {
        contentId: string;
        contentTitle: string;
        points: number;
        mediaUrls: Array<{
            type: string;
            url: string;
            poster?: string;
        }>;
    };
}

// Define interface for Select options that matches what react-select expects
interface ContentOption {
    value: string;
    label: string;
    content: Content;
}

interface GenerateGemParams {
    contentId?: string;
    points: number;
}

const GemGenerationDropdown: React.FC = () => {
    const [contents, setContents] = useState<Content[]>([]);
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [points, setPoints] = useState<number>(10);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [generatedGem, setGeneratedGem] = useState<GemGenerationResponse['gem'] | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch content using useQuery
    const { data: content, isLoading } = useQuery<Content[]>({
        queryKey: ["content"],
        queryFn: async () => {
            const response = await api.get(`/content`);
            return response.data;
        }
    });

    // Generate gem mutation - Fixed to use proper API call
    const mutation = useMutation({
        mutationFn: async (params: GenerateGemParams) => {
            // Use the proper API function that handles params correctly
            const url = `/content/generate-gem`;
            const queryParams: Record<string, any> = {
                points: params.points
            };

            if (params.contentId) {
                queryParams.contentId = params.contentId;
            }

            // Send an empty object as body, with params in the config
            const response = await api.post(url, {}, { params: queryParams });
            return response.data;
        },
        onSuccess: (data: GemGenerationResponse) => {
            if (data.success) {
                setGeneratedGem(data.gem);
                setSuccessModalVisible(true);
                setSelectedContent(null);
                setPoints(10);
            } else {
                setErrorMessage(data.message || 'فشل في إنشاء الجوهرة');
            }
        },
        onError: (error: any) => {
            console.error("API Error:", error);
            setErrorMessage(error.response?.data?.message || 'فشل في إنشاء الجوهرة');
        }
    });

    useEffect(() => {
        if (content) {
            const sortedContents = content.sort((a: Content, b: Content) =>
                a.title.localeCompare(b.title)
            );
            setContents(sortedContents);
        }
    }, [content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const payload: GenerateGemParams = { points };
        if (selectedContent) {
            payload.contentId = selectedContent.id;
        }

        mutation.mutate(payload);
    };

    const handleContentSelect = (option: ContentOption | null) => {
        setSelectedContent(option ? option.content : null);
    };

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        setGeneratedGem(null);
    };

    // Format content options for react-select
    const getSelectOptions = (): ContentOption[] => {
        return contents.map(content => ({
            value: content.id,
            label: content.title,
            content: content
        }));
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
        const content = data.content;
        return (
            <div
                {...innerProps}
                className={`p-2 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
            >
                <div className="font-semibold">{content.title}</div>
                <div className="text-gray-600 text-sm truncate">
                    {content.description.length > 50
                        ? `${content.description.substring(0, 50)}...`
                        : content.description}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                    {content.ownerType} • {content.type}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full" dir="rtl">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center text-xl font-bold mb-2">
                    <Gift className="ml-2" size={24} />
                    <h2>إنشاء جوهرة</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    إنشاء جواهر للمحتوى التي ستكافئ المستخدمين عند مشاهدة المحتوى
                </p>

                <div className="border-t border-gray-200 my-4"></div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اختر المحتوى
                        </label>
                        <Select
                            options={getSelectOptions()}
                            isLoading={isLoading}
                            isClearable
                            onChange={handleContentSelect}
                            placeholder="ابحث عن المحتوى..."
                            styles={customStyles}
                            filterOption={(option, inputValue) => {
                                const content = option.data.content;
                                return (
                                    content.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                    content.description.toLowerCase().includes(inputValue.toLowerCase())
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
                            اختر محتوى معين أو اتركه فارغاً للاختيار العشوائي
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            نقاط الجوهرة
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={points}
                            onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
                            placeholder="أدخل القيمة"
                            required
                        />
                    </div>

                    {selectedContent && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-sm">
                                <span className="font-medium">المحتوى المختار:</span> {selectedContent.title}
                            </p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {mutation.isPending ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -mr-1 ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري المعالجة...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Send size={16} className="ml-2" />
                                إنشاء جوهرة
                            </span>
                        )}
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            {successModalVisible && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/75 backdrop-md transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="absolute top-0 left-0 pt-4 pl-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={closeSuccessModal}
                                >
                                    <span className="sr-only">إغلاق</span>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Gift className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            تم إنشاء الجوهرة بنجاح
                                        </h3>
                                        {generatedGem && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-500 mb-2">
                                                    <span className="font-medium">المحتوى:</span> {generatedGem.contentTitle}
                                                </p>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    <span className="font-medium">النقاط:</span> {generatedGem.points}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-4">
                                                    سيتم منح هذه الجوهرة لأول مستخدم يشاهد هذا المحتوى.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeSuccessModal}
                                >
                                    موافق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GemGenerationDropdown;