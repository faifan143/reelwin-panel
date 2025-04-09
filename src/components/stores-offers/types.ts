// Type definitions
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

