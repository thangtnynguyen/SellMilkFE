import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";

interface Props {
    children: ReactNode;
}

const AdminProtected: React.FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const authToken = AuthService.getAuthTokenLocalStorage();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            if (authToken) {
                try {
                    const result: any = await AuthService.fetchUserCurrent();
                    if (result.data && result.data.role === 1) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setIsLoading(false);
        };

        fetchUser();
    }, [authToken]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAdmin) {
        return <>{children}</>;
    } else {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
};

export default AdminProtected;
