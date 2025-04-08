// types/store.ts
export interface Store {
    id: string;
    name: string;
    phone: string;
    image?: string;
    city: string;
    address: string;
    longitude: number;
    latitude: number;
    createdAt?: string;
    updatedAt?: string;
    _count?: {
      offers: number;
      contents: number;
    };
  }
  
  export interface StoreFormData {
    name: string;
    phone: string;
    city: string;
    address: string;
    longitude: number;
    latitude: number;
  }
  
  export interface StoreFilterData {
    name?: string;
    city?: string;
  }
  
  // types/offer.ts
  export interface OfferCategory {
    id: string;
    name: string;
    _count?: {
      offers: number;
    };
  }
  
  export interface Offer {
    id: string;
    title: string;
    description: string;
    images?: string[];
    price: number;
    discount: number;
    categoryId: string;
    storeId: string;
    contentId?: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: OfferCategory;
    store?: Store;
  }
  
  export interface OfferFormData {
    title: string;
    description: string;
    price: number;
    discount: number;
    categoryId: string;
    storeId: string;
    contentId?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }
  
  export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
  }
  
  export interface OfferFilterData {
    categoryId?: string;
    storeId?: string;
    isActive?: boolean;
    contentId?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    priceSort?: SortOrder;
    minDiscount?: number;
    maxDiscount?: number;
    fromDate?: string;
    toDate?: string;
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
    page?: number;
    limit?: number;
  }
  
  export interface CategoryFormData {
    name: string;
  }
  
  export interface CategoryFilterData {
    name?: string;
  }