import { apiClient } from "../api/api";

const UserService = {
  signup: async (request: any | null = null) => {
    const response = await apiClient.post('/NguoiDung/sign-up', request);
    return response.data;
  },

  getTatNguoiDung: async (request: any | null = null) => {
    const response = await apiClient.get('/NguoiDung/get', { params: request });
    return response.data;
  }
};

export default UserService;
