import React from 'react';
import { Monitor, Code, Layout, Smartphone, ShieldCheck, ShoppingCart } from 'lucide-react';
import './Services.css';

const services = [
    {
        icon: <Monitor size={32} />,
        title: 'Web Development',
        description: 'We build fast, responsive, and fully customized web applications tailored to your business needs.',
        delay: '0s'
    },
    {
        icon: <Code size={32} />,
        title: 'Software Development',
        description: 'Robust desktop and enterprise software solutions designed for scalability and high performance.',
        delay: '0.1s'
    },
    {
        icon: <Layout size={32} />,
        title: 'UI/UX Design',
        description: 'Stunning, intuitive interfaces that provide exceptional user experiences and boost conversion rates.',
        delay: '0.2s'
    },
    {
        icon: <Smartphone size={32} />,
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile apps for iOS and Android that engage users on the go.',
        delay: '0.3s'
    },
    {
        icon: <ShieldCheck size={32} />,
        title: 'IT Consulting',
        description: 'Strategic IT consulting to optimize your infrastructure and align technology with business goals.',
        delay: '0.4s'
    },
    {
        icon: <ShoppingCart size={32} />,
        title: 'E-commerce Solutions',
        description: 'Secure, scalable e-commerce platforms designed to maximize sales and streamline management.',
        delay: '0.5s'
    }
];

const Services = () => {
    return (
        <section className="section services-section" id="services">
            <div className="container">
                <div className="section-header reveal">
                    <span className="subtitle">What We Do</span>
                    <h2 className="section-title">Our <span className="text-gradient">Services</span></h2>
                    <p className="section-desc">
                        We offer comprehensive technology solutions to help your business thrive in the digital landscape.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, idx) => (
                        <div
                            className="service-card reveal glass-panel"
                            key={idx}
                            style={{ transitionDelay: service.delay }}
                        >
                            <div className="service-icon-wrapper">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.description}</p>
                            <a href="#" className="service-link">
                                Learn More <span className="arrow">→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
