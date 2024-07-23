import { apiClient } from "../api/api";
import LocalStorageService from './local-storage.service';


let userCurrent: any | null | undefined = null;

const AuthService = {
	// Auth token
	getAuthTokenLocalStorage: (): any | null => {
		return LocalStorageService.getItem('authToken');
	},

	setAuthTokenLocalStorage: (authToken: any | null): void => {
		LocalStorageService.setItem('authToken', authToken);
	},

	// User
	setUserCurrent: (currentUser: any | null): void => {
		userCurrent = currentUser;
	},

	getUserCurrent: (): any | null | undefined => {
		return userCurrent;
	},

	fetchUserCurrent: async (): Promise<any> => {
		const res = await apiClient.get('/XacThuc/get-thongtin-nguoidung-async');
		return res.data;
	},

	loginByUsername: async (request: any): Promise<any> => {
		const res = await apiClient.post('/XacThuc/login', request);
		return res.data;
	},

	refreshToken: async (request: any): Promise<any> => {
		const res = await apiClient.post('/XacThuc/refresh-token', request);
		return res.data;
	},

	logout: async (): Promise<any> => {
		const res = await apiClient.post('/XacThuc/logout', null);
		return res.data;
	},

	isAuthenticated: (): boolean => {
		return !!LocalStorageService.getItem('currentUser');
	},

	// Get student
	getStudentInfo: async (request: any): Promise<any> => {
		const res = await apiClient.get('/XacThuc/get-student-user-id', { params: request });
		return res.data;
	}
};

export default AuthService;
