import { apiClient } from "../api/api";

const BillService = {
  getHoaDonBan: async (request: any | null = null) => {
    const response = await apiClient.get('/HoaDonBan/get', { params: request });
    return response.data;
  },

  getHoaDonBanById: async (request: any) => {
    const response = await apiClient.get('/HoaDonBan/get-by-id', { params: request });
    return response.data;
  },

  getHoaDonBanByNguoiDungId: async (request: any) => {
    const response = await apiClient.get('/HoaDonBan/get-by-nguoidung-id', { params: request });
    return response.data;
  },

  addHoaDonBan: async (request: any) => {
    const response = await apiClient.post('/HoaDonBan/create', request);
    return response.data;
  },

  updateStatusHoaDonBan: async (request: any) => {
    const response = await apiClient.post('/HoaDonBan/update-status', request);
    return response.data;
  }
};

export default BillService;
