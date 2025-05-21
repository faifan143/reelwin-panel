// Gems related types
export interface GenerateGemDto {
  points: number;
  contentId?: string;
}

export interface Gem {
  id: string;
  points: number;
  contentId?: string;
  createdAt: string;
}

export interface GemResponse {
  gem: Gem;
  message: string;
}

export interface ContentGem {
  id: string;
  contentId: string;
  content: {
    id: string;
    title: string;
  };
  points: number;
  createdAt: string;
}

export interface Version {
  id: string;
  version: string;
  mandatory: boolean;
  description: string;
  appUrl: string;
  createdAt: string;
}

export interface CreateVersionDto {
  version: string;
  mandatory: boolean;
  description: string;
  appUrl: string;
}
