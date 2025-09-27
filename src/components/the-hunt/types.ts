export type HuntStatus = "DRAFT" | "ACTIVE" | "COMPLETED";

export interface Hunt {
  id: string;
  storeId: string;
  name: string;
  winnersTarget: number;
  gridRows: number;
  gridCols: number;
  codesPerTile: number;
  startsAt: string;
  endsAt: string;
  status: HuntStatus;
  createdAt: string;
  imageUrl?: string;
}

export interface PaginatedHuntsResponse {
  data: Hunt[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateHuntDto {
  storeId: string;
  image: File;
  name: string;
  winnersTarget: number;
  gridRows: number;
  gridCols: number;
  codesPerTile: number;
  startsAt: string; // ISO
  endsAt: string; // ISO
}

export interface UpdateHuntStatusDto {
  status: HuntStatus;
}

export interface RegeneratePdfsDto {
  tiles?: number[];
  replaceOld?: boolean;
}
