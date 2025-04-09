// components/StatusBadge.tsx
import React from 'react';
import { RewardStatus } from './types';

interface StatusBadgeProps {
    status: RewardStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case RewardStatus.PENDING:
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    label: 'قيد الانتظار'
                };
            case RewardStatus.FULFILLED:
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    label: 'تم التنفيذ'
                };
            case RewardStatus.CANCELLED:
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    label: 'ملغي'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    label: 'غير معروف'
                };
        }
    };

    const { bg, text, label } = getStatusConfig();

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {label}
        </span>
    );
};