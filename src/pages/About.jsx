import React, { useEffect } from 'react';
import { Target, Lightbulb, Users, CheckCircle2, Cpu, Headphones, Network } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

const About = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Users size={32} />,
            title: 'Experienced Team',
            desc: 'Our professionals bring years of industry expertise to deliver high-quality solutions.'
        },
        {
            icon: <Cpu size={32} />,
            title: 'Modern Technologies',
            desc: 'We utilize the latest frameworks and tools to build future-proof products.'
        },
        {
            icon: <Target size={32} />,
            title: 'Client-Centered',
            desc: 'Your success is our priority. We align our strategies with your business goals.'
        },
        {
            icon: <Headphones size={32} />,
            title: '24/7 Support',
            desc: 'Reliable and continuous technical support to ensure your systems run flawlessly.'
        }
    ];

    return (
        <main className="about-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title animate-fade-in-up">About <span className="text-gradient">CodeFox IT</span></h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        Empowering businesses through innovative digital solutions and strategic technology partnerships.
                    </p>
                </div>
            </section>

            {/* About Content */}
            <section className="section about-content">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text reveal">
                            <span className="subtitle">Who We Are</span>
                            <h2 className="section-title">Driving Digital <span className="text-gradient">Transformation</span></h2>
                            <p className="about-body-text">
                                CodeFox IT is a premier technology agency specializing in software engineering,
                                web development, and digital innovation. Founded with the vision of bridging the gap
                                between complex technologies and business growth, we design products that are fast,
                                scalable, and user-centric.
                            </p>

                            <div className="mission-vision">
                                <div className="mv-box glass-panel">
                                    <div className="mv-icon"><Target size={24} /></div>
                                    <div>
                                        <h3>Our Mission</h3>
                                        <p>To deliver high-impact digital solutions that streamline workflows, enhance user experiences, and drive measurable results.</p>
                                    </div>
                                </div>

                                <div className="mv-box glass-panel">
                                    <div className="mv-icon"><Lightbulb size={24} /></div>
                                    <div>
                                        <h3>Our Vision</h3>
                                        <p>To be the globally recognized leader in IT consulting and software development, setting the benchmark for technical excellence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="about-image reveal delay-2">
                            <div className="image-stack">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="CodeFox IT Team"
                                    className="img-main"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                    alt="Office setup"
                                    className="img-secondary glass-panel"
                                />
                                {/* Decorative Badge */}
                                <div className="experience-badge glass-panel">
                                    <span className="years">12+</span>
                                    <span className="text">Years<br />Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section wcu-section">
                <div className="wcu-bg"></div>
                <div className="container relative">
                    <div className="section-header reveal">
                        <span className="subtitle">Why Choose Us</span>
                        <h2 className="section-title">Your Trusted <span className="text-gradient">Technology Partner</span></h2>
                        <p className="section-desc">
                            We don't just write code; we build sustainable digital ecosystems that propel your business forward.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, idx) => (
                            <div
                                className="feature-card glass-panel reveal"
                                key={idx}
                                style={{ transitionDelay: `${idx * 0.1}s` }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>

                                {/* Visual hover effect line */}
                                <div className="feature-line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
