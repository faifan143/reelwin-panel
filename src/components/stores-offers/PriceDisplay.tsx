import React from 'react';
import { PriceType, CURRENCY_SYMBOLS } from './types';

interface PriceDisplayProps {
    price: number;
    priceType: PriceType;
    className?: string;
    showCurrency?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
    price, 
    priceType, 
    className = '', 
    showCurrency = true 
}) => {
    const formatPrice = (value: number) => {
        // Format price with proper locale formatting
        return new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <span className={className}>
            {formatPrice(price)}
            {showCurrency && (
                <span className="mr-1">{CURRENCY_SYMBOLS[priceType]}</span>
            )}
        </span>
    );
};

// Hook to get currency information
export const useCurrency = (priceType: PriceType) => {
    return {
        symbol: CURRENCY_SYMBOLS[priceType],
        format: (price: number) => `${price} ${CURRENCY_SYMBOLS[priceType]}`,
    };
};
