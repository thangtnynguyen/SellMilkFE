import React from 'react';
import { Link } from 'react-router-dom';

const SidebarAdmin: React.FC = () => {
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" style={{ minHeight: '150vh' }}>
            {/* Sidebar - Brand */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Admin<sup>2</sup></div>
            </a>

            {/* Divider */}
            <hr className="sidebar-divider my-0" />

            {/* Nav Item - Dashboard */}
            <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard" >
                    <i className="fa-solid fa-house"></i>
                    <span>Dashboard</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/admin/milk/list" >
                    <i className="fa-solid fa-cow"></i>
                    <span>Milk</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/admin/category/list" >
                    <i className="fa-solid fa-list"></i>
                    <span>Category</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/admin/bill/list" >
                    <i className="fa-solid fa-file-invoice"></i>
                    <span>Bill</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/admin/account/list" >
                    <i className="fa-solid fa-user-tie"></i>
                    <span>Account</span>
                </Link>
            </li>
        </ul>
    );
};

export default SidebarAdmin;
