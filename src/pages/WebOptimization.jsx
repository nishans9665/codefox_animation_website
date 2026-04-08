import React, { useEffect, useRef } from 'react';
import webimage from '../assets/web-image1.avif';
import {
    Zap,
    Search,
    Bug,
    ShieldCheck,
    BarChart,
    Code2,
    CheckCircle2,
    Settings,
    Cpu,
    Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './WebOptimization.css';

const GlobalStarfield = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const stars = Array.from({ length: 400 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            color: ['rgba(255, 255, 255, ', 'rgba(59, 130, 246, ', 'rgba(139, 92, 246, '][Math.floor(Math.random() * 3)]
        }));

        let animId;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.alpha += (Math.random() - 0.5) * 0.05;
                if (star.alpha <= 0) star.alpha = 0;
                if (star.alpha >= 1) star.alpha = 1;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${star.color}${star.alpha * 0.8})`;
                ctx.fill();

                star.y -= 0.1;
                if (star.y < 0) star.y = height;
            });
            animId = requestAnimationFrame(render);
        };
        render();

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

const WebOptimization = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Zap size={30} />,
            title: 'Speed Optimization',
            desc: 'Ultra-fast loading times through advanced caching, image optimization, and code minification strategies.'
        },
        {
            icon: <Search size={30} />,
            title: 'SEO Friendly Audit',
            desc: 'Comprehensive technical SEO optimization to ensure search engines can index and rank your site effectively.'
        },
        {
            icon: <Bug size={30} />,
            title: 'Expert Bug Fixing',
            desc: 'Identifying and resolving critical errors, layout breaks, and functional issues across all browsers.'
        },
        {
            icon: <ShieldCheck size={30} />,
            title: 'Security Hardening',
            desc: 'Protecting your web applications with modern security protocols and vulnerability patching.'
        }
    ];

    const benefits = [
        "Core Web Vitals Scoring",
        "Mobile-First Optimization",
        "Conversion Rate Uplift",
        "Cross-Browser Stability",
        "Technical Debt Reduction",
        "Real-time Performance Monitoring"
    ];

    return (
        <main className="web-optimization-page">
            <GlobalStarfield />

            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">Performance & Growth</span>
                    <h1 className="page-title animate-fade-in-up">
                        Web & System <span className="text-gradient">Optimization</span>
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        Maximize your digital potential with high-performance speed optimization, 
                        technical SEO, and bulletproof system reliability.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Optimize My Site</Link>
                </div>
            </section>

            {/* Intro Content */}
            <section className="section intro-section">
                <div className="container">
                    <div className="intro-grid">
                        <div className="intro-image reveal">
                            <img
                                src={webimage}
                                alt="Web Performance Dashboard"
                            />
                        </div>
                        <div className="intro-text reveal delay-2">
                            <span className="subtitle">Why Optimization Matters</span>
                            <h2>Speed That <span className="text-gradient">Converts & Ranks</span></h2>
                            <p>
                                In today's digital landscape, every millisecond counts. A slow website doesn't just frustrate users; 
                                it directly impacts your Google ranking and conversion rates. Our optimization services 
                                transform sluggish sites into high-velocity business assets.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                We go beyond simple caching. Our team performs deep architectural audits to eliminate 
                                render-blocking issues, optimize server response times, and implement cutting-edge 
                                technical SEO to ensure your visibility is maximized.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {benefits.map((benefit, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={18} color="var(--accent-primary)" />
                                        <span style={{ fontSize: '0.9rem' }}>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Comprehensive Solutions</span>
                        <h2 className="section-title">Optimization <span className="text-gradient">Framework</span></h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '700px' }}>
                            We provide a full-spectrum approach to system health, ensuring your application is 
                            fast, visible, and error-free.
                        </p>
                    </div>

                    <div className="grid-4">
                        {features.map((f, i) => (
                            <div className="feature-box reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon-wrapper">
                                    {f.icon}
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-cta section">
                <div className="container">
                    <div className="cta-box reveal">
                        <h2>Ready to <span className="text-gradient">Boost Performance?</span></h2>
                        <p>
                            Don't let slow load times or technical bugs hold your business back. 
                            Let our experts audit your system and implement a tailor-made optimization strategy.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Free Performance Audit</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default WebOptimization;
