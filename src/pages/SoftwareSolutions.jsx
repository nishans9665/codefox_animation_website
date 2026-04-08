import React, { useEffect, useRef } from 'react';
import {
    Code2,
    Store,
    Users,
    Hexagon,
    CheckCircle2,
    Database,
    Zap,
    Lock,
    BarChart,
    Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './SoftwareSolutions.css';

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

const SolutionBlock = ({ title, subtitle, desc, features, reverse, icon: Icon }) => (
    <section className="solution-block">
        <div className="container">
            <div className={`solution-grid ${reverse ? 'reverse' : ''}`}>
                <div className="solution-visual reveal">
                    <div className="abstract-visual">
                        <Icon size={120} strokeWidth={1} />
                    </div>
                </div>
                <div className="solution-text reveal delay-2">
                    <span className="subtitle" style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        {subtitle}
                    </span>
                    <h2>{title}</h2>
                    <p>{desc}</p>
                    <div className="feature-list">
                        {features.map((feature, i) => (
                            <div className="feature-item" key={i}>
                                <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SoftwareSolutions = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const solutionsData = [
        {
            icon: Code2,
            subtitle: 'Engineering',
            title: 'Custom Software Development',
            desc: 'We build tailored software applications from the ground up to address your exact business challenges. Our modern tech stack ensures your software is robust, scalable, and easy to maintain.',
            features: [
                'Full-Stack Web Applications',
                'Legacy System Modernization',
                'API Development & Integration',
                'Cloud-Native Architectures'
            ],
            reverse: false
        },
        {
            icon: Store,
            subtitle: 'Retail & Sales',
            title: 'Point of Sales (POS) Systems',
            desc: 'Streamline your retail or restaurant operations with our custom POS integrations. Fast, reliable, and perfectly synchronized with your inventory and accounting.',
            features: [
                'Inventory Management',
                'Omnichannel Syncing',
                'Staff & Role Permissions',
                'Real-Time Analytics Dashboard'
            ],
            reverse: true
        },
        {
            icon: Users,
            subtitle: 'Customer Relations',
            title: 'CRM Tools Formulation',
            desc: 'Enhance the way you interact with customers. We deploy customized Customer Relationship Management systems to track leads, boost engagement, and increase sales efficiency.',
            features: [
                'Lead & Pipeline Tracking',
                'Automated Email Campaigns',
                'Support Ticket Management',
                'Sales Performance Reporting'
            ],
            reverse: false
        },
        {
            icon: Hexagon,
            subtitle: 'Bespoke Integration',
            title: 'Versatile Enterprise Solutions',
            desc: 'No matter how niche or complex your problem is, we engineer any software solution you need. We bridge the gap between your conceptual needs and functional reality.',
            features: [
                'Enterprise Resource Planning (ERP)',
                'Workflow Automation Modules',
                'Custom FinTech Dashboards',
                'Healthcare & Logistics Systems'
            ],
            reverse: true
        }
    ];

    return (
        <main className="software-solutions-page">
            <GlobalStarfield />

            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">Tailored Digital Tools</span>
                    <h1 className="page-title animate-fade-in-up">
                        Enterprise <span className="text-gradient">Software Solutions</span>
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        From custom web apps to comprehensive POS and CRM systems, we develop bespoke software engineered to scale and streamline your business operations.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Discuss Your Project</Link>
                </div>
            </section>

            {/* Render dynamically mapped section blocks */}
            {solutionsData.map((data, idx) => (
                <SolutionBlock
                    key={idx}
                    icon={data.icon}
                    subtitle={data.subtitle}
                    title={data.title}
                    desc={data.desc}
                    features={data.features}
                    reverse={data.reverse}
                />
            ))}

            {/* CTA */}
            <section className="page-cta section">
                <div className="container">
                    <div className="cta-box reveal">
                        <h2>Ready to <span className="text-gradient">Automate & Scale?</span></h2>
                        <p>
                            Stop relying on out-of-the-box templates that don't fit your needs. Let's build software that actually aligns with your unique business goals.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Request Custom Consultation</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default SoftwareSolutions;
