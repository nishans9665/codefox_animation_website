import React, { useEffect, useRef } from 'react';
import webimage from '../assets/web-image1.avif';
import {
    Layout,
    Smartphone,
    Search,
    Code2,
    CheckCircle2,
    Settings,
    ShieldCheck,
    Cpu,
    Globe,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './WordPressDevelopment.css';

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

const WordPressDevelopment = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Settings size={30} />,
            title: 'Custom Theme Development',
            desc: 'We build unique, lightweight WordPress themes from scratch that reflect your brand identity and performance needs.'
        },
        {
            icon: <Cpu size={30} />,
            title: 'Advanced Features Integration',
            desc: 'Seamlessly integrating custom plugins and advanced features to enhance functionality for your specific business goals.'
        },
        {
            icon: <Search size={30} />,
            title: 'SEO Optimization',
            desc: 'Implementing best practices to boost your search engine rankings, driving organic traffic and online visibility.'
        },
        {
            icon: <Smartphone size={30} />,
            title: 'Mobile Responsiveness',
            desc: 'Ensuring your WordPress site delivers a flawless experience across all devices, from desktops to smartphones.'
        }
    ];

    const benefits = [
        "Scalable Architecture",
        "User-Friendly CMS",
        "Fast Performance",
        "Enhanced Security",
        "Custom Plugin Development",
        "Ongoing Support"
    ];

    const industries = [
        "Travel & Tourism", "Hospitality", "Education", "Account & Finance", "Construction", "Transportation & Logistics", "Corporate", "SME Brands"
    ];

    return (
        <main className="wordpress-page">
            <GlobalStarfield />

            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">WordPress CMS Experts</span>
                    <h1 className="page-title animate-fade-in-up">
                        WordPress <span className="text-gradient">Web Development</span> Services
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        Empowering your business with custom themes, advanced technical SEO,
                        and high-performance WordPress solutions that grow with you.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Start Your Project</Link>
                </div>
            </section>

            {/* Intro Content */}
            <section className="section intro-section">
                <div className="container">
                    <div className="intro-grid">
                        <div className="intro-image reveal">
                            <img
                                src={webimage}
                                alt="WordPress Dashboard"
                            />
                        </div>
                        <div className="intro-text reveal delay-2">
                            <span className="subtitle">Empowering with WordPress</span>
                            <h2>Websites That Build <span className="text-gradient">Measurable Growth</span></h2>
                            <p>
                                We build WordPress websites that enhance your online presence with stunning designs,
                                responsive layouts, and intuitive navigation. Our solutions are feature-rich and scalable,
                                ensuring your site grows alongside your business.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                From custom themes to powerful plugins, our WordPress development services offer
                                everything you need to create a website that stands out and performs. We combine
                                captivating aesthetics with seamless technical implementation.
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
                        <span className="subtitle">Core Services</span>
                        <h2 className="section-title">WordPress <span className="text-gradient">Capabilities</span></h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '700px' }}>
                            We don't just use templates; we create sustainable WordPress ecosystems that solve complex business problems.
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

            {/* Industries */}
            <section className="section industries-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Our Expertise</span>
                        <h2 className="section-title">Industries <span className="text-gradient">We Serve</span></h2>
                    </div>

                    <div className="industry-tags reveal">
                        {industries.map((tag, i) => (
                            <span className="industry-tag" key={i}>{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-cta section">
                <div className="container">
                    <div className="cta-box reveal">
                        <h2>Your Digital Success <span className="text-gradient">Starts Here</span></h2>
                        <p>
                            From custom themes to powerful plugins, our WordPress development services offer
                            everything you need to create a website that stands out and performs.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Discuss a Project</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default WordPressDevelopment;
