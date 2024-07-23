import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../context/app.context';

interface User {
  name: string;
  email: string;
}

const HeaderAdmin: React.FC = () => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Example logout function
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Search */}
      <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Search for..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        <li className={`nav-item dropdown no-arrow d-sm-none ${showSearchDropdown ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
          >
            <i className="fas fa-search fa-fw"></i>
          </a>
          <div className={`dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in ${showSearchDropdown ? 'show' : ''}`}>
            <form className="form-inline mr-auto w-100 navbar-search">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

       

       

        {/* Nav Item - User Information */}
        <li className={`nav-item dropdown no-arrow ${showUserDropdown ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            {/* You can include user avatar or other user information here */}
            <span className="mr-2 d-none d-lg-inline text-gray-600 small black-color" >{user ? user.name : ''}</span>
          </a>
          <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${showUserDropdown ? 'show' : ''}`}>
            <Link className="dropdown-item" to="#">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </Link>
            <Link className="dropdown-item" to="/home">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Role User
            </Link>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>

      <ToastContainer />
    </nav>
  );
};

export default HeaderAdmin;
