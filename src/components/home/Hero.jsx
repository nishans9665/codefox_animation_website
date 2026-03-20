import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Rocket } from 'lucide-react';
import WebGLGlobe from './WebGLGlobe';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section" id="home" style={{ position: 'relative' }}>
            {/* The space/starfield background has been moved globally to Home.jsx! */}
            
            {/* Background decorations */}
            <div className="hero-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="container hero-container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="hero-content">
                    <div className="badge animate-fade-in-up">
                        <Rocket size={16} className="badge-icon" />
                        <span>Innovating the Future</span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up delay-1">
                        We Build <br />
                        <span className="text-gradient">Smart Digital Solutions</span>
                    </h1>

                    <p className="hero-desc animate-fade-in-up delay-2">
                        Professional Web, Software & IT Services to Grow Your Business.
                        We partner with you to transform your digital presence with cutting-edge technologies.
                    </p>

                    <div className="hero-actions animate-fade-in-up delay-3">
                        <a href="#services" className="btn btn-primary hero-btn">
                            Our Services
                            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </a>
                        <Link to="/contact" className="btn btn-secondary hero-btn-secondary">
                            Contact Us
                        </Link>
                    </div>

                    <div className="hero-stats animate-fade-in-up delay-4">
                        <div className="stat-item">
                            <span className="stat-number">250+</span>
                            <span className="stat-label">Projects Done</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Happy Clients</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">12+</span>
                            <span className="stat-label">Years Exp</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image-wrapper animate-fade-in-up delay-2">
                    <div className="floating-card review-card" style={{ animationDelay: '0s' }}>
                        <div className="review-stars">★★★★★</div>
                        <p>Best IT agency!</p>
                    </div>
                    <div className="floating-card tech-card" style={{ animationDelay: '2s' }}>
                        <div className="tech-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <p>System Online</p>
                    </div>

                    <WebGLGlobe />

                    <div className="hero-img-glow"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
