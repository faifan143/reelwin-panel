// components/tabs/VersionsTab.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, DownloadCloud, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { getLatestVersion, createVersion, clearVersions } from '../api';
import { CreateVersionDto } from '../types';
import { Button } from '@/components/rewards-managment/Button';

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
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <DownloadCloud className="ml-2 text-indigo-600" size={24} />
                    {t.versionManagement}
                </h2>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        icon={<Plus size={16} />}
                    >
                        {t.addVersion}
                    </Button>
                    <Button
                        onClick={handleClearVersions}
                        variant="danger"
                        disabled={clearVersionsMutation.isPending}
                        icon={<RefreshCw size={16} />}
                    >
                        {clearVersionsMutation.isPending ? t.clearing : t.clearVersions}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="mr-2 text-gray-600">{t.loading}</span>
                </div>
            ) : isError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-right">
                    <p>{t.error}</p>
                </div>
            ) : (
                <>
                    {/* Version Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 text-right">{t.currentVersion}</h3>
                        </div>
                        {latestVersion ? (
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`flex items-center px-3 py-1 rounded-full text-sm ${latestVersion.isRequired
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
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
                                        <h4 className="text-xl font-semibold">{latestVersion.version}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDate(latestVersion.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mt-4 text-right">
                                    {latestVersion.isRequired ? t.updatingRequired : t.updatingOptional}
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {t.noVersion}
                            </div>
                        )}
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 text-right">إرشادات تحديث الإصدار</h3>
                        </div>
                        <div className="p-5">
                            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right">
                                <li>إضافة إصدار جديد سيغير الإصدار الحالي للتطبيق</li>
                                <li>الإصدارات الإجبارية ستجبر المستخدمين على التحديث قبل استخدام التطبيق</li>
                                <li>يجب أن تكون صيغة الإصدار متوافقة مع نظام الإصدارات الدلالي (مثل 1.0.0)</li>
                                <li>حذف الإصدارات سيزيل جميع معلومات الإصدار من النظام</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Create Version Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                &times;
                            </button>
                            <h3 className="text-lg font-medium text-right text-gray-900">{t.newVersion}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    {t.version}
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-right"
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
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isRequired" className="mr-2 block text-sm text-gray-900">
                                    {t.isRequired}
                                </label>
                            </div>
                            <div className="flex justify-start gap-3">
                                <Button
                                    type="submit"
                                    disabled={createVersionMutation.isPending}
                                    fullWidth
                                >
                                    {createVersionMutation.isPending ? t.adding : t.addNew}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsModalOpen(false)}
                                    fullWidth
                                >
                                    {t.cancel}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionsTab;