// components/tabs/VersionsTab.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, DownloadCloud, Plus, RefreshCw, X } from 'lucide-react';
import React, { useState } from 'react';
import { clearVersions, createVersion, getLatestVersion } from '../api';
import { CreateVersionDto } from '../types';

const VersionsTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<CreateVersionDto>({
        version: '',
        isRequired: false,
    });

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
            setIsModalOpen(false);
            resetForm();
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
        createVersionMutation.mutate(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
                        onClick={() => setIsModalOpen(true)}
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

            {/* Create Version Modal - Dark Theme */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50">
                        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white bg-slate-700/50 rounded-lg p-2 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-lg font-bold text-right text-white">{t.newVersion}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-200 mb-2 text-right">
                                    {t.version}
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                                    placeholder={t.versionFormat}
                                    required
                                />
                            </div>
                            <div className="mb-6 flex items-center justify-end">
                                <input
                                    type="checkbox"
                                    id="isRequired"
                                    name="isRequired"
                                    checked={formData.isRequired}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700/50"
                                />
                                <label htmlFor="isRequired" className="mr-2 block text-sm text-slate-200">
                                    {t.isRequired}
                                </label>
                            </div>
                            <div className="flex justify-start gap-3">
                                <button
                                    type="submit"
                                    disabled={createVersionMutation.isPending}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createVersionMutation.isPending ? t.adding : t.addNew}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 border border-slate-600/50 transition-all font-semibold"
                                >
                                    {t.cancel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionsTab;