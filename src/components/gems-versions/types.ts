// types.ts
export interface GenerateGemDto {
    points: number;
    contentId?: string;
}

export interface ContentGem {
    contentId: string;
    contentTitle: string;
    mediaUrls: string[];
    points: number;
    claimedByUserId?: string;
    claimedAt?: string;
    createdAt?: string;
}

export interface GemResponse {
    success: boolean;
    message: string;
    gem: ContentGem;
}

export interface CreateVersionDto {
    version: string;
    isRequired: boolean;
}

export interface Version {
    id?: string;
    version: string;
    isRequired: boolean;
    createdAt?: string;
}

// QR Code types
export enum QrCodeType {
    PERMANENT = 'PERMANENT',
    ONCE = 'ONCE'
}

export enum QrStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    COMPLETED = 'COMPLETED'
}

export interface QrCode {
    id: string;
    name: string;
    description?: string;
    type: QrCodeType;
    status: QrStatus;
    createdAt: string;
    updatedAt: string;
    reward1000Count: number;
    reward500Count: number;
    reward250Count: number;
    reward125Count: number;
}

export interface QrScan {
    id: string;
    qrCodeId: string;
    userId: string;
    points: number;
    scannedAt: string;
    user?: {
        id: string;
        name: string;
        phone: string;
        profilePhoto?: string;
    };
}

export interface QrCodeWithScans extends QrCode {
    scans: QrScan[];
    scansCount: number;
}

export interface PaginatedQrCodesResponse {
    data: QrCodeWithScans[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface CreateQrCodeDto {
    name: string;
    description?: string;
    type: QrCodeType;
    reward1000Count?: number;
    reward500Count?: number;
    reward250Count?: number;
    reward125Count?: number;
}

export interface UpdateQrCodeDto {
    name?: string;
    description?: string;
    type?: QrCodeType;
    reward1000Count?: number;
    reward500Count?: number;
    reward250Count?: number;
    reward125Count?: number;
}