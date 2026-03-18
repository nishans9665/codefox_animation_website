import React, { useEffect, useState } from 'react';
import { Mail, FileText, Users, Activity, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ contacts: 0, posts: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;

            try {
                // In a perfect world, we'd have a /api/stats endpoint, but for now we'll fetch all arrays and get .length
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [contactsRes, postsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/contacts', config).catch(() => ({data: []})),
                    axios.get('http://localhost:5000/api/posts/admin', config).catch(() => ({data: []})),
                    axios.get('http://localhost:5000/api/users', config).catch(() => ({data: []}))
                ]);

                setStats({
                    contacts: contactsRes.data.length || 0,
                    posts: postsRes.data.length || 0,
                    users: usersRes.data.length || 0
                });
            } catch (error) {
                toast.error("Failed to load dashboard data. Check database connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Contacts', value: stats.contacts, icon: Mail, color: '#9333ea' },
        { title: 'Total Posts', value: stats.posts, icon: FileText, color: '#3b82f6' },
        { title: 'Registered Users', value: stats.users, icon: Users, color: '#10b981' },
    ];

    if (loading) {
        return <div className="admin-loader"><Loader className="animate-spin text-primary" size={40} /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Dashboard Overview</h2>
                <p>Welcome back to the CodeFox IT Admin Panel</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div className="stat-card glass-panel" key={i}>
                            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                                <Icon size={28} />
                            </div>
                            <div className="stat-info">
                                <h3>{stat.title}</h3>
                                <h2>{stat.value}</h2>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="recent-activity glass-panel mt-4">
                <div className="activity-header">
                    <h3>Recent Activity</h3>
                    <Activity size={20} className="text-secondary" />
                </div>
                <div className="activity-list">
                    <p className="text-secondary">CRM Dashboard Interface connected. You are ready to manage CodeFox IT!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
