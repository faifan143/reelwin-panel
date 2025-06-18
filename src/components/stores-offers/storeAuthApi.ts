// API functions for store owner authentication (phone + OTP)
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function requestStoreOtp(phone: string) {
  return axios.post(`${API_BASE}/stores/auth/request-otp`, { phone });
}

export async function verifyStoreOtp(phone: string, otp: string) {
  return axios.post(`${API_BASE}/stores/auth/verify-otp`, { phone, otp });
}
