// Content related types
export interface MediaItem {
  type: "IMAGE" | "VIDEO";
  url: string;
  poster?: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  image: string;
  longitude: number;
  latitude: number;
}

export interface ContentStats {
  likedBy: number;
  viewedBy: number;
  whatsappedBy: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  ownerName: string | null;
  ownerNumber: string | null;
  ownerType: "INDIVIDUAL" | "STORE";
  storeId: string | null;
  store?: {
    id: string;
    name: string;
  };
  type: "REEL";
  intervalHours: number;
  endValidationDate: string;
  mediaUrls: MediaItem[];
  interests: Interest[];
  createdAt: string;
  _count?: ContentStats;
}

export interface ContentFormData {
  title: string;
  description: string;
  ownerType: "INDIVIDUAL" | "STORE";
  ownerName: string;
  ownerNumber: string;
  storeId: string;
  intervalHours: number;
  endValidationDate: string;
  interestIds: string[];
  type: "REEL";
}

export interface SearchFilters {
  ownerName?: string;
  ownerNumber?: string;
  type?: "REEL";
  interestId?: string;
}
