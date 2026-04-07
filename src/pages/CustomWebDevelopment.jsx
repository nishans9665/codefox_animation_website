import React, { useEffect, useRef } from 'react';
import { 
    Layout, 
    Smartphone, 
    Zap, 
    ShieldCheck, 
    Search, 
    Database, 
    RefreshCcw, 
    Code2, 
    ChevronRight,
    CheckCircle2,
    Globe,
    Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './CustomWebDevelopment.css';

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
            color: ['rgba(255, 255, 255, ', 'rgba(255, 123, 0, ', 'rgba(255, 140, 0, '][Math.floor(Math.random() * 3)]
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
                if(star.y < 0) star.y = height;
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

const CustomWebDevelopment = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Layout size={30} />,
            title: 'Visually Stunning Designs',
            desc: 'We create captivating, innovative designs that align with your brand, engage visitors, and leave a lasting, memorable impact.'
        },
        {
            icon: <Globe size={30} />,
            title: 'Easy to Navigate',
            desc: 'Focusing on intuitive, easy to use navigation to enhance the user experience and ensure effortless browsing.'
        },
        {
            icon: <Smartphone size={30} />,
            title: 'Mobile Responsive',
            desc: 'Providing a seamless experience across all devices, ensuring functionality and accessibility on smartphones and tablets.'
        },
        {
            icon: <Layers size={30} />,
            title: 'Seamless Technology',
            desc: 'Scaling technology to meet your business’s evolving needs, ensuring long term flexibility and growth.'
        }
    ];

    const faqs = [
        {
            q: "What is custom website development?",
            a: "Custom website development means building a website specifically tailored to your business needs, goals, and workflows. Unlike pre-built templates, custom solutions offer better performance, flexibility, and scalability."
        },
        {
            q: "Why should I choose custom website development over WordPress?",
            a: "Custom development provides greater control, enhanced security, and the ability to scale as your business grows. It is ideal for businesses that require advanced features, unique user experiences, or proprietary logic."
        },
        {
            q: "Are your custom websites mobile-friendly and SEO-ready?",
            a: "Yes. All our custom websites are fully responsive and optimized for mobile devices. We also follow modern SEO best practices to ensure strong search engine visibility from day one."
        },
        {
            q: "Which technologies do you use for custom website development?",
            a: "We use modern and proven technologies such as React, Node.js, Laravel, MySQL, and REST APIs to build secure and scalable web solutions."
        }
    ];

    const industries = [
        "Travel & Tourism", "Hospitality", "Education", "Account & Finance", "Construction", "Transportation & Logistics", "Healthcare", "E-commerce"
    ];

    return (
        <main className="custom-web-page">
            <GlobalStarfield />
            
            {/* Hero Section */}
            <section className="custom-page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">Tailored Digital Solutions</span>
                    <h1 className="page-title animate-fade-in-up">
                        Custom <span className="text-gradient">Web Development</span> Solutions
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        Faster performance | Scalable architecture | Business-focused UX | Secure custom code.
                        We build high-performance web applications for SMEs, startups, and growing businesses.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Get a Free Quote</Link>

                    <div className="hero-stats animate-fade-in delay-3">
                        <div className="stat-item">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Custom Code</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">Scale</span>
                            <span className="stat-label">Future-Ready</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">SEO</span>
                            <span className="stat-label">Optimized</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Content */}
            <section className="section intro-section">
                <div className="container">
                    <div className="intro-grid">
                        <div className="intro-text reveal">
                            <span className="subtitle">Transforming Digital Presence</span>
                            <h2>We Design Websites That <span className="text-gradient">Drive Growth</span></h2>
                            <p className="lead-text">
                                At CodeFox IT, we specialize in crafting bespoke websites that elevate your online presence. 
                                Combining captivating designs, mobile responsiveness, and user-friendly navigation, 
                                we deliver solutions focused on seamless functionality.
                            </p>
                            <p className="about-body-text" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                With experience in corporate websites globally, we bring a wealth of expertise to each project. 
                                Our websites are meticulously coded to provide an optimal user experience while 
                                enhancing search engine visibility. Let us help you stand out with expertly crafted websites 
                                that merge aesthetics with functionality.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={18} color="var(--accent-secondary)" />
                                    <span>Bespoke Design</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={18} color="var(--accent-secondary)" />
                                    <span>High Performance</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={18} color="var(--accent-secondary)" />
                                    <span>Scalable Backend</span>
                                </div>
                            </div>
                        </div>

                        <div className="visual-element reveal delay-2">
                            <div className="floating-card">
                                <Code2 size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                                <h3>Modern Tech Stack</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    We utilize React, Next.js, and Node.js to ensure your web application is fast, secure, and ready for the future.
                                </p>
                                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                     <div className="glass-panel" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>React.js</div>
                                     <div className="glass-panel" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>Node.js</div>
                                     <div className="glass-panel" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>Laravel</div>
                                     <div className="glass-panel" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>API First</div>
                                </div>
                            </div>
                            <div className="visual-glow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Core Features</span>
                        <h2 className="section-title">Why Our <span className="text-gradient">Custom Websites</span> Win</h2>
                        <p className="section-desc mx-auto" style={{maxWidth: '700px'}}>
                            Every line of code is written with your business goals in mind, ensuring a unique digital footprint that differentiates you from the competition.
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

            {/* FAQ */}
            <section className="section faq-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Common Questions</span>
                        <h2 className="section-title">Custom Development <span className="text-gradient">FAQ</span></h2>
                    </div>

                    <div className="faq-grid">
                        {faqs.map((faq, i) => (
                            <div className="faq-item reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                                <h4>{faq.q}</h4>
                                <p>{faq.a}</p>
                            </div>
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
                            Ready to build something extraordinary? Our custom web development services focus on delivery dynamic, 
                            secure, and future-proof solutions that grow with your business.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Discuss Your Project</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default CustomWebDevelopment;
