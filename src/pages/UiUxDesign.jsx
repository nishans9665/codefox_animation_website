import React, { useEffect, useRef } from 'react';
import {
    Search,
    LayoutTemplate,
    PenTool,
    LineChart,
    CheckCircle2,
    Megaphone,
    Image as ImageIcon,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './UiUxDesign.css';

const GlobalStarfield = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const stars = Array.from({ length: 300 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            color: ['rgba(255, 255, 255, ', 'rgba(236, 72, 153, ', 'rgba(139, 92, 246, '][Math.floor(Math.random() * 3)]
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

const UiUxDesign = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const processes = [
        {
            icon: <Search size={30} />,
            number: '01',
            title: 'User Research',
            desc: 'We dive deep into your target audience to discover their pain points, behaviors, and expectations. This ensures every design decision is data-driven.',
            deliverables: [
                'User Personas',
                'Journey Mapping',
                'Competitor Analysis'
            ]
        },
        {
            icon: <LayoutTemplate size={30} />,
            number: '02',
            title: 'Wireframing & Prototyping',
            desc: 'Before making things look pretty, we build the skeletal framework of your app to finalize logic, flow, and user interaction pathways.',
            deliverables: [
                'Low-Fidelity Wireframes',
                'Clickable Prototypes',
                'Information Architecture'
            ]
        },
        {
            icon: <PenTool size={30} />,
            number: '03',
            title: 'User Interface (UI) Design',
            desc: 'We breathe life into wireframes by applying color theory, typography, and visual hierarchy to create stunning, modern interfaces that align with your brand.',
            deliverables: [
                'High-Fidelity Mockups',
                'Interactive Animations',
                'Comprehensive UI Kits'
            ]
        },
        {
            icon: <LineChart size={30} />,
            number: '04',
            title: 'UX Optimization & Testing',
            desc: 'Design is an iterative process. We conduct extensive usability testing to refine experiences, reduce friction, and boost overall conversion rates.',
            deliverables: [
                'A/B Testing Strategies',
                'Accessibility Audits',
                'Usability Reports'
            ]
        }
    ];

    return (
        <main className="uiux-design-page">
            <GlobalStarfield />

            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">Aesthetic & Functional</span>
                    <h1 className="page-title animate-fade-in-up">
                        UI/UX <span className="text-gradient">Design Services</span>
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        We design intuitive, gorgeous digital experiences that captivate users, build brand loyalty, and drive measurable business results.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Discuss Your Vision</Link>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Our Methodology</span>
                        <h2 className="section-title">The <span className="text-gradient">Design Process</span></h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '700px' }}>
                            We follow a systematic, human-centered design approach to ensure your software is as easy to use as it is beautiful.
                        </p>
                    </div>

                    <div className="process-grid">
                        {processes.map((process, idx) => (
                            <div className="process-card reveal" key={idx} style={{ transitionDelay: `${idx * 0.1}s` }}>
                                <span className="step-number">{process.number}</span>
                                <div className="process-icon-wrapper">
                                    {process.icon}
                                </div>
                                <h3>{process.title}</h3>
                                <p>{process.desc}</p>
                                
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deliverables:</h4>
                                <ul className="deliverables-list">
                                    {process.deliverables.map((item, i) => (
                                        <li key={i}>
                                            <CheckCircle2 size={16} color="var(--accent-primary)" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Graphic & Marketing Design Section */}
            <section className="marketing-section" style={{ padding: '100px 0', backgroundColor: 'rgba(236, 72, 153, 0.02)' }}>
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Beyond The Screen</span>
                        <h2 className="section-title">Graphic & <span className="text-gradient">Marketing Solutions</span></h2>
                        <p className="section-desc mx-auto" style={{ maxWidth: '700px' }}>
                            We provide comprehensive graphic design services including engaging social media posts, eye-catching flyers, and professional commercial brochures.
                        </p>
                    </div>

                    <div className="process-grid" style={{ marginTop: '2rem' }}>
                        <div className="process-card reveal" style={{ transitionDelay: '0.1s' }}>
                            <div className="process-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <Megaphone size={30} />
                            </div>
                            <h3>Social Media & Marketing Posts</h3>
                            <p>High-conversion graphic posts tailored for Instagram, Facebook, and LinkedIn to maximize your brand reach and engagement rates.</p>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deliverables:</h4>
                            <ul className="deliverables-list">
                                <li><CheckCircle2 size={16} color="#3b82f6" /> Campaign Graphics</li>
                                <li><CheckCircle2 size={16} color="#3b82f6" /> Ad Creatives</li>
                            </ul>
                        </div>
                        
                        <div className="process-card reveal" style={{ transitionDelay: '0.2s' }}>
                            <div className="process-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                <ImageIcon size={30} />
                            </div>
                            <h3>Flyers & Banners</h3>
                            <p>Stunning, print-ready or digital flyers and banners that instantly capture attention and clearly communicate your value proposition or event details.</p>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deliverables:</h4>
                            <ul className="deliverables-list">
                                <li><CheckCircle2 size={16} color="#8b5cf6" /> Promotional Flyers</li>
                                <li><CheckCircle2 size={16} color="#8b5cf6" /> Web & Event Banners</li>
                            </ul>
                        </div>

                        <div className="process-card reveal" style={{ transitionDelay: '0.3s' }}>
                            <div className="process-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                                <BookOpen size={30} />
                            </div>
                            <h3>Brochures & Print Media</h3>
                            <p>Professionally laid out multi-page brochures, portfolios, and company profiles designed to leave a lasting premium impression.</p>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deliverables:</h4>
                            <ul className="deliverables-list">
                                <li><CheckCircle2 size={16} color="#ec4899" /> Trifold Brochures</li>
                                <li><CheckCircle2 size={16} color="#ec4899" /> Corporate Profiles</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-cta section">
                <div className="container">
                    <div className="cta-box reveal">
                        <h2>Ready to <span className="text-gradient">Redesign Your Brand?</span></h2>
                        <p>
                            Stop losing customers to clunky interfaces and confusing user flows. Let's create an experience your users will love.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Start Your Design Project</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default UiUxDesign;
