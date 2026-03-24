import React, { useState, useEffect } from 'react';
import { Search, MailOpen, Mail, Trash2, Calendar, ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './ContactsAdmin.css';

const ContactsAdmin = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = 'http://localhost:5000/api/contacts';

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}?page=${page}&limit=10&search=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const responseData = res.data;
            if (responseData && responseData.data) {
                setContacts(responseData.data);
                setTotalPages(responseData.pagination?.totalPages || 1);
            } else if (Array.isArray(responseData)) {
                // Fallback for old API response format
                setContacts(responseData);
                setTotalPages(1);
            } else {
                setContacts([]);
                setTotalPages(1);
            }
        } catch (error) {
            toast.error('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [page, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Message deleted');
            fetchContacts();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleToggleRead = async (id, currentStatus, event) => {
        if(event) event.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/${id}/read`, { is_read: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
            
            // Update local state without re-fetching everything
            setContacts(contacts.map(c => c.id === id ? { ...c, is_read: !currentStatus } : c));
            if (selectedContact && selectedContact.id === id) {
                setSelectedContact({ ...selectedContact, is_read: !currentStatus });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        // Auto mark as read if unread
        if (!contact.is_read) {
            handleToggleRead(contact.id, false);
        }
    };

    const closeModal = () => setSelectedContact(null);

    return (
        <div className="admin-page contacts-admin">
            <div className="admin-header flex-between">
                <div>
                    <h2>Contact Submissions</h2>
                    <p>Manage and respond to all inquiries sent from the website contact form.</p>
                </div>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search name or email..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="glass-panel table-container">
                {loading && contacts?.length === 0 ? (
                    <div className="admin-loader"><Loader className="animate-spin text-primary" size={40} /></div>
                ) : !contacts || contacts.length === 0 ? (
                    <div className="text-center py-5 text-secondary">No submissions found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                                {contacts.map(contact => (
                                    <tr 
                                        key={contact.id} 
                                        className={!contact.is_read ? 'unread-row' : ''}
                                        onClick={() => handleViewContact(contact)}
                                    >
                                        <td>
                                            {!contact.is_read ? (
                                                <span className="badge badge-warning"><Mail size={14} /> Unread</span>
                                            ) : (
                                                <span className="badge badge-success"><MailOpen size={14} /> Read</span>
                                            )}
                                        </td>
                                        <td className="font-semibold">{contact.full_name}</td>
                                        <td>{contact.email}</td>
                                        <td>
                                            <span className="truncate-text" style={{ maxWidth: '200px' }}>
                                                {contact.subject}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <Calendar size={14} />
                                                {new Date(contact.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons justify-end flex gap-2">
                                                <button 
                                                    className="icon-btn edit-btn tooltip" 
                                                    title={contact.is_read ? "Mark Unread" : "Mark Read"}
                                                    onClick={(e) => handleToggleRead(contact.id, contact.is_read, e)}
                                                >
                                                    {contact.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                                                </button>
                                                <button 
                                                    className="icon-btn delete-btn tooltip" 
                                                    title="Delete"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="btn-pagination" 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={18} /> Prev
                        </button>
                        <span className="page-info">Page {page} of {totalPages}</span>
                        <button 
                            className="btn-pagination" 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* View Message Modal */}
            {selectedContact && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content contact-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header flex-between">
                            <h3>Contact Details</h3>
                            <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="contact-info-grid">
                                <div className="info-group">
                                    <label>Full Name</label>
                                    <p>{selectedContact.full_name}</p>
                                </div>
                                <div className="info-group">
                                    <label>Email Address</label>
                                    <p><a href={`mailto:${selectedContact.email}`} className="text-primary">{selectedContact.email}</a></p>
                                </div>
                                <div className="info-group">
                                    <label>Phone Number</label>
                                    <p>{selectedContact.phone || 'N/A'}</p>
                                </div>
                                <div className="info-group">
                                    <label>Submission Date</label>
                                    <p>{new Date(selectedContact.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="message-box mt-4">
                                <label>Subject</label>
                                <h4>{selectedContact.subject}</h4>
                            </div>
                            
                            <div className="message-box mt-4">
                                <label>Message</label>
                                <div className="message-content">
                                    {selectedContact.message.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={closeModal}>Close Details</button>
                            <button className="btn btn-primary" onClick={() => window.location.href=`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}>
                                Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsAdmin;
