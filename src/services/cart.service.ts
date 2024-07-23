import { request } from "http";
import { apiClient } from "../api/api";

const CartService = {

    getGioHangByNguoiDungId: async (request: any) => {
        return apiClient.get('GioHang/get-by-nguoidung-id', { params: request });
    },

    addGioHang: async (request: any) => {
        return apiClient.post('GioHang/create', request);
    },

    updateGioHang: async (request: any) => {
        return apiClient.post('GioHang/update', request);
    },
    
    deleteGioHang: async (request: any) => {
        return apiClient.post('GioHang/delete', request);
    },

    deleteNhieuGioHang: async (request: any) => {
        return apiClient.post('GioHang/delete-multiple', request);
    },

};

export default CartService;

