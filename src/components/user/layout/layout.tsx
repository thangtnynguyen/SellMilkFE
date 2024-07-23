import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import '../../../assets/css/user-layout.css';

type Props = {
    children?: React.ReactNode;
};

export default function AppLayout({ children }: Props): JSX.Element {



    return (

        <div id="layout-wrapper">
            <Header />
            {/* <Sidebar /> */}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Outlet></Outlet>
                    </div>
                </div>
                <Footer />
            </div>
            <div className="rightbar-overlay"></div>
        </div>
        
    );
};
