// Store related types
export interface Store {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  image: string;
  longitude: number;
  latitude: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStoreDto {
  name: string;
  phone: string;
  city: string;
  address: string;
  image?: string;
  longitude: number;
  latitude: number;
}

export interface UpdateStoreDto {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  image?: string;
  longitude?: number;
  latitude?: number;
}

export interface QrCode {
  id: string;
  code: string;
  storeId: string;
  store?: Store;
  active: boolean;
  points: number;
  createdAt: string;
}

export interface QrCodeScan {
  id: string;
  qrCodeId: string;
  userId: string;
  user: {
    id: string;
    phone: string;
    name: string;
  };
  createdAt: string;
}

export interface QrCodeWithScans extends QrCode {
  scans: QrCodeScan[];
}

export interface CreateQrCodeDto {
  storeId: string;
  points: number;
}

export interface UpdateQrCodeDto {
  storeId?: string;
  points?: number;
}

export interface PaginatedQrCodesResponse {
  items: QrCode[];
  total: number;
  page: number;
  limit: number;
}
