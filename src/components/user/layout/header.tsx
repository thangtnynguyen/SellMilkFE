import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../context/app.context';
import '../../../assets/css/user/header.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => { }, []);

    const handleLogout = () => {
        logout();
        navigate('/home');
        toast.success('Đăng xuất thành công');
    };

    const toggleDropdown = () => {
        setShowDropdown((prevState) => !prevState);
    };

    return (
        <div className="header" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="row">
                <div className="col-md-3">
                    <div className="logo">
                        <img
                            src="https://th.bing.com/th/id/OIP.Li12WCmeVV2g32LTxD_N0gHaDz?rs=1&pid=ImgDetMain"
                            alt="Logo của trang web"
                            className="img-fluid"
                            style={{ maxWidth: '100px' }}
                        />
                    </div>
                </div>
                <div className="col-md-9">
                    <nav className="navbar navbar-expand-lg">
                        <div className="ml-auto flex-grow-1 d-flex justify-content-end">
                            <ul className="navbar-nav flex-row ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/home">
                                        <i className="fa-solid fa-house"></i>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="/home">Sản Phẩm</Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">
                                        <i className="fa-solid fa-cart-shopping"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/history">Đơn Hàng Đã Mua</Link>
                                </li>
                            </ul>
                        </div>
                        {!user && (
                            <>
                                <div className="nav-item ">
                                    <Link className="nav-link" to="/sign-up">Đăng ký</Link>
                                </div>
                                <div className="nav-item ml-2">
                                    <Link className="nav-link" to="/login">Đăng nhập</Link>
                                </div>
                            </>
                        )}
                        {user && (
                            <div className="dropdown d-inline-block user-dropdown-item">
                                <button
                                    type="button"
                                    className="btn header-item waves-effect"
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        className="rounded-circle header-profile-user"
                                        src={user.profilePicture || 'https://tse2.mm.bing.net/th?id=OIP.EZSE_R9Nk9jBS6EGWJss4gHaJ2&pid=Api&P=0&h=220'}
                                        alt="Avatar người dùng"
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                    <span className="d-none d-xl-inline-block ml-2">{user?.name}</span>
                                    <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-right ${showDropdown ? 'show' : ''}`}>
                                    <Link to="/account/update" className="dropdown-item cursor-pointer">
                                        <i className="ri-user-line align-middle mr-1"></i> Cập Nhật Thông Tin
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <span
                                        className="dropdown-item text-danger cursor-pointer logout-button"
                                        onClick={handleLogout}
                                    >
                                        <i className="ri-shut-down-line align-middle mr-1 text-danger"></i>
                                        Đăng Xuất
                                    </span>
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Header;

