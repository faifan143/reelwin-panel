// types.ts
export enum RewardStatus {
  PENDING = "PENDING",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
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
  images?: string[]; // Public URLs
  stock?: number; // Available quantity
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
  storeId?: string;
  stock?: number; // Defaults to 0 if omitted
  isRadar?: boolean;
}

export interface UpdateRewardDto {
  title?: string;
  description?: string;
  pointsCost?: number;
  categoryId?: string;
  isActive?: boolean;
  storeId?: string;
  stock?: number;
  isRadar?: boolean;
  // When replacing/removing images, send the final array you want to keep
  images?: string[];
}

export interface PurchaseRewardDto {
  rewardId: string;
}

export interface UpdateUserRewardStatusDto {
  status: RewardStatus;
}
