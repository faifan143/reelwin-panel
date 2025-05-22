import React from 'react';
import { Filter } from 'lucide-react';
import { PriceType, CURRENCY_SYMBOLS, CURRENCY_NAMES } from './types';

interface PriceTypeFilterProps {
    selectedPriceType: string;
    onPriceTypeChange: (priceType: string) => void;
    className?: string;
}

export const PriceTypeFilter: React.FC<PriceTypeFilterProps> = ({
    selectedPriceType,
    onPriceTypeChange,
    className = ''
}) => {
    const priceTypeOptions = [
        { value: '', label: 'جميع العملات' },
        ...Object.values(PriceType).map(type => ({
            value: type,
            label: `${CURRENCY_NAMES[type]} (${CURRENCY_SYMBOLS[type]})`
        }))
    ];

    return (
        <div className={`relative ${className}`}>
            <select
                value={selectedPriceType}
                onChange={(e) => onPriceTypeChange(e.target.value)}
                className="pr-10 pl-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-200 text-right min-w-48"
                dir="rtl"
            >
                {priceTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
    );
};
