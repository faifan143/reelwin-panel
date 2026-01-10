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

interface GemGenerationDropdownProps {
    onGemSuccess?: (gem: GemGenerationResponse['gem']) => void;
}

const GemGenerationDropdown: React.FC<GemGenerationDropdownProps> = ({ onGemSuccess }) => {
    const [contents, setContents] = useState<Content[]>([]);
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [points, setPoints] = useState<number>(10);
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
                onGemSuccess?.(data.gem);
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


    // Format content options for react-select
    const getSelectOptions = (): ContentOption[] => {
        return contents.map(content => ({
            value: content.id,
            label: content.title,
            content: content
        }));
    };

    // Custom styles for react-select - Dark Theme
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: state.isFocused ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
            color: '#f8fafc',
            '&:hover': {
                borderColor: '#3b82f6',
            }
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#1e293b',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            zIndex: 50,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? 'rgba(59, 130, 246, 0.2)' 
                : state.isFocused 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'transparent',
            color: '#f8fafc',
            padding: '8px 12px',
            '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#f8fafc',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#f8fafc',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#64748b',
        }),
    };

    // Custom Option component - Dark Theme
    const CustomOption = ({ innerProps, data, isSelected }: any) => {
        const content = data.content;
        return (
            <div
                {...innerProps}
                className={`p-2 cursor-pointer hover:bg-slate-700/50 ${isSelected ? 'bg-blue-500/20' : ''}`}
            >
                <div className="font-semibold text-white">{content.title}</div>
                <div className="text-slate-300 text-sm truncate">
                    {content.description.length > 50
                        ? `${content.description.substring(0, 50)}...`
                        : content.description}
                </div>
                <div className="text-slate-400 text-xs mt-1">
                    {content.ownerType} • {content.type}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-slate-800 p-4 rounded-2xl" dir="rtl">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">إنشاء جوهرة</h2>
                        <p className="text-slate-400 text-sm">
                            إنشاء جواهر للمحتوى التي ستكافئ المستخدمين عند مشاهدة المحتوى
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-700/50 my-6"></div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                DropdownIndicator: () => <Search size={16} className="mx-2 text-slate-400" />,
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
                        <p className="text-xs text-slate-400 mt-2">
                            اختر محتوى معين أو اتركه فارغاً للاختيار العشوائي
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                            نقاط الجوهرة
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={points}
                            onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
                            className="mt-1 block w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 text-right"
                            placeholder="أدخل القيمة"
                            required
                        />
                    </div>

                    {selectedContent && (
                        <div className="mb-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                            <p className="text-sm text-slate-200">
                                <span className="font-medium text-blue-400">المحتوى المختار:</span> {selectedContent.title}
                            </p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-blue-500/20 transition-all"
                    >
                        {mutation.isPending ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -mr-1 ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري المعالجة...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Send size={18} className="ml-2" />
                                إنشاء جوهرة
                            </span>
                        )}
                    </button>
                </form>
            </div>

            {/* Success Modal moved to page level */}
        </div>
    );
};

export default GemGenerationDropdown;