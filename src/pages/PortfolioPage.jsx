import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink } from 'lucide-react';
import '../components/home/Portfolio.css';

const categories = ['All', 'Web', 'App', 'Software'];

const PortfolioPage = () => {
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`);
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects");
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = activeTab === 'All'
        ? projects
        : projects.filter(p => p.category === activeTab);

    return (
        <div className="page portfolio-full-page">
            <section className="page-header" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                <div className="container text-center">
                    <span className="subtitle animate-fade-in-up">Extensive Showcase</span>
                    <h1 className="page-title animate-fade-in-up delay-1">All Portfolio <span className="text-gradient">Projects</span></h1>
                    <p className="page-desc animate-fade-in-up delay-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Browse our complete history of successful deployments and innovative digital solutions.
                    </p>
                </div>
            </section>

            <section className="section portfolio-section" style={{ minHeight: '60vh' }}>
                <div className="container">
                    <div className="portfolio-filters" style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="portfolio-grid">
                        {filteredProjects.length === 0 ? (
                            <p className="text-secondary text-center" style={{gridColumn: '1 / -1', padding: '2rem'}}>No projects found.</p>
                        ) : filteredProjects.map((project, idx) => (
                            <div
                                className="portfolio-card glass-panel"
                                key={project.id}
                                style={{ transitionDelay: `${(idx % 6) * 0.05}s`, animation: 'fadeInUp 0.6s ease forwards' }}
                            >
                                <div className="portfolio-image-wrap">
                                    <img src={project.image && project.image.startsWith('http') ? project.image : (project.image ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image}` : '')} alt={project.title} className="portfolio-image" />
                                    <div className="portfolio-overlay">
                                        {project.project_url ? (
                                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-icon">
                                                <ExternalLink size={20} />
                                            </a>
                                        ) : (
                                            <button className="btn btn-primary btn-icon">
                                                <ExternalLink size={20} />
                                            </button>
                                        )}
                                        <p className="overlay-text">{project.project_url ? 'Visit Project' : 'View Details'}</p>
                                    </div>
                                </div>
                                <div className="portfolio-content">
                                    <span className="portfolio-category">{project.category}</span>
                                    <h3 className="portfolio-title">{project.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PortfolioPage;
