import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import satelliteImg from '../../assets/Satellite.png';
import './Portfolio.css';

const projects = [
    {
        id: 1,
        title: 'FinTech Dashboard',
        category: 'Web',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        title: 'HealthCare Mobile App',
        category: 'App',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        title: 'E-Commerce Platform',
        category: 'Web',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        title: 'Smart Home IoT System',
        category: 'Software',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        title: 'Real Estate Portal',
        category: 'Web',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 6,
        title: 'Crypto Wallet App',
        category: 'App',
        image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
];

const categories = ['All', 'Web', 'App', 'Software'];

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filteredProjects = activeTab === 'All'
        ? projects
        : projects.filter(p => p.category === activeTab);

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
                    {filteredProjects.map((project, idx) => (
                        <div
                            className="portfolio-card reveal glass-panel"
                            key={project.id}
                            style={{ transitionDelay: `${idx * 0.1}s` }}
                        >
                            <div className="portfolio-image-wrap">
                                <img src={project.image} alt={project.title} className="portfolio-image" />
                                <div className="portfolio-overlay">
                                    <button className="btn btn-primary btn-icon">
                                        <ExternalLink size={20} />
                                    </button>
                                    <p className="overlay-text">View Details</p>
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
                    <button className="btn btn-secondary load-more">View All Projects</button>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
