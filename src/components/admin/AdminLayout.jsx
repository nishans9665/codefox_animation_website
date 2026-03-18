import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Mail, LogOut, ExternalLink } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar glass-panel">
                <div className="admin-brand">
                    <h2>CodeFox<span className="text-gradient"> CRM</span></h2>
                </div>
                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/contacts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Mail size={20} />
                        <span>Contacts</span>
                    </NavLink>
                    <NavLink to="/admin/posts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FileText size={20} />
                        <span>Blog Posts</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                </nav>
                <div className="admin-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <button onClick={() => window.open('/', '_blank')} className="logout-btn mt-2" style={{ opacity: 0.7 }}>
                        <ExternalLink size={20} />
                        <span>Back to Site</span>
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
