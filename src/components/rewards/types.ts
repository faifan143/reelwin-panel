// types.ts
export interface Category {
  id: string;
  name: string;
  isActive: boolean;
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

export interface CommonProps {
  token?: string;
}
