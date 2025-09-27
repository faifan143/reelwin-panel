import { api } from "../gems-versions/api";
import {
  CreateHuntDto,
  Hunt,
  PaginatedHuntsResponse,
  RegeneratePdfsDto,
  UpdateHuntStatusDto,
} from "./types";

export const listHunts = async (
  page = 1,
  limit = 10,
  status?: string,
  storeId?: string
): Promise<PaginatedHuntsResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) params.set("status", status);
  if (storeId) params.set("storeId", storeId);
  const response = await api.get(`/hunts?${params.toString()}`);
  return response.data;
};

export const getHunt = async (huntId: string): Promise<Hunt> => {
  const response = await api.get(`/hunts/${huntId}`);
  return response.data;
};

export const createHunt = async (payload: CreateHuntDto): Promise<Hunt> => {
  const formData = new FormData();
  formData.append("storeId", payload.storeId);
  formData.append("image", payload.image);
  formData.append("name", payload.name);
  formData.append("winnersTarget", String(payload.winnersTarget));
  formData.append("gridRows", String(payload.gridRows));
  formData.append("gridCols", String(payload.gridCols));
  formData.append("codesPerTile", String(payload.codesPerTile));
  formData.append("startsAt", payload.startsAt);
  formData.append("endsAt", payload.endsAt);
  const response = await api.post("/hunts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateHuntStatus = async (
  huntId: string,
  status: UpdateHuntStatusDto
): Promise<Hunt> => {
  const response = await api.patch(`/hunts/${huntId}/status`, status);
  return response.data;
};

export const deleteHunt = async (huntId: string): Promise<void> => {
  await api.delete(`/hunts/${huntId}`);
};

export const getWinners = async (huntId: string): Promise<any> => {
  const response = await api.get(`/hunts/${huntId}/winners`);
  return response.data;
};

export const getLeaderboard = async (
  huntId: string,
  page = 1,
  limit = 10
): Promise<any> => {
  const response = await api.get(
    `/hunts/${huntId}/leaderboard?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const notifyWinners = async (huntId: string): Promise<any> => {
  const response = await api.post(`/hunts/${huntId}/winners/notify`);
  return response.data;
};

export const downloadAllPdfsZip = async (huntId: string): Promise<Blob> => {
  const response = await api.get(`/hunts/${huntId}/pdfs/zip`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadTilePdf = async (
  huntId: string,
  tileIndex: number
): Promise<Blob> => {
  const response = await api.get(`/hunts/${huntId}/pdfs/tile/${tileIndex}`, {
    responseType: "blob",
  });
  return response.data;
};

export const regeneratePdfs = async (
  huntId: string,
  payload: RegeneratePdfsDto
): Promise<Blob> => {
  const response = await api.post(`/hunts/${huntId}/regenerate-pdfs`, payload, {
    responseType: "blob",
  });
  return response.data;
};
