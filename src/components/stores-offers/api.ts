import useStore from "@/store";
import axios from "axios";

const API_BASE_URL = `https://anycode-sy.com/radar/api`;

// API functions
export const api = {
    // Categories
    getCategories: async () => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/offer-categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },
    getContent: async () => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/content`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },
    getCategory: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/offer-categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    createCategory: async (categoryData: { name: string }) => {
        const { token } = useStore.getState();
        const { data } = await axios.post(`${API_BASE_URL}/offer-categories`, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    },

    deleteCategory: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.delete(`${API_BASE_URL}/offer-categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    updateCategory: async (id: string, categoryData: { name: string }) => {
        const { token } = useStore.getState();
        const { data } = await axios.put(`${API_BASE_URL}/offer-categories/${id}`, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    },

    // Stores
    getStores: async () => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/stores`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    getStore: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/stores/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    createStore: async (storeData: FormData) => {
        const { token } = useStore.getState();
        const { data } = await axios.post(`${API_BASE_URL}/stores`, storeData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    },

    deleteStore: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.delete(`${API_BASE_URL}/stores/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    updateStore: async (id: string, storeData: FormData) => {
        const { token } = useStore.getState();
        const { data } = await axios.put(`${API_BASE_URL}/stores/${id}`, storeData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    },

    // Offers
    getOffers: async (categoryId?: string) => {
        const { token } = useStore.getState();
        const url = categoryId
            ? `${API_BASE_URL}/offers?categoryId=${categoryId}`
            : `${API_BASE_URL}/offers`;

        const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return Array.isArray(data) ? data : data.data || [];
    },

    getOffer: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.get(`${API_BASE_URL}/offers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    createOffer: async (offerData: FormData) => {
        const { token } = useStore.getState();
        const { data } = await axios.post(`${API_BASE_URL}/offers`, offerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    },

    deleteOffer: async (id: string) => {
        const { token } = useStore.getState();
        const { data } = await axios.delete(`${API_BASE_URL}/offers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    },

    updateOffer: async (id: string, offerData: FormData) => {
        const { token } = useStore.getState();
        const { data } = await axios.put(`${API_BASE_URL}/offers/${id}`, offerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    }
};