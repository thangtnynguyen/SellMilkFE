import { apiClient } from "../api/api";

const MilkService = {
  getSua: async (request: any | null = null) => {
    const response = await apiClient.get('/Sua/get', { params: request });
    return response.data;
  },

  getSuaById: async (request: any | null = null) => {
    const response = await apiClient.get('/Sua/get-by-id', { params: request });
    return response.data;
  },

  createSua: async (request: FormData) => {
    const response = await apiClient.post('/Sua/create', request, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateSua: async (request: FormData) => {
    const response = await apiClient.post('/Sua/update', request,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateStockSua: async (request: any) => {
    const response = await apiClient.post('/Sua/update-tonkho', request);
    return response.data;
  },

  deleteSua: async (request: any) => {
    const response = await apiClient.post('/Sua/delete', request);
    return response.data;
  }
};

export default MilkService;
