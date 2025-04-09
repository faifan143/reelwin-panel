// types.ts
export enum RewardStatus {
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    CANCELLED = 'CANCELLED'
}

export interface Category {
    id: string;
    name: string;
    isActive: boolean;
    rewards?: Reward[];
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    pointsCost: number;
    categoryId: string;
    isActive: boolean;
    category?: Category;
}

export interface User {
    id: string;
    name: string;
    phone: string;
}

export interface UserReward {
    id: string;
    userId: string;
    rewardId: string;
    pointsSpent: number;
    status: RewardStatus;
    createdAt: string;
    user?: User;
    reward?: Reward;
}

export interface CreateCategoryDto {
    name: string;
    isActive?: boolean;
}

export interface UpdateCategoryDto {
    name?: string;
    isActive?: boolean;
}

export interface CreateRewardDto {
    title: string;
    description: string;
    pointsCost: number;
    categoryId: string;
    isActive?: boolean;
}

export interface UpdateRewardDto {
    title?: string;
    description?: string;
    pointsCost?: number;
    categoryId?: string;
    isActive?: boolean;
}

export interface PurchaseRewardDto {
    rewardId: string;
}

export interface UpdateUserRewardStatusDto {
    status: RewardStatus;
}
