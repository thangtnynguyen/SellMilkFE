import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../store/user.atom";
interface Props {
	children: ReactNode;
}
const LoginProtected: React.FC<Props> = ({ children }) => {
	// const user = JSON.parse(localStorage.getItem("user") || "{}"); 
	const user = useRecoilValue(userState);
	let location = useLocation();
	if (user && user.token) {
		return (<>{children}</>);
	} else {
		return <Navigate to="/login" state={{ from: location }} replace />
		// return (<>{children}</>);
	}

};

export default LoginProtected;
