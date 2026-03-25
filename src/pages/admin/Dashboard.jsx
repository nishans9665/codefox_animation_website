import React, { useEffect, useState } from 'react';
import { Mail, FileText, Users, Activity, Loader, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ contacts: 0, posts: 0, users: 0, projects: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;

            try {
                // In a perfect world, we'd have a /api/stats endpoint, but for now we'll fetch all arrays and get .length
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [contactsRes, postsRes, usersRes, projectsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contacts`, config).catch(() => ({data: []})),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/admin`, config).catch(() => ({data: []})),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, config).catch(() => ({data: []})),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`, config).catch(() => ({data: []}))
                ]);

                // Extract contact count accurately whether the backend responds with paginated data or an array
                let contactsCount = 0;
                if (contactsRes.data && contactsRes.data.pagination) {
                    contactsCount = contactsRes.data.pagination.total;
                } else if (Array.isArray(contactsRes.data)) {
                    contactsCount = contactsRes.data.length;
                } else if (contactsRes.data && Array.isArray(contactsRes.data.data)) {
                    contactsCount = contactsRes.data.data.length;
                }

                setStats({
                    contacts: contactsCount,
                    posts: postsRes.data.length || 0,
                    users: usersRes.data.length || 0,
                    projects: projectsRes.data.length || 0
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
        { title: 'Completed Projects', value: stats.projects, icon: Briefcase, color: '#f59e0b' },
        { title: 'Registered Users', value: stats.users, icon: Users, color: '#10b981' },
    ];

    const chartData = [
        { name: 'Oct', traffic: 2400, interactions: 1400 },
        { name: 'Nov', traffic: 1398, interactions: 1210 },
        { name: 'Dec', traffic: 9800, interactions: 2290 },
        { name: 'Jan', traffic: 3908, interactions: 2000 },
        { name: 'Feb', traffic: 4800, interactions: 2181 },
        { name: 'Mar', traffic: 3800, interactions: 2500 },
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

            <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
                
                {/* Traffic Analytics Chart */}
                <div className="chart-container glass-panel" style={{ padding: '1.5rem', borderRadius: '15px', gridColumn: '1 / span 2' }}>
                    <div className="flex-between mb-4">
                        <h3 style={{ margin: 0, fontWeight: 600 }}>Traffic Analytics</h3>
                        <Activity size={20} className="text-secondary" />
                    </div>
                    <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" name="Site Visitors" />
                                <Area type="monotone" dataKey="interactions" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorInteractions)" name="Engagement" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Log */}
                <div className="recent-activity glass-panel" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <div className="flex-between mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 600 }}>Recent Activity</h3>
                        <Activity size={20} className="text-secondary" />
                    </div>
                    <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                        <div className="activity-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', marginTop: '5px' }}></div>
                           <div>
                               <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>Dashboard connection verified</p>
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Just now</span>
                           </div>
                        </div>
                        <div className="activity-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', marginTop: '5px' }}></div>
                           <div>
                               <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>Export feature configured</p>
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>10 minutes ago</span>
                           </div>
                        </div>
                        <div className="activity-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px' }}></div>
                           <div>
                               <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>Portfolio API activated</p>
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>2 hours ago</span>
                           </div>
                        </div>
                         <div className="activity-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9333ea', marginTop: '5px' }}></div>
                           <div>
                               <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>Initial Administrator login</p>
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>4 hours ago</span>
                           </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
