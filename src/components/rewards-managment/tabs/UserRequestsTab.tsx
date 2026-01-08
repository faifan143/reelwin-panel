// components/tabs/UserRequestsTab.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Calendar,
    Check,
    X,
    User,
    Phone,
    Award,
    Clock,
    ArrowUpDown,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { StatusBadge } from '../StatusBadge';
import { RewardStatus, UserReward } from '../types';
import { getAllUserRewards, updateUserRewardStatus } from '../api';

const UserRequestsTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<UserReward | null>(null);
    const [statusToUpdate, setStatusToUpdate] = useState<RewardStatus | null>(null);

    // Get all user requests
    const { data: userRequests = [], isLoading } = useQuery({
        queryKey: ['userRequests'],
        queryFn: () => getAllUserRewards(),
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: RewardStatus }) =>
            updateUserRewardStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userRequests'] });
            closeModal();
        },
    });

    // Filter only PENDING requests
    const pendingRequests = userRequests.filter(
        (request) => request.status === RewardStatus.PENDING
    );

    // Handlers
    const openConfirmModal = (request: UserReward, status: RewardStatus) => {
        setSelectedRequest(request);
        setStatusToUpdate(status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setStatusToUpdate(null);
        setIsModalOpen(false);
    };

    const confirmStatusUpdate = () => {
        if (selectedRequest && statusToUpdate) {
            updateStatusMutation.mutate({
                id: selectedRequest.id,
                status: statusToUpdate,
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (isLoading) {
        return <div className="text-center py-4 text-slate-300">جاري التحميل...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">طلبات المستخدمين</h2>
                <p className="text-slate-400 text-sm mt-1">
                    {pendingRequests.length} طلب في انتظار المراجعة
                </p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden shadow-xl rounded-xl border border-slate-700/50">
                <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-slate-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                المستخدم
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                المكافأة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                النقاط المستخدمة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                تاريخ الطلب
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                        {userRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-slate-300" />
                                        </div>
                                        <div className="mx-4">
                                            <div className="text-sm font-medium text-white">{request.user?.name}</div>
                                            <div className="text-sm text-slate-400 flex items-center">
                                                <Phone size={12} className="inline mx-1" />
                                                {request.user?.phone}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-white">{request.reward?.title}</div>
                                    <div className="text-xs text-slate-400">{request.reward?.category?.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-200 font-semibold">{request.pointsSpent} نقطة</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-300 flex items-center">
                                        <Calendar size={14} className="inline mx-1" />
                                        {formatDate(request.createdAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={request.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {request.status === RewardStatus.PENDING && (
                                        <div className="flex gap-2 rtl:gap-reverse">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                icon={<Check size={16} />}
                                                onClick={() => openConfirmModal(request, RewardStatus.FULFILLED)}
                                            >
                                                قبول
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                icon={<X size={16} />}
                                                onClick={() => openConfirmModal(request, RewardStatus.CANCELLED)}
                                            >
                                                رفض
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {userRequests.map((request) => (
                    <div key={request.id} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-xl">
                        <div className="flex justify-between items-center mb-3">
                            <StatusBadge status={request.status} />
                            <div className="flex items-center text-xs text-slate-400">
                                <Clock size={12} className="mx-1" />
                                {formatDate(request.createdAt)}
                            </div>
                        </div>

                        <div className="border-b border-slate-700/50 pb-2 mb-2">
                            <h3 className="text-md font-medium text-white">{request.reward?.title}</h3>
                            <p className="text-xs text-slate-400">{request.reward?.category?.name}</p>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center">
                                <Award size={16} className="text-blue-400 mx-1" />
                                <span className="text-sm font-medium text-slate-200">{request.pointsSpent} نقطة</span>
                            </div>
                        </div>

                        <div className="flex items-center py-2 border-t border-slate-700/50">
                            <div className="flex-shrink-0 h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center">
                                <User size={14} className="text-slate-300" />
                            </div>
                            <div className="mx-2">
                                <div className="text-sm font-medium text-white">{request.user?.name}</div>
                                <div className="text-xs text-slate-400 flex items-center">
                                    <Phone size={10} className="inline mx-1" />
                                    {request.user?.phone}
                                </div>
                            </div>
                        </div>

                        {request.status === RewardStatus.PENDING && (
                            <div className="mt-3 flex gap-2 rtl:gap-reverse">
                                <Button
                                    variant="success"
                                    size="sm"
                                    fullWidth
                                    icon={<Check size={16} />}
                                    onClick={() => openConfirmModal(request, RewardStatus.FULFILLED)}
                                >
                                    قبول
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    fullWidth
                                    icon={<X size={16} />}
                                    onClick={() => openConfirmModal(request, RewardStatus.CANCELLED)}
                                >
                                    رفض
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={
                    statusToUpdate === RewardStatus.FULFILLED
                        ? 'تأكيد قبول الطلب'
                        : 'تأكيد رفض الطلب'
                }
            >
                <div className="py-3">
                    <div className="flex items-center justify-center mb-4">
                        {statusToUpdate === RewardStatus.FULFILLED ? (
                            <CheckCircle size={48} className="text-green-500" />
                        ) : (
                            <XCircle size={48} className="text-red-500" />
                        )}
                    </div>

                    <p className="text-center text-slate-200 mb-4">
                        {statusToUpdate === RewardStatus.FULFILLED
                            ? 'هل أنت متأكد من قبول هذا الطلب؟'
                            : 'هل أنت متأكد من رفض هذا الطلب؟'}
                    </p>

                    {selectedRequest && (
                        <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600/50 mb-4">
                            <p className="text-sm font-medium text-slate-200">تفاصيل الطلب:</p>
                            <div className="mt-2 text-sm text-slate-300">
                                <p><span className="font-medium">المستخدم:</span> {selectedRequest.user?.name}</p>
                                <p><span className="font-medium">المكافأة:</span> {selectedRequest.reward?.title}</p>
                                <p><span className="font-medium">النقاط:</span> {selectedRequest.pointsSpent}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 rtl:gap-reverse">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            variant={statusToUpdate === RewardStatus.FULFILLED ? 'success' : 'danger'}
                            disabled={updateStatusMutation.isPending}
                            onClick={confirmStatusUpdate}
                        >
                            {updateStatusMutation.isPending
                                ? 'جاري التنفيذ...'
                                : statusToUpdate === RewardStatus.FULFILLED
                                    ? 'تأكيد القبول'
                                    : 'تأكيد الرفض'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserRequestsTab;