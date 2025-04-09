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