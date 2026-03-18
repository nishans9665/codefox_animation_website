import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Loader, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './PostsAdmin.css';

const PostsAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Technology',
        content: '',
        status: 'draft'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef(null);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/posts/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(res.data);
        } catch (error) {
            toast.error("Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: editingPost ? formData.slug : generateSlug(title) // Auto-slug only for new posts
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                slug: post.slug,
                category: post.category,
                content: post.content,
                status: post.status
            });
            setImagePreview(post.image ? `http://localhost:5000${post.image}` : '');
            setImageFile(null);
        } else {
            setEditingPost(null);
            setFormData({ title: '', slug: '', category: 'Technology', content: '', status: 'draft' });
            setImagePreview('');
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        
        // Since we have file uploads, we must use FormData
        const data = new FormData();
        data.append('title', formData.title);
        data.append('slug', formData.slug);
        data.append('category', formData.category);
        data.append('content', formData.content);
        data.append('status', formData.status);
        if (imageFile) {
            data.append('image', imageFile);
        }

        const config = { 
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            } 
        };

        try {
            if (editingPost) {
                await axios.put(`http://localhost:5000/api/posts/${editingPost.id}`, data, config);
                toast.success("Blog post updated successfully!");
            } else {
                await axios.post('http://localhost:5000/api/posts', data, config);
                toast.success("New blog post published!");
            }
            closeModal();
            fetchPosts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post? This cannot be undone.")) return;
        
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Post deleted permanently");
            fetchPosts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    const toggleStatus = async (post) => {
        const token = localStorage.getItem('token');
        const newStatus = post.status === 'published' ? 'draft' : 'published';
        const data = new FormData();
        data.append('title', post.title);
        data.append('slug', post.slug);
        data.append('category', post.category);
        data.append('content', post.content);
        data.append('status', newStatus);

        try {
            await axios.put(`http://localhost:5000/api/posts/${post.id}`, data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            toast.success(`Post marked as ${newStatus}`);
            fetchPosts();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <div className="admin-loader"><Loader className="animate-spin text-primary" size={40} /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header flex-between">
                <div>
                    <h2>Blog Posts</h2>
                    <p>Manage, write, and publish articles directly to the CodeFox IT homepage.</p>
                </div>
                <button className="btn btn-primary flex-center gap-2" onClick={() => openModal()}>
                    <Plus size={18} /> Write New Post
                </button>
            </div>

            <div className="glass-panel table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title & Category</th>
                            <th>Status</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td style={{width: '90px'}}>
                                    {post.image ? (
                                        <div className="post-thumbnail" style={{backgroundImage: `url(http://localhost:5000${post.image})`}}></div>
                                    ) : (
                                        <div className="post-thumbnail placeholder flex-center">
                                            <ImageIcon size={20} className="text-secondary" />
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="font-medium">{post.title}</div>
                                    <div className="text-secondary" style={{fontSize: '0.8rem'}}>{post.category}</div>
                                </td>
                                <td>
                                    <button 
                                        className={`status-badge ${post.status}`} 
                                        onClick={() => toggleStatus(post)}
                                        title={post.status === 'published' ? 'Click to Unpublish' : 'Click to Publish'}
                                    >
                                        {post.status === 'published' ? <Globe size={14} className="mr-1" /> : <FileText size={14} className="mr-1" />}
                                        {post.status.toUpperCase()}
                                    </button>
                                </td>
                                <td className="text-secondary">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit-btn" onClick={() => openModal(post)} title="Edit Article">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDelete(post.id)} title="Delete Article">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-secondary">
                                    No blog posts found. Write your first article today!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add / Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel post-modal">
                        <div className="modal-header flex-between">
                            <h3>{editingPost ? 'Edit Blog Post' : 'Draft New CodeFox Article'}</h3>
                            <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            
                            <div className="form-row" style={{display: 'flex', gap: '1.5rem'}}>
                                <div className="form-group" style={{flex: 2}}>
                                    <label>Article Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleTitleChange} required placeholder="Top 10 Web Frameworks in 2026" />
                                </div>
                                
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="Technology">Technology</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Software">Software Development</option>
                                        <option value="Company News">Company News</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>URL Slug (auto-generated)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required style={{background: 'rgba(0,0,0,0.1)'}} />
                            </div>

                            <div className="form-group">
                                <label>Article Content (Excerpt or Full text)</label>
                                <textarea name="content" value={formData.content} onChange={handleInputChange} rows="6" required placeholder="Write your excellent article excerpt or body here..."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Featured Image</label>
                                <div className="image-upload-wrapper">
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                                    <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="file-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Publish Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="draft">Save as Draft (Hidden)</option>
                                    <option value="published">Publish Instantly (Live)</option>
                                </select>
                            </div>

                            <div className="modal-actions mt-4 flex-end gap-3">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : (editingPost ? 'Update Article' : 'Save Article')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostsAdmin;
