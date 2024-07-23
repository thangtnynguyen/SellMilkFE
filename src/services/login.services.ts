import { apiClient } from "../api/api";

export const login = async (
	data: any,
): Promise<any> => {
	const res = await apiClient?.post(`/XacThuc/login`, data);
	return res?.data;
};

