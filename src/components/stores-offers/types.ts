// Type definitions

// Add PriceType enum
export enum PriceType {
    SYP = 'SYP',
    USD = 'USD',
    EUR = 'EUR',
    TRY = 'TRY',
    GBP = 'GBP',
    SAR = 'SAR',
    AED = 'AED',
}

// Currency symbol mapping
export const CURRENCY_SYMBOLS: Record<PriceType, string> = {
    [PriceType.SYP]: 'ل.س',
    [PriceType.USD]: '$',
    [PriceType.EUR]: '€',
    [PriceType.TRY]: '₺',
    [PriceType.GBP]: '£',
    [PriceType.SAR]: 'ر.س',
    [PriceType.AED]: 'د.إ',
};

// Currency name mapping in Arabic
export const CURRENCY_NAMES: Record<PriceType, string> = {
    [PriceType.SYP]: 'الليرة السورية',
    [PriceType.USD]: 'الدولار الأمريكي',
    [PriceType.EUR]: 'اليورو',
    [PriceType.TRY]: 'الليرة التركية',
    [PriceType.GBP]: 'الجنيه الإسترليني',
    [PriceType.SAR]: 'الريال السعودي',
    [PriceType.AED]: 'الدرهم الإماراتي',
};

export interface Category {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Store {
    id: string;
    name: string;
    phone: string;
    city: string;
    address: string;
    longitude: string;
    latitude: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    price: number;
    priceType: PriceType; // Add price type
    discount: number;
    images: string[];
    storeId: string;
    categoryId: string;
    contentId?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
    store?: Store;
    category?: Category;
}

