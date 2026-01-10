// components/tabs/VersionsTab.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, DownloadCloud, Plus, RefreshCw, X } from 'lucide-react';
import React, { useState } from 'react';
import { clearVersions, createVersion, getLatestVersion } from '../api';
import { CreateVersionDto } from '../types';

interface VersionsTabProps {
    onOpenCreate?: () => void;
    onCloseCreate?: () => void;
    formData?: CreateVersionDto;
    onFormDataChange?: (data: CreateVersionDto) => void;
    onSubmit?: (e: React.FormEvent) => void;
    isSubmitting?: boolean;
}

const VersionsTab: React.FC<VersionsTabProps> = ({ 
    onOpenCreate,
    onCloseCreate,
    formData: externalFormData,
    onFormDataChange,
    onSubmit: externalOnSubmit,
    isSubmitting: externalIsSubmitting
}) => {
    const queryClient = useQueryClient();
    const [internalFormData, setInternalFormData] = useState<CreateVersionDto>({
        version: '',
        isRequired: false,
    });
    
    // Use external form data if provided (controlled), otherwise use internal state
    const formData = externalFormData ?? internalFormData;
    const isControlled = externalFormData !== undefined;

    // Query to fetch the latest version
    const { data: latestVersion, isLoading, isError } = useQuery({
        queryKey: ['latest-version'],
        queryFn: getLatestVersion,
    });

    // Mutation to add a new version
    const createVersionMutation = useMutation({
        mutationFn: createVersion,
            onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['latest-version'] });
            resetForm();
            onCloseCreate?.(); // Call parent callback to close modal
        },
    });

    // Mutation to clear all versions
    const clearVersionsMutation = useMutation({
        mutationFn: clearVersions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['latest-version'] });
        },
    });

    const resetForm = () => {
        setFormData({
            version: '',
            isRequired: false,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (externalOnSubmit) {
            externalOnSubmit(e);
        } else {
            createVersionMutation.mutate(formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        };
        
        if (onFormDataChange) {
            onFormDataChange(newData);
        } else {
            setInternalFormData(newData);
        }
    };

    const handleClearVersions = () => {
        if (window.confirm('هل أنت متأكد من حذف جميع إصدارات التطبيق؟')) {
            clearVersionsMutation.mutate();
        }
    };

    // Translations (Arabic)
    const t = {
        versionManagement: 'إدارة إصدارات التطبيق',
        addVersion: 'إضافة إصدار جديد',
        clearVersions: 'حذف الإصدارات',
        version: 'الإصدار',
        isRequired: 'تحديث إجباري',
        addNew: 'إضافة',
        adding: 'جاري الإضافة...',
        cancel: 'إلغاء',
        status: 'الحالة',
        required: 'إجباري',
        optional: 'اختياري',
        currentVersion: 'الإصدار الحالي',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ في تحميل البيانات',
        noVersion: 'لم يتم تعيين إصدار بعد',
        versionFormat: 'مثال: 1.0.0',
        createdAt: 'تاريخ الإضافة',
        updatingRequired: 'يجب على المستخدمين التحديث إلى هذا الإصدار',
        updatingOptional: 'التحديث إلى هذا الإصدار اختياري',
        newVersion: 'إصدار جديد',
        clearing: 'جاري الحذف...',
    };

    // Format date in Arabic
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-slate-800 p-4 rounded-2xl">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <DownloadCloud className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{t.versionManagement}</h2>
                        <p className="text-slate-400 text-sm mt-0.5">إدارة إصدارات التطبيق والتحديثات</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onOpenCreate?.()}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 font-semibold"
                    >
                        <Plus size={18} />
                        {t.addVersion}
                    </button>
                    <button
                        onClick={handleClearVersions}
                        disabled={clearVersionsMutation.isPending}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={18} className={clearVersionsMutation.isPending ? "animate-spin" : ""} />
                        {clearVersionsMutation.isPending ? t.clearing : t.clearVersions}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="mr-2 text-slate-400">{t.loading}</span>
                </div>
            ) : isError ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-right">
                    <p>{t.error}</p>
                </div>
            ) : (
                <>
                    {/* Version Card - Dark Theme */}
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden mb-6">
                        <div className="p-5 border-b border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white text-right">{t.currentVersion}</h3>
                        </div>
                        {latestVersion ? (
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                                        latestVersion.isRequired
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                                        }`}>
                                        {latestVersion.isRequired ? (
                                            <>
                                                <AlertTriangle size={16} className="ml-1" />
                                                {t.required}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} className="ml-1" />
                                                {t.optional}
                                            </>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-xl font-bold text-white">{latestVersion.version}</h4>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {formatDate(latestVersion.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-slate-300 mt-4 text-right p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    {latestVersion.isRequired ? t.updatingRequired : t.updatingOptional}
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                {t.noVersion}
                            </div>
                        )}
                    </div>

                    {/* Instructions Card - Dark Theme */}
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                        <div className="p-5 border-b border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white text-right">إرشادات تحديث الإصدار</h3>
                        </div>
                        <div className="p-5">
                            <ul className="list-disc list-inside space-y-2 text-slate-300 text-right">
                                <li>إضافة إصدار جديد سيغير الإصدار الحالي للتطبيق</li>
                                <li>الإصدارات الإجبارية ستجبر المستخدمين على التحديث قبل استخدام التطبيق</li>
                                <li>يجب أن تكون صيغة الإصدار متوافقة مع نظام الإصدارات الدلالي (مثل 1.0.0)</li>
                                <li>حذف الإصدارات سيزيل جميع معلومات الإصدار من النظام</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Modal rendering moved to page level */}
        </div>
    );
};

export default VersionsTab;