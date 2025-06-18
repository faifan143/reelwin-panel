// API for store's reward management (using JWT from StoreAuthContext)
import axios from 'axios';
import { RewardStatus, UserReward } from '../rewards-managment/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function getStoreRewardRequests(storeId: string, status?: RewardStatus, jwt?: string): Promise<UserReward[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('storeId', storeId);
  const res = await axios.get(`${API_BASE}/rewards/admin/purchases?${params.toString()}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res.data;
}

export async function updateStoreRewardRequestStatus(id: string, status: RewardStatus, jwt?: string): Promise<UserReward> {
  const res = await axios.put(
    `${API_BASE}/rewards/admin/purchases/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return res.data;
}
