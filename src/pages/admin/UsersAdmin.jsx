import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Loader, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './UsersAdmin.css';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Editor',
        password: '' // Only required for new users, optional for editing
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'Editor', password: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (editingUser) {
                // UPDATE USER
                await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, formData, config);
                toast.success("User updated successfully!");
            } else {
                // CREATE USER
                if (!formData.password) {
                    toast.error("Password is required for new users");
                    setIsSubmitting(false);
                    return;
                }
                await axios.post('http://localhost:5000/api/users', formData, config);
                toast.success("New user created!");
            }
            closeModal();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed. Ensure you have Admin privileges.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User deleted");
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    if (loading) {
        return <div className="admin-loader"><Loader className="animate-spin text-primary" size={40} /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header flex-between">
                <div>
                    <h2>User Management</h2>
                    <p>Manage administrator and editor accounts</p>
                </div>
                <button className="btn btn-primary flex-center gap-2" onClick={() => openModal()}>
                    <Plus size={18} /> Add New User
                </button>
            </div>

            <div className="glass-panel table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Role</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="font-medium">{user.name}</td>
                                <td className="text-secondary">{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        <Shield size={14} className="mr-1" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="text-secondary">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit-btn" onClick={() => openModal(user)} title="Edit User">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDelete(user.id)} title="Delete User">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-secondary">
                                    No users found matching criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add / Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header flex-between">
                            <h3>{editingUser ? 'Edit User Record' : 'Add New User'}</h3>
                            <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" />
                            </div>
                            
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@codefoxit.com" />
                            </div>

                            <div className="form-group">
                                <label>Account Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="Editor">Editor (Limited Access)</option>
                                    <option value="Admin">Administrator (Full Access)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    {editingUser ? 'Change Password (leave blank to keep current)' : 'Account Password'}
                                </label>
                                <input 
                                    type="text" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    placeholder={editingUser ? "••••••••" : "Enter a secure password"} 
                                    required={!editingUser} 
                                />
                            </div>

                            <div className="modal-actions mt-4 flex-end gap-3">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersAdmin;
