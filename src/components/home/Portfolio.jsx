import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import satelliteImg from '../../assets/Satellite.png';
import './Portfolio.css';

const categories = ['All', 'Web', 'App', 'Software'];

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
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

    // Limit to exactly 12 projects max (4 columns x 3 rows ideally)
    const displayedProjects = filteredProjects.slice(0, 12);

    return (
        <section className="section portfolio-section" id="portfolio" style={{ position: 'relative' }}>
            {/* The floating satellite image positioned between Services and Portfolio */}
            <div className="portfolio-satellite-wrapper">
                <img src={satelliteImg} alt="Satellite" className="portfolio-satellite-img" />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 5 }}>
                <div className="section-header reveal">
                    <span className="subtitle">Our Work</span>
                    <h2 className="section-title">Completed <span className="text-gradient">Projects</span></h2>
                    <p className="section-desc">
                        Explore our latest successful projects across various digital platforms.
                    </p>
                </div>

                <div className="portfolio-filters reveal">
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
                    {displayedProjects.length === 0 ? (
                        <p className="text-secondary text-center" style={{gridColumn: '1 / -1', padding: '2rem'}}>No projects completed in this category yet.</p>
                    ) : displayedProjects.map((project, idx) => (
                        <div
                            className="portfolio-card glass-panel"
                            key={project.id}
                            style={{ transitionDelay: `${idx * 0.05}s`, animation: 'fadeInUp 0.6s ease forwards' }}
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

                <div className="portfolio-action reveal" style={{ transitionDelay: '0.4s' }}>
                    <Link to="/portfolio" className="btn btn-secondary load-more">View All Projects</Link>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
