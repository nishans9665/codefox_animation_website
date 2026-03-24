import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Loader, Globe, Image as ImageIcon, Link, Search, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Web',
        project_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Title', 'Category', 'Project URL', 'Created At'];
        const rows = filteredProjects.map(p => [
            p.id, `"${p.title.replace(/"/g, '""')}"`, p.category, p.project_url || 'N/A', new Date(p.created_at).toLocaleDateString()
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,'
            + headers.join(',') + '\n'
            + rows.map(e => e.join(',')).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "codefox_projects_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("CodeFox - Portfolio Projects", 14, 15);

        const tableColumn = ["ID", "Title", "Category", "URL", "Added On"];
        const tableRows = [];

        filteredProjects.forEach(p => {
            const rowData = [
                p.id,
                p.title,
                p.category,
                p.project_url || 'N/A',
                new Date(p.created_at).toLocaleDateString()
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('codefox_projects_export.pdf');
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (error) {
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                category: project.category,
                project_url: project.project_url || ''
            });
            setImagePreview(project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`);
            setImageFile(null);
        } else {
            setEditingProject(null);
            setFormData({ title: '', category: 'Web', project_url: '' });
            setImagePreview('');
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('project_url', formData.project_url);
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
            if (editingProject) {
                await axios.put(`http://localhost:5000/api/projects/${editingProject.id}`, data, config);
                toast.success("Project updated successfully!");
            } else {
                if (!imageFile) throw new Error("Image is required for new projects");
                await axios.post('http://localhost:5000/api/projects', data, config);
                toast.success("New project added to portfolio!");
            }
            closeModal();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Project deleted permanently");
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete project");
        }
    };

    if (loading) return <div className="admin-loader"><Loader className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="flex-between mb-4">
                    <div>
                        <h2>Portfolio Projects</h2>
                        <p>Manage and display completed projects on your homepage portfolio.</p>
                    </div>
                    <div className="action-buttons flex gap-3">
                        <button className="btn btn-outline flex-center gap-2" onClick={exportToCSV} title="Export to CSV">
                            <Download size={18} /> CSV
                        </button>
                        <button className="btn btn-outline flex-center gap-2" onClick={exportToPDF} title="Export to PDF">
                            <FileText size={18} /> PDF
                        </button>
                        <button className="btn btn-primary flex-center gap-2" onClick={() => openModal()}>
                            <Plus size={18} /> Add Project
                        </button>
                    </div>
                </div>

                <div className="search-bar" style={{ maxWidth: '400px', marginBottom: '1.5rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                    <Search size={18} className="text-secondary" style={{ marginRight: '10px' }} />
                    <input
                        type="text"
                        placeholder="Search projects by title or category..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit' }}
                    />
                </div>
            </div>

            <div className="glass-panel table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Project Title & Category</th>
                            <th>External Link</th>
                            <th>Added On</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProjects.map(project => (
                            <tr key={project.id}>
                                <td style={{ width: '90px' }}>
                                    {project.image ? (
                                        <div className="post-thumbnail" style={{ backgroundImage: `url(${project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`})` }}></div>
                                    ) : (
                                        <div className="post-thumbnail placeholder flex-center">
                                            <ImageIcon size={20} className="text-secondary" />
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="font-medium">{project.title}</div>
                                    <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{project.category}</div>
                                </td>
                                <td>
                                    {project.project_url ? (
                                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="badge badge-success" style={{ textDecoration: 'none' }}>
                                            <Link size={12} /> Active Link
                                        </a>
                                    ) : (
                                        <span className="text-secondary">-</span>
                                    )}
                                </td>
                                <td className="text-secondary">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="action-buttons justify-end flex gap-2">
                                        <button className="icon-btn edit-btn tooltip" onClick={() => openModal(project)} title="Edit Project">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete-btn tooltip" onClick={() => handleDelete(project.id)} title="Delete Project">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedProjects.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-secondary">
                                    {searchTerm ? 'No projects match your search.' : 'No completed projects yet. Add your first success story!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                        <button
                            className="btn-pagination"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={{ padding: '8px 16px', borderRadius: '6px', background: currentPage === 1 ? 'transparent' : 'var(--accent-primary)', color: currentPage === 1 ? 'var(--text-secondary)' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid var(--card-border)', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> Prev
                        </button>
                        <span className="page-info font-medium" style={{ color: 'var(--text-primary)' }}>Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn-pagination"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{ padding: '8px 16px', borderRadius: '6px', background: currentPage === totalPages ? 'transparent' : 'var(--accent-primary)', color: currentPage === totalPages ? 'var(--text-secondary)' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid var(--card-border)', opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            Next <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '5px' }} />
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel post-modal">
                        <div className="modal-header flex-between">
                            <h3>{editingProject ? 'Edit Project Details' : 'Add New Project'}</h3>
                            <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">

                            <div className="form-row" style={{ display: 'flex', gap: '1.5rem' }}>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Project Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="HealthCare App..." />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="Web">Web</option>
                                        <option value="App">App</option>
                                        <option value="Software">Software</option>
                                        <option value="Design">Design</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Project URL (Optional linking)</label>
                                <input type="url" name="project_url" value={formData.project_url} onChange={handleInputChange} placeholder="https://..." />
                            </div>

                            <div className="form-group">
                                <label>Project Cover Image</label>
                                <div className="image-upload-wrapper">
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                                    <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="file-input" />
                                </div>
                            </div>

                            <div className="modal-actions mt-4 flex-end gap-3">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Uploading...' : (editingProject ? 'Update Project' : 'Save Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsAdmin;
