import { apiClient } from "../api/api";

const CategoryService = {
    
  getLoaiSua: async (request: any | null = null) => {
    const response = await apiClient.get('/LoaiSua/get', { params: request });
    return response.data;
  },

  getLoaiSuaById: async (request: any | null = null) => {
    const response = await apiClient.get('/LoaiSua/get-by-id', { params: request });
    return response.data;
  },

  createLoaiSua: async (request: any) => {
    const response = await apiClient.post('/LoaiSua/create', request);
    return response.data;
  }
};

export default CategoryService;
