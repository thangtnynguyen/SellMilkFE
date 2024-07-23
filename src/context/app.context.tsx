import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/auth.service';
// import AuthService from '../auth.service';
// import { ApiResult } from '../../models/interfaces/common/api-result.interface';
// import UserCurrent from '../../models/interfaces/user/user-current.interface';
// import { LoginRequest } from '../../models/interfaces/auth/login-request.interface';
// import { AuthToken } from '../../models/interfaces/common/auth-token.interface';
// import { RefreshTokenRequest } from '../../models/interfaces/auth/refresh-token-request.interface';

interface AppContextType {
	user: any | null;
	isInitialized: boolean;
	login: (request: any) => Promise<Boolean>;
	logout: () => Promise<Boolean>;
	refreshToken: (request: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<any | null>(null);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);

	useEffect(() => {
		const initializeAuth = async () => {
			const authToken = AuthService.getAuthTokenLocalStorage();
			if (authToken) {
				try {
					const result: any = await AuthService.fetchUserCurrent();
					setUser(result.data);
				} catch (error) {
					console.error('Failed to fetch user', error);
				}
			}
			setIsInitialized(true);
		};
		initializeAuth();
	}, []);

	const login = async (request: any): Promise<Boolean> => {
		try {
			const result: any = await AuthService.loginByUsername(request);
			if (result.status) {
				AuthService.setAuthTokenLocalStorage(result.data.token);
				const userResult: any = await AuthService.fetchUserCurrent();
				setUser(userResult.data);
				return true;
			}
			else {
				AuthService.setAuthTokenLocalStorage(null);
				setUser(null);
				return false;
			}

		} catch (error) {
			console.error('Login failed', error);
			AuthService.setAuthTokenLocalStorage(null);
			setUser(null);
			return false;
		}
	};


	const logout = async (): Promise<Boolean> => {
		try {
			AuthService.setAuthTokenLocalStorage(null);
			setUser(null);
			return true;
		} catch (error) {
			console.error('Logout failed', error);
			AuthService.setAuthTokenLocalStorage(null);
			setUser(null);
			return false;

		}
	};

	const refreshToken = async (request: any) => {
		try {
			const result: any = await AuthService.refreshToken(request);
			AuthService.setAuthTokenLocalStorage(result.data);
			const userResult: any = await AuthService.fetchUserCurrent();
			setUser(userResult.data);
		} catch (error) {
			console.error('Refresh token failed', error);
		}
	};

	return (
		<AppContext.Provider value={{ user, isInitialized, login, logout, refreshToken }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAuth = (): AppContextType => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AppContextProvider');
	}
	return context;
};
