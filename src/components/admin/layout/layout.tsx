import { Outlet } from "react-router-dom";
import HeaderAdmin from "./header";
import FooterAdmin from "./footer";
import '../../../assets/css/user-layout.css';
import SidebarAdmin from "./sidebar";

import '../../../assets/css/admin/layout.css';

type Props = {
    children?: React.ReactNode;
};

export default function AppLayoutAdmin({ children }: Props): JSX.Element {

    return (

        <div id="layout-wrapper">
            <HeaderAdmin />
            <div id="main" className="main-app">
                <div className="sidebar-admin">
                    <SidebarAdmin />
                </div>
                <div className="main-content">
                    <Outlet></Outlet>
                </div>
            </div>

            <FooterAdmin />
        </div>

    );
};
